<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../stores/quiz';
import type { QuizSettings } from '../types';

const quizStore = useQuizStore();
const router = useRouter();

const settings = ref<QuizSettings>({
  amount: 10,
  category: 'any',
  difficulty: 'any',
  type: 'any'
});

onMounted(() => {
  quizStore.fetchCategories();
});

const start = async () => {
  await quizStore.startQuiz(settings.value);
  if (!quizStore.error) {
    router.push('/quiz');
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <div class="glass-card p-8 text-center mb-8">
      <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Quiz Master
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        Testez vos connaissances avec notre quiz interactif !
      </p>
    </div>

    <div class="glass-card p-8">
      <div class="space-y-6">
        <div>
          <label id="label-amount" class="block text-sm font-medium mb-2">Nombre de questions</label>
          <input
            v-model.number="settings.amount"
            type="number"
            min="1"
            max="50"
            aria-labelledby="label-amount"
            class="input-field"
          />
        </div>

        <div>
          <label id="label-category" class="block text-sm font-medium mb-2">Catégorie</label>
          <select v-model="settings.category" aria-labelledby="label-category" class="input-field">
            <option value="any">Toutes les catégories</option>
            <option v-for="cat in quizStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div>
          <label id="label-difficulty" class="block text-sm font-medium mb-2">Difficulté</label>
          <select v-model="settings.difficulty" aria-labelledby="label-difficulty" class="input-field">
            <option value="any">Toutes les difficultés</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>

        <button
          @click="start"
          :disabled="quizStore.loading"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span v-if="quizStore.loading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
          {{ quizStore.loading ? 'Chargement...' : 'Commencer la partie' }}
        </button>
      </div>

      <div v-if="quizStore.error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm">
        {{ quizStore.error }}
      </div>

      <div class="mt-8 flex gap-4">
        <router-link to="/history" class="btn-secondary flex-1 text-center">Historique</router-link>
        <router-link to="/leaderboard" class="btn-secondary flex-1 text-center">Classement</router-link>
      </div>
    </div>
  </div>
</template>
