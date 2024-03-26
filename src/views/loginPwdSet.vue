<template>
    <div class="personalInfomation hideScrollbar maxWidth lrPadding">
        <div class="pwdBox lrPadding">
            <div class="btnOpt cursor">
                <div :class="{ spanAct: btnIndex === 0 }" @click="changeBtn(0)">
                    <span>{{ $t("password.setting.login.pass.button.text") }}</span>
                </div>
                <div :class="{ spanAct: btnIndex === 1 }" @click="changeBtn(1)">
                    <span>{{ $t("index.login.forget.text") }}</span>
                </div>
            </div>
            <div class="pwdForm" v-if="btnIndex === 0">
                <div class="sendBox">
                    <input type="password" class="hideInputBtn" v-model="form1.origin" :placeholder="$t('ruls.xxx.please', { name: $t('password.setting.login.pass.button.text') })">
                </div>
                <div class="sendBox">
                    <input type="password" class="hideInputBtn" v-model="form1.newPwd" :placeholder="$t('ruls.xxx.please', { name: $t('form.new.password.text') })">
                </div>
                <div class="sendBox">
                    <input type="password" class="hideInputBtn" v-model="form1.twicePwd" :placeholder="$t('ruls.xxx.please', { name: $t('form.confirm.password.text') })">
                </div>
            </div>
            <div v-else>
                <Select :selectedObj="verifyObj" @sendSelectVal="sendSelectVal" />
                <div class="sendBox">
                    <input type="text" class="hideInputBtn" v-model="form2.phone" :placeholder="$t('form.phoneNum.text')" v-if="verifyObj.optIndex==0" :disabled="true">
                    <input type="text" class="hideInputBtn" v-model="form2.email" :placeholder="$t('form.email.text')" v-if="verifyObj.optIndex==1" :disabled="true">
                </div>
                <div class="sendBox">
                    <div class="verifyOpt cursor">
                        <input type="text" class="hideInputBtn" v-model="form2.code" @input="getVerifyCode"
                            :placeholder="$t('addWalletAddress.verify.code.text')">
                        <div class="sendBtn" @click="sendVerify">
                            {{ sendBtn }} <span v-if="showSeconds">s</span>
                        </div>
                    </div>
                </div>
                <div class="sendBox">
                    <input type="password" class="hideInputBtn" v-model="form2.newPwd" :placeholder="$t('ruls.xxx.please', { name: $t('form.new.password.text') })">
                </div>
                <div class="sendBox">
                    <input type="password" class="hideInputBtn" v-model="form2.twicePwd" :placeholder="$t('ruls.xxx.please', { name: $t('form.confirm.password.text') })">
                </div>
            </div>
             
        </div>
        <div class="confirm cursor" @click="submit">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted,computed } from 'vue'
import Select from '@/components/select.vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/index'
import {checkPwd} from '@/utils/utils'
const store = useStore()
const accountInfo = computed(() => store.accountInfo)
const { t } = useI18n()
const router = useRouter()
const state = reactive({
    verifyMetIndex: 1,
    verifyText:'',
    verifyCode: '',
    btnIndex:0,
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
        selectedVal: t('addWalletAddress.verify.email.text'),
        optIndex: 1,
    },
    sendBtn: t('forget.send'),
    showSeconds: false,
    form1:{
        origin:'',
        newPwd:'',
        twicePwd:''
    },
    form2:{
        newPwd:'',
        twicePwd:'',
        code:'',
        email:'',
        phone:''
    }
})
function changeBtn(index) {
  state.btnIndex = index
  if(state.btnIndex == 1){
      state.form2.email = accountInfo.value.email
      state.form2.phone = accountInfo.value.phone
  }
}
function sendSelectVal(data) {
    if (data.type === 'verify') {
        state.verifyObj.selectedVal = data.val.label
        state.verifyObj.optIndex = state.verifyObj.options.find(item => item.label == data.val.label)?.value
        if(!state.verifyObj.optIndex == 0){
            state.verifyText = accountInfo.value.phone
        }else{
            state.verifyText = accountInfo.value.email
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
async function submit() {
    let data = {}
    let url = ''
    if(state.btnIndex == 0){
        if (state.form1.origin === '') {
            showToast(t('ruls.login.pass.null.length'))
            return
        } 
        if (state.form1.newPwd === '') {
            showToast(t('ruls.pass.empty'))
            return
        }
        if(!checkPwd(state.form1.newPwd)){
            showToast(t('ruls.pass.length'))
            return 
        }
        if (state.form1.twicePwd === '') {
            showToast(t('ruls.passtwo.empty'))
            return
        } 
        if(!checkPwd(state.form1.twicePwd)){
            showToast(t('ruls.passtwo.length'))
            return 
        }
        if (state.form1.newPwd != state.form1.twicePwd) {
            showToast(t('ruls.passtwo.unequal'))
            return
        }
        url ='/player/auth/editPwd'
        data = {
            origin:state.form1.origin,
            newpwd:state.form1.newPwd,
            confirmed:state.form1.twicePwd
        }
    }else{
        if (state.form2.code === '') {
            showToast(t('addWalletAddress.verify.code.text'))
            return
        }
        if (state.form2.newPwd === '') {
            showToast(t('ruls.pass.empty'))
            return
        }
        if(!checkPwd(state.form2.newPwd)){
            showToast(t('ruls.pass.length'))
            return 
        }
        if (state.form2.twicePwd === '') {
            showToast(t('ruls.passtwo.empty'))
            return
        } 
        if(!checkPwd(state.form2.twicePwd)){
            showToast(t('ruls.passtwo.length'))
            return 
        }
        if (state.form2.newPwd != state.form2.twicePwd) {
            showToast(t('ruls.passtwo.unequal'))
            return
        }
        
        url ='/player/v2/change_pwd_online'
        data = Object.assign({ }, state.form2)
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
const { verifyCode, verifyText, verifyObj, sendBtn, showSeconds, subBranch,btnIndex,form1,form2 } = toRefs(state)
</script>
<style scoped lang='scss'>
.personalInfomation {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    .pwdBox {
        width: 100%;
        border-radius: 10px;
        /* 设置背景颜色为半透明白色 */
        backdrop-filter: blur(17px);
        /* 应用背景模糊效果 */
        // @include flex(center);
        box-sizing: border-box;
        padding-top: 20px;
        .btnOpt {
            width: 100%;
            height: 53px;
            border-radius: 26.5px;
            background-color: #1d1d25;
            padding: 4px;
            color: #fff;
            @include flex();
            box-sizing: border-box;
            margin-bottom: 13px;
            div{
                width: 50%;
                height: 100%;
                @include flex(center);
                text-transform: uppercase;
                span {
                    width: 100%;
                    display: block;
                    margin: 0 auto;
                    text-align: center;
                }
            }
            .spanAct {
                border-radius: 22.5px;
                background-image: linear-gradient(151deg, #353545 26%, rgba(43, 43, 63, 0.55) 80%);
            }
        }
    }
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