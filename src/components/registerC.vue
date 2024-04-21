<template>
    <div class="register maxWidth" @click="showAreaCodeOpt = false">
        <div class="registerMain">
            <div class="registerForm">
                <div v-for="(item, index) in userInfo" :key="index">
                    <div class="formItem" :class="{ errorStyle: item.error, focusBorderColor: inputIndex === index }">
                        <div class="login_left">
                            <img :src="getImg(item.iconFile, item.imgIcon)" alt=""
                                v-if="item.imgIcon && item.name != 'verificationCode'">
                            <div class="langBox" v-if="item.name === 'phoneNumber'">
                                <div class="langSelect" @click.stop="showSelect">
                                    <div class="l_left">
                                        <span class="l_name">{{ areaCode }}</span>
                                    </div>
                                    <van-icon :name="showAreaCodeOpt ? 'arrow-up' : 'arrow-down'" />
                                </div>
                                <div class="options" :class="{ showOpt: showAreaCodeOpt }">
                                    <div class="o_item" :class="{ lfc: item.num === areaCode }"
                                        v-for="(item, index) in codeList" :key="index">
                                        <span class="l_name" @click="selectAreaNum(item)">{{ item.num }}</span>
                                    </div>
                                </div>
                            </div>
                            <input :type="item.type" :placeholder="item.placeholder" v-model="item.val"
                                :class="{ inputMl: item.name === 'phoneNumber', verificationMl: item.name === 'verificationCode' }"
                                @focus="borderActive(index)" @blur="resetActive(item)" @input="resetActive(item)" />
                            <img :src="verificationObj?.img" alt=""
                                v-if="item.name === 'verificationCode'"
                                style="margin-left: 60px; width: 80px;cursor: pointer;" @click="getVerifyCode">
                            <div class="sendBtn" @click="sendVerify" v-if="item.name === 'emailCode'">
                                {{ sendBtn }} <span v-if="showSeconds">s</span>
                            </div>
                        </div>
                        <img :src="getImg('login', isReadPwd ? 'open' : 'close')" class="eye" alt=""
                            v-if="item.name == 'password'" @click="readPwd(item)" style="cursor: pointer;">
                    </div>
                    <p :class="{ errorPStyle: item.error }" style="padding-left: 8px;margin-bottom: 9px;" v-if="item.error">
                        {{item.errorText }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, onMounted, watchEffect,computed } from 'vue'
import { getImg,checkName } from '@/utils/utils'
import { useRouter } from 'vue-router';
import http from "@/utils/axios";
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const props = defineProps(['isRegBtn', 'btnIndex'])
const emit = defineEmits('changeRegStatus', 'changeBtnIndex')
const state = reactive({
    // userInfo: [
    //     {
    //         name: 'account',
    //         imgIcon: 'acc',
    //         type: 'text',
    //         val: '',
    //         iconFile: 'login',
    //         error: false,
    //         errorText: t('login.uErrorText'),
    //         placeholder: t('login.username')
    //     },
    //     {
    //         name: 'password',
    //         imgIcon: 'pwd',
    //         type: 'password',
    //         val: '',
    //         iconFile: 'login',
    //         error: false,
    //         errorText: t('login.pErrorText'),
    //         placeholder: t('login.password')
    //     },
    //     {
    //         name: 'ConfirmPassword',
    //         imgIcon: 'pwd',
    //         type: 'password',
    //         val: '',
    //         iconFile: 'login',
    //         error: false,
    //         errorText: t('register.confirmErrorText'),
    //         placeholder: t('register.confirmPwd')
    //     },
    //     {
    //         name: 'invitationCode',
    //         imgIcon: 'rCode',
    //         type: 'text',
    //         val: '',
    //         error: false,
    //         iconFile: 'register',
    //         errorText: t('register.referralErrorText'),
    //         placeholder: t('register.referralCode')
    //     },
    //     {
    //         name: 'emailAddress',
    //         imgIcon: 'email',
    //         type: 'text',
    //         val: '',
    //         iconFile: 'login',
    //         error: false,
    //         errorText: t('register.emailErrorText'),
    //         placeholder: t('register.email')
    //     },
    //     {
    //         name: 'phoneNumber',
    //         imgIcon: '',
    //         type: 'text',
    //         val: '',
    //         iconFile: '',
    //         error: false,
    //         errorText: t('register.phoneErrorText'),
    //         placeholder: t('register.phone')
    //     },
    //     {
    //         name: 'verificationCode',
    //         imgIcon: 'code',
    //         type: 'text',
    //         val: '',
    //         iconFile: 'register',
    //         error: false,
    //         errorText: t('login.vErrorText'),
    //         placeholder: t('login.verificationCode')
    //     },
    // ],
    isReadPwd: false,
    showAreaCodeOpt: false,
    areaCode: '',
    codeList: [],
    checked: false,
    showCheckedBordr: false,
    showCheckedAnimate: false,
    verificationObj: {},
    inputIndex: -1,
    lUser:[],
    isEmailCode:0,
    sendBtn: t('forget.send'),
    showSeconds: false
})

