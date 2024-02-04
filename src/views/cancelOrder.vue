<template>
    <div class="cancelOrder maxWidth lrPadding">
        <div class="title">
            <img src="" alt="">
            Friendly reminder
        </div>
        <p class="text"> 1. If you have already made payment to the seller, please do not cancel the order.</p>

        <p class="text"> 2. If the seller does not respond to your message within 15 minutes, you can cancel the order
            without any
            penalty, and your completion rate will not be affected. You can cancel orders without penalty up to 5 times per
            day.</p>

        <p class="text"> 3. If the order is canceled due to system timeout, the buyer will be penalized (completion rate
            affected).
            You can have up to 3 cancellations with penalty per day. Otherwise, your account will be suspended, and you will
            not be able to place orders on the same day.</p>
        <h5>Please select the reason for cancellation</h5>
        <van-divider />
        <ul class="list">
            <li class="cursor " :class="{ pactive: reasonsIndex === index }" v-for="(item, index) in listData" :key="index"
                @click="selectReasons(index)">
                <img :src="getImg('common', reasonsIndex === index ? `${item.icon}Active` : item.icon)" class="circle"
                    alt="">
                {{ item.text }}
            </li>

        </ul>
    </div>
</template>
<script setup >
import { reactive, toRefs } from "vue";
import { getImg } from '@/utils/utils'
import http from '@/utils/axios'
import { useRouter } from 'vue-router'
const router = useRouter()
const state = reactive({
    reasonsIndex: -1,
    listData: [
        {
            icon: 'dot',
            text: 'I changed my mind/I no longer want to buy.'
        },
        {
            icon: 'dot',
            text: 'There was a technical or network error with the payment platform.'
        },
        {
            icon: 'dot',
            text: 'I haven’t made the payment yet, but accidentally clicked ‘Transferred.'
        },
        {
            icon: 'dot',
            text: 'I am a beginner and don’t know how to make the transfer.'
        },
        {
            icon: 'dot',
            text: 'The seller’s receiving account has been flagged by risk control and I am unable to make the payment.'
        },
        {
            icon: 'dot',
            text: 'The actual unit price/amount does not match what I saw.'
        },
        {
            icon: 'dot',
            text: 'Negotiated cancellation with the seller.'
        },
        {
            icon: 'dot',
            text: 'Other reasons.'
        },
    ]
})
function selectReasons(index) {
    state.reasonsIndex = index
    router.push({
        path: '/orderStatus'
    })
}
const { listData, reasonsIndex } = toRefs(state)
</script>
<style scoped lang='scss'>
.cancelOrder {
    height: 100%;
    background: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    .title {
        @include flex(flex-start);
        font-family: SegoeUI;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 14px;

        img {
            width: 20px;
            height: 20px;
        }
    }

    .text {
        font-size: 12px;
        line-height: 1.33;
        color: #a6a6a6;
        margin-bottom: 10px;
    }

    h5 {
        font-family: SegoeUI;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        margin-top: 24px;
    }

    .list {
        li {
            @include flex(flex-start);
            font-family: SegoeUI;
            font-size: 13px;
            color: #fff;
            margin-bottom: 26px;

            .circle {
                width: 18px;
                height: 18px;
                margin-right: 12px;
            }
        }

        .pactive {
            color: #ff7c43;
        }
    }
}
</style>