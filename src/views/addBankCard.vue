<template>
    <div class="addBankCard hideScrollbar maxWidth lrPadding">
        <div class="sendBox">
            <div class="title">{{ $t('user.security.center.bankcard.bankadd.input.address.text') }}</div>
            <div class="bankIDBox cursor" @click="showNewAddPanel">{{ bankId }}</div>
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('addBankCard.card.number.text') }}</div>
            <input type="number" class="hideInputBtn" v-model="cardNumber" :placeholder="$t('deal_enter_bank_card_number')">
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('addBankCard.cardNumberTwice.text') }}</div>
            <input type="number" class="hideInputBtn" v-model="cardNumberTwice"
                :placeholder="$t('addBankCard.cardNumberTwice.placeholder.text')">
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('user.security.center.bankcard.bankadd.input.branch.text') }}</div>
            <input type="text" v-model="subBranch" :placeholder="$t('addBankCard.bankcard.name.placeholder.text')">
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('addBankCard.Holder.name.text') }}</div>
            <input type="text" v-model="cardName" :placeholder="$t('addBankCard.Holder.name.placeholder.text')">
        </div>
        <Select :selectedObj="verifyObj" @sendSelectVal="sendSelectVal" />
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="number" class="hideInputBtn" v-model="code"
                    :placeholder="$t('addWalletAddress.verify.code.text')">
                <div class="sendBtn" @click="sendVerify">
                    {{ sendBtn }} <span v-if="showSeconds">s</span>
                </div>
            </div>
        </div>
        <!-- <div class="sendBox date">
            <div class="leftBox">
                <div class="title">{{ $t('addBankCard.month.text') }}</div>
                <div class="month">MM</div>
            </div>
            <div class="rightBox">
                <div class="title">{{ $t('addBankCard.year.text') }}</div>
                <div class="year">YY</div>
            </div>
        </div> -->
        <div class="sendBox">
            <div class="title">{{ $t('user.security.center.bankcard.bankadd.input.pay.pass.text') }}</div>
            <input type="password" class="hideInputBtn" v-model="payPwd" :placeholder="$t('send.payment.placeholder.text')">
        </div>
        <div class="confirm cursor" @click="submit">
            {{ $t('modal.confirm.text') }}
        </div>
        <div class="betPanel maxWidth" :class="{ showBetPanel: isShowNewAddBool }">
            <div class="panelBar"></div>
            <div class="panel_top relative">
                <div class="flex left_box">
                    {{ $t('addBankCard.bankPanel.title.text') }}
                </div>
                <van-icon name="cross" class="closeIcon" color="#fff" @click="closePanel" />
            </div>
            <div class="addlist">
                <div class="wItem cursor" v-for="(k, j) in state.bankObj?.banks" :class="{
                    wItActive: bankListIndex === j
                }" :key="j" @click.stop="selectNewAddress(k, j,)">
                    {{ k.bankCname }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted } from 'vue'
