<script setup lang="ts">
import Components from '~/logic/components'
</script>

<template>
  <div v-for="v, i in Components" :key="i" class="flex items-start">
    <h2 class="text-4xl font-bold mr-10 flex-shrink-0 sticky top-25 capitalize">
      {{ i }}
    </h2>
    <div class="grid grid-cols-7 gap-xl flex-grow min-h-200vh">
      <router-link
        v-for="item in v" :key="item.name"
        :to="`/components/elements/${item.name}`"
        class="border-(2 slate-2) rounded-lg bg-slate-1 bg-opacity-60 aspect-ratio-1/1 grid place-content-center font-bold text-xl"
        dark="border-slate-8 bg-slate-9"
      >
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>
