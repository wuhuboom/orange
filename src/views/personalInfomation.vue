<template>
    <div class="personalInfomation hideScrollbar maxWidth lrPadding">
        <div class="sendBox">
            <input type="number" class="hideInputBtn" v-model="newPwd" :placeholder="$t('form.new.password.text')">
        </div>
        <div class="sendBox">
            <input type="number" class="hideInputBtn" v-model="twicePwd" :placeholder="$t('form.confirm.password.text')">
        </div>
        <Select :selectedObj="verifyObj" @sendSelectVal="sendSelectVal" />
        <div class="sendBox">
            <input type="text" class="hideInputBtn" v-model="verifyText" :placeholder="$t('form.email.text')" v-if="verifyObj.optIndex==1">
            <input type="text" class="hideInputBtn" v-model="verifyText" :placeholder="$t('form.phoneNum.text')" v-if="verifyObj.optIndex==0">
        </div>
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="text" class="hideInputBtn" v-model="code" @input="getVerifyCode"
                    :placeholder="$t('addWalletAddress.verify.code.text')">
                <div class="sendBtn" @click="sendVerify">
                    {{ sendBtn }} <span v-if="showSeconds">s</span>
                </div>
            </div>
        </div>
        <div class="confirm cursor" @click="submit">
            {{ $t('modal.confirm.text') }}
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
    verifyText:'',
    verifyCode: '',
    newPwd: '',
    twicePwd: '',
    code: '',
    account:{},
    verifyObj: {
        title: '',
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
        optIndex: 1,
    },
    sendBtn: t('forget.send'),
    showSeconds: false
})

onMounted(() => {
    getPlayInfo()
})
function sendSelectVal(data) {
    if (data.type === 'verify') {
        state.verifyObj.selectedVal = data.val.label
        state.verifyObj.optIndex = state.verifyObj.options.find(item => item.label == data.val.label)?.value
        if(!state.verifyObj.optIndex == 0){
            state.verifyText = state.account.phone
        }else{
            state.verifyText = state.account.email
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
    state.code = state.code.replace(/\D/g, '')
}

async function getPlayInfo(){
    let url = '/player/player_info'
    try {
        const res = http.get(url)
        if(res){
            state.account = res
        }
    } catch (error) {
        console.log(error)
    }
}
async function submit() {
    if (state.newPwd === '') {
        showToast(t('ruls.pass.empty'))
        return
    }
    if (state.newPwd != state.twicePwd) {
        showToast(t('backapi.twicePwdDiff'))
        return
    }
    if (state.twicePwd === '') {
        showToast(t('ruls.passtwo.empty'))
        return
    } 
    if (state.code === '') {
        showToast(t('addWalletAddress.verify.code.text'))
        return
    }
    let url = '/player/v2/change_pwd_online'
    let data = {
        newPwd: state.newPwd,
        twicePwd: state.twicePwd,
        code: state.code
    }
    try {
        const res = await http.post(url, data)
        if (res === null) {
            showToast(t('tips.success.text'))
            state.newPwd = ''
            state.twicePwd = ''
            state.code = ''
            setTimeout(() => {
                router.go(-1)
            }, 500);
        }
    } catch (error) {
        console.log(error);
    }
}
const { verifyCode, verifyText,newPwd, verifyObj, sendBtn, showSeconds, twicePwd, subBranch,  code } = toRefs(state)
</script>
<style scoped lang='scss'>
.personalInfomation {
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