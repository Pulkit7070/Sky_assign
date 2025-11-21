/**
 * Gemini Vision API Service
 * Uses Google's Gemini API with vision capabilities (FREE)
 * Same API key as regular Gemini - no additional setup needed!
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
// Use model name WITHOUT "models/" prefix for SDK (SDK adds it automatically)
const GEMINI_MODEL = 'gemini-1.5-flash'; // Stable model with vision support

let genAI: GoogleGenerativeAI | null = null;

/**
 * Retry helper with exponential backoff for 503 errors
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;
      const is503 = error.message?.includes('503') || error.message?.includes('overloaded');
      
      if (!is503 || isLastAttempt) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`[Vision API] Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

export const initializeVision = () => {
  console.log('[Vision API] Attempting to initialize...');
  console.log('[Vision API] API Key present:', !!GEMINI_API_KEY);
  console.log('[Vision API] API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
  
  if (!GEMINI_API_KEY) {
    console.error('[Vision API] ❌ API key not found. Please add VITE_GEMINI_API_KEY to .env file');
    console.error('[Vision API] Check https://aistudio.google.com/apikey to get a valid key');
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('[Vision API] ✅ Successfully initialized with GoogleGenerativeAI SDK');
    console.log(`[Vision API] Will use model: ${GEMINI_MODEL}`);
    return true;
  } catch (error) {
    console.error('[Vision API] ❌ Failed to initialize:', error);
    if (error instanceof Error) {
      console.error('[Vision API] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return false;
  }
};

export const isVisionAvailable = (): boolean => {
  return genAI !== null && GEMINI_API_KEY !== '';
};

/**
 * Analyze an image using Gemini Vision
 * @param imageFile The image file to analyze
 * @param prompt Optional prompt to guide the analysis
 * @returns Analysis result from Gemini
 */
