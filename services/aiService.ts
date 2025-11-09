import { GenerateContentParameters, Chat, CreateChatParameters } from "@google/genai";
import { Type } from '../lib/ai/schemaType';
import { generateContent, generateContentStream, createChat as createChatBackend, activeProviderConfig } from '../lib/ai';

// Use the default model from the active provider's configuration.
// Fallback to a gemini model if not configured.
const DEFAULT_MODEL = activeProviderConfig?.defaultModel || 'gemini-2.5-flash';

/**
 * Generates structured JSON content from a prompt and schema by calling the backend service.
 * @param prompt - The text prompt to send to the model.
 * @param schema - The JSON schema for the expected response.
 * @param model - The model to use (defaults to the active provider's default).
 * @returns A promise that resolves to the parsed JSON object.
 */
export async function generateJsonContent(prompt: string, schema: any, model: string = DEFAULT_MODEL): Promise<any> {
    try {
        const response = await generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("AI Service Error (JSON):", error);
        throw new Error("Failed to generate JSON content from the AI service.");
    }
}

/**
 * Generates plain text content from a prompt by calling the backend service.
 * @param prompt - The text prompt to send to the model.
 * @param model - The model to use (defaults to the active provider's default).
 * @returns A promise that resolves to the generated text string.
 */
export async function generateTextContent(prompt: string, model: string = DEFAULT_MODEL): Promise<string> {
    try {
        const response = await generateContent({ model, contents: prompt });
        return response.text;
    } catch (error) {
        console.error("AI Service Error (Text):", error);
        throw new Error("Failed to generate text content from the AI service.");
    }
}

/**
 * Generates a stream of text content from a prompt by calling the backend service.
 * @param prompt - The text prompt to send to the model.
 * @param model - The model to use (defaults to a fast streaming model).
 * @returns A promise that resolves to the streaming response.
 */
export async function generateTextStream(prompt: string, model?: string) {
    try {
        // Use a specific fast model for streaming if no other model is specified.
        const streamModel = model || 'gemini-flash-lite-latest';
        return await generateContentStream({ model: streamModel, contents: prompt });
    } catch (error) {
        console.error("AI Service Error (Stream):", error);
        throw new Error("Failed to generate streaming content from the AI service.");
    }
}

/**
 * Creates a new chat session using the backend service.
 * The model used is determined by the parameters passed, falling back to the default.
 * @param params - The parameters for creating a chat session.
 * @returns A Chat instance.
 */
export const createChat = (params: CreateChatParameters): Chat => {
    // If no model is provided in the chat params, inject the default one.
    if (!params.model) {
        params.model = DEFAULT_MODEL;
    }
    return createChatBackend(params);
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctAnswer', 'explanation'],
            },
        },
    },
    required: ['questions'],
};

/**
 * Generates a full quiz with multiple questions based on a topic.
 * @param subject - The broader subject area.
 * @param topic - The specific topic of the quiz.
 * @param difficulty - The difficulty level ('easy', 'medium', 'hard').
 * @param totalQuestions - The number of questions to generate.
 * @param academicLevel - The academic level of the user.
 * @returns A promise that resolves to an array of generated questions.
 */
export async function generateQuizQuestions(subject: string, topic: string, difficulty: string, totalQuestions: number, academicLevel: string): Promise<any[]> {
    const prompt = `Generate a quiz with ${totalQuestions} multiple-choice questions about the topic "${topic}" within the broader subject of "${subject}".
    The questions should be appropriate for a student at the "${academicLevel}" level.
    The difficulty should be "${difficulty}".
    Each question must have 4 options.
    The 'correctAnswer' field must exactly match one of the strings in the 'options' array.
    Provide a brief explanation for the correct answer.`;

    const result = await generateJsonContent(prompt, quizSchema);
    if (result && Array.isArray(result.questions)) {
        return result.questions;
    } else {
        const questionsArray = Array.isArray(result) ? result : (result.questions || []);
        if (questionsArray.length > 0) {
            console.warn("AI response format was slightly off, but questions were extracted.");
            return questionsArray;
        }
        throw new Error("AI failed to return questions in the expected format.");
    }
}

/**
 * Generates a full quiz with multiple questions from an uploaded file (image or PDF page).
 * @param file - The file uploaded by the user.
 * @param questionCount - The number of questions to generate.
 * @param academicLevel - The academic level of the user.
 * @returns A promise that resolves to an array of generated questions.
 */
