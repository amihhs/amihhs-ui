<script setup lang='ts'>

</script>

<template>
  <div
    class="flex items-center justify-between py-xl px-4xl text-lg border-(b-1 slate-1) sticky top-0 z-9 bg-white"
    dark="border-slate-7 bg-gray-8"
  >
    <div>
      <img h-8 src="/logo.svg" alt="LOGO">
    </div>
    <div
      class="flex items-center gap-4xl divide-(x-3 slate-2)"
      dark="divide-slate-7"
    >
      <div class="flex items-center gap-4xl font-bold">
        <router-link to="/">
          Home
        </router-link>
        <router-link to="/components">
          Components
        </router-link>
        <router-link to="/docs">
          Docs
        </router-link>
      </div>
      <div class="flex items-center gap-4xl pl-4xl">
        <a href="https://github.com/amihhs/amihhs-ui" target="_blank">GitHub</a>
        <DarkToggle />
      </div>
    </div>
  </div>
</template>
