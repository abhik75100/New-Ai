
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-3-flash-preview";

export const fetchGroundedResponse = async (
    prompt: string, 
    imagePart?: { inlineData: { data: string; mimeType: string; } }
): Promise<GenerateContentResponse> => {
  try {
    const contents = imagePart 
      ? { parts: [{ text: prompt }, imagePart] }
      : prompt;

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response;
  } catch (error: any) {
    console.error("Error fetching from Gemini API:", error);

    if (error.message && error.message.toLowerCase().includes('api key')) {
      throw new Error("There's an issue with the API key. It might be missing, invalid, or expired. Please check your environment configuration.");
    }
    
    throw new Error("Failed to fetch a response from the Gemini API. Please check your network connection and try again.");
  }
};

export const startChat = (): Chat => {
  return ai.chats.create({
    model: model,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
};
