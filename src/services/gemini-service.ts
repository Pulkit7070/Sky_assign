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
    
    if (result.success) {
      return {
        text: result.response || '',
      };
    } else {
      return {
        text: '',
        error: result.error || 'Failed to get AI response',
      };
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return {
      text: '',
      error: error.message || 'Failed to communicate with AI',
    };
  }
};