import Select from '@/components/select.vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const state = reactive({
    verifyMetIndex: 1,
    verifyCode: '',
    bankListIndex: 0,
    bankId: '',
    bankObj: {},
    cardNumber: '',
    cardNumberTwice: '',
    cardName: '',
    subBranch: '',
    payPwd: '',
    code: '',
    isShowNewAddBool: false,
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
        selectedVal: t('addWalletAddress.verify.phone.text'),
        optIndex: 0,
    },
    sendBtn: t('forget.send'),
    showSeconds: false
})
function sendSelectVal(data) {
    if (data.type === 'verify') {
        state.verifyObj.selectedVal = data.val.label
        state.verifyObj.optIndex = state.verifyObj.options.find(item => item.label == data.val.label)?.value
    }
}
getBankIdList()
async function getBankIdList() {
    let url = '/player/banks'
    try {
        const res = await http.get(url)
        console.log(res);
        state.bankId = res.banks[state.bankListIndex]?.bankCname
        state.bankObj = res
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
            state.showSeconds = false
            state.sendBtn = t('forget.send')
        }
    }, 1000)
}
function selectNewAddress(k, j) {
    state.bankListIndex = j
    state.bankId = k.bankCname
    state.isShowNewAddBool = false
    console.log(k, j);
}
function showNewAddPanel() {
    state.isShowNewAddBool = !state.isShowNewAddBool
}
async function submit() {
    if (state.cardNumber === '') {
        showToast(t('deal_enter_bank_card_number'))
        return
    }
    if (state.cardNumber != state.cardNumberTwice) {
        showToast(t('backapi.cardNumberTwiceDiff'))
        return
    }
    if (state.cardNumberTwice === '') {
        showToast(t('addBankCard.cardNumberTwice.placeholder.text'))
        return
    }
    if (state.subBranch === '') {
        showToast(t('addBankCard.bankcard.name.placeholder.text'))
        return
    }
    if (state.cardName === '') {
        showToast(t('addBankCard.Holder.name.placeholder.text'))
        return
    }
    if (state.code === '') {
        showToast(t('addBankCard.cardNumberTwice.placeholder.text'))
        return
    }
    if (state.payPwd === '') {
        showToast(t('send.payment.placeholder.text'))
        return
    }
    let url = '/player/bind_bank_card'
    let data = {
        bankId: state.bankObj.banks[state.bankListIndex]?.id,
        subBranch: state.subBranch,
        cardName: state.cardName,
        cardNumber: state.cardNumber,
        cardNumberTwice: state.cardNumberTwice,
        payPwd: state.payPwd,
        code: state.code
    }
    try {
        const res = await http.post(url, data)
        console.log(res);
        if (res === null) {
            showToast(t('tips.success.text'))
            state.subBranch = ''
            state.cardName = ''
            state.cardNumber = ''
            state.cardNumberTwice = ''
            state.payPwd = ''
            state.code = ''
            setTimeout(() => {
                router.go(-1)
            }, 500);
        }
    } catch (error) {
        console.log(error);
    }
}
const { verifyCode, cardNumber, verifyObj, sendBtn, showSeconds, cardNumberTwice, subBranch, bankId, bankObj, bankListIndex, cardName, code, isShowNewAddBool, payPwd } = toRefs(state)
</script>
<style scoped lang='scss'>
.addBankCard {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    overflow-x: hidden;

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
            font-family: SFProText;
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

        .bankIDBox {
            @extend input;
            @include flex(center);
            font-size: 14px;
            padding: 0;
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
                font-family: Helvetica;
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
                font-family: SFProText;
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

        .leftBox {
            width: 48%;

            .month {
                margin-top: 5px;
                height: 48px;
                border-radius: 15px;
                background-color: #333;
                text-align: center;
                line-height: 48px;
                color: #fff;
            }
        }

        .rightBox {
            width: 48%;

            .year {
                margin-top: 5px;
                height: 48px;
                border-radius: 15px;
                background-color: #333;
                text-align: center;
                line-height: 48px;
                color: #fff;
            }
        }
    }

    .date {
        flex-direction: row;
        justify-content: space-between;
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
        margin: 5vh auto 20px;
    }

    .betPanel {
        position: fixed;
        left: 50%;
        bottom: 50px;
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
                font-family: SegoeUI;
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
            height: calc(50vh - 70px);
            padding: 0 20px;
            overflow: auto;

            .wItem {
                height: 60px;
                text-align: center;
                @include flex(center);
                flex-wrap: wrap;
                // border-radius: 10px;
                border-bottom: 1px solid #313131;
                color: #fff;
                font-size: 14px;
            }

            .wItActive {
                background-color: #ed8251;
                color: #fff;
                border-bottom: 1px solid #ed8251;
            }
        }

    }

    .showBetPanel {
        height: 50vh;
    }
}
</style>