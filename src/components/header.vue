<template>
    <div class="header maxWidth" :style="{ background: header?.bgColor }">
        <div class="hbox">
            <div class="left">
                <img :src="getImg('header', header.leftIcon)"
                    :style="{ width: header.leftIconWidth, height: header.leftIconHeight }" alt=""
                    @click="handleHeaderClick">
                <!-- buy页面 -->
                <div class="buyC2C" v-if="route.name == 'buy'">
                    C2C
                </div>
                <!-- 购买数量 -->
                <div class="purchaseAmount" v-if="route.name == 'purchaseAmount'">
                    <img src="../assets/images/common/avatar.webp" class="avatar" alt="">
                    <div>
                        <p class="name">name name</p>
                        <p class="num">$7.821</p>
                    </div>
                </div>

            </div>
            <div class="center" :style="{ marginRight: header.leftIconWidth }">{{ header.center }}</div>
            <div class="right">
                <!-- 金额 -->
                <div class="money" v-if="header.isShowRightMoney">
                    <img :src="getImg('header', 'mIcon')" class="mIcon" alt="">
                    <span class="moneyNum">{{ accountInfo?.currRate || '0.0' }}</span>
                </div>
                <!-- buy页面 -->
                <div class="hbuy" v-if="route.name == 'buy'">
                    <div class="money buyMoney">
                        <img :src="getImg('header', 'buy')" class="mIcon" alt="">
                        <span class="moneyNum bOrder">{{ $t('safe.buy.header.order.text') }}</span>
                    </div>
                    <div class="myAssets">
                        {{ $t('safe.buy.header.myAsseets.text') }}
                    </div>
                </div>
                <img :src="getImg('header', header.rightIcon)" class="rightIcon" alt="" v-if="header.rightIcon"
                    @click="handleRightIcon" :style="{ width: header?.rightIconWidth, height: header?.rightIconHeight }">
            </div>
        </div>
    </div>
</template>
<script setup >
import { toRefs, defineProps, reactive, onMounted, computed } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/stores/index'

const store = useStore()
const accountInfo = computed(() => store.accountInfo)
const router = useRouter()
const route = useRoute()
const props = defineProps(['header'])
const { header } = toRefs(props)


async function handleHeaderClick() {
    await store.getUserInfo()
    if (header.value.leftIcon == 'back') {
        router.go(-1)
    }
    let showLeftArr = ['home', 'safe']
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
onMounted(() => {
    store.getUserInfo()
})
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
            font-family: $fontFamily;
            font-size: 18px;
            color: #fff;
        }

        .purchaseAmount {
            @include flex(flex-start);

            .avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                margin-right: 8px;
            }

            div {
                .name {
                    font-size: 11px;
                    color: #fff;

                }

                .num {
                    font-size: 12px;
                    color: #69cfb5;
                }
            }
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
            width: 32px;
            height: 32px;
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
                font-family: $fontFamily;
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
                font-family: $fontFamily;
                font-size: 11px;
                color: #fff;
            }


        }
    }
}
</style>@/stores