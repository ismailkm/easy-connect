interface ContentGoal {
  type: 'goal';
  text: string;
}

interface VocabularyItem {
  en: string;
  native: string;
}

interface ContentVocabulary {
  type: 'vocabulary';
  title: string;
  items: VocabularyItem[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ContentQuiz {
  type: 'quiz';
  title: string;
  questions: QuizQuestion[];
}

declare type ContentItem = ContentGoal | ContentVocabulary | ContentQuiz;

declare type status = 'not_started' | 'in_progress' | 'completed';

interface Stage {
  id: string;
  title: string;
  duration: string;
  progress: number;
  status: status;
  content: ContentItem[]; 
}

export interface RoadmapInterface {
  id: string;
  title: string;
  duration: string;
  progress: number;
  stages: Stage[]; 
}