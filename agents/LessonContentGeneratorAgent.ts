import { LearningLine } from '@/types/RoadmapInterface';
import UserInterface from '@/types/UserInterface';

const buildInstruction = (
  lessonTitle: string,
  lessonGoal: string,
  userProfile: UserInterface
): string => {
  const role = `You are an expert AI English language lesson designer. You create practical, beginner-friendly English lessons for new immigrants in the UK. Your job is to generate a list of simple, useful English lines based on the provided context.`;
  
  const context = `
CONTEXT ABOUT THE LEARNER:
- Name: ${userProfile.firstName}
- Age: ${userProfile.age}
- English Level: ${userProfile.englishLevel}
`;

  const lessonDetails = `
LESSON CONTEXT:
LESSON TITLE: ${lessonTitle}
LESSON GOAL: ${lessonGoal || 'Teach useful English lines the learner can use in real life, based on the title.'}
`;

  const task = `
TASK:
You primary task is to generate a list of 10 to 15 simple, useful English lessons based on the provided LESSON CONTEXT. The lessons MUST be a mix of simple phrases, questions, and single words directly related to the lesson.`;

  const rules = `
RESPONSE RULES — FOLLOW STRICTLY:
- DO NOT include any introductory or concluding sentences, phrases, or conversational filler. Respond ONLY with the list of lessons lines.
- DO NOT repeat lesson lines.
- Ensure **all lesson lines are directly relevant to the specific LESSON TITLE and LESSON GOAL** provided.
- Ensure the complexity of the lesson is strictly based on CONTEXT ABOUT THE LEARNER provided.
- The lines MUST be a mix of simple phrases, questions, and single words, as appropriate for the lesson context.
- Use full sentences with proper grammar and spelling.
- Do NOT include any extra text, explanation, or formatting outside the list of lines.`;
  
  const example = `
EXAMPLE of the required output format:
Hello.
Good morning.
How are you?
I'm fine, thank you.
What is your name?
Nice to meet you.
Goodbye.`;

  return `${role}\n\n${context}\n\n${lessonDetails}\n\n${task}\n\n${rules}\n\n${example}`;
};


const parseResponseToEnglishLines = (responseText: string): string[] => {

  if (!responseText?.trim()) {
    return [];
  }
  
  return responseText
    .split('\n')
    .map(line => line.replace(/^\d+[\)\.]?\s*[-–]?\s*/, '').trim())
    .filter(cleanText => cleanText.length > 0);
};

export const generateLessonContent = async (
  generateResponse: (prompt: string) => Promise<string>,     
  translateBatch: (lines: string[], lang: 'pashto' | 'dari') => Promise<string[]>, 
  lessonTitle: string,
  lessonGoal: string,
  userProfile: UserInterface
): Promise<LearningLine[]> => {
  
  const instruction = buildInstruction(lessonTitle, lessonGoal, userProfile);
  const gemmaResponse = await generateResponse(instruction);
  let englishLines = parseResponseToEnglishLines(gemmaResponse);
 
  const translatedLines = await translateBatch(englishLines, userProfile.nativeLanguage);

  if (englishLines.length !== translatedLines.length) {
    throw new Error("Translation error.");
  }
  
  const finalLearningLines: LearningLine[] = englishLines.map((englishLine, index) => ({
    en: englishLine,
    native: translatedLines[index],
  }));
  return finalLearningLines; 
};

export const LessonContentGeneratorAgent = {
  generateLessonContent,
};