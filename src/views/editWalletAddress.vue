<template>
    <div class="addWalletAddress maxWidth lrPadding">
        <!-- <Select :selectedObj="walletTypeObj" @sendSelectVal="sendSelectVal" :disabled="true"/> -->
        <div class="sendBox">
            <div class="title">{{ $t("withdraw.add.with.currency.text") }}</div>
            <input type="text" class="hideInputBtn" v-model="walletType" :disabled="true">
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('addWalletAddress.walletId.text') }}</div>
            <input type="text" class="hideInputBtn" v-model="walletId"
                :placeholder="$t('addWalletAddress.walletId.plaaceholder.text')">
        </div>
        <Select :selectedObj="verifyObj" @sendSelectVal="sendSelectVal" />
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="text" class="hideInputBtn" @input="getVerifyCode" v-model="verifyCode"
                    :placeholder="$t('addWalletAddress.verify.code.text')">
                <div class="sendBtn" @click="sendVerify">
                    {{ sendBtn }} <span v-if="showSeconds">s</span>
                </div>
            </div>
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('user.security.center.bankcard.bankadd.input.pay.pass.text') }}</div>
            <input type="password" class="hideInputBtn" v-model="payPwd" :placeholder="$t('send.payment.placeholder.text')">
        </div>

        <div class="confirm cursor" @click="confirm">
            {{ $t('modal.confirm.text') }}
        </div>
        <update-tip :type="$t('withdraw.record.center.show.detail.usdt.bank.text')" v-if="showTip" @submit="submit" @close="showTip=false"></update-tip>
    </div>
</template>
<script setup >
import UpdateTip from '@/components/updateTip.vue'
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import Select from '@/components/select.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const state = reactive({
    walletType: '',
    walletId: '',
    id:'',
    isShowVerifyMet: false,
    verifyCode: '',
    payPwd: '',
    walletTypeObj: {
        title: t('addWalletAddress.type.text'),
        dataType: 'type',
        options: [
            {
                label: 'USDT',
                value: 0
            },
            {
                label: 'TRC20',
                value: 1
            }
        ],
        selectedVal: 'USDT',
        optIndex: 0,
    },
    verifyObj: {
        title: t('addWalletAddress.verify.methods.text'),
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
    showTip:false
})
initData()
function initData(){
    const res = JSON.parse(route.query.item)
    console.log(res)
    if(res){
        state.id = res.id
        state.walletId = res.addr
        state.walletType = res.protocol
        if(res.protocol =='TRC20'){
            state.walletTypeObj.optIndex = 1
            state.walletTypeObj.selectedVal = 'TRC20'
        }
    }
}
function sendSelectVal(data) {
    if (data.type === 'verify') {
        state.verifyObj.selectedVal = data.val.label
        state.verifyObj.optIndex = state.verifyObj.options.find(item => item.label == data.val.label)?.value
    }else if(data.type == 'type'){
        state.walletTypeObj.selectedVal = data.val.label
        state.walletTypeObj.optIndex = state.walletTypeObj.options.find(item => item.label == data.val.label)?.value
    }
}
function confirm(){
    if (state.walletId === '') {
        showToast(t('addWalletAddress.walletAddr.notEmpty.text'))
        return
    }
    if (state.walletId.length != 34 || !state.walletId.startsWith('T')) {
        showToast(t('ruls.trc.length'))
        return
    }
    if (state.code === '') {
        showToast(t('backapi.codeIsEmpty'))
        return
    }
    if (state.payPwd === '') {
        showToast(t('ruls.xxx.empty', { type: t('user.security.center.bankcard.bankadd.input.pay.pass.text') }))
        return
    }
    state.showTip = true
}
async function submit() {
    state.showTip = false
    let url = '/player/virtual_currency_edit'
    let data = {
        id: state.id,
        addr: state.walletId,
        payPwd: state.payPwd,
        code: state.verifyCode,
    }
    if (state.walletId === '') {
        showToast(t('addWalletAddress.walletAddr.notEmpty.text'))
        return
    }
    if (state.walletId.length != 34 || !state.walletId.startsWith('T')) {
        showToast(t('ruls.trc.length'))
        return
    }
    if (state.code === '') {
        showToast(t('backapi.codeIsEmpty'))
        return
    }
    if (state.payPwd === '') {
        showToast(t('ruls.xxx.empty', { type: t('user.security.center.bankcard.bankadd.input.pay.pass.text') }))
        return
    }
    try {
        const res = await http.post(url, data)
        if (res === null) {
            showToast(t('tips.success.text'))
            state.code = ''
            state.walletId = ''
            state.payPwd = ''
            state.id = ''
            setTimeout(() => {
                router.go(-1)
            }, 500);
        }
    } catch (error) {
        console.log(error);
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
    let url = urlObj[state.verifyObj.optIndex]
    try {
        const res = state.verifyObj.optIndex === 0 ? await http.post(url) : await http.get(url)
        // console.log(res);
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
    state.verifyCode = state.verifyCode.replace(/\D/g, '')
}
onMounted(() => {
    if (state.verifyObj.optIndex === 0) {
        state.verifyObj.selectedVal = t('addWalletAddress.verify.phone.text')
    } else {
        state.verifyObj.selectedVal = t('addWalletAddress.verify.email.text')
    }
})
const { walletId, verifyObj, walletType,walletTypeObj, verifyCode, payPwd, sendBtn, showSeconds,showTip } = toRefs(state)
</script>
<style scoped lang='scss'>
.addWalletAddress {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    .sendBox {
        width: 100%;
        box-sizing: border-box;
        @include flex(center);
        flex-direction: column;
        margin-top: 20px;

        .title {
            width: 100%;
            display: block;
            margin: 0 auto;
            font-family: $fontFamily;
            font-size: 14px;
            color: #9da4b4;
        }

        input {
            width: 100%;
            height: 49px;
            border-radius: 10px;
            border: none;
            background-color: #333;
            color: #fff;
            margin-top: 8px;
            box-sizing: border-box;
            padding-left: 15px;
        }

        .wtStyle {
            @extend input;
            @include flex(flex-start);
        }

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

        .hideBr {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        .verifyMethods {
            width: 100%;
            position: absolute;
            top: 73px;
            background-color: #333;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            height: 0;
            transition: height .5s ease-out;
            overflow: hidden;

            .itemOpt {
                height: 50px;
                line-height: 50px;
                padding-left: 15px;
                font-family: $fontFamily;
                font-size: 14px;
                color: #fff;

            }

            .ioAcitve {
                background-color: rgba(255, 124, 67, 0.18);
            }
        }

        .showVMOpt {
            height: 100px;
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
        margin: 10vh auto 0;
    }
}
</style>