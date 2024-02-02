<template>
    <div class="layout">
        <Header :header="headerObj[pageName]" />
        <router-view />
        <Footer />
    </div>
</template>
<script setup>
import { reactive, toRefs, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'

const route = useRoute()
const state = reactive({
    pageName: route.name,
    headerObj: {
        home: {
            leftIcon: 'hleftIcon',
            leftIconWidth: '32px',
            leftIconHeight: '32px',
            center: '',
            rightIcon: 'hRightIcon',
            isShowRightMoney: true,
            bgColor: '#202020'
        },
        match: {
            leftIcon: 'cter',
            leftIconWidth: '58px',
            leftIconHeight: '19px',
            center: '',
            rightIcon: 'hRightIcon',
            isShowRightMoney: true,
            bgColor: '#202020'
        },
        order: {
            leftIcon: 'boldCter',
            leftIconWidth: '58px',
            leftIconHeight: '19px',
            center: '',
            rightIcon: 'hRightIcon',
            isShowRightMoney: true,
            bgColor: '#202020'
        },
        betPage: {
            leftIcon: 'back',
            leftIconWidth: '32px',
            leftIconHeight: '32px',
            center: 'Friendlies Clubs',
            rightIcon: 'bell',
            noticeLink: '/sysNotice',
            isShowRightMoney: false,
            bgColor: 'transparent',
            link: '/contest'
        },
        sysNotice: {
            leftIcon: 'back',
            leftIconWidth: '32px',
            leftIconHeight: '32px',
            center: 'Message Center',
            rightIcon: '',
            isShowRightMoney: false,
            bgColor: '#202020',
            link: '/home'
        },
        partner: {
            leftIcon: 'cter',
            leftIconWidth: '58px',
            leftIconHeight: '19px',
            center: '',
            rightIcon: 'bell',
            isShowRightMoney: true,
            bgColor: '#202020'
        },
    },

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