<template>
    <div class="send maxWidth lrPadding">
        <div class="sendBox">
            <div class="title">{{ $t('send.amount.placeholder.text') }}</div>
            <input type="number" class="hideInputBtn" :class="{ inputAct: amountInput }" v-model="amount"
                @input="getInputAmount" :placeholder="$t('send.amount.placeholder.text')" @blur="amountInput = false"
                @focus="amountInput = true">
        </div>
        <div class="balance">
            <p>
                {{ $t('recharge.current.exchang.rate') }}: <span class="money">{{ rechargeInfo?.rate || 0 }}</span>
            </p>
        </div>
        <div class="balance">
            <p>
                {{ $t('recharge.actual.receivedamount') }}: <span class="money">{{ amount * rechargeInfo?.rate || 0
                }}</span>
            </p>
        </div>
        <div class="sendBox sub">
            <div class="title" style="margin-bottom: 15px;">{{ $t('recharge.pay.method') }}</div>
            <div class="bankList cursor" v-for="(item, index) in channelList" :key="index"
                :class="{ bankListActive: index === channelIndex }" @click="selectBank(item, index)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div class="cardName">{{ item.name }}</div>
                </div>
                <!-- <van-icon name="arrow" color="#fff" /> -->
            </div>
        </div>

        <div class="confirm cursor" :class="{ confirmMt: channelList.length > 0 }" @click="toPage">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, } from 'vue'
import { useRouter, useRoute } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const { rechargeType } = route.query

const state = reactive({
    amount: '0',
    rechargeInfo: {},
    channelList: [],
    channelIndex: 0,
    amountInput: false
})
async function toPage() {
    let safeUrl = '/player/safe/recharge'
    let footballUrl = '/player/recharge'
    let url = rechargeType === 'football' ? footballUrl : safeUrl
    if (state.channelIndex < 0) {
        showToast(t('recharge.confirm.notSelectPayMet.text'))
        return
    }
    if (state.amount <= 4) {
        showToast(t('backapi.payMoneyTooMinOrMax'))
        return
    }
    let payId = state.channelList[state.channelIndex]?.id
    let data = {
        money: state.amount,
        payId
    }
    try {
        const res = await http.post(url, data)
        // console.log(res);
        if (res?.UrlAddress) {
            location.href = res?.UrlAddress
            // router.push({
            //     path: '/swapInfo'
            // })

        }
    } catch (error) {

    }
}
function getInputAmount() {
    if (state.amount < 0) {
        state.amount = 0
    }

}
if (rechargeType === 'safe') {
    reachargePre()
}
async function reachargePre() {
    let url = '/player/safe/recharge_pre'
    // let footballUrl = '/player/recharge_pre'
    // let url = rechargeType === 'football' ? footballUrl : safeUrl
    try {
        const res = await http.get(url)
        if (res?.id) {
            state.rechargeInfo = res
        }
    } catch (error) {
        console.log(error);
    }
}
getMultiChannel()
// 充值多渠道列表
async function getMultiChannel() {
    let safeUrl = '/player/safe/recharge_pre_mult'
    let footballUrl = '/player/recharge_pre'
    let url = rechargeType === 'football' ? footballUrl : safeUrl
    try {
        const res = await http.get(url)
        state.channelList = res
        if (rechargeType === 'football') {
            state.rechargeInfo = state.channelList[state.channelIndex]
        }
    } catch (error) {
        console.log(error);
    }
}
function selectBank(item, index) {
    state.channelIndex = index
    state.rechargeInfo = item
}
const { amount, channelIndex, rechargeInfo, channelList, amountInput } = toRefs(state)
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
    .sub{
        margin-top: 30px!important;
    }
    .sendBox {
        width: 100%;
        box-sizing: border-box;
        @include flex(center);
        flex-direction: column;

        .title {
            width: 100%;
            text-align: left;
            font-size: 14px;
            color: #fff;
            display: block;
            margin: 0 auto;
        }

        input {
            width: 100%;
            height: 49px;
            border-radius: 10px;
            border: solid 1px #0a0b0b;
            background-color: #333;
            color: #fff;
            margin-top: 8px;
            box-sizing: border-box;
            padding-left: 15px;
        }

        .inputAct {
            border-color: $btnBgColor;
        }

        .bankList {
            width: 100%;
            @include flex(space-between);
            border-radius: 12px;
            background-color: #1c1c1c;
            padding: 12px 7px 12px 12px;
            margin-bottom: 12px;
            box-sizing: border-box;
            border: solid 1px;

            .left {
                display: flex;
                align-items: center;

                img {
                    width: 63px;
                    height: 35px;
                    border-radius: 8px;
                }

                .cardName {
                    font-size: 12px;
                    color: #fff;
                    margin-left: 32px;
                }
            }
        }

        .bankListActive {
            border: solid 1px #ff7c43;
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
        width: 100%;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #8a929a;
        @include flex(space-between);
        margin: 10px auto 10px;

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
        margin: 30vh auto 0;
    }

    .confirmMt {
        margin-top: 10px;
    }
}
</style>