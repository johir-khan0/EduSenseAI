import type { GenerateContentParameters, GenerateContentResponse, Chat, CreateChatParameters } from "@google/genai";
import { aiConfig } from './config';
import { AIProvider } from './types';

// Don't eagerly import provider implementations here. Some provider SDKs run Node-only
// initialization at module import time which will crash in the browser during dev.
let providerInstance: AIProvider | null = null;

const resolveProvider = async (): Promise<AIProvider> => {
    if (providerInstance) return providerInstance;

        switch (aiConfig.activeProvider) {
        case 'gemini': {
            const mod = await import('./gemini');
            const candidate = (mod as any).default || mod;
            providerInstance = typeof candidate === 'function' ? new candidate() : candidate;
            break;
        }
        case 'openai': {
            const mod = await import('./openai');
            const candidate = (mod as any).default || mod;
            providerInstance = typeof candidate === 'function' ? new candidate() : candidate;
            break;
        }
        case 'claude': {
            const mod = await import('./claude');
            const candidate = (mod as any).default || mod;
            providerInstance = typeof candidate === 'function' ? new candidate() : candidate;
            break;
        }
        default: {
            console.warn(`Unknown AI provider "${aiConfig.activeProvider}", defaulting to Gemini.`);
            const mod = await import('./gemini');
            providerInstance = (mod as any).default || mod;
            break;
        }
    }

    return providerInstance as AIProvider;
};

/**
 * Wrapper for the generateContent method of the active AI provider.
 */
export const generateContent = async (params: GenerateContentParameters): Promise<GenerateContentResponse> => {
    const provider = await resolveProvider();
    return provider.generateContent(params);
};

/**
 * Wrapper for the generateContentStream method of the active AI provider.
 */
export const generateContentStream = async (params: GenerateContentParameters) => {
    const provider = await resolveProvider();
    return provider.generateContentStream(params);
};

/**
 * Wrapper for the createChat method of the active AI provider.
 */
export const createChat = async (params: CreateChatParameters): Promise<Chat> => {
    const provider = await resolveProvider();
    return provider.createChat(params);
};

/**
 * Exposes the configuration of the currently active provider (safe to access synchronously).
 */
export const activeProviderConfig = aiConfig.providers[aiConfig.activeProvider];
