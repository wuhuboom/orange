<template>
    <div class="footer maxWidth">
        <div class="radius">
            <div v-for="(item, index) in list" :key="index" class="footerItem" @click="changeFooterIndex(item, index)">
                <img :src="getImg('footer', (activeIndex === index ? `${item.icon}Active` : item.icon))" alt="">
                <p>{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, onMounted, watchEffect, computed } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const state = reactive({
    activeIndex: 0,
})
const list = computed(() => {

    let list = [
        {
            icon: 'home',
            name: t('footer.home'),
            fname: 'home',
            link: '/home'
        },
        {
            icon: 'match',
            name: t('footer.match'),
            fname: 'match',
            link: '/Match'
        },
        // {
        //     icon: 'partner',
        //     name: 'Partner',
        //     link: '/partner'
        // },
        {
            icon: 'partner',
            name: t('footer.order'),
            fname: 'order',
            link: '/order'
        },
        {
            icon: 'funds',
            name: t('footer.safe'),
            fname: 'safe',
            link: '/safe'
        },
        // {
        //     icon: 'funds',
        //     name: 'Funds',
        // },
        // {
        //     icon: 'profile',
        //     name: 'Profile',
        // },
    ]
    return list
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
        state.activeIndex = list.value.findIndex(item => item.fname.toLocaleLowerCase() === route.meta?.parentName) || 0
    } else {
        state.activeIndex = list.value.findIndex(item => item.fname.toLocaleLowerCase() === pageName) || 0
    }
}
watchEffect(() => {
    currentHighlight()
})
onMounted(() => {
    currentHighlight()
})
const { activeIndex } = toRefs(state)
</script>
<style scoped lang='scss'>
.footer {
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    cursor: pointer;
    background-color: $mainBg;

    .radius {
        height: 50px;
        @include flex();
        background-color: #212121;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;

        .footerItem {
            width: calc(100% / 4);
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
}
</style>