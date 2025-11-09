// Minimal ambient declarations for the @google/genai package used in this project.
// This file silences TypeScript errors when the package doesn't provide types
// or when the installed package's types are not available in the environment.

declare module '@google/genai' {
  export type GenerateContentParameters = any;
  export type GenerateContentResponse = { text: string } & any;
  export type CreateChatParameters = any;
  export type Chat = any;
  export type LiveServerMessage = any;
  export type Modality = any;
  export type Blob = any;

  // Minimal 'Type' helper used by the repo to build JSON schema shapes.
  export const Type: {
    OBJECT: string;
    ARRAY: string;
    STRING: string;
    BOOLEAN?: string;
    NUMBER?: string;
  } & any;

  export class GoogleGenAI {
    constructor(opts?: { apiKey?: string });
    models: {
      generateContent: (params: GenerateContentParameters) => Promise<GenerateContentResponse>;
      generateContentStream: (params: GenerateContentParameters) => AsyncGenerator<GenerateContentResponse, any, unknown>;
    };
    chats: {
      create: (params: CreateChatParameters) => Chat;
    };
  }

  export {}; // keep module semantic
}
