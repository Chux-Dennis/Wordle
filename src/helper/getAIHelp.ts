import { GoogleGenerativeAI } from "@google/generative-ai";

const instructionalPrompt: string =
  "your a wordle game assistant , you are to give the user a hint in two senteces about the word:(do not reveal too much):";

const bot = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

const getAIHelp = async (word: string): Promise<string> => {
  const model = bot.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(`${instructionalPrompt} ${word}`);
  const response = await result.response;
  const output = response.text();
  return output;
};


export default getAIHelp