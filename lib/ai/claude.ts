import { GenerateContentParameters, GenerateContentResponse, Chat, CreateChatParameters } from "@google/genai";
import { AIProvider } from './types';

/**
 * Placeholder implementation for an Anthropic Claude provider.
 * In a real application, this class would use the Anthropic SDK.
 */
class ClaudeProvider implements AIProvider {
    constructor() {
        if (!process.env.API_KEY) {
            throw new Error("ANTHROPIC_API_KEY (via process.env.API_KEY) is not set. Please configure it to use the Claude provider.");
        }
        // Initialize Anthropic SDK here
    }

    async generateContent(params: GenerateContentParameters): Promise<GenerateContentResponse> {
        throw new Error("ClaudeProvider.generateContent() is not implemented.");
    }

    // FIX: The original 'async' function implicitly returned Promise<void>, which is incompatible with the AIProvider interface.
    // This is changed to return a rejected promise to correctly match the expected return type structure.
    generateContentStream(params: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse, any, unknown>> {
        return Promise.reject(new Error("ClaudeProvider.generateContentStream() is not implemented."));
    }
    
    createChat(params: CreateChatParameters): Chat {
        throw new Error("ClaudeProvider.createChat() is not implemented.");
    }
}

export default new ClaudeProvider();