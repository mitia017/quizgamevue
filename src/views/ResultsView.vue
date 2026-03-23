<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../stores/quiz';

const quizStore = useQuizStore();
const router = useRouter();

const lastResult = computed(() => quizStore.results[0]);

const percentage = computed(() => {
  if (!lastResult.value) return 0;
  return (lastResult.value.score / lastResult.value.totalQuestions) * 100;
});

const getFeedback = computed(() => {
  if (percentage.value >= 80) return { title: 'Excellent !', color: 'text-green-600', desc: 'Vous êtes un vrai champion !' };
  if (percentage.value >= 50) return { title: 'Pas mal !', color: 'text-indigo-600', desc: 'Encore un peu d’entraînement et ce sera parfait.' };
  return { title: 'Pas terrible...', color: 'text-red-600', desc: 'Vous pouvez faire mieux, réessayez !' };
});

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

if (!lastResult.value) {
  router.push('/');
}

const handleReplay = async () => {
  if (quizStore.currentSettings) {
    await quizStore.startQuiz(quizStore.currentSettings);
    router.push('/quiz');
  } else {
    router.push('/');
  }
};
</script>

<template>
  <div v-if="lastResult" class="max-w-2xl mx-auto py-12 px-4 text-center">
    <div class="glass-card p-12 mb-8">
      <div class="mb-6">
        <div class="relative inline-block">
          <svg class="w-32 h-32 transform -rotate-90">
            <circle
              class="text-slate-200 dark:text-slate-800"
              stroke-width="8"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
            <circle
              class="text-indigo-600 transition-all duration-1000 ease-out"
              stroke-width="8"
              :stroke-dasharray="364.4"
              :stroke-dashoffset="364.4 - (364.4 * percentage) / 100"
              stroke-linecap="round"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-3xl font-bold">{{ Math.round(percentage) }}%</span>
          </div>
        </div>
      </div>

      <h1 class="text-4xl font-bold mb-2" :class="getFeedback.color">
        {{ getFeedback.title }}
      </h1>
      <p class="text-slate-600 dark:text-slate-400 mb-8">
        {{ getFeedback.desc }}
      </p>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div class="text-sm text-slate-500 mb-1">Score</div>
          <div class="text-2xl font-bold">{{ lastResult.score }} / {{ lastResult.totalQuestions }}</div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div class="text-sm text-slate-500 mb-1">Temps</div>
          <div class="text-2xl font-bold">{{ formatTime(lastResult.timeTaken) }}</div>
        </div>
      </div>

      <div class="space-y-4">
        <button @click="handleReplay" class="btn-primary w-full block">Rejouer</button>
        <router-link to="/" class="btn-secondary w-full block">Retour à l'accueil</router-link>
      </div>
    </div>
  </div>
</template>
