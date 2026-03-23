import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QuizView from '../views/QuizView.vue';
import ResultsView from '../views/ResultsView.vue';
import HistoryView from '../views/HistoryView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/quiz', name: 'quiz', component: QuizView },
  { path: '/results', name: 'results', component: ResultsView },
  { path: '/history', name: 'history', component: HistoryView },
  { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
