
<template>
  <RouterView />
  <TaxPayment v-if="user.id && isShow"/>
</template>
<script setup>
import { computed, watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router';
const route = useRoute()
import TaxPayment from '@/components/TaxPayment.vue'
import { useStore } from '@/stores/index'
const store = useStore()
const user = computed(() => store.accountInfo)
const isShow=computed(()=>{
  console.log(route.name)
  return route.name !== 'recharge'
})
watchEffect(() => {
  // if (route.query?.ojbk === "1") {
  //   localStorage.setItem('lang', 'zh')
  // }
})
</script>


<style scoped lang="scss">
</style>
