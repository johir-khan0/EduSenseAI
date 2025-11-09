import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse, Chat, CreateChatParameters } from "@google/genai";
import { AIProvider } from './types';

/**
 * Implementation of the AIProvider interface for the Google Gemini API.
 * This is where the API key is securely used.
 */
class GeminiProvider implements AIProvider {
    private ai: GoogleGenAI;

    constructor() {
        // The API key is used here, on the "backend" side of the application logic.
        // This ensures it is not exposed on the frontend.
        if (!process.env.API_KEY) {
            throw new Error("GEMINI_API_KEY (via process.env.API_KEY) is not set. Please configure it to use the Gemini provider.");
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    }

    async generateContent(params: GenerateContentParameters): Promise<GenerateContentResponse> {
        return this.ai.models.generateContent(params);
    }

    async generateContentStream(params: GenerateContentParameters) {
        return this.ai.models.generateContentStream(params);
    }
    
    createChat(params: CreateChatParameters): Chat {
        return this.ai.chats.create(params);
    }
}

// Export the class so the caller can decide when to instantiate it (avoids running Node-only code during client-side bundle)
export default GeminiProvider;