export async function generateQuizQuestionsFromFile(file: File, questionCount: number, academicLevel: string): Promise<any[]> {
    const fileToGenerativePart = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = (reader.result as string).split(',')[1];
                resolve({
                    inlineData: { data: base64Data, mimeType: file.type },
                });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const prompt = `Based on the content of the provided image of a textbook page, generate a quiz with ${questionCount} multiple-choice questions. 
    The questions should be relevant to the text and diagrams in the image.
    The questions should be appropriate for a student at the "${academicLevel}" level.
    Each question must have 4 options.
    The 'correctAnswer' field must exactly match one of the strings in the 'options' array.
    Provide a brief explanation for the correct answer.`;

    const imagePart = await fileToGenerativePart(file);
    const textPart = { text: prompt };

    const response = await generateContent({
        // Use the default model, assuming it's multimodal-capable if this function is called.
        model: DEFAULT_MODEL, 
        contents: { parts: [textPart, imagePart] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: quizSchema,
        }
    });

    const result = JSON.parse(response.text);
    if (result && Array.isArray(result.questions)) {
        return result.questions;
    } else {
        throw new Error("AI failed to return questions in the expected format from the file.");
    }
}


/**
 * Generates a single quiz question based on a topic.
 * @param subject - The broader subject area.
 * @param topic - The specific topic of the question.
 * @param difficulty - The difficulty level ('easy', 'medium', 'hard').
 * @param academicLevel - The academic level of the user.
 * @returns A promise that resolves to a single generated question object.
 */
export async function generateSingleQuestion(subject: string, topic: string, difficulty: string, academicLevel: string): Promise<any> {
    const schema = {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
        },
        required: ['question', 'options', 'correctAnswer', 'explanation'],
    };

    const prompt = `Generate a single multiple-choice question about the topic "${topic}" within the broader subject of "${subject}".
    The question should be appropriate for a student at the "${academicLevel}" level.
    The difficulty should be "${difficulty}".
    The question must have 4 options.
    The 'correctAnswer' field must exactly match one of the strings in the 'options' array.
    Provide a brief explanation for the correct answer.`;

    return await generateJsonContent(prompt, schema);
}

/**
 * Generates a personalized explanation for an incorrect answer.
 * @param question The question text.
 * @param userAnswer The user's incorrect answer.
 * @param correctAnswer The correct answer.
 * @returns A promise that resolves to the explanation string.
 */
export async function generateIncorrectAnswerFeedback(question: string, userAnswer: string, correctAnswer: string): Promise<string> {
    const prompt = `You are an expert and encouraging tutor. A student answered a multiple-choice question incorrectly. Explain clearly why their chosen answer is wrong and why the correct answer is right. Be concise and focus on clarifying the core concept.

    Question: "${question}"
    Student's incorrect answer: "${userAnswer}"
    Correct answer: "${correctAnswer}"
    
    Your explanation should be 2-4 sentences long. Do not use markdown.`;

    return await generateTextContent(prompt);
}


/**
 * Generates a set of IQ test questions.
 * @param level - The difficulty level of the questions (0 is easiest).
 * @returns A promise that resolves to an array of 15 generated questions.
 */
export async function generateIQQuestions(level: number): Promise<any[]> {
    const schema = {
        type: Type.OBJECT,
        properties: {
            questions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctAnswer', 'explanation'],
                },
            },
        },
        required: ['questions'],
    };
    
    const difficultyMap = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Hard', 'Expert', 'Genius', 'Master', 'Grandmaster', 'Legendary'];
    const difficulty = difficultyMap[Math.min(level, difficultyMap.length - 1)];

    const prompt = `Generate a set of 15 IQ test-style questions. The difficulty should be "${difficulty}" (corresponding to level ${level}).
    Questions should cover logical reasoning, pattern recognition, spatial puzzles, and abstract thinking.
    Each question must be multiple-choice with 4 options.
    The 'correctAnswer' field must exactly match one of the strings in the 'options' array.
    Provide a brief, clear explanation for the correct answer.`;

    const result = await generateJsonContent(prompt, schema);
     if (result && Array.isArray(result.questions)) {
        return result.questions;
    } else {
        throw new Error("AI failed to return IQ questions in the expected format.");
    }
}