<template>
    <div class="layout">
        <Header :header="headerObj[pageName]" />
        <router-view />
        <Footer />

        <LeftNav />
    </div>
</template>
<script setup>
import { reactive, toRefs, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import LeftNav from '@/components/leftNav.vue'
import headerConf from '@/utils/header'

const route = useRoute()
const state = reactive({
    pageName: route.name,
    headerObj: headerConf

})
watchEffect(() => {
    console.log(route.name);
    state.pageName = route.name

})
const { headerObj, pageName } = toRefs(state)
</script>
<style scoped lang='scss'>
.layout {
    padding-top: 44px;
    padding-bottom: 50px;
    height: 100%;
    box-sizing: border-box;
}
</style>