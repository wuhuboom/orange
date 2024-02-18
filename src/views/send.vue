<template>
    <div class="send maxWidth lrPadding">
        <div class="sendBox">
            <div class="title">{{ $t('login.username') }}</div>
            <input type="text" v-model="useName" :placeholder="$t('send.username.placeholder.text')">
        </div>
        <div class="arrow-down">
            <img src="../assets/images/common/arrow-down.webp" alt="">
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('send.amount.text') }}</div>
            <input type="text" v-model="amount" :placeholder="$t('send.amount.placeholder.text')">
        </div>
        <div class="balance">
            <p>
                {{ $t('send.balance.text') }}: <span class="money"> {{ getAmount(safeData?.money) || 0 }}</span>
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
import { getAmount } from '@/utils/utils'
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useStore } from '@/stores/index'
import { useI18n } from 'vue-i18n'
const store = useStore()
const { t } = useI18n()
const accountInfo = computed(() => store.accountInfo)

const state = reactive({
    useName: '',
    amount: 0,
    payPwd: '',
    safeData: {}
})
function setAllAmount() {
    state.amount = getAmount(state.safeData?.money)
}
getSafeInfo()
async function getSafeInfo() {
    let url = '/player/safe/info'
    try {
        const res = await http.get(url)
        if (res?.id) {
            state.safeData = res
        }
    } catch (error) {
        console.log(error);
    }
}
async function confirmTransfer() {
    let url = '/player/safe/transfer'
    let data = {
        aimName: state.useName,
        money: state.amount,
        payPwd: state.payPwd
    }
    if (state.useName === '') {
        showToast(t('backapi.usernameIsEmpty'))
        return
    }
    if (state.amount <= 4) {
        showToast(t('backapi.payMoneyTooMinOrMax'))
        return
    }
    if (state.payPwd === '') {
        showToast(t('backapi.payPwdIsEmpty'))
        return
    }
    try {
        const res = await http.post(url, data)
        if (res === null) {
            state.useName = ''
            state.amount = 0
            state.payPwd = ''
            showToast('success')
        }
    } catch (error) {
        console.log(error);
    }
}
const { useName, amount, payPwd, safeData } = toRefs(state)
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