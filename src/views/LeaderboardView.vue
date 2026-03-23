<script setup lang="ts">
import { computed } from 'vue';
import { useQuizStore } from '../stores/quiz';

const quizStore = useQuizStore();

const topScores = computed(() => {
  return [...quizStore.results].sort((a, b) => {
    const scoreA = (a.score / a.totalQuestions);
    const scoreB = (b.score / b.totalQuestions);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return b.score - a.score;
  }).slice(0, 10);
});

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Meilleurs Scores</h1>
      <router-link to="/" class="btn-secondary">Retour</router-link>
    </div>

    <div v-if="topScores.length === 0" class="glass-card p-12 text-center text-slate-500">
      Aucun score enregistré pour le moment.
    </div>

    <div v-else class="space-y-4">
      <div v-for="(result, index) in topScores" :key="result.id" class="glass-card p-6 flex items-center gap-6">
        <div class="w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold bg-slate-100 dark:bg-slate-800"
             :class="{'bg-yellow-100 text-yellow-600 border-2 border-yellow-500': index === 0,
                      'bg-slate-200 text-slate-600': index === 1,
                      'bg-orange-100 text-orange-600': index === 2}">
          {{ index + 1 }}
        </div>

        <div class="flex-1">
          <div class="font-bold text-lg leading-tight">{{ result.category }}</div>
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
            {{ result.difficulty }} • {{ formatTime(result.timeTaken) }}
          </div>
        </div>

        <div class="text-right">
          <div class="text-sm text-slate-500 uppercase font-medium mb-1">Précision</div>
          <div class="text-2xl font-black text-indigo-600">
            {{ Math.round((result.score / result.totalQuestions) * 100) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
