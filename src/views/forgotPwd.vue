<template>
    <div class="forgotPwd maxWidth" @click="showAreaCodeOpt = false">
        <div class="forgotMain">
            <div class="backBox">
                <img src="../assets/images/register/back.png" class="goBack" alt="" @click="goback">
                <span class="title">{{ $t('forget.title') }}</span>
            </div>
            <div class="registerForm">
                <div v-for="(item, index) in userInfo" :key="index" style="position: relative;">
                    <div v-if="item.isShow">
                        <div class="formItem" :class="{ errorStyle: item.error, focusBorderColor: inputIndex === index }"
                            @click="showVerifySelect(item)">
                            <div class="login_left">
                                <img :src="getImg(item.iconFile, item.imgIcon)" alt=""
                                    v-if="item.imgIcon && item.name != 'emailOrPhoneVerifiCode'">
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
                                    :class="{ inputMl: item.name === 'phoneNumber' }" @focus="borderActive(index)"
                                    @blur="resetActive(item)" @input="resetActive(item)"
                                    v-if="item.name != 'emailOrPhoneVerifiCode'" />
                                <!-- 选择 验证方式 -->
                                <div v-if="item.name == 'emailOrPhoneVerifiCode'"
                                    style="width:100%;display: flex; justify-content: space-between;font-size: 14px;color: #fff;">
                                    <span style="margin-left: 12px;">{{ item.val }}</span>
                                    <van-icon :name="showVerifyOpt ? 'arrow-up' : 'arrow-down'" />
                                </div>
                                <!-- 发送验证码 -->
                                <div class="sendBtn" v-if="item.name === 'verificationCode'" @click="getVerifyCode">
                                    {{ $t('forget.send') }}
                                </div>
                            </div>
                        </div>
                        <p :class="{ errorPStyle: item.error }" style="padding-left: 8px;margin-bottom: 9px;"
                            v-if="item.error">
                            {{ item.errorText }}</p>
                    </div>
                </div>
                <div class="verifyType" :class="{ addVerifyClass: showVerifyOpt }">
                    <p @click="clickVerify(1)" :class="{ activeText: optVal.includes($t('forget.phoneVerifiCode')) }">{{
                        $t('forget.phoneVerifiCode') }}</p>
                    <van-divider :hairline="true" />
                    <p @click="clickVerify(2)" :class="{ activeText: optVal.includes($t('forget.emailVerifiCode')) }">{{
                        $t('forget.emailVerifiCode') }}</p>
                </div>
            </div>
            <van-button type="primary" class="loginbtn" @click="changePwd">{{ $t('forget.continue') }}</van-button>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router';
