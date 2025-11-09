import { GenerateContentParameters, GenerateContentResponse, Chat, CreateChatParameters } from "@google/genai";
import { aiConfig } from './config';
import { AIProvider } from './types';

import GeminiProvider from './gemini';
import OpenAIProvider from './openai';
import ClaudeProvider from './claude';

let providerInstance: AIProvider;

/**
 * Factory function to get the currently active AI provider instance.
 * This is the single point of control for switching between different AI services.
 */
const getAIProvider = (): AIProvider => {
    // Singleton pattern: create instance only once.
    if (providerInstance) {
        return providerInstance;
    }

    switch (aiConfig.activeProvider) {
        case 'gemini':
            providerInstance = GeminiProvider;
            break;
        case 'openai':
            providerInstance = OpenAIProvider;
            break;
        case 'claude':
            providerInstance = ClaudeProvider;
            break;
        default:
            console.warn(`Unknown AI provider "${aiConfig.activeProvider}", defaulting to Gemini.`);
            providerInstance = GeminiProvider;
            break;
    }
    return providerInstance;
};

const provider = getAIProvider();

/**
 * Wrapper for the generateContent method of the active AI provider.
 */
export const generateContent = (params: GenerateContentParameters): Promise<GenerateContentResponse> => {
    return provider.generateContent(params);
};

/**
 * Wrapper for the generateContentStream method of the active AI provider.
 */
export const generateContentStream = (params: GenerateContentParameters) => {
    return provider.generateContentStream(params);
}

/**
 * Wrapper for the createChat method of the active AI provider.
 */
export const createChat = (params: CreateChatParameters): Chat => {
    return provider.createChat(params);
};

/**
 * Exposes the configuration of the currently active provider.
 */
export const activeProviderConfig = aiConfig.providers[aiConfig.activeProvider];
