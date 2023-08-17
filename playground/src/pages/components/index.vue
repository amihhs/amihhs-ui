<script setup lang="ts">

</script>

<template>
  <div class="flex items-start">
    <h2 class="text-4xl font-bold mr-10 flex-shrink-0 sticky top-25">
      Elements
    </h2>
    <div class="grid grid-cols-7 gap-xl flex-grow min-h-200vh">
      <router-link
        to="/components/elements/button"
        class="border-(2 slate-2) rounded-lg bg-slate-1 bg-opacity-60 aspect-ratio-1/1 grid place-content-center font-bold text-xl"
        dark="border-slate-8 bg-slate-9"
      >
        button
      </router-link>
    </div>
  </div>
</template>
