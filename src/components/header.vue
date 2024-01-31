<template>
    <div class="header maxWidth" :style="{ background: header.bgColor }">
        <div class="left">
            <img :src="getImg('header', header.leftIcon)" alt="" @click="handleHeaderClick">
        </div>
        <div class="center">{{ header.center }}</div>
        <div class="right">
            <!-- 金额 -->
            <div class="money" v-if="header.isShowRightMoney">
                <img :src="getImg('header', 'mIcon')" class="mIcon" alt="">
                <span class="moneyNum">5093.76</span>
            </div>
            <img :src="getImg('header', header.rightIcon)" class="rightIcon" alt="">
        </div>
    </div>
</template>
<script setup >
import { toRefs, defineProps, watchEffect } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps(['header'])
const { header } = toRefs(props)

function handleHeaderClick() {
    router.push({
        path: header.value.link
    })
}
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

    img {
        width: 100%;
        height: 100%;
    }

    .left {
        width: 32px;
        height: 32px;
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
    }
}
</style>