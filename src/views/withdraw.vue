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
            <div class="title sub">{{ $t('withdraw.type.text') }}</div>
            <template v-for="(item, index) in virtualCurrencyList" :key="index">
                <div class="bankList cursor relative"  :class="{ bankListActive: index === channelIndex }" @click="selectBank(item, index)">
                    <div class="left">
                        <img :src="item.img" alt="">
                        <div class="cardName">{{ item.name }}</div>
                    </div>
                    <img src="../assets/images/common/check.webp" class="checkIcon" alt="" v-if="index === channelIndex">
                </div>
            </template>
            
        </div>
        <div class="WAddress cursor relative" v-if="currentWAList[walletAddrIndex]?.addr">
            {{ currentWAList[walletAddrIndex].addr }}
            <!-- <van-icon :name="isShowWalletOpt ? 'arrow-up' : 'arrow-down'" size="18" /> -->
            <!-- <div class="currentWalletList" :class="{ showCurrentWallet: isShowWalletOpt }">
                <div class="wItem" v-for="(k, j) in currentWAList" :class="{ wItActive: walletAddrIndex === j }" :key="j"
                    @click.stop="selectWallet(k, j,)">
                    {{ k.addr }}
                </div>
            </div> -->
        </div>
        <div class="addWallet cursor" @click="addWalletPage">
            {{ getAddText() }}
            <div class="addIcon">
                <van-icon name="plus" />
            </div>
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('withdraw.password.text') }}</div>
            <input type="password" class="hideInputBtn" v-model="payPwd" :placeholder="$t('withdraw.placeholder.text')">
        </div>
        <div class="sendBox" v-if="verifyType == 3">
            <Select :selectedObj="verifyObj" @sendSelectVal="sendSelectVal" />
        </div>
       
        <!-- <div class="sendBox">
            <input type="text" class="hideInputBtn" v-model="form2.phone" :placeholder="$t('form.phoneNum.text')" v-if="verifyObj.optIndex==0" :disabled="true">
            <input type="text" class="hideInputBtn" v-model="form2.email" :placeholder="$t('form.email.text')" v-if="verifyObj.optIndex==1" :disabled="true">
        </div> -->
        <div class="sendBox" v-if="verifyType > 0">
            <div class="title sub" v-if="state.verifyObj.optIndex==0 ">{{ $t('forget.phoneVerifiCode') }}</div>
            <div class="title sub" v-else>{{ $t('forget.emailVerifiCode') }}</div>
            <div class="verifyOpt cursor">
                <input type="text" class="hideInputBtn" v-model="code" @input="getVerifyCode"
                    :placeholder="$t('addWalletAddress.verify.code.text')">
                <div class="sendBtn" @click="sendVerify">
                    {{ sendBtn }} <span v-if="showSeconds">s</span>
                </div>
            </div>
        </div>

        <div class="confirm cursor" :class="{ confirmMt: virtualCurrencyList.length > 0 }" @click="submitWithdrawPre">
            {{ $t('modal.confirm.text') }}
        </div>

        <div class="tip_mod_container">
            <div class="tip_mod">
                <div class="tip_title">{{ $t("recharge.tip.title.text") }}</div>
                <div class="tip_item">
                    1、{{ $t('withdraw.desc.list1') }} {{ rechargeInfo.everydayWithdrawFree }}
                </div>
                <div class="tip_item">
                    2、{{ $t('withdraw.desc.list2') }} {{ rechargeInfo.everydayWithdrawTimes }}
                </div>
                <div class="tip_item">
                    3、{{ $t('withdraw.desc.list3') }} {{ rechargeInfo.withdrawalRate }}%
                </div>
                <div class="tip_item">
                    4、{{ $t('withdraw.desc.list4') }} {{ rechargeInfo.withdrawMax }},{{ $t('withdraw.desc.list5') }} {{
                        rechargeInfo.withdrawMin }}
                </div>
                <div class="tip_item">
                    5、{{ $t('withdraw.desc.list6') }} {{ rechargeInfo.withdrawalToday }}
                </div>
                <div class="tip_item">
                    6、{{ $t('withdraw.desc.list7') }} {{ rechargeInfo.withdrawalRateMin }},{{ $t('withdraw.desc.list8') }}
                    {{rechargeInfo.withdrawalRateMax }}
                </div>
                <div class="tip_item">
                    7、{{ $t('withdraw.desc.list9') }} {{ rechargeInfo.usdtWithdrawPer }}
                </div>
            </div>
        </div>
        <div class="betPanel maxWidth" :class="{ showBetPanel: isShowWalletPanel }">
            <div class="panelBar"></div>
            <div class="panel_top relative">
                <div class="flex left_box">
                    {{ getPanelTitle() }}
                </div>
                <van-icon name="cross" class="closeIcon" color="#fff" @click="closePanel" />
            </div>
            <div class="addlist">
                <div class="wItem cursor" v-for="(k, j) in currentWAList" :class="{ wItActive: walletAddrIndex === j }"
                    :key="j" @click.stop="selectWallet(k, j,)">
                    {{ k.addr }}
                </div>
            </div>
        </div>

        <van-dialog v-model:show="tipDialog" width="310px" className="fundDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <img src="../assets/images/withdraw/sucIcon.webp" class="warningIcon" alt="">
                <p class="wtitle">{{$t('withdraw.success.title.text')}}</p>
                <p class="wcontent">{{$t('withdraw.success.content.text')}}</p>
                <div class="btn" @click="tipDialog = false">{{$t('invite.tip.btn.text')}}</div>
            </template>
        </van-dialog>
        <van-dialog v-model:show="vipClearDialog" width="310px" className="fundDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <p class="wcontent">{{$t('withdraw.clearvip.tip.text')}}</p>
                <div class="btn-box">
                    <div class="btn-cal" @click="vipClearDialog = false">{{$t('index.editor.psd.modal.cancel.btn')}}</div>
                    <div class="btn-sub" @click="submitWithdraw">{{$t('invite.tip.btn.text')}}</div>
                </div>
                
            </template>
        </van-dialog>
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
    isShowWalletOpt: false,
    isShowWalletPanel: false,
    tipDialog:false,
    vipClearDialog:false,
    verifyText:'',
    verifyCode: '',
    code:'',
    verifyObj: {
        title: t('index.editor.psd.text'),
        dataType: 'verify',
        options: [
            {
                label: t('addWalletAddress.verify.phone.text'),
                value: 0
            },
            {
                label: t('addWalletAddress.verify.email.text'),
                value: 1
            },
        ],
        selectedVal: t('addWalletAddress.verify.email.text'),
        optIndex: 1,
    },
    sendBtn: t('forget.send'),
    showSeconds: false,
    verifyType:'0'// 0不验证1手机2邮件3两者
})
function submitWithdrawPre(){
    console.log(state.currentWAList,'===============');
    if(state.currentWAList.length == 0){
        addWalletPage()
        return;
    }
    if (!state.amount) {
        showToast(t('deal.buyDetail.387081-13'))
        return
    }
    if (state.payPwd.length <= 0) {
        showToast(t('withdraw.placeholder.text'))
        return
    }
    if (state.channelIndex < 0) {
        showToast(t('withdraw.withdrawType.text'))
        return
    }
    var wiClear = state.virtualCurrencyList[state.channelIndex].wiClearVip
    if(wiClear==0){
        submitWithdraw()
    }else{
        state.vipClearDialog = true
    }
}
async function submitWithdraw() {
    state.vipClearDialog = false
    let url = '/player/withdrawal'
     if (!state.amount) {
        showToast(t('deal.buyDetail.387081-13'))
        return
    }
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
        payPwd: state.payPwd,
        code:state.code,
        deviceUa:navigator.userAgent
    }
    try {
        const res = await http.post(url, data)
        if (res === null) {
            state.payPwd = ''
            state.money = ''
            // showToast(t('withdraw.success.text'))
            state.tipDialog = true
            // setTimeout(() => {
            //     state.tipDialog = false
            //     state.payPwd = ''
            //     state.amount = ''
            // }, 5000)
        }else if(res.code == 103){
            showToast(res.data.withdrawalLimitMsg)
            return
        }
    } catch (error) {

    }
}
function getAddText() {
    let type = state.rechargeInfo.type || ''
    if (type==4) {
        return t('withdraw.add.eWallet.text')
    } else if (type==1) {
        return t('withdraw.add.bankCard.text')
    } else if (type==2) {
        return t('withdraw.add.usdt.text')
    }else{
         return t('withdraw.add.eWallet.text')
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
        state.rechargeInfo = state.virtualCurrencyList[state.channelIndex] || {}
        state.verifyType = state.rechargeInfo.codeMode || '0'
        if(state.verifyType==1){
            state.verifyObj.optIndex = 0
            state.verifyObj.selectedVal = state.verifyObj.options[0].label
        }else{
            state.verifyObj.optIndex = 1
            state.verifyObj.selectedVal = state.verifyObj.options[1].label
        }
        if (!localStorage.getItem('toaddFlag')) {
            localStorage.setItem('toaddFlag', 0)
        }
        let type = state.rechargeInfo.type || ''
        if (type == 4) {
            eWalletList()
        } else if (type === 1) {
            getBankList()
        } else if (type === 2) {
            getUsdtWalletList()
        }
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
        if (res.length > 0) {
            console.log(res);
            res.forEach(item => {
                item.addr = item.addr.slice(0, 4) + '****' + item.addr.slice(-4)
            })
        }
        state.usdtWallet = res || []
        state.currentWAList = state.usdtWallet
        if (state.currentWAList.length == 0 && localStorage.getItem('toaddFlag') == 0) {
            addWalletPage()
        }
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
            state.bankList = res
        } else if (typeof res === 'object' && res !== null) {
            state.bankList = []
            res.addr = maskString(res.cardNumber)
            state.bankList.push(res)
        }
        state.currentWAList = state.bankList
        if (state.currentWAList.length == 0 && localStorage.getItem('toaddFlag') == 0) {
            addWalletPage()
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
        if (Array.isArray(res) && res.length > 0) {
            res.forEach(item => {
                item.addr = item.address
            })
            state.eWallet = res
            state.currentWAList = state.eWallet
            if (state.currentWAList.length == 0 && localStorage.getItem('toaddFlag') == 0) {
                addWalletPage()
            }
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
    if (item.type == 4) {
        state.currentWAList = state.eWallet
    } else if (item.type === 1) {
        state.currentWAList = state.bankList
    } else if (item.type === 2) {
        state.currentWAList = state.usdtWallet
    }
     state.rechargeInfo = item
     state.channelIndex = index
    if(state.currentWAList.length == 0){
        addWalletPage()
    }else{
        state.isShowWalletPanel = true
       
        item.showCurrWallet = !item.showCurrWallet
    }
}
// 选择钱包地址
function selectWallet(k, j,) {
    state.walletAddrIndex = j
    // state.isShowWalletOpt = false
    console.log(k);
    state.isShowWalletPanel = false
}
function addWalletPage() {
    localStorage.setItem('toaddFlag', 1)
    let type = state.rechargeInfo.type || ''
    if (type == 4) {
        router.push({
            path: '/addWallet'
        })
    } else if (type == 1) {
        router.push({
            path: '/addBankCard',
        })
    } else if (type == 2) {
        router.push({
            path: '/addWalletAddress',
            query: {
                addType: state.virtualCurrencyList[state.channelIndex].name
            }
        })
    }
    return
}
function getPanelTitle() {
    let type = state.rechargeInfo.type || ''
    if (type == 4) {
        return t('withdraw.add.eWallet.text')
    } else if (type == 1) {
        return t('withdraw.add.bankCard.text')
    } else if (type == 2) {
        return t('withdraw.usdt.panel.title.text')
    }
}
function closePanel() {
    state.isShowWalletPanel = false
}
function sendSelectVal(data) {
    if (data.type === 'verify') {
        state.verifyObj.selectedVal = data.val.label
        state.verifyObj.optIndex = state.verifyObj.options.find(item => item.label == data.val.label)?.value
        if(!state.verifyObj.optIndex == 0){
            // state.verifyText = accountInfo.value.phone
        }else{
            // state.verifyText = accountInfo.value.email
        }
    }
}
async function sendVerify() {
    if (state.showSeconds) {
        showToast(t('addWalletAddress.countDown.tips.text'))
        return
    }
    if (state.walletId === '') {
        showToast(t('addWalletAddress.walletAddr.notEmpty.text'))
        return
    }
    let urlObj = {
        0: '/player/v2/phone_code/online',
        1: '/player/mail/code'
    }
    let url = ''
    let res = {}
    if(state.verifyType==1){
        url = '/player/v2/phone_code/online'
        res = await http.post(url)
    }else if(state.verifyType == 2){
        url = '/player/mail/code'
        res = await http.get(url)
    }else{
        url = urlObj[state.verifyObj.optIndex]
        res = state.verifyObj.optIndex === 0 ? await http.post(url) : await http.get(url)
    }
    try {
        
        if (res.hasOwnProperty('hasSend')) {
            if (!state.showSeconds) {
                state.sendBtn = 60
                startCountdown()
            }
            showToast(t('form.verift.send.text'))
            return
        }
    } catch (error) {
        console.log(error);
    }
}
function startCountdown() {
    state.showSeconds = true
    let timer = setInterval(function () {
        state.sendBtn--
        if (state.sendBtn <= 0) {
            clearInterval(timer)
            state.showSeconds = false
            state.sendBtn = t('forget.send')
        }
    }, 1000)
} 
function getVerifyCode() {
    state.code = state.code.replace(/\D/g, '')
}
const { amount, channelIndex, rechargeInfo, virtualCurrencyList, payPwd, currentWAList, walletAddrIndex, isShowWalletOpt, isShowWalletPanel,bankList,tipDialog,vipClearDialog,verifyText, verifyObj, sendBtn, showSeconds,code,verifyType } = toRefs(state)
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
        .verifyOpt {
                width: 100%;
                background-color: #333;
                border-radius: 10px;
                @include flex();
                box-sizing: border-box;
                margin-top: 10px;
                padding-right: 16px;

                input {
                    width: 90%;
                    margin: 0;
                    border: none;
                }

                .vmType {
                    @extend input;
                    @include flex(flex-start);
                }

                .arrowBox {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color: #d9dbe8;
                    @include flex(center);
                }

                .sendBtn {
                    width: 70px;
                    height: 32px;
                    border-radius: 8px;
                    background-color: #ff7c43;
                    @include flex(center);
                    font-family: $fontFamily;
                    font-size: 13px;
                    color: #fff;

                }
            }

        .title {
            width: 100%;
            text-align: left;
            font-size: 14px;
            color: #fff;
            display: block;
            margin: 0 auto;
            font-family: $fontFamily;
        }
        .sub{
            margin-top: 20px;
            margin-bottom: 10px;
        }

        input {
            width: 100%;
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
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                }

                .cardName {
                    width: 180px;
                    // display: flex;
                    // flex-wrap: wrap;
                    word-wrap: break-word;
                    font-size: 14px;
                    color: #fff;
                    margin-left: 15px;
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
                font-family: $fontFamily;
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

    .WAddress {
        height: 50px;
        color: #fff;
        line-height: 50px;
        background-color: #1c1c1c;
        margin-bottom: 12px;
        text-align: center;
        font-size: 14px;

        .currentWalletList {
            width: 100%;
            max-height: 0;
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background-color: #1c1c1c;
            z-index: 10;
            font-family: $fontFamily;
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
        text-align: left;
        color: #8a929a;
        @include flex(space-between);
        margin-top: 10px;
        .money {
            color: #fff;
        }

        .all {
            color: #ff7c43;
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
        margin: 5vh auto 0;
    }

    .confirmMt {
        margin-top: 20px;
    }

    .tip_mod_container {
        display: none;
        margin-top: 20px;
        color: #c4c4c4;
        font-size: 12px;

        .tip_mod {
            // @include bg-24232A;
            margin-bottom: 48px;

            .tip_title {
                margin-bottom: 24px;
                // @include font-se-28;
                // @include color-B5DB1C;
            }

            .tip_item {
                margin-bottom: 16px;
                // @include font-se-24;
                // @include color-C4C4C4;
            }
        }
    }

    .betPanel {
        position: fixed;
        left: 50%;
        bottom: 0;
        height: 0;
        background-color: #1c1b20;
        box-sizing: border-box;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        transition: height .5s ease-out;
        transform: translateX(-50%);

        .panelBar {
            width: 35px;
            height: 5px;
            margin: 8px auto 10px;
            border-radius: 3px;
            background-color: #3b3a42;
        }

        .panel_top {
            padding: 0 16px;
            @include flex(center);
            border-bottom: 1px solid #313038;
            padding-bottom: 15px;

            .left_box {
                align-items: center;
                font-family: $fontFamily;
                font-size: 17px;
                font-weight: 600;
                letter-spacing: -0.17px;
                color: #fff;

            }

            .closeIcon {
                position: absolute;
                right: 15px;
            }
        }

        .addlist {
            padding: 0 20px;

            .wItem {
                height: 60px;
                text-align: center;
                line-height: 60px;
                border-radius: 10px;
                border-bottom: 1px solid #313131;
            }

            .wItActive {
                background-color: #ed8251;
                color: #fff;
                border-bottom: 1px solid #ed8251;
            }
        }

    }

    .showBetPanel {
        height: 250px;
    }
    :deep(.fundDialog) {
        border-radius: 16px;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 0 30px;
        .warningIcon {
            width: 54px;
            height: 54px;
            margin: 10px auto 0;
        }
        .wtitle {
            text-align: center;
            color: #fff;
            margin-top: 18px;
            font-family: $fontFamily;
            font-size: 13px;
            font-weight: bold;
            color: #fff;
        }
        .wcontent {
            font-family: Roboto;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.3px;
            text-align: left;
            color: #d9dbe9;
            padding: 15px 10px 20px 10px;
        }
        .btn{
            margin: 0 8px 0 0;
            padding: 13.3px 104px 16px 105px;
            border-radius: 14px;
            background-color: #ff6c00;
            text-transform: uppercase;
            color: #fff;
            margin-bottom: 20px;
        }
        .btn-box{
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            margin-bottom: 20px;
            .btn-cal{
                width:30%;
                height: 35px;
                line-height: 35px;
                border-radius: 14px;
                background-color: transparent;
                text-transform: uppercase;
                color: #fff;
                border: 1px solid #fff;
                text-align: center;
            }
            .btn-sub{
                width:30%;
                height: 35px;
                line-height: 35px;
                border-radius: 14px;
                background-color: #ff6c00;
                text-transform: uppercase;
                color: #fff;
                text-align: center;
            }
        }
    }
}
</style>