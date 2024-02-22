<template>
    <div class="successfulArrival">
        <img src="../assets/images/common/usdtBg.webp" class="usdtBg" alt="">
        <p class="usdtNum">100.000 usdt</p>
        <p class="text">Successfully credited</p>
        <div class="backHome" @click="goHome">
            BACK HOME
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() {
    router.push({
        path: '/home'
    })
}
</script>
<style scoped lang='scss'>
.successfulArrival {
    height: 100%;
    overflow: auto;
    background-color: #0b0b0b;

    .usdtBg {
        width: 208px;
        margin: 0 auto;
    }

    .usdtNum {
        text-align: center;
        font-family: $fontFamily;
        font-size: 24px;
        letter-spacing: -0.3px;
        color: #fff;
    }

    .text {
        text-align: center;
        font-size: 16px;
        color: #a2a0a8;
        margin: 20px 0;
    }

    .backHome {
        font-family: $fontFamily;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -0.14px;
        color: #ff7c43;
        width: 137px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        border-radius: 24px;
        border: solid 1px #ff7c43;
        margin: 0 auto;
    }
}
</style>