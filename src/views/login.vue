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
        <img src="../assets/images/login/logo.png" class="logoImg p_left" alt="logo">
        <h3 class="w_cter">Welcome to CTER</h3>
        <p class="logo_p">Create an account to explore amazing feature</p>
      </div>
      <!-- 账号登陆 -->
      <div class="loginForm">
        <div :class="{ focusBorderColor: inputIndex === index }" v-for="(item, index) in userInfo" :key="index">
          <div class="formItem" :class="{ errorStyle: item.error }">
            <div class="login_left">
              <img :src="getImg('login', item.imgIcon)" alt="">
              <input :type="item.type" :placeholder="item.placeholder" @focus="borderActive(index)"
                @blur="resetActive(item)">
            </div>
            <img :src="getImg('login', isReadPwd ? 'open' : 'close')" alt="" v-if="item.name == 'password'"
              @click="readPwd(item)">
          </div>
          <p :class="{ errorPStyle: item.error }" style="padding-left: 8px;margin-bottom: 9px;" v-if="item.error">{{ item.errorText }}</p>
        </div>
      </div>
      <div class="remember">
        <div class="r_switch">
          <van-switch v-model="isRemember" active-color="#ff7c43" inactive-color="#2c2c2c" />
          <span>Remember me</span>
        </div>
        <div class="r_forgot">
          Forgot password
        </div>
      </div>
      <van-button type="primary" class="loginbtn">Login</van-button>
      <p class="addAccText">Not have an account? &nbsp;&nbsp;<span class="r_now">Register now</span></p>

    </div>
    <van-divider style="background-color: #343434;" :hairline="true" />
    <p class="serviceLink">
      <img src="../assets/images/login/service.png" alt="">
      Online Service
    </p>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { getImg } from '@/utils/utils'
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
  userInfo: [
    {
      name: 'account',
      imgIcon: 'acc',
      type: 'text',
      val: '',
      error: false,
      errorText:'',
      placeholder: 'Username or Email'
    },
    {
      name: 'password',
      imgIcon: 'pwd',
      type: 'password',
      val: '',
      error: false,
      errorText:'',
      placeholder: 'Password'
    },
    {
      name: 'verificationCode',
      imgIcon: 'email',
      type: 'text',
      val: '',
      error: false,
      errorText:'',
      placeholder: 'Verification code'
    },
  ],
  isRemember: true,
  isReadPwd: false,
  inputIndex: -1
})
function showSelect() {
  state.showLangOpt = !state.showLangOpt
}
function selectLang(item) {
  state.langTarget = item.name
  state.showLangOpt = false
}
function readPwd(item) {
  state.isReadPwd = !state.isReadPwd
  item.type = state.isReadPwd ? 'text' : 'password'
}
function borderActive(index) {
  state.inputIndex = index
}
function resetActive(item) {
  state.inputIndex = -1
}
const { langList, showLangOpt, langTarget, userInfo, isRemember, isReadPwd, inputIndex } = toRefs(state)
</script>
<style lang="scss" scoped>
$selectWidth: 86px;
$selectHeight: 26px;

.p_left {
  padding-left: 4px;
}

.login {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/login/loginBg.png')no-repeat;
  background-size: cover;
  padding-bottom: 60px;
  box-sizing: border-box;
  overflow: auto;
}

.loginMain {
  padding: 40px 20px 0;
}

.langBox {
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
    font-family: Poppins;
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
    height: 0;

    .o_item {
      height: 28px;
      padding: 0 6px 0 7px;
      font-family: Poppins;
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
  margin-top: 90px;

  .logoImg {
    width: 70px;
    height: 70px;
  }

  .w_cter {
    margin: 12px 12px 4px 4px;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: -0.5px;
    color: #eaeaea;
  }

  .logo_p {
    margin: 16px 0px 20px 4px;
    font-size: 13px;
    color: #ddd;
  }
}

.loginForm {
  margin-top: 16px;
  box-sizing: border-box;

  .formItem {
    width: 335px;
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

      input {
        width: 100%;
        height: calc(100% - px);
        background-color: #2c2c2c;
        border: none;
        font-family: Poppins;
        font-size: 14px;
        color: #fff;
      }

    }
  }

  .errorTipStyle {
    font-family: Poppins;
    font-size: 12px;
    color: #ff4343;

  }

  .errorStyle {
    @extend .errorTipStyle;
    border-color: #ff4343;
    .login_left{
      input{
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
  @include flex();
  margin-top: 16px;

  .r_switch {
    @include flex(flex-start);

    span {
      font-family: Poppins;
      font-size: 14px;
      color: #8d8d8d;
      margin-left: 12px;
    }
  }

  .r_forgot {
    font-family: Poppins;
    font-size: 14px;
    color: #eaeaea;
  }
}

.loginbtn {
  width: 336px;
  height: 40px;
  margin: 26px 0 0;
  border-radius: 20px;
  background-color: $btnBgColor;
  border: none;
  font-family: Poppins;
  font-size: 15px;
  color: #eaeaea;
}

.addAccText {
  text-align: center;
  font-family: Poppins;
  font-size: 14px;
  color: #eaeaea;
  margin-top: 15px;

  .r_now {
    font-size: 14px;
    color: #00a3b7;
  }
}

.serviceLink {
  @include flex(center);
  margin: 5px 0 4px;
  font-family: Poppins;
  font-size: 14px;
  color: #ff7c43;
  margin-bottom: 63px;
}</style>
