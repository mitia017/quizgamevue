export interface Question {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[];
}

export interface QuizSettings {
  amount: number;
  category: number | string;
  difficulty: string;
  type: string;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  category: string;
  categoryId: number | string;
  difficulty: string;
  timeTaken: number;
}

export interface Category {
  id: number;
  name: string;
}
