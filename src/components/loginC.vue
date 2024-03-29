<template>
    <div>
        <!-- 账号登陆 -->
        <div class="loginForm">
            <div v-for="(item, index) in userInfo" :key="index">
                <div class="formItem" :class="{ errorStyle: item.error, focusBorderColor: inputIndex === index }">
                    <div class="login_left">
                        <img :src="getImg('login', item.imgIcon)" alt="">
                        <input :type="item.type" autocomplete="off" v-model="item.val" :placeholder="item.placeholder"
                            @focus="borderActive(index)" @blur="resetActive(item)" @input="resetActive(item)" />
                    </div>
                    <img :src="getImg('login', (isReadPwd ? 'open' : 'close'))" alt="" class="eye"
                        v-if="item.name == 'password'" @click="readPwd(item)" style="cursor: pointer;">
                    <img :src="verificationObj?.img" alt="" v-if="item.name === 'verificationCode'"
                        style="width: 80px;height:25px;cursor: pointer;" @click="getVerifyCode">
                </div>
                <p :class="{ errorPStyle: item.error }" style="padding-left: 8px;margin-bottom: 9px;" v-if="item.error">{{
                    item.errorText }}</p>
            </div>
        </div>
        <div class="remember">
            <div class="r_switch">
                <van-switch v-model="isRemember" active-color="#ff7c43" inactive-color="#2c2c2c" @change="savePwd" />
                <span>{{ $t('login.remember') }}</span>
            </div>
            <div class="r_forgot" @click="toForgot">
                {{ $t('login.forgotPwd') }}
            </div>
        </div>
        <van-button type="primary" class="loginbtn" @click="login">{{ $t('login.loginBtn') }}</van-button>

    </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, computed, watchEffect } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router';
import http from '@/utils/axios'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps(['btnIndex'])
const router = useRouter()
const state = reactive({
    langList: [
        {
            name: 'EN'
        },
        {
            name: 'DE'
        },
        {
            name: 'ES'
        },
        {
            name: 'FR'
        },
        {
            name: 'INS'
        },
    ],
    showLangOpt: false,
    langTarget: 'EN',
    isRemember: false,
    isReadPwd: false,
    inputIndex: -1,
    verificationObj: {},
    serviceUrl: '',
    lUser: []
})
const userInfo = computed(() => {
    state.lUser = [
        {
            name: 'account',
            imgIcon: 'acc',
            type: 'text',
            val: '',
            error: false,
            errorText: t('login.uErrorText'),
            placeholder: t('login.username')
        },
        {
            name: 'password',
            imgIcon: 'pwd',
            type: 'password',
            val: '',
            error: false,
            errorText: t('login.pErrorText'),
            placeholder: t('login.password')
        },
        {
            name: 'verificationCode',
            imgIcon: 'email',
            type: 'text',
            val: '',
            error: false,
            errorText: t('login.vErrorText'),
            placeholder: t('login.verificationCode')
        },
    ]
    return state.lUser
})
function readPwd(item) {
    state.isReadPwd = !state.isReadPwd
    item.type = state.isReadPwd ? 'text' : 'password'
}
function borderActive(index) {
    state.inputIndex = index
}
function toForgot() {
    router.push({
        path: '/forgotPwd'
    })
}
function resetActive(item) {
    state.inputIndex = -1
    if (item.vale != '') {
        item.error = false
    }
    if (state.isRemember) {
        savePwd()
    }
}
function savePwd() {
    let storeage = {
        isremember: state.isRemember,
        user: userInfo.value
    }
    if (state.isRemember) {
        localStorage.setItem('remember', JSON.stringify(storeage))
    } else {
        localStorage.removeItem('remember')
    }
}
async function login() {
    let url = '/player/auth/login'
    for (let i in userInfo.value) {
        userInfo.value[i].error = userInfo.value[i].val == '' ? true : false
        if (userInfo.value[i].error) {
            return
        }
    }
    let data = {
        username: userInfo.value[0].val,
        password: userInfo.value[1].val,
        code: userInfo.value[2].val,
        verifyKey: state.verificationObj.verifyKey
    }
    console.log(data);
    try {
        const res = await http.post(url, data)
        console.log(res);
        if (res == 103) {
            getVerifyCode()
        }
        if (res?.token) {
            localStorage.setItem('userInfo', JSON.stringify(res))
            setTimeout(() => {
                router.push({
                    path: '/home'
                })
            }, 500)
        }
    } catch (error) {
        console.log(error);
    }
}
async function getVerifyCode() {
    userInfo.value[2].val = ''
    let url = '/player/auth/verify_code'
    try {
        const res = await http.get(url)
        state.verificationObj = res
    } catch (error) {
        console.log(error);
    }
}
// getVerifyCode()
async function getServiceLink() {
    let url = '/player/home/serv_tmp'
    try {
        const res = await http.get(url)
        if (res.serviceAddr) {
            state.serviceUrl = res.serviceAddr
        }
    } catch (error) {
        console.log(error);
    }
}
getServiceLink()
watchEffect(() => {
    if (props.btnIndex === 0) {
        setAccPwd()
        getVerifyCode()
    }
})
function setAccPwd() {
    if (localStorage.getItem('remember')) {
        let storeage = JSON.parse(localStorage.getItem('remember'))
        console.log(storeage);
        state.isRemember = storeage.isremember
        userInfo.value[0].val = storeage.user[0]?.val
        userInfo.value[1].val = storeage.user[1]?.val
    }
}
onMounted(() => {
    console.log( localStorage.getItem('lang'),'---------------');
    if (localStorage.getItem('lang')?.toUpperCase().includes('ZH')) {
        state.langTarget = 'VN'
    } else {
        state.langTarget = localStorage.getItem('lang')?.toUpperCase() || 'VN'
    }
    const language = state.langTarget;
    if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', language)
    }
    if (props.btnIndex === 0) {
        setAccPwd()
    }
})
const { langList, showLangOpt, langTarget, isRemember, isReadPwd, inputIndex, verificationObj } = toRefs(state)
</script>
<style scoped lang='scss'>
.loginForm {
    box-sizing: border-box;

    .formItem {
        // width: $width;
        height: 45px;
        border-radius: 22px;
        border: solid 1px #11101c;
        background-color: #11101c;
        ;
        @include flex();
        padding-left: 9px;
        margin-bottom: 9px;
        box-sizing: border-box;
        padding-right: 14px;

        .login_left {
            height: 100%;
            @include flex(flex-start);
            flex: 1;

            img {
                width: 28px;
                height: 28px;
            }

            input {
                width: 100%;
                height: calc(100% - px);
                background-color: #11101c;
                border: none;
                font-family: $fontFamily;
                font-size: 14px;
                color: #fff;
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

.remember {
    // width: $width;
    @include flex();
    margin-top: 16px;

    .r_switch {
        @include flex(flex-start);

        span {
            font-family: $fontFamily;
            font-size: 14px;
            color: #fff;
            margin-left: 12px;
        }
    }

    .r_forgot {
        font-family: $fontFamily;
        font-size: 14px;
        color: #eaeaea;
        cursor: pointer;
    }
}

.loginbtn {
    margin-top: 32px;
}
</style>
