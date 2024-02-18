<template>
    <div class="withdraw maxWidth lrPadding hideScrollbar">
        <div class="sendBox">
            <div class="title">{{ $t('send.amount.placeholder.text') }}</div>
            <input type="number" class="hideInputBtn" v-model="amount" @input="getInputAmount"
                :placeholder="$t('send.amount.placeholder.text')">
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
            <div class="bankList cursor relative" v-for="(item, index) in virtualCurrencyList" :key="index"
                :class="{ bankListActive: index === channelIndex }" @click="selectBank(item, index)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div class="cardName">{{ item.name }}</div>
                </div>
                <img src="../assets/images/common/check.webp" class="checkIcon" alt="" v-if="index === channelIndex">
                <div class="currentWalletList"
                    :class="{ showCurrentWallet: item.showCurrWallet && index === channelIndex }">
                    <div class="wItem" v-for="(k, j) in currentWAList" :class="{ wItActive: walletAddrIndex === j }"
                        :key="j" @click.stop="selectWallet(k, j, item)">
                        {{ k.addr }}
                    </div>
                </div>
            </div>
        </div>
        <div class="addWallet cursor" @click="addWalletPage">
            {{ $t('withdraw.add.newWallet.text') }}
            <div class="addIcon">
                <van-icon name="plus" />
            </div>
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('withdraw.password.text') }}</div>
            <input type="password" class="hideInputBtn" v-model="payPwd" :placeholder="$t('withdraw.placeholder.text')">
        </div>

        <div class="confirm cursor" :class="{ confirmMt: virtualCurrencyList.length > 0 }" @click="submitWithdraw">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, watchEffect } from 'vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const state = reactive({
    amount: '',
    rechargeInfo: {},
    virtualCurrencyList: [],
    channelIndex: 0,
    payPwd: '',
    usdtWallet: [],//usdt地址列表
    eWallet: [],//E-Wallet地址列表
    bankList: [],//bank地址列表
    currentWAList: [],
    walletAddrIndex: 0,
})
async function submitWithdraw() {
    let url = '/player/withdrawal'
    if (state.payPwd.length <= 0) {
        showToast(t('withdraw.placeholder.text'))
        return
    }
    if (state.channelIndex < 0) {
        showToast(t('withdraw.withdrawType.text'))
        return
    }
    let data = {
        type: state.virtualCurrencyList[state.channelIndex].type,
        usdtId: state.currentWAList[state.walletAddrIndex].id,
        money: state.amount,
        payPwd: state.payPwd
    }
    try {
        const res = await http.post(url, data)
        if (res === null) {
            state.payPwd = ''
            state.money = ''
            showToast(t('withdraw.success.text'))
        }
    } catch (error) {

    }
}
// 提现准备
reachargePre()
async function reachargePre() {
    let url = '/player/withdrawal_pre'
    try {
        const res = await http.get(url)
        if (res?.length > 0) {
            res.forEach(item => {
                item.showCurrWallet = false
            });
        }
        state.virtualCurrencyList = res
        state.rechargeInfo = state.virtualCurrencyList[state.channelIndex]
    } catch (error) {
        console.log(error);
    }
}
// 获取usdt提现的钱包地址
getUsdtWalletList()
async function getUsdtWalletList() {
    let url = '/player/virtual_currency_list'
    try {
        const res = await http.post(url)
        // console.log(res);
        state.usdtWallet = res || []
    } catch (error) {
        console.log(error);
    }
}
// 获取银行卡提现的地址
getBankList()
async function getBankList() {
    let url = '/player/bank_card_info'
    try {
        const res = await http.get(url)
        if (Array.isArray(res)) {
            res.forEach(item => {
                item.addr = maskString(item.cardNumber)
            })
        } else if (typeof res === 'object' && res !== null) {
            res.addr = maskString(res.cardNumber)
            state.bankList.push(res)
        }
    } catch (error) {
        console.log(error);
    }
}
// E-wallet 钱包
eWalletList()
async function eWalletList() {
    let url = '/player/wallet_info'
    try {
        const res = await http.get(url)
        console.log('====', res);
        if (Array.isArray(res) && res.length > 0) {
            res.forEach(item => {
                item.addr = item.address
            })
            state.eWallet = res
        }
    } catch (error) {
        console.log(error);
    }
}
function maskString(str) {
    if (str.length <= 4) {
        return str;
    }
    const maskedPart = '*'.repeat(str.length - 4);
    const visiblePart = str.slice(-4);
    return maskedPart + visiblePart;
}

function selectBank(item, index) {
    state.virtualCurrencyList.forEach(item => {
        item.showCurrWallet = false
    })
    if (item.name == 'E-Wallet') {
        state.currentWAList = state.eWallet
    } else if (item.name === 'Bank') {
        state.currentWAList = state.bankList
    } else if (item.name === 'USDT') {
        state.currentWAList = state.usdtWallet
    }
    state.rechargeInfo = item
    state.channelIndex = index
    item.showCurrWallet = !item.showCurrWallet
}
// 选择钱包地址
function selectWallet(k, j, item) {
    state.walletAddrIndex = j
    item.showCurrWallet = false
}
function addWalletPage() {
    router.push({
        path: '/addWalletAddress',
        query: {
            addType: state.virtualCurrencyList[state.channelIndex].type
        }
    })
}
watchEffect(() => {
    // conole.log('');
})
const { amount, channelIndex, rechargeInfo, virtualCurrencyList, payPwd, currentWAList, walletAddrIndex } = toRefs(state)
</script>
<style scoped lang='scss'>
.withdraw {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    padding-top: 20px;
    padding-bottom: 20px;

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

            .currentWalletList {
                width: 100%;
                max-height: 0;
                position: absolute;
                top: 60px;
                left: 0;
                right: 0;
                background-color: #1c1c1c;
                z-index: 10;
                font-family: Roboto;
                font-size: 12px;
                color: #fff;
                overflow: hidden;
                transition: max-height .5s ease-out;
                border-radius: 12px;

                .wItem {
                    height: 60px;
                    text-align: center;
                    line-height: 60px;
                }

                .wItActive {
                    background-color: #4e3700;
                }
            }

            .showCurrentWallet {
                max-height: 100px;
            }
        }

        .bankListActive {
            border: solid 1px #ff7c43;
            background-color: #261d08;
        }
    }

    .addWallet {
        height: 58px;
        border-radius: 12px;
        background-color: #1c1c1c;
        @include flex(center);
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #fff;
        margin-bottom: 24px;

        .addIcon {
            width: 20px;
            height: 20px;
            margin: 0 0 0 13px;
            border: solid 1px #fff;
            color: #fff;
            border-radius: 4px;
            @include flex(center);
            font-size: 14px;

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

    .confirmMt {
        margin-top: 20px;
    }
}
</style>