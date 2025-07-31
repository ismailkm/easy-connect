interface MaterialItem {
  en: string;
  native: string;
}

export interface LearningMaterial {
  type: 'vocabulary' | 'grammar_tip' | 'phrase_list'; 
  title: string;
  items: MaterialItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface StageInterface {
  id: string;
  title: string;
  duration: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  goal: string; 
  learningMaterials: LearningMaterial[] | []; 
  quiz: Quiz | null; 
}

export interface RoadmapInterface {
  id: string;
  title:string;
  duration: string;
  goal: string;
  progress: number;
  stages: StageInterface[] | [];
}