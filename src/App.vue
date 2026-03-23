<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300"
  >
    <nav
      class="sticky top-0 z-50 glass-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 rounded-none shadow-sm"
    >
      <div
        class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"
      >
        <router-link to="/" class="flex items-center gap-2 group">
          <div
            class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform"
          >
            <span class="text-xl font-bold">Q</span>
          </div>
          <span
            class="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-tight"
            >Quiz Time</span
          >
        </router-link>

        <div class="flex items-center gap-6">
          <router-link
            to="/history"
            class="text-sm font-semibold hover:text-indigo-600 transition-colors"
            >Historique</router-link
          >
          <router-link
            to="/leaderboard"
            class="text-sm font-semibold hover:text-indigo-600 transition-colors"
            >Classement</router-link
          >
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="mt-auto py-8 text-center text-slate-400 text-sm">
      <p>&copy; 2024 Quiz Time App. Fait avec passion pour les curieux.</p>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
