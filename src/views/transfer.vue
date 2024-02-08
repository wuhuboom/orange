<template>
    <div class="send maxWidth lrPadding">
        <div class="sendBox safeBox">
            {{ accountInfo.currRate }}
        </div>
        <div class="arrow-down">
            <img src="../assets/images/common/arrow-down.webp" alt="">
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('transfer.football.balance') }}</div>
            <input type="text" v-model="amount" placeholder="please enter amount">
        </div>
        <div class="balance">
            <p>
                {{ $t('send.balance.text') }}: <span class="money">{{ accountInfo.currRate }}</span>
            </p>
            <span class="all cursor" @click="setAllAmount">
                {{ $t('send.all.text') }}
            </span>
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('send.paymentPassword.text') }}</div>
            <input type="password" v-model="payPwd" :placeholder="$t('send.payment.placeholder.text')">
        </div>
        <div class="confirm cursor" @click="confirmTransfer">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, computed } from 'vue'
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useStore } from '@/stores/index'
const store = useStore()
const accountInfo = computed(() => store.accountInfo)
const state = reactive({
    amount: 0,
    payPwd: ''
})
function setAllAmount() {
    state.amount = accountInfo?.value.currRate
}
async function confirmTransfer() {
    let url = '/player/safe/toBalance'
    let data = {
        money: state.amount,
        payPwd: state.payPwd
    }
    http.post(url, data).then(res => {
        console.log(
            '%c res: ',
            'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
            res
        )

        state.amount = 0
        state.payPwd = ''
        // store.getUserInfo()
        showToast('success')
    })

}
const { amount, payPwd } = toRefs(state)
</script>
<style scoped lang='scss'>
.send {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    padding-top: 20px;

    // @include flex();
    // flex-direction: column;
    .sendBox {
        width: 100%;
        box-sizing: border-box;
        @include flex(center);
        flex-direction: column;

        .title {
            width: 350px;
            text-align: left;
            font-size: 14px;
            color: #fff;
            display: block;
            margin: 0 auto;
        }

        input {
            width: 350px;
            height: 49px;
            border-radius: 10px;
            border: solid 1px #ff7c43;
            background-color: #333;
            color: #fff;
            margin-top: 8px;
            box-sizing: border-box;
            padding-left: 15px;
        }
    }

    .safeBox {
        width: 350px;
        height: 49px;
        border-radius: 10px;
        border: solid 1px #ff7c43;
        background-color: #333;
        color: #fff;
        margin-top: 8px;
        box-sizing: border-box;
        padding-left: 15px;
        margin: 0 auto;
        align-items: flex-start;
    }

    .arrow-down {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        background-color: #333;
        margin: 26px auto 15px;
    }

    .balance {
        width: 350px;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #8a929a;
        @include flex(space-between);
        margin: 14px auto 34px;

        .money {
            color: #fff;
        }

        .all {
            color: #ff7c43;
        }
    }

    .confirm {
        width: 351px;
        height: 48px;
        border-radius: 14px;
        background-color: #ff7c43;
        box-sizing: border-box;
        @include flex(center);
        font-size: 14px;
        color: #fff;
        margin: 20vh auto 0;
    }
}
</style>