<template>
  <div class="animate-pulse">
    <div class="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-4"></div>
    <div class="h-4 bg-slate-100 dark:bg-slate-900 rounded-lg w-1/2 mb-8"></div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800"></div>
    </div>
  </div>
</template>