import { showToast } from 'vant'
import http from "@/utils/axios";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const state = reactive({
    userInfo: [
        {
            name: 'username',
            type: 'text',
            val: '',
            error: false,
            isShow: true,
            errorText: t('login.uErrorText'),
            placeholder: t('login.username')
        },
        {
            name: 'newPwd',
            type: 'password',
            val: '',
            error: false,
            isShow: true,
            errorText: t('login.pErrorText'),
            placeholder: t('login.password')
        },
        {
            name: 'ConfirmPassword',
            type: 'password',
            val: '',
            error: false,
            isShow: true,
            errorText: t('register.confirmErrorText'),
            placeholder: t('register.confirmPwd')
        },
        {
            name: 'emailOrPhoneVerifiCode',
            imgIcon: 'back',
            type: 'text',
            val: t('forget.emailVerifiCode'),
            iconFile: 'register',
            error: false,
            errorText: '',
            isOpt: false,
            isShow: true,
        },
        {
            name: 'emailAddress',
            imgIcon: 'email',
            type: 'text',
            val: '',
            iconFile: 'login',
            error: false,
            isShow: true,
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
            isShow: false,
            errorText: t('register.phoneErrorText'),
            placeholder: t('register.phone')
        },
        {
            name: 'verificationCode',
            type: 'text',
            val: '',
            error: false,
            isShow: true,
            errorText: t('login.vErrorText'),
            placeholder: t('login.verificationCode')
        },
    ],
    inputIndex: -1,
    areaCode: '225',
    showAreaCodeOpt: false,
    showVerifyOpt: false,
    codeList: [],
    optVal: t('forget.emailVerifiCode'),
    optObj: {
        1: t('forget.phoneVerifiCode'),
        2: t('forget.emailVerifiCode')
    }
})
function goback() {
    router.go(-1)
}
function showSelect() {
    state.showAreaCodeOpt = !state.showAreaCodeOpt
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
function showVerifySelect(item) {
    if (item.name === 'emailOrPhoneVerifiCode') {
        state.showVerifyOpt = !state.showVerifyOpt
    }
}
function getVerifyCode() {
    if (state.optVal === 'Email verifiCode') {
        getEmailCode()
    } else {
        getPhoneCode()
    }
}
function selectAreaNum(item) {
    state.areaCode = item.num
    state.showAreaCodeOpt = false
}
async function getEmailCode() {
    let url = '/player/mail/change_pwd'
    let data = {
        username: state.userInfo[0].val,
        email: state.userInfo[4].val
    }
    try {
        let res = await http.post(url, data)
        if (res?.hasSend) {
            showToast(t('form.verift.send.text'))
        }
    } catch (error) {
        console.log(error);
    }
}
async function getPhoneCode() {
    let url = '/player/v2/phone_code/change_pwd'
    let data = {
        username: state.userInfo[0].val,
        phone: `${state.areaCode}${state.userInfo[5].val}`
    }
    try {
        let res = await http.post(url, data)
        if (res?.hasSend) {
            showToast(t('form.verift.send.text'))
        }
    } catch (error) {
        console.log(error);
    }
}
function clickVerify(params) {
    state.optVal = state.optObj[params]
    state.showVerifyOpt = false
    state.userInfo.forEach(item => {
        if (item.name === 'emailOrPhoneVerifiCode') {
            item.val = state.optObj[params]
        }
    });
    if (params === 'Phone verifiCode') {
        state.userInfo[4].isShow = false
        state.userInfo[5].isShow = true
        state.userInfo[4].val = ''
    }
    if (params === 'Email verifiCode') {
        state.userInfo[5].isShow = false
        state.userInfo[4].isShow = true
        state.userInfo[5].val = ''
    }
}
async function changePwd() {
    let url = '/player/v2/phone_change_pwd'
    let data = {
        username: state.userInfo[0].val,
        newPwd: state.userInfo[1].val,
        twicePwd: state.userInfo[2].val,
        code: state.userInfo[6].val
    }
    try {
        const res = await http.post(url, data)
        if (res === null) {
            showToast(t('index.editor.psd.change.pass.success.text'))
            setTimeout(() => {
                router.push({
                    path: "/"
                })
            }, 1000);
        }
    } catch (error) {
        console.log(error);
    }
}
onMounted(() => {

    state.optVal = t('forget.emailVerifiCode')
    console.log(
        '%c state.optVal: ',
        'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
        state.optVal
    )
    state.optObj = {
        1: t('forget.phoneVerifiCode'),
        2: t('forget.emailVerifiCode')
    }
    state.userInfo = [
        {
            name: 'username',
            type: 'text',
            val: '',
            error: false,
            isShow: true,
            errorText: t('login.uErrorText'),
            placeholder: t('login.username')
        },
        {
            name: 'newPwd',
            type: 'password',
            val: '',
            error: false,
            isShow: true,
            errorText: t('login.pErrorText'),
            placeholder: t('login.password')
        },
        {
            name: 'ConfirmPassword',
            type: 'password',
            val: '',
            error: false,
            isShow: true,
            errorText: t('register.confirmErrorText'),
            placeholder: t('register.confirmPwd')
        },
        {
            name: 'emailOrPhoneVerifiCode',
            imgIcon: 'back',
            type: 'text',
            val: t('forget.emailVerifiCode'),
            iconFile: 'register',
            error: false,
            errorText: '',
            isOpt: false,
            isShow: true,
        },
        {
            name: 'emailAddress',
            imgIcon: 'email',
            type: 'text',
            val: '',
            iconFile: 'login',
            error: false,
            isShow: true,
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
            isShow: false,
            errorText: t('register.phoneErrorText'),
            placeholder: t('register.phone')
        },
        {
            name: 'verificationCode',
            type: 'text',
            val: '',
            error: false,
            isShow: true,
            errorText: t('login.vErrorText'),
            placeholder: t('login.verificationCode')
        },
    ]
    let codeList = [
        255,
        213,
        33,
        44,
        49,
        34,
        1,
        91,
        90,
        260,
        251,
        254,
        255,
        234,
        237,
        213,
        33,
        44,]
    state.codeList = codeList.map(item => {
        return {
            num: item
        }
    })
})
const { userInfo, inputIndex, areaCode, showAreaCodeOpt, codeList, showVerifyOpt, optVal } = toRefs(state)
</script>
<style scoped lang='scss'>
.forgotPwd {
    height: 100%;
    background: url('@/assets/images/register/forgotPwd.png')no-repeat;
    background-size: cover;
    box-sizing: border-box;
    overflow: auto;

    .forgotMain {
        padding: 40px 20px 0;
        @include flex();

        flex-direction: column;

        .backBox {
            width: $width;

            @include flex(flex-start);

            .title {
                margin: 4px 0 5px 12px;
                font-family: Roboto;
                font-size: 16px;
                color: #fff;
            }
        }

        .registerForm {
            box-sizing: border-box;
            margin-top: 16px;

            .formItem {
                width: $width;
                height: 45px;
                border-radius: 12px;
                border: solid 1px #3f3f3f;
                background-color: #2c2c2c;
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

                    input {
                        // width: 100%;
                        // height: calc(100% - px);
                        background-color: #2c2c2c;
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
                            font-family: normal;
                            font-size: 14px;
                            color: #fff;
                            font-weight: normal;
                        }

                        .options {
                            width: 74px;
                            position: absolute;
                            top: 30px;
                            left: -0;
                            color: #000;
                            border-radius: 4px;
                            background-color: #2c2c2c;
                            height: 0;
                            overflow: hidden;
                            transition: height .5s ease-out;
                            height: 0;
                            cursor: pointer;
                            box-sizing: border-box;
                            padding: 0 9px;

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
                            height: 185px;
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
                        width: 58px;
                        height: 28px;
                        margin: 0 0 0 33px;
                        border-radius: 4px;
                        background-color: #ff7c43;
                        font-size: 14px;
                        color: #fff;
                        @include flex(center, center);
                        cursor: pointer;
                    }
                }
            }

            .verifyType {
                width: $width;
                // height: 90px;
                position: absolute;
                top: 296px;
                background-color: #202020;
                z-index: 12;
                padding: 7px 16px 11px;
                border-radius: 12px;
                box-sizing: border-box;
                color: #8d8d8d;
                font-size: 14px;
                height: 0;
                cursor: pointer;
                display: none;

                p {
                    height: 40px;
                    @include flex(flex-start, center);
                }

                .van-divider {
                    margin: 0;
                }

                .activeText {
                    color: #fff;
                }
            }

            .addVerifyClass {
                display: block;
                height: 90px;
                transition: height .5s ease-out;
                cursor: pointer;
            }

            // .removeVerifyClass {
            //     display: none;
            // }

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

        .loginbtn {
            margin-top: 264px;
        }
    }
}

@media screen and (max-width: 400px) {
    .forgotPwd {
        .forgotMain {
            .loginbtn {
                margin-top: 30%;
            }
        }

    }
}
</style>