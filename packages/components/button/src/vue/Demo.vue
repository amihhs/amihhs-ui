<script setup lang='ts'>
import BasicButton from './BasicButton.vue'
</script>

<template>
  <div grid grid-cols-1 gap-5 text-center>
    <h2 class="font-bold">
      Size
    </h2>
    <div class="flex items-center justify-center gap-5">
      <BasicButton size="large">
        large
      </BasicButton>
      <BasicButton>medium</BasicButton>
      <BasicButton size="small">
        small
      </BasicButton>
    </div>
    <h2 class="font-bold">
      Type
    </h2>
    <div class="flex items-center justify-center gap-5">
      <BasicButton type="default">
        default
      </BasicButton>
      <BasicButton type="primary">
        primary
      </BasicButton>
      <BasicButton type="warning">
        warning
      </BasicButton>
      <BasicButton type="danger">
        danger
      </BasicButton>
      <BasicButton type="success">
        success
      </BasicButton>
    </div>
    <h2 class="font-bold">
      Loading
    </h2>
    <div class="flex items-center justify-center gap-5">
      <BasicButton :loading="true">
        Loading
      </BasicButton>
    </div>
    <h2 class="font-bold">
      Icon
    </h2>
    <div class="flex items-center justify-center gap-5">
      <BasicButton icon="i-ion:md-rocket block" raw class="p-2 rounded-full bg-slate-2" />
      <BasicButton icon="i-ion:md-rocket">
        Loading
      </BasicButton>
      <BasicButton>
        Loading
        <i class="i-ion:md-rocket" />
      </BasicButton>
    </div>
  </div>
</template>
