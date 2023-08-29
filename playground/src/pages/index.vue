<script setup lang="ts">

</script>

<template>
  <div class="pt-10">
    <p class="text-6xl font-mono text-center font-900 max-w-300 m-auto leading-relaxed">
      <span>Handless UI Component Library Based on </span>
      <a
        href="https://github.com/unocss/unocss" target="_blank"
        class="underline underline-dotted underline-offset-13 hover:text-teal-5"
      >
        UnoCSS
      </a>
    </p>
    <div class="flex items-end justify-center gap-xl mt-20">
      <router-link to="/docs/quickly-start" class="px-xl rounded-lg py-sm bg-slate-7 text-white font-900">
        Getting Started
      </router-link>
      <router-link to="/components" class="px-xl rounded-lg py-sm bg-slate-2 text-slate-7 font-900">
        Components
      </router-link>
      <router-link to="/docs" class=" underline-(~ 2) text-slate-7 dark:text-slate-4 font-900 text-lg pb-1">
        Docs <i class="i-ic:outline-keyboard-double-arrow-right" />
      </router-link>
    </div>
  </div>
</template>
