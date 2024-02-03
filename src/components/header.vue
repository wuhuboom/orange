<template>
    <div class="header maxWidth" :style="{ background: header?.bgColor }">
        <div class="hbox">
            <div class="left" :style="{ width: header.leftIconWidth, height: header.leftIconHeight }">
                <img :src="getImg('header', header.leftIcon)" alt="" @click="handleHeaderClick">
                <div class="buyC2C" v-if="route.name == 'buy'">
                    C2C
                </div>
            </div>
            <div class="center">{{ header.center }}</div>
            <div class="right">
                <!-- 金额 -->
                <div class="money" v-if="header.isShowRightMoney">
                    <img :src="getImg('header', 'mIcon')" class="mIcon" alt="">
                    <span class="moneyNum">{{ accInfo?.currRate || '0.0' }}</span>
                </div>
                <!-- buy页面 -->
                <div class="hbuy" v-if="route.name == 'buy'">
                    <div class="money buyMoney">
                        <img :src="getImg('header', 'buy')" class="mIcon" alt="">
                        <span class="moneyNum bOrder">Order</span>
                    </div>
                    <div class="myAssets">
                        My Assets
                    </div>
                </div>
                <img :src="getImg('header', header.rightIcon)" class="rightIcon" alt="" v-if="header.rightIcon"
                    @click="handleRightIcon" :style="{ width: header?.rightIconWidth, height: header?.rightIconHeight }">
            </div>
        </div>
    </div>
</template>
<script setup >
import { toRefs, defineProps, reactive } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter, useRoute } from 'vue-router'
import http from '@/utils/axios'
import { useStore } from '@/stores/index'

const store = useStore()
const router = useRouter()
const route = useRoute()
const props = defineProps(['header'])
const { header } = toRefs(props)

const state = reactive({
    accInfo: {}
})
function handleHeaderClick() {
    // router.push({
    //     path: header.value.link
    // })
    if (header.value.leftIcon == 'back') {
        router.go(-1)
    }
    let showLeftArr = ['home', 'safe']
    console.log(route.name);
    if (showLeftArr.includes(route.name)) {
        store.showLeftNav = true
    }
}
function handleRightIcon() {
    if (header.value.noticeLink) {
        router.push({
            path: header.value.noticeLink
        })
    }
}
getBalance()
async function getBalance() {
    let url = '/player/player_info'
    try {
        const res = await http.get(url)
        if (res?.currRate) {
            state.accInfo = res
            store.balance = res.currRate
        }
    } catch (error) {
        console.log(error);
    }
}
const { accInfo } = toRefs(state)
</script>
<style scoped lang='scss'>
.header {
    height: 44px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    @include flex(space-between);
    // background-color: #202020;
    box-sizing: border-box;
    padding: 0 12px;
    z-index: 10;

    .hbox {
        width: 100%;
        @include flex(space-between);
    }

    img {
        width: 100%;
        height: 100%;
    }

    .left {
        @include flex(flex-start);

        img {
            width: 32px;
            height: 32px;
        }

        .buyC2C {
            color: #fff;
            font-family: Helvetica;
            font-size: 18px;
            color: #fff;
        }
    }

    .center {
        font-size: 16px;
        color: #fff;
    }

    .right {
        @include flex(space-between);

        .rightIcon {
            @extend .left;

        }

        .money {
            height: 32px;
            @include flex();
            margin-right: 23px;
            border-radius: 16px;
            background-color: #2b2b2b;
            padding: 0px 9px 0px 4px;

            .moneyNum {
                margin: 0px 0 0px 6px;
                font-family: Roboto;
                font-size: 14px;
                color: #fff;
            }


            .mIcon {
                width: 24px;
                height: 24px;
            }
        }

        .hbuy {
            @include flex();

            .buyMoney {
                background-color: #0b0b0b;
            }

            .myAssets {
                height: 23px;
                line-height: 23px;
                padding: 2.4px 9px 2.6px 10px;
                border-radius: 8px;
                background-image: linear-gradient(to bottom, #ff6c00, #ffa031);
                font-family: SegoeUI;
                font-size: 11px;
                color: #fff;
            }


        }
    }
}
</style>@/stores