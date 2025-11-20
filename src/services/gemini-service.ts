// Gemini AI Service - Using Electron main process to avoid CORS
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

export const isGeminiAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         window.electronAPI && 
         window.electronAPI.gemini !== undefined;
};

export const sendMessageToGemini = async (
  message: string, 
  conversationHistory: Message[] = []
): Promise<GeminiResponse> => {
  if (!isGeminiAvailable()) {
    return {
      text: '',
      error: 'Gemini API not available',
    };
  }

  try {
    const result = await window.electronAPI.gemini.sendMessage(message, conversationHistory);
    
    // Check for successful response with actual content
    if (result.success && result.response && result.response.trim()) {
      return {
        text: result.response.trim(),
      };
    } else if (result.success) {
      // Success flag but no content
      return {
        text: '',
        error: result.error || 'Received an empty response from AI. Please try again.',
      };
    } else {
      // Explicit failure
      return {
        text: '',
        error: result.error || 'Failed to get AI response',
      };
    }
  } catch (error: any) {
    return {
      text: '',
      error: error.message || 'Failed to communicate with AI',
    };
  }
};

