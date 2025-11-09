import { AIProviderType } from './types';

interface AIConfig {
  activeProvider: AIProviderType;
  providers: {
    [key in AIProviderType]?: {
      // Provider-specific settings like default model, etc.
      defaultModel: string;
      // In a real app, you might map to env var names here,
      // but we are constrained to use process.env.API_KEY.
    };
  };
}

/**
 * Main configuration for the AI backend.
 * To switch the active AI provider, change the `activeProvider` value.
 * The runtime environment is expected to provide the correct API key
 * in the `process.env.API_KEY` variable for the selected provider.
 */
export const aiConfig: AIConfig = {
  // --- SWITCH PROVIDER HERE ---
  activeProvider: 'gemini', // Options: 'gemini', 'openai', 'claude'
  // --------------------------

  providers: {
    gemini: {
      defaultModel: 'gemini-2.5-flash',
    },
    openai: {
      // Placeholder for when OpenAI is added
      defaultModel: 'gpt-4o',
    },
    claude: {
      // Placeholder for when Claude is added
      defaultModel: 'claude-3-sonnet',
    }
  }
};
