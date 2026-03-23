<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuizStore } from '../stores/quiz';
import type { QuizResult } from '../types';

const quizStore = useQuizStore();
const router = useRouter();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const replaySimilar = async (result: QuizResult) => {
  await quizStore.startQuiz({
    amount: result.totalQuestions,
    category: result.categoryId,
    difficulty: result.difficulty,
    type: 'any'
  });
  router.push('/quiz');
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Historique des parties</h1>
      <router-link to="/" class="btn-secondary">Retour</router-link>
    </div>

    <div v-if="quizStore.results.length === 0" class="glass-card p-12 text-center text-slate-500">
      Aucune partie jouée pour le moment.
    </div>

    <div v-else class="space-y-4">
      <div v-for="result in quizStore.results" :key="result.id" class="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex-1 min-w-[200px]">
          <div class="text-sm text-slate-500 mb-1">{{ formatDate(result.date) }}</div>
          <div class="font-bold text-lg leading-tight">{{ result.category }}</div>
          <div class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mt-1">
            {{ result.difficulty }}
          </div>
        </div>

        <div class="flex items-center gap-8">
          <div class="text-center">
            <div class="text-xs text-slate-500 uppercase font-medium mb-1">Score</div>
            <div class="text-xl font-bold text-indigo-600">
              {{ result.score }} / {{ result.totalQuestions }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-xs text-slate-500 uppercase font-medium mb-1">Temps</div>
            <div class="text-xl font-bold">
              {{ formatTime(result.timeTaken) }}
            </div>
          </div>

        <button
          @click="replaySimilar(result)"
          class="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
          title="Rejouer une partie similaire"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        </div>
      </div>
    </div>
  </div>
</template>
