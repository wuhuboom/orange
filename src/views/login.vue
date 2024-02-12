<template>
  <div class="login maxWidth">
    <div class="loginMain" @click="showLangOpt = false">
      <div class="langBox">
        <div class="langSelect" @click.stop="showSelect">
          <div class="l_left">
            <img :src="getImg('login', langTarget)" class="langImg" alt="">
            <span class="l_name">{{ langTarget }}</span>
          </div>
          <van-icon :name="showLangOpt ? 'arrow-up' : 'arrow-down'" />
        </div>
        <div class="options" :class="{ showOpt: showLangOpt }">
          <div class="o_item" :class="{ lfc: item.name === langTarget }" v-for="(item, index) in langList" :key="index"
            @click="selectLang(item)">
            <img :src="getImg('login', item.name)" class="langImg" alt="">
            <span class="l_name">{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="logoBox">
        <img src="../assets/images/login/logo.webp" class="logoImg p_left" alt="logo">
        <h3 class="w_cter">{{ $t('login.title') }} &nbsp;<span>CTER</span></h3>
        <p class="logo_p">{{ $t('login.create.accTips') }}</p>
      </div>
      <!-- 账号登陆 -->
      <div class="loginForm">
        <div v-for="(item, index) in userInfo" :key="index">
          <div class="formItem" :class="{ errorStyle: item.error, focusBorderColor: inputIndex === index }">
            <div class="login_left">
              <img :src="getImg('login', item.imgIcon)" alt="">
              <input :type="item.type" autocomplete="off" v-model="item.val" :placeholder="item.placeholder"
                @focus="borderActive(index)" @blur="resetActive(item)" @input="resetActive(item)" />
            </div>
            <img :src="getImg('login', (isReadPwd ? 'open' : 'close'))" alt="" class="eye" v-if="item.name == 'password'"
              @click="readPwd(item)" style="cursor: pointer;">
            <img :src="verificationObj?.img" alt="" v-if="item.name === 'verificationCode'"
              style="width: 80px;cursor: pointer;" @click="getVerifyCode">
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
      <p class="addAccText">{{ $t('login.notAcc') }}? &nbsp;&nbsp;<span class="r_now" @click="jumpRegisterPage">{{
        $t('login.goRegister') }}</span></p>

    </div>
    <van-divider style="background-color: #3f3f3f;" :hairline="true" />
    <p class="serviceLink" @click="jumpService">
      <img src="../assets/images/login/service.webp" alt="">
      {{ $t('login.service') }}
    </p>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, computed } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router';
import http from '@/utils/axios'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
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
  serviceUrl: ''
})
const userInfo = computed(() => {
  let user = [
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
  return user
})
function showSelect() {
  let langList = [
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
  ]
  state.langList = langList.filter(item => item.name != state.langTarget)
  state.showLangOpt = !state.showLangOpt
}
function selectLang(item) {
  state.langTarget = item.name
  let language = item.name.toLowerCase()
  localStorage.setItem('lang', language)
  locale.value = language
  state.showLangOpt = false
}
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
function jumpRegisterPage() {
  router.push({
    path: '/register',
  })
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
  try {
    const res = await http.post(url, data)
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
getVerifyCode()
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
function jumpService() {
  console.log(state.serviceUrl);
  if (state.serviceUrl) {
    window.location.href = state.serviceUrl
  }
}
onMounted(() => {
  if (localStorage.getItem('lang')?.toUpperCase().includes('ZH')) {
    state.langTarget = 'EN'
  } else {
    state.langTarget = localStorage.getItem('lang')?.toUpperCase() || 'EN'
  }
  const language = navigator.language;
  if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', language)

  }
  if (localStorage.getItem('remember')) {
    let storeage = JSON.parse(localStorage.getItem('remember'))
    state.isRemember = storeage.isremember
    userInfo.value[0] = storeage.user[0]
    userInfo.value[1] = storeage.user[1]
  }
})
const { langList, showLangOpt, langTarget, isRemember, isReadPwd, inputIndex, verificationObj } = toRefs(state)
</script>
<style lang="scss" scoped>
.p_left {
  padding-left: 4px;
}

.login {
  height: 100%;
  background: url('@/assets/images/login/loginBg.webp')no-repeat;
  background-size: cover;
  padding-bottom: 60px;
  box-sizing: border-box;
  overflow: auto;
}

.loginMain {
  padding: 40px 20px 0;
  @include flex();
  flex-direction: column
}

.langBox {
  width: 100%;
  @include flex(flex-end);
  position: relative;

  .langSelect {
    @include flex();
    color: #fff;
    width: $selectWidth;
    height: $selectHeight;
    padding: 0 6px 0 4px;
    border-radius: 3.5px;
    border: solid 1px #fff;
    cursor: pointer;

    .l_left {
      @include flex(flex-start)
    }
  }

  .langImg {
    width: 19px;
    height: 19px;
  }

  .l_name {
    margin-left: 6px;
    font-family: $fontFamily;
    font-size: 15px;
    color: #fff;
  }

  .options {
    width: calc($selectWidth + 12px);
    position: absolute;
    top: calc($selectHeight + 2px);
    right: 0;
    color: #000;
    border-radius: 4px;
    background: rgba(0, 0, 0, .56);
    height: 0;
    overflow: hidden;
    transition: height .5s ease-out;
    cursor: pointer;

    .o_item {
      height: 28px;
      padding: 0 6px 0 7px;
      font-family: $fontFamily;
      font-size: 15px;
      color: #fff;
      @include flex(flex-start);
      margin-top: 9px;
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
  }
}

.logoBox {
  width: $width;
  margin-top: 90px;

  .logoImg {
    width: 70px;
    height: 70px;
  }

  .w_cter {
    margin: 20px 12px 0px 4px;
    font-size: 22px;
    font-weight: 400;
    letter-spacing: 0.5px;
    color: #eaeaea;

    span {
      font-weight: 700;
    }
  }

  .logo_p {
    margin: 8px 0px 16px 4px;
    font-size: 13px;
    color: #ddd;
  }
}

.loginForm {
  box-sizing: border-box;

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
        background-color: #2c2c2c;
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
  width: $width;
  @include flex();
  margin-top: 16px;

  .r_switch {
    @include flex(flex-start);

    span {
      font-family: $fontFamily;
      font-size: 14px;
      color: #8d8d8d;
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


.addAccText {
  text-align: center;
  font-family: $fontFamily;
  font-size: 14px;
  color: #eaeaea;
  margin-top: 15px;

  .r_now {
    font-size: 14px;
    color: #00a3b7;
    cursor: pointer;
  }
}
</style>
