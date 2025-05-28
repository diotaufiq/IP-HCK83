const { GoogleGenAI, Type } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEN_AI_API_KEY,
});

async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.INTEGER,
          },
        },
      },
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    if (error.response && error.response.status === 503) {
      throw new Error("Service Unavailable: Please try again later.");
    }
    throw error;
  }
}
module.exports = {
  generateContent,
};
