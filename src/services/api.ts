import axios from 'axios';
import type { Question, Category, QuizSettings } from '../types';

const API_BASE_URL = 'https://opentdb.com';

export const api = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api_category.php`);
      return response.data.trivia_categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getQuestions(settings: QuizSettings): Promise<Question[]> {
    try {
      const { amount, category, difficulty, type } = settings;
      const params: any = { amount };
      if (category !== 'any') params.category = category;
      if (difficulty !== 'any') params.difficulty = difficulty;
      if (type !== 'any') params.type = type;

      const response = await axios.get(`${API_BASE_URL}/api.php`, { params });

      if (response.data.response_code === 0) {
        return response.data.results.map((q: Question) => {
          const decodedQuestion = this.decodeHtml(q.question);
          const decodedCorrect = this.decodeHtml(q.correct_answer);
          const decodedIncorrect = q.incorrect_answers.map(a => this.decodeHtml(a));
          const all_answers = this.shuffleArray([...decodedIncorrect, decodedCorrect]);

          return {
            ...q,
            category: this.decodeHtml(q.category),
            question: decodedQuestion,
            correct_answer: decodedCorrect,
            incorrect_answers: decodedIncorrect,
            all_answers
          };
        });
      } else {
        throw new Error('Could not fetch questions from API');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
};
