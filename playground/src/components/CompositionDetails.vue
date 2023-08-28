<script setup lang='ts'>
const props = withDefaults(defineProps<{
  required: Record<string, Record<string, string>[]>
}>(), {
  required: () => ({}),
})
const toggle = ref(false)

function toggleHandler(e: Event) {
  toggle.value = (e.target as HTMLDetailsElement).open
}
</script>

<template>
  <details @toggle="toggleHandler">
    <summary class="cursor-pointer select-none list-none text-emerald text-lg font-bold">
      <i class="i-ion:sparkles-outline transition-all" :class="[toggle ? 'transform rotate-z-90' : '']" />
      Required
    </summary>
    <div class="">
      <ul v-for="v, key in props.required" :key="key" class=" m-sm">
        <h4 class="font-bold flex items-center gap-1">
          <span class="bg-slate-2 rounded-full p-1 inline-grid place-content-center text-3.5 mr-1"><i class="i-ion:md-rocket text-emerald" /></span>
          <span>{{ key }}</span>
        </h4>
        <li v-for="href, value in v" :key="value" class="mt-2">
          <i class="i-ion:git-merge-outline text-slate-4 text-3.5 mx-2" />
          <a :href="Object.values(href)[0]" target="_blank">
            <span class="hover:(underline underline-offset-6 underline-dashed underline-emerald text-emerald) ">{{ Object.keys(href)[0] }}</span>
            <span class="text-slate-4 text-3.5 ml-1">({{ Object.values(href)[0] }})</span>
          </a>
        </li>
      </ul>
    </div>
  </details>
</template>
