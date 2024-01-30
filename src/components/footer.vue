<template>
    <div class="footer maxWidth">
        <div v-for="(item, index) in list" :key="index" class="footerItem" @click="changeFooterIndex(index)">
            <img :src="getImg('footer', activeIndex === index ? `${item.icon}Active` : item.icon)" alt="">
            <p>{{ item.name }}</p>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import { getImg } from '@/utils/utils'
const state = reactive({
    activeIndex: 0,
    list: [
        {
            icon: 'home',
            name: 'Home',
        },
        {
            icon: 'contest',
            name: 'Contest',
        },
        {
            icon: 'partner',
            name: 'partner',
        },
        {
            icon: 'funds',
            name: 'funds',
        },
        {
            icon: 'profile',
            name: 'Profile',
        },
    ]
})
function changeFooterIndex(index) {
    state.activeIndex = index
}
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