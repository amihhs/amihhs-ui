<script setup lang='ts'>

</script>

<template>
  <div>
    <Header />
    <main class="min-h-[calc(100vh-6rem)] font-sans" p="x-8xl y-3xl" text=" gray-700 dark:gray-200">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
