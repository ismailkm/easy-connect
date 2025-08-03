import { NativeModules } from 'react-native';
const { GemmaModule } = NativeModules;

const buildInstruction = (textToSummarize: string): string => {
  const role = `You are an expert AI assistant that is highly skilled at summarizing English text into a concise, easy-to-understand paragraph.`;

  const task = `Your task is to summarize the following document in a single, short paragraph of 3 to 4 sentences.`;
  
  const rules = `
RULES:
- Respond ONLY with the summary paragraph.
- Do NOT use bullet points, numbered lists, or hyphens.
- Do NOT add any conversational text like "Here is your summary...".`;

  const document = `
DOCUMENT TO SUMMARIZE:
---
${textToSummarize}
---`;

  return `${role}\n\n${task}\n\n${rules}\n\n${document}`;
};


export const generateSummary = async (
  fullText: string
): Promise<string> => {
  const prompt = buildInstruction(fullText);
  const summary = await GemmaModule.generateResponse(prompt);
  return summary.trim(); 
};

export const SummaryAgent = {
  generateSummary,
};