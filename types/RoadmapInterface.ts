interface MaterialItem {
  en: string;
  native: string;
}

export interface LearningMaterial {
  type: 'vocabulary' | 'grammar_tip' | 'phrase_list'; 
  title: string;
  items: MaterialItem[];
}

interface Quiz {
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface StageInterface {
  id: string;
  title: string;
  duration: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  goal: string; 
  learningMaterials: LearningMaterial[]; 
  quiz: Quiz; 
}

export interface RoadmapInterface {
  id: string;
  title:string;
  duration: string;
  progress: number;
  stages: StageInterface[];
}