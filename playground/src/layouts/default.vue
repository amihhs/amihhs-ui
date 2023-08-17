<script setup lang='ts'>

</script>

<template>
  <div>
    <Header />
    <main class="min-h-[calc(100vh-6rem)] font-sans" p="x-8xl y-3xl">
      <Suspense>
        <router-view />
      </Suspense>
    </main>
    <Footer />
  </div>
</template>
