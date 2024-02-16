<template>
    <div class="send maxWidth lrPadding">
        <div class="sendBox">
            <div class="title">{{ $t('send.amount.placeholder.text') }}</div>
            <input type="number" v-model="amount" @input="getInputAmount" :placeholder="$t('send.amount.placeholder.text')">
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
        <div class="sendBox">
            <div class="title" style="margin-bottom: 15px;">{{ $t('withdraw.type.text') }}</div>
            <div class="bankList cursor" v-for="(item, index) in virtualCurrencyList" :key="index"
                :class="{ bankListActive: index === channelIndex }" @click="selectBank(index)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div class="cardName">{{ item.addr }}</div>
                </div>
                <img src="../assets/images/common/check.webp" class="checkIcon" alt="" v-if="index === channelIndex">
                <van-icon name="arrow" color="#fff" v-else />
            </div>
        </div>

        <div class="confirm" :class="{ confirmMt: virtualCurrencyList.length > 0 }" @click="toPage">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, } from 'vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const state = reactive({
    amount: '0',
    rechargeInfo: {},
    virtualCurrencyList: [],
    channelIndex: -1,
})
async function toPage() {
    let url = '/player/safe/recharge'
    if (state.channelIndex < 0) {
        showToast(t('recharge.confirm.notSelectPayMet.text'))
        return
    }
    let payId = state.virtualCurrencyList[state.channelIndex]?.id
    let data = {
        money: state.amount,
        payId
    }
    try {
        const res = await http.post(url, data)
        // console.log(res);
        if (res?.UrlAddress) {
            location.href = res?.UrlAddress
        }
    } catch (error) {

    }
}
function getInputAmount() {
    if (state.amount < 0) {
        state.amount = 0
    }

}
reachargePre()
async function reachargePre() {
    let url = '/player/safe/recharge_pre'
    try {
        const res = await http.get(url)
        if (res?.id) {
            state.rechargeInfo = res
        }
    } catch (error) {
        console.log(error);
    }
}
getVirtualList()
// 充值多渠道列表
async function getVirtualList() {
    let url = '/player/virtual_currency_list'
    try {
        const res = await http.post(url)
        console.log(res);
        state.virtualCurrencyList = res
    } catch (error) {
        console.log(error);
    }
}
function selectBank(index) {
    state.channelIndex = index
}
const { amount, channelIndex, rechargeInfo, virtualCurrencyList } = toRefs(state)
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

                width: 93%;
                display: flex;
                align-items: center;
                box-sizing: border-box;

                img {
                    width: 63px;
                    height: 35px;
                    border-radius: 8px;
                }

                .cardName {
                    width: 180px;
                    // display: flex;
                    // flex-wrap: wrap;
                    word-wrap: break-word;
                    font-size: 12px;
                    color: #fff;
                    margin-left: 32px;
                    line-height: 1.2;
                }
            }

            .checkIcon {
                width: 28px;
                height: 28px;
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
        margin: 30vh auto 0;
    }

    .confirmMt {
        margin-top: 10px;
    }
}
</style>