const userInfo = computed(() => {
    state.lUser = [
        {
            name: 'account',
            imgIcon: 'acc',
            type: 'text',
            val: '',
            iconFile: 'login',
            error: false,
            errorText: t('login.uErrorText'),
            placeholder: t('login.username')
        },
        {
            name: 'password',
            imgIcon: 'pwd',
            type: 'password',
            val: '',
            iconFile: 'login',
            error: false,
            errorText: t('login.pErrorText'),
            placeholder: t('login.password')
        },
        {
            name: 'ConfirmPassword',
            imgIcon: 'pwd',
            type: 'password',
            val: '',
            iconFile: 'login',
            error: false,
            errorText: t('register.confirmErrorText'),
            placeholder: t('register.confirmPwd')
        },
        {
            name: 'invitationCode',
            imgIcon: 'rCode',
            type: 'text',
            val: '',
            error: false,
            iconFile: 'register',
            errorText: t('register.referralErrorText'),
            placeholder: t('register.referralCode')
        },
        {
            name: 'emailAddress',
            imgIcon: 'email',
            type: 'text',
            val: '',
            iconFile: 'login',
            error: false,
            errorText: t('register.emailErrorText'),
            placeholder: t('register.email')
        },
        {
            name: 'phoneNumber',
            imgIcon: '',
            type: 'text',
            val: '',
            iconFile: '',
            error: false,
            errorText: t('register.phoneErrorText'),
            placeholder: t('register.phone')
        },
        {
            name: 'verificationCode',
            imgIcon: 'code',
            type: 'text',
            val: '',
            iconFile: 'register',
            error: false,
            errorText: t('login.vErrorText'),
            placeholder: t('login.verificationCode')
        },
    ]
    return state.lUser
})
function showSelect() {
    state.showAreaCodeOpt = !state.showAreaCodeOpt
}
function readPwd(item) {
    state.isReadPwd = !state.isReadPwd
    item.type = state.isReadPwd ? 'text' : 'password'
}
function selectAreaNum(item) {
    state.areaCode = item.num
}
function borderActive(index) {
    state.inputIndex = index
}
function resetActive(item) {
    state.inputIndex = -1
    if (item.vale != '') {
        item.error = false
    }
}
async function registerAcc() {
    if (props.isRegBtn) {
        for (let i in userInfo.value) {
            userInfo.value[i].error = userInfo.value[i].val == '' ? true : false
            if (userInfo.value[i].error) {
                emit('changeRegStatus', false)
                return
            }
        }
    }
    userInfo.value[0].val = userInfo.value[0].val.trim()
    if(!checkName(userInfo.value[0].val)){
        showToast(t('login.nameErrorText'))
        emit('changeRegStatus', false)
        return
    }
    let url = '/player/auth/regist'
    let data = {
        username: userInfo.value[0].val,
        password: userInfo.value[1].val,
        twoPassword: userInfo.value[2].val,
        invitationCode: userInfo.value[3].val,
        verifyKey: state.verificationObj?.verifyKey,
        email: userInfo.value[4].val,
        emailCode: state.isEmailCode == 1 ? userInfo.value[5].val : '', 
        code: state.isEmailCode == 1 ? userInfo.value[7].val : userInfo.value[6].val,
        phone: state.isEmailCode == 1 ? `${state.areaCode}${userInfo.value[6].val}` : `${state.areaCode}${userInfo.value[5].val}`,
        areaCode: state.areaCode,
    }
    try {
        const res = await http.post(url, data)
        emit('changeRegStatus', false)
        if (!res) {
            getVerifyCode()
        }
        if (res?.token) {
            let reStoreage = {
                isremember: false,
                user: userInfo.value
            }
            if (localStorage.getItem('remember')) {
                let storage = JSON.parse(localStorage.getItem('remember'))
                reStoreage.isremember = storage.isremember
            }
            localStorage.setItem('remember', JSON.stringify(reStoreage))
            showToast(t('tips.success.text'))

            emit('changeBtnIndex', 0)
            // setTimeout(() => {
            // }, 500);
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
    
    let username = state.lUser[0].val
    let email = state.lUser[4].val
    if (username === '') {
        showToast(t('login.uErrorText'))
        return
    } 
    if (email === '') {
        showToast(t('register.emailErrorText'))
        return
    } 
    let url = '/player/mail/code/reg?username='+username+'&email='+email
    try {
        const res = await http.get(url)
        if (res && res.hasOwnProperty('hasSend')) {
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
async function getVerifyCode() {
    if(state.isEmailCode == 1 ){
        userInfo.value[7].val = ''
    }else{
        userInfo.value[6].val = ''
    }
    
    let url = '/player/auth/verify_code'
    try {
        const res = await http.get(url)
        state.verificationObj = res
    } catch (error) {
        console.log(error);
    }
}
async function getConfig(){
    let url = '/player/auth/sys_config'
    try {
        const res = await http.get(url)
        let codeList =  res.area_code || []
        state.codeList = codeList.map(item=>{
            return {
                num: item
            }
        })
        if(codeList.length > 0){
            state.areaCode = codeList[0]
        }
         state.isEmailCode = res.mailCodeRequired || 0
        if(state.isEmailCode ==1){
          let emaiCode = {
              name: 'emailCode',
              imgIcon: 'email',
              type: 'text',
              val: '',
              iconFile: 'login',
              error: false,
              errorText: t('addWalletAddress.verify.code.text'),
              placeholder: t('forget.emailVerifiCode')
            }
          state.lUser.splice(5,0,emaiCode)
        }
    } catch (error) {
        console.log(error);
    }
}
// getVerifyCode()

watchEffect(() => {
    console.log(props.isRegBtn);
    if (props.isRegBtn) {
        registerAcc()
    }
    if (props.btnIndex === 1) {
        // getVerifyCode()
        // console.log(props.btnIndex,'-------------------');
    }
})
onMounted(() => {
     getConfig()
     getVerifyCode()
})
const { isReadPwd, areaCode, showAreaCodeOpt, codeList, checked, verificationObj, showCheckedBordr, showCheckedAnimate, inputIndex,isEmailCode,sendBtn,showSeconds } = toRefs(state)
</script>
<style lang="scss" scoped>
@keyframes shake {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    50% {
        transform: translateX(0);
    }

    75% {
        transform: translateX(5px);
    }

    100% {
        transform: translateX(0);
    }
}

.register {

    .registerMain {
        @include flex();

        flex-direction: column;

        .backBox {
            width: $width;

            @include flex(flex-start);

            img {
                width: 28px;
                height: 28px;
            }
        }

        .registerForm {
            box-sizing: border-box;

            .formItem {
                width: $width;
                height: 45px;
                border-radius: 22px;
                border: solid 1px #11101c;
                background-color: #11101c;
                @include flex();
                padding-left: 9px;
                margin-bottom: 9px;
                box-sizing: border-box;
                padding-right: 14px;
                position: relative;

                .login_left {
                    height: 100%;
                    @include flex(flex-start);
                    flex: 1;

                    img {
                        width: 28px;
                        height: 28px;
                    }

                    input {
                        // width: 100%;
                        // height: calc(100% - px);
                        flex: 1;
                        background-color: #11101c;
                        border: none;
                        font-family: $fontFamily;
                        font-size: 14px;
                        color: #fff;
                        margin-left: 12px;
                    }

                    .inputMl {
                        margin-left: 50px;
                    }

                    .verificationMl {
                        margin-left: 0;
                    }

                    .langBox {
                        width: 43px;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 10;

                        .langSelect {
                            @include flex(flex-start);
                            color: #fff;
                            width: 100%;
                            border-radius: 3.5px;
                            cursor: pointer;
                            margin-left: 12px;

                            .l_left {
                                @include flex(flex-start);
                                margin-right: 4px;
                            }
                        }

                        .langImg {
                            width: 19px;
                            height: 19px;
                        }

                        .l_name {
                            font-family: $fontFamily;
                            font-size: 14px;
                            color: #fff;
                            font-weight: normal;
                        }

                        .options {
                            width: 74px;
                            overflow: auto;
                            position: absolute;
                            top: 30px;
                            left: -0;
                            color: #000;
                            border-radius: 4px;
                            background-color: #2c2c2c;
                            overflow: hidden;
                            transition: height .5s ease-out;
                            height: 0;
                            cursor: pointer;
                            box-sizing: border-box;
                            padding: 0 9px;
                            z-index: 999;

                            .o_item {
                                width: 100%;
                                height: 28px;
                                font-family: $fontFamily;
                                font-size: 15px;
                                color: #fff;
                                @include flex(flex-start);
                                margin-top: 9px;

                                span {
                                    display: block;
                                    width: 100%;
                                    text-align: center;
                                    border-bottom: 1px solid #707070;
                                    padding-bottom: 4px;
                                }
                            }

                            .lfc {
                                .l_name {
                                    color: #ff7c43;
                                }
                            }
                        }

                        .showOpt {
                            transition: height .5s ease-out;
                            height: 135px;
                            overflow: auto;
                        }

                        .showOpt::-webkit-scrollbar {
                            width: 0px;
                            /* 设置滚动条宽度 */
                        }

                        .showOpt::-webkit-scrollbar-track {
                            background-color: rgb(0, 0, 0);
                            /* 设置滚动条轨道背景色 */
                        }

                        .showOpt::-webkit-scrollbar-thumb {
                            background-color: rgb(0, 0, 0);
                            /* 设置滚动条滑块颜色 */
                        }

                        .showOpt::-webkit-scrollbar-thumb:hover {
                            background-color: rgb(0, 0, 0);
                            /* 设置滚动条滑块在鼠标悬停时的颜色 */
                        }
                    }
                    .sendBtn {
                        width: 70px;
                        height: 26px;
                        border-radius: 8px;
                        background-color: #ff7c43;
                        @include flex(center);
                        font-family: $fontFamily;
                        font-size: 13px;
                        color: #fff;
                        margin-left: 30px;
                    }
                }

                .eye {
                    width: 28px;
                    height: 28px;
                }
            }

            .errorTipStyle {
                font-family: $fontFamily;
                font-size: 12px;
                color: #ff4343;

            }

            .errorStyle {
                @extend .errorTipStyle;
                border-color: #ff4343;

                .login_left {
                    input {
                        color: #ff4343;
                    }
                }
            }

            .errorPStyle {
                @extend .errorTipStyle;
            }

            .focusBorderColor {
                border-color: $btnBgColor;
            }
        }

        .desc {
            @include flex(flex-start);
            width: 335px;
            margin-top: 18px;

            .noChecked {
                border: 1px solid red;
                border-radius: 5px;
            }

            .addAnimateClass {
                animation: shake 0.5s forwards;
            }

            img {
                vertical-align: middle;
            }

            span {
                font-family: $fontFamily;
                font-size: 14px;
                font-weight: normal;
                color: #fff;
                margin-left: 8px;
                line-height: 17px;
            }
        }

    }
}
</style>
