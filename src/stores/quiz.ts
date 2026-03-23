import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Question, QuizResult, QuizSettings, Category } from '../types';
import { api } from '../services/api';

export const useQuizStore = defineStore('quiz', () => {
  // State
  const questions = ref<Question[]>([]);
  const currentQuestionIndex = ref(0);
  const score = ref(0);
  const isGameOver = ref(false);
  const results = ref<QuizResult[]>(JSON.parse(localStorage.getItem('quiz_results') || '[]'));
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const startTime = ref<number>(0);
  const currentSettings = ref<QuizSettings | null>(null);

  // Getters
  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
  const progress = computed(() => {
    if (questions.value.length === 0) return 0;
    return ((currentQuestionIndex.value + 1) / questions.value.length) * 100;
  });

  // Actions
  async function fetchCategories() {
    try {
      categories.value = await api.getCategories();
    } catch (e) {
      error.value = 'Failed to load categories';
    }
  }

  async function startQuiz(settings: QuizSettings) {
    loading.value = true;
    error.value = null;
    currentSettings.value = settings;
    try {
      questions.value = await api.getQuestions(settings);
      currentQuestionIndex.value = 0;
      score.value = 0;
      isGameOver.value = false;
      startTime.value = Date.now();
    } catch (e) {
      error.value = 'Failed to load questions';
    } finally {
      loading.value = false;
    }
  }

  function submitAnswer(answer: string) {
    if (answer === currentQuestion.value.correct_answer) {
      score.value++;
    }

    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    isGameOver.value = true;
    const timeTaken = Math.floor((Date.now() - startTime.value) / 1000);

    const result: QuizResult = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      score: score.value,
      totalQuestions: questions.value.length,
      category: currentQuestion.value.category,
      categoryId: currentSettings.value?.category || 'any',
      difficulty: currentQuestion.value.difficulty,
      timeTaken
    };

    results.value.unshift(result);
    localStorage.setItem('quiz_results', JSON.stringify(results.value));
  }

  function resetQuiz() {
    questions.value = [];
    currentQuestionIndex.value = 0;
    score.value = 0;
    isGameOver.value = false;
    error.value = null;
  }

  return {
    questions,
    currentQuestionIndex,
    score,
    isGameOver,
    results,
    categories,
    loading,
    error,
    currentQuestion,
    progress,
    fetchCategories,
    currentSettings,
    startQuiz,
    submitAnswer,
    resetQuiz
  };
});
