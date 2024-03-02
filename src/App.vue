
<template>
  <RouterView />
</template>
<script setup>
import { watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router';
const route = useRoute()

watchEffect(() => {
  if (route.query?.ojbk === "1") {
    localStorage.setItem('lang', 'zh')
  }
})
</script>


<style scoped lang="scss">
</style>
