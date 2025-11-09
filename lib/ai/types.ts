import { GenerateContentParameters, GenerateContentResponse, Chat, CreateChatParameters } from "@google/genai";

export type AIProviderType = 'gemini' | 'openai' | 'claude';

/**
 * Defines a common interface for different AI providers.
 * This allows for easy swapping between services like Gemini, OpenAI, etc.
 */
export interface AIProvider {
  generateContent(params: GenerateContentParameters): Promise<GenerateContentResponse>;
  generateContentStream(params: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse, any, unknown>>;
  createChat(params: CreateChatParameters): Chat;
}