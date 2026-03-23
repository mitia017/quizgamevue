<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../stores/quiz';
import QuizSkeleton from '../components/QuizSkeleton.vue';

const quizStore = useQuizStore();
const router = useRouter();

const selectedAnswer = ref<string | null>(null);
const isAnswered = ref(false);
const timeLeft = ref(30);
let timer: any = null;

const currentQuestion = computed(() => quizStore.currentQuestion);

const startTimer = () => {
  timeLeft.value = 30;
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      handleAnswer(''); // Temps écoulé
    }
  }, 1000);
};

onMounted(() => {
  if (!currentQuestion.value) {
    router.push('/');
    return;
  }
  startTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});

const handleAnswer = (answer: string) => {
  if (isAnswered.value) return;

  clearInterval(timer);
  selectedAnswer.value = answer;
  isAnswered.value = true;

  setTimeout(() => {
    quizStore.submitAnswer(answer);
    if (quizStore.isGameOver) {
      router.push('/results');
    } else {
      selectedAnswer.value = null;
      isAnswered.value = false;
      startTimer();
    }
  }, 1500);
};

const getAnswerClass = (answer: string) => {
  if (!isAnswered.value) return 'hover:bg-indigo-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800';

  if (answer === currentQuestion.value?.correct_answer) {
    return 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400';
  }

  if (answer === selectedAnswer.value) {
    return 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400';
  }

  return 'opacity-50 border-slate-200 dark:border-slate-800';
};
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div v-if="quizStore.loading" class="glass-card p-8">
      <QuizSkeleton />
    </div>

    <!-- Progress & Timer -->
    <template v-else-if="currentQuestion">
    <transition name="slide-up" mode="out-in">
    <div :key="quizStore.currentQuestionIndex">
    <div class="flex justify-between items-center mb-6">
      <div class="flex-1 mr-4">
        <div class="flex justify-between text-sm mb-2 font-medium">
          <span>Question {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.questions.length }}</span>
          <span>{{ Math.round(quizStore.progress) }}%</span>
        </div>
        <div class="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-600 transition-all duration-500"
            :style="{ width: `${quizStore.progress}%` }"
          ></div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 transition-colors"
           :class="timeLeft < 10 ? 'border-red-500 text-red-500' : 'border-indigo-600 text-indigo-600'">
        <span class="text-xl font-bold">{{ timeLeft }}</span>
      </div>
    </div>

    <!-- Question Card -->
    <div class="glass-card p-8 mb-8">
      <div class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 mb-4 uppercase tracking-wider">
        {{ currentQuestion.category }} • {{ currentQuestion.difficulty }}
      </div>
      <h2 class="text-2xl font-bold leading-relaxed mb-8" id="question-text">
        {{ currentQuestion.question }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-labelledby="question-text">
        <button
          v-for="answer in currentQuestion.all_answers"
          :key="answer"
          @click="handleAnswer(answer)"
          :disabled="isAnswered"
          class="p-4 text-left border-2 rounded-xl transition-all font-medium flex justify-between items-center group"
          :class="getAnswerClass(answer)"
        >
          <span>{{ answer }}</span>
          <span v-if="isAnswered && answer === currentQuestion.correct_answer" class="text-green-600">✓</span>
          <span v-if="isAnswered && answer === selectedAnswer && answer !== currentQuestion.correct_answer" class="text-red-600">✗</span>
        </button>
      </div>
    </div>
    </div>
    </transition>
    </template>
  </div>
</template>
