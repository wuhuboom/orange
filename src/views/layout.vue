<template>
    <div class="layout">
        <Header :header="headerObj[pageName]" />
        <router-view />
        <Footer />
    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'

import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

const route = useRoute()
console.log(route.name);
const state = reactive({
    pageName: route.name,
    headerObj: {
        home: {
            leftIcon: 'hleftIcon',
            center: '',
            rightIcon: 'hRightIcon',
            isShowRightMoney: true
        }
    },
})
const { headerObj, pageName } = toRefs(state)
</script>
<style scoped lang='scss'>
.layout {
    padding-top: 44px;
    padding-bottom: 50px;
    height: 100%;
}
</style>