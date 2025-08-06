import { RoadmapInterface } from '@/types/RoadmapInterface';
import UserInterface from '@/types/UserInterface';

const buildInstruction = (userProfile: UserInterface, userGoal: string): string => {

  const role = `You are an expert AI language curriculum designer. Your job is to create simple, personalized, real-world English learning roadmaps for immigrants who are new to the UK. You specialize in designing stage-based English learning programs that are practical, culturally sensitive, and based on each learner’s real-life context. Each stage must reflect everyday situations the learner is likely to face. These stages will later be expanded into full English lessons.`;

  const context = `
CONTEXT ABOUT THE LEARNER:
- Name: ${userProfile.firstName}
- Gender: ${userProfile.gender}
- Age: ${userProfile.age}
- Profession: ${userProfile.profession}
- English Level: ${userProfile.englishLevel}
- Stated Goal: "${userGoal}"
`;

  const task = `
TASK:
Your primary task is to generate a roadmap of maximum 6 stage titles that are DEEPLY PERSONALIZED based on the CONTEXT ABOUT THE LEARNER. The stages MUST directly address the real-life situations this specific person is likely to face.
`;

  let rules = `
RESPONSE RULES — FOLLOW STRICTLY:
- Return only best 6 stage titles that are matches with CONTEXT ABOUT THE LEARNER. 
- DO NOT RETURN more than 6 items in the list.
- The roadmap stages MUST progress logically from foundational to advanced concepts.
- No quotes, dialogue, or example sentences.
- Each stage must be a short, plain-text line, with a title and brief goal but no more than 100 characters.
- Do NOT include any explanations, greetings, or summaries.`;

  const example = `
EXAMPLE of the required format:
1. Essential Greetings - Confidently greet people and introduce yourself and your family. 
2. Essential First Words - Learn the most important words for daily politeness.
3. Shopping for Groceries - Be able to ask for basic items at the store.
4. Visiting the Doctor - Explain a simple health problem to a receptionist.
5. Using Public Transport - Learn how to ask for the correct bus.`;

  return `${role}\n\n${context}\n\n${task}\n\n${rules}\n\n${example}`;
};

const extractStageData = (responseText: string): { title: string; goal: string }[] | null => {
  
  if (!responseText?.trim()) {
    return null;
  }
  const stageLines = responseText.match(/^\d+\.\s.*$/gm) || [];
  
  if (stageLines.length === 0) {
    return null;
  }

  return stageLines.map(line => {
    const cleanLine = line.replace(/^\d+\.\s+/, '').trim();
    const parts = cleanLine.split(/\s*[-–]\s*/); 
    const title = parts[0]?.trim() || 'Untitled Stage';
    let goal = parts.slice(1).join(' – ').trim(); 
    return { title, goal };
  });
};

const parseResponseToRoadmap = (responseText: string, userGoal: string, roadmapTitle: string): RoadmapInterface | null=> {

  const parsedStages: { title: string; goal: string }[] = extractStageData(responseText) || [];

  if (parsedStages.length === 0) {
    console.error("Parser Error: Could not find any valid stage lines in the AI response.");
    return null;
  }

  const newRoadmap: RoadmapInterface = {
    id: `roadmap_${Date.now()}`,
    title: roadmapTitle, 
    goal: userGoal,
    duration: `${parsedStages.length} Lessons`,
    progress: 0,
    stages: parsedStages.map((stageData, index) => ({
      id: `stage_${Date.now()}_${index}`,
      title: stageData.title,
      duration: "1 Lesson",
      progress: 0,
      status: "not_started",
      goal: stageData.goal,
      learningMaterials: [],
      quiz: {
        title: "Test Your Knowledge",
        questions: [],
      },
    })),
  };

  return newRoadmap;

};

const generateAndSave = async (generateResponse: (prompt: string) => Promise<string>, userProfile: UserInterface, goal: string, title: string): Promise<RoadmapInterface | null> => {
  
  const instruction = buildInstruction(userProfile, goal);
  const gemmaResponse = await generateResponse(instruction);
  if (!gemmaResponse) {
    throw new Error('The AI did not return a response. Please try again.');
  }
  let roadmap = parseResponseToRoadmap(gemmaResponse, goal, title);
  return roadmap;

};

export const RoadmapGeneratorAgent = {
  generateAndSave,
};