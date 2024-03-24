<template>
  <div class="login maxWidth lrPadding">
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
      </div>
      <div class="loginBox lrPadding">
        <div class="btnOpt cursor">
          <span :class="{ spanAct: btnIndex === 0 }" @click="changeBtn(0)">{{ $t('login.loginBtn') }}</span>
          <span :class="{ spanAct: btnIndex === 1 }" @click="changeBtn(1)">{{ $t('register.registerBtn') }}</span>
        </div>
        <LoginC v-show="btnIndex === 0" :btnIndex="btnIndex" />
        <RegisterC v-show="btnIndex === 1" :btnIndex="btnIndex" @changeRegStatus="changeRegStatus"
          @changeBtnIndex="changeBtnIndex" ref="regRefs" :isRegBtn="isRegBtn" />
      </div>
    </div>
    <div class="regiter" v-if="btnIndex === 1">
      <div class="desc">
        <img :src="rCheckBool ? getImg('register', 'checked') : getImg('register', 'nocheck')" alt="" @click="isChecked">
        <p :class="{ checkErr: noCheck }">{{ $t('register.instructions') }}</p>
      </div>
      <van-button type="primary" class="loginbtn" @click="registerAcc">{{ $t('register.registerBtn') }}</van-button>
    </div>
    <p class="serviceLink" @click="jumpService" v-if="btnIndex === 0">
      <img src="../assets/images/login/service.webp" alt="">
      {{ $t('login.service') }}
    </p>
  </div>
</template>

<script setup>
import { reactive, toRefs, ref } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router';
import http from '@/utils/axios'
import LoginC from '@/components/loginC.vue'
import RegisterC from '@/components/registerC.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()
let regRefs = ref(null)
const state = reactive({
  langList: [
    {
      name: 'VN'
    },
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
    }
  ],
  showLangOpt: false,
  langTarget: localStorage.getItem('lang')?.toUpperCase() || 'VN',
  serviceUrl: '',
  btnIndex: 0,
  rCheckBool: false,
  regTimer: null,
  isRegBtn: false,
  noCheck: false
})
function showSelect() {
  let langList = [
     {
      name: 'VN'
    },
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
  if (state.serviceUrl) {
    window.location.href = state.serviceUrl
  }
}
function changeBtn(index) {
  state.btnIndex = index
}
function isChecked() {
  state.rCheckBool = !state.rCheckBool
  if (state.rCheckBool) {
    state.noCheck = false
  }
}
function changeRegStatus(bool) {
  state.isRegBtn = bool
}
function changeBtnIndex(index) {
  state.btnIndex = index
}
function registerAcc() {
  if (!state.rCheckBool) {
    state.noCheck = true
    return
  }
  state.isRegBtn = true
}
const { langList, showLangOpt, langTarget, btnIndex, rCheckBool, isRegBtn, noCheck } = toRefs(state)
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
  padding: 40px 0px 0;
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
    z-index: 2;

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
    height: 160px;
  }
}

.logoBox {
  width: $width;
  margin-top: 17px;
  margin-bottom: 43px;

  .logoImg {
    width: 70px;
    height: 70px;
    margin: 0 auto;
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

.loginBox {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  /* 设置背景颜色为半透明白色 */
  backdrop-filter: blur(17px);
  /* 应用背景模糊效果 */
  // @include flex(center);
  padding: 9px 9px 17px 9px;
  box-sizing: border-box;

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

    span {
      width: 50%;
      height: 100%;
      @include flex(center);
      text-transform: uppercase;
    }

    .spanAct {
      border-radius: 22.5px;
      background-image: linear-gradient(151deg, #353545 26%, rgba(43, 43, 63, 0.55) 80%);
    }
  }
}

.regiter {
  margin-top: 7px;

  .desc {
    @include flex(flex-start);
    margin-top: 7px;

    img {
      width: 24px;
      height: 24px;
    }

    p {
      font-size: 12px;
      color: #fff;
      margin-left: 7px;
    }

    .checkErr {
      color: red;
    }
  }
}

.serviceLink {
  img {
    width: 32px;
    height: 32px;
  }
}
</style>
