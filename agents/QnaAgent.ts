import { KnowledgebaseTopic } from '@/types/KnowledgebaseInterface';
import { NativeModules } from 'react-native';
const { GemmaModule } = NativeModules;


//  The RAG Prompt Builder 
// This builds the prompt for when we HAVE found a relevant context.
const buildRagPrompt = (context: string, question: string): string => {
  const promptInDari = `
زمینه: "${context}"

سوال: "${question}"

وظیفه: تنها بر اساس زمینه ارائه شده، به سوال به صورت مفید، دوستانه و واضح به زبان دری پاسخ دهید. پاسخ خود را در یک پاراگراف کوتاه خلاصه کنید.
`;
 console.log({promptInDari})
  return promptInDari;
};


//The General Help Prompt Builder 
// This builds the prompt for when we have NOT found a relevant context.
const buildGeneralHelpPrompt = (question: string): string => {
  const promptInDari = `
شما یک دستیار هوش مصنوعی مفید هستید. من در پایگاه دانش خود موضوعی برای سوال زیر پیدا نکردم. لطفاً یک پاسخ عمومی، کوتاه و مفید به زبان دری ارائه دهید. به کاربر اطلاع دهید که اطلاعات دقیقی ندارید اما می‌توانید راهنمایی کلی ارائه دهید. از او بخواهید سوال خود را به روش دیگری بپرسد یا موضوعات مرتبط را امتحان کند.

سوال کاربر: "${question}"
`;
  return promptInDari;
};


// It now receives the 'bestTopic' from the UI component.
export const getAnswer = async (
  question: string,
  bestTopic: KnowledgebaseTopic | null, 
  language: Language
): Promise<string> => {

  let prompt: string;

  if (bestTopic) {
    // --- PATH A: TOPIC FOUND (Use the RAG prompt) ---
    const context = bestTopic.content_native;
    prompt = buildRagPrompt(context, question);

  } else {
    // --- PATH B: NO TOPIC FOUND (Use the General Help prompt) ---
    console.log("Agent: No topic found. Building General Help prompt.");
    prompt = buildGeneralHelpPrompt(question);
  }
  
  // --- Call the Gemma model with whichever prompt was built ---
  return await GemmaModule.generateResponse(prompt);
};


// We export the agent as a single object with its public methods.
export const QnaAgent = {
  getAnswer,
};