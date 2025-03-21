import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyCuiAY-6eGbuVyL0xNZ9jdlQAqUgYckOYc'; // Ensure this is securely stored
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getGeminiResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [], // Can be enhanced to add conversation context if needed
    });

    const result = await chatSession.sendMessage(message);

    if (!result || !result.response) {
      throw new Error('No valid response received from the Gemini API.');
    }

    return result.response.text() || 'Sorry, I couldn’t generate a response.';
  } catch (error) {
    console.error('Error fetching Gemini response:', error);
    return 'Sorry, I am unable to process your request at the moment.';
  }
};
