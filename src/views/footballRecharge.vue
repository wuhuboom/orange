<template>
    <div class="fRecharge  maxWidth lrPadding">
        <div>
            <div class="sendBox">
                <div class="title">{{ $t('recharge.type.text') }}</div>
                <div class="payMet">
                    <div class="payList" v-for="(item, index) in channelList" :key="index"
                        :class="{ plActive: channelIndex === index }" @click="changePayM(item, index)">
                        <img :src="item.img" alt="">
                        <p>{{ item.name }}</p>
                    </div>
                </div>
            </div>
            <div class="money sendBox">
                <div class="mtop">
                    <span class="tips">{{ $t('ruls.amount.length') }}</span>
                    <span class="rate">{{ $t('recharge.current.exchang.rate') }} ：{{ rechargeInfo?.rate || 0 }}</span>
                </div>
                <input type="number" v-model="amount" class="hideInputBtn" placeholder="0">
            </div>
        </div>
        <div class="confirm cursor" :class="{ confirmMt: channelList.length > 0 }" @click="toPage">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, } from 'vue'
import { useRouter, useRoute } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const state = reactive({
    amount: '',
    rechargeInfo: {},
    channelList: [],
    channelIndex: 0,
})
getMultiChannel()
// 充值多渠道列表
async function getMultiChannel() {
    let url = '/player/recharge_pre'
    try {
        const res = await http.get(url)
        state.channelList = res
        state.rechargeInfo = state.channelList[state.channelIndex]
        console.log(state.rechargeInfo);
    } catch (error) {
        console.log(error);
    }
}
function changePayM(item, index) {
    state.channelIndex = index
}
async function toPage() {
    let url = '/player/recharge'
    console.log(state.amount);
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
        if (res?.UrlAddress) {
            location.href = res?.UrlAddress
        }
    } catch (error) {

    }

}
const { amount, channelIndex, rechargeInfo, channelList } = toRefs(state)
</script>
<style scoped lang='scss'>
.fRecharge {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    padding-top: 20px;
    @include flex();
    flex-direction: column;
    align-items: normal;

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

        .payMet {
            width: 100%;
            @include flex(space-between);
            margin-top: 22px;

            .payList {
                width: 30%;
                height: 72px;
                border-radius: 12px;
                background-color: #1c1c1c;
                @include flex(center);
                flex-direction: column;
                border: 1px solid;

                img {
                    width: 35px;
                    margin-bottom: 10px;
                }

                p {
                    font-family: Roboto;
                    font-size: 12px;
                    color: #fff;
                }
            }

            .plActive {
                border: solid 1px #ff7c43;
                background-color: rgba(255, 124, 67, 0.15);
            }
        }

        .mtop {
            width: 100%;
            @include flex(space-between);

            .tips {
                font-family: Roboto;
                font-size: 14px;
                color: #fff;
            }

            .rate {
                font-family: Roboto;
                font-size: 14px;
                color: #8a929a;
            }
        }
    }

    .money {
        margin-top: 23px;
        border-radius: 10px;
        background-color: #1c1c1c;
        align-items: flex-start;
        padding: 15px 10px;

        input {
            width: 100%;
            height: 30px;
            margin-top: 23px;
            border: none;
            outline: none;
            background-color: #1c1c1c;
            color: #fff;
        }
    }


    .confirm {
        width: 100%;
        height: 48px;
        border-radius: 14px;
        background-color: #ff7c43;
        box-sizing: border-box;
        @include flex(center);
        font-size: 14px;
        color: #fff;
        margin: 0 auto 20px;
    }

    .confirmMt {
        margin-top: 10px;
    }
}
</style>