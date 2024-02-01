<template>
    <div class="footer maxWidth">
        <div v-for="(item, index) in list" :key="index" class="footerItem" @click="changeFooterIndex(item, index)">
            <img :src="getImg('footer', (activeIndex === index ? `${item.icon}Active` : item.icon))" alt="">
            <p>{{ item.name }}</p>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, onMounted, watchEffect } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const state = reactive({
    activeIndex: 0,
    list: [
        {
            icon: 'home',
            name: 'Home',
            link: '/home'
        },
        {
            icon: 'match',
            name: 'Match',
            link: '/Match'
        },
        {
            icon: 'partner',
            name: 'Partner',
            link: '/partner'
        },
        {
            icon: 'funds',
            name: 'Funds',
        },
        {
            icon: 'profile',
            name: 'Profile',
        },
    ]
})
function changeFooterIndex(item, index) {
    state.activeIndex = index
    router.push({
        path: item.link
    })
}
function currentHighlight() {
    let pageName = route.name
    if (route.meta?.parentName) {
        state.activeIndex = state.list.findIndex(item => item.name.toLocaleLowerCase() === route.meta?.parentName) || 0
    } else {
        state.activeIndex = state.list.findIndex(item => item.name.toLocaleLowerCase() === pageName) || 0
    }
}
watchEffect(() => {
    currentHighlight()
})
onMounted(() => {
    currentHighlight()
})
const { list, activeIndex } = toRefs(state)
</script>
<style scoped lang='scss'>
.footer {
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #18181b;
    @include flex();

    .footerItem {
        width: calc(100% / 5);
        @include flex();
        flex-direction: column;
        font-size: 10px;
        text-align: left;
        color: #8d8d8d;

        img {
            width: 26px;
            height: 26px;
        }
    }
}
</style>