export const analyzeImage = async (
  imageFile: File,
  prompt: string = 'Describe this image in detail'
): Promise<{ success: boolean; response?: string; error?: string }> => {
  if (!genAI) {
    if (!initializeVision()) {
      return {
        success: false,
        error: 'Gemini Vision API is not initialized. Please check your API key.',
      };
    }
  }

  try {
    // Convert file to base64
    const imageData = await fileToBase64(imageFile);
    
    // Use stable gemini-1.5-flash model (supports vision and is FREE)
    const model = genAI!.getGenerativeModel({ model: GEMINI_MODEL });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: imageFile.type,
      },
    };

    // Generate content with image and text
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      response: text,
    };
  } catch (error: any) {
    console.error('Gemini Vision error:', error);
    
    let errorMessage = 'Failed to analyze image';
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Analyze an image with conversation context
 * @param imageFile The image file to analyze
 * @param userMessage The user's message/question about the image
 * @param conversationHistory Previous messages for context
 * @returns Analysis result with context
 */
export const analyzeImageWithContext = async (
  imageFile: File,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> => {
  console.log('[Vision API] Starting image analysis...');
  console.log('[Vision API] Image:', { name: imageFile.name, type: imageFile.type, size: imageFile.size });
  
  if (!genAI) {
    console.warn('[Vision API] Not initialized, attempting to initialize...');
    if (!initializeVision()) {
      const error = '❌ Gemini Vision API is not initialized. Please add VITE_GEMINI_API_KEY to your .env file and restart the app.';
      console.error('[Vision API]', error);
      throw new Error(error);
    }
  }

  try {
    console.log('[Vision API] Converting image to base64...');
    const imageData = await fileToBase64(imageFile);
    console.log('[Vision API] Image converted, size:', imageData.length, 'characters');
    
    // Build context-aware prompt BEFORE using it
    let contextPrompt = userMessage;
    
    if (conversationHistory.length > 0) {
      const recentContext = conversationHistory
        .slice(-3) // Last 3 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
      
      contextPrompt = `Previous conversation:\n${recentContext}\n\nNow analyzing image with question: ${userMessage}`;
    }
    
    console.log(`[Vision API] Creating model instance: ${GEMINI_MODEL}`);
    
    try {
      const model = genAI!.getGenerativeModel({ 
        model: GEMINI_MODEL,
      });
      
      console.log('[Vision API] Model instance created successfully');
      console.log('[Vision API] Preparing image parts...');
      
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: imageFile.type,
        },
      };
      
      console.log('[Vision API] Sending request to Gemini...');
      console.log('[Vision API] Prompt:', contextPrompt.substring(0, 100) + '...');
      
      // Use retry logic for 503 "model overloaded" errors
      const text = await retryWithBackoff(async () => {
        const result = await model.generateContent([contextPrompt, imagePart]);
        const response = await result.response;
        return response.text();
      });
      
      console.log('[Vision API] ✅ Analysis complete, response length:', text.length);
      return text;
    } catch (modelError: any) {
      console.error('[Vision API] ❌ Model error:', modelError);
      console.error('[Vision API] Full error object:', JSON.stringify(modelError, null, 2));
      
      // Extract actual error message from SDK error structure
      let errorMsg = modelError.message || 'Unknown error';
      
      // Check if error has response data (common in SDK errors)
      if (modelError.response) {
        console.error('[Vision API] Error response:', modelError.response);
      }
      
      // Handle specific SDK error patterns
      if (errorMsg.includes('API key not valid') || errorMsg.includes('API_KEY_INVALID')) {
        throw new Error('❌ Invalid API key. Please verify your key at https://aistudio.google.com/apikey and ensure it\'s correctly set in .env as VITE_GEMINI_API_KEY');
      }
      
      if (errorMsg.includes('models/') && errorMsg.includes('not found')) {
        throw new Error(`❌ Model "${GEMINI_MODEL}" not found. Please check available models at https://ai.google.dev/gemini-api/docs/models/gemini. Try using "gemini-1.5-flash" or "gemini-pro-vision" instead.`);
      }
      
      throw modelError;
    }
  } catch (error: any) {
    console.error('[Vision API] ❌ Analysis failed:', error);
    
    if (error instanceof Error) {
      console.error('[Vision API] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    // Map error messages to user-friendly descriptions based on Google's error codes
    let userMessage = error.message || 'Unknown error occurred';
    
    // Check for HTTP error codes in message
    if (userMessage.includes('400')) {
      userMessage = '❌ Bad Request (400): The request is malformed. Please check the image format and try again.';
    } else if (userMessage.includes('403') || userMessage.includes('PERMISSION_DENIED')) {
      userMessage = '❌ Permission Denied (403): Your API key doesn\'t have the required permissions. Verify at https://aistudio.google.com/apikey';
    } else if (userMessage.includes('404') || userMessage.includes('NOT_FOUND')) {
      userMessage = `❌ Model Not Found (404): The model "${GEMINI_MODEL}" is not available. Try "models/gemini-1.5-flash" or "models/gemini-pro-vision" instead.`;
    } else if (userMessage.includes('429') || userMessage.includes('RESOURCE_EXHAUSTED')) {
      userMessage = '❌ Rate Limit (429): Too many requests. Please wait a moment and try again. Check rate limits at https://ai.google.dev/gemini-api/docs/rate-limits';
    } else if (userMessage.includes('500') || userMessage.includes('INTERNAL')) {
      userMessage = '❌ Internal Error (500): An unexpected error occurred on Google\'s side. Try reducing your input or switching models.';
    } else if (userMessage.includes('503') || userMessage.includes('UNAVAILABLE') || userMessage.includes('overloaded')) {
      userMessage = '❌ Service Unavailable (503): The service is temporarily overloaded. Please try again in a few moments.';
    } else if (userMessage.includes('504') || userMessage.includes('DEADLINE_EXCEEDED')) {
      userMessage = '❌ Timeout (504): The request took too long. Try with a smaller image or simpler prompt.';
    }
    
    throw new Error(userMessage);
  }
};

/**
 * Helper function to convert File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Initialize on module load
initializeVision();
