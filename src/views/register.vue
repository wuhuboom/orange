<template>
  <div class="register maxWidth" @click="showAreaCodeOpt = false">
    <div class="registerMain">
      <div class="backBox">
        <img src="../assets/images/register/back.png" class="goBack" alt="" @click="goback">
      </div>
      <div class="registerForm">
        <div v-for="(item, index) in userInfo" :key="index">
          <div class="formItem">
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
                  <div class="o_item" :class="{ lfc: item.num === areaCode }" v-for="(item, index) in codeList"
                    :key="index" @click="selectLang(item)">
                    <span class="l_name" @click="selectAreaNum(item)">{{ item.num }}</span>
                  </div>
                </div>
              </div>
              <input :type="item.type" :placeholder="item.placeholder"
                :class="{ inputMl: item.name === 'phoneNumber', verificationMl: item.name === 'verificationCode' }">
              <img :src="getImg(item.iconFile, item.imgIcon)" alt="" v-if="item.name === 'verificationCode'"
                style="margin-left: 20px;">
            </div>
            <img :src="getImg('login', isReadPwd ? 'open' : 'close')" alt="" v-if="item.name == 'password'"
              @click="readPwd(item)" style="cursor: pointer;">
          </div>
          <p :class="{ errorPStyle: item.error }" style="padding-left: 8px;margin-bottom: 9px;" v-if="item.error">{{
            item.errorText }}</p>
        </div>
      </div>
      <div class="desc">
        <img :src="getImg('register', checked ? 'checked' : 'nocheck')" alt="" style="width: 28px;height: 28px;"
          @click="isChecked">
        <span>I am over 18 years old and agree toTrading
          related regulations and</span>
      </div>
      <van-button type="primary" class="loginbtn">Register</van-button>
      <p class="serviceLink">
        <img src="../assets/images/login/service.png" alt="">
        Online Service
      </p>
    </div>
  </div>
</template>
<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router';
import http from "@/utils/axios";
const router = useRouter()

const state = reactive({
  userInfo: [
    {
      name: 'account',
      imgIcon: 'acc',
      type: 'text',
      val: '',
      iconFile: 'login',
      placeholder: 'Username or Email'
    },
    {
      name: 'password',
      imgIcon: 'pwd',
      type: 'password',
      val: '',
      iconFile: 'login',
      placeholder: 'Password'
    },
    {
      name: 'referralCode',
      imgIcon: 'rCode',
      type: 'text',
      val: '',
      iconFile: 'register',
      placeholder: 'Referral code'
    },
    {
      name: 'emailAddress',
      imgIcon: 'email',
      type: 'text',
      val: '',
      iconFile: 'login',
      placeholder: 'email address'
    },
    {
      name: 'phoneNumber',
      imgIcon: '',
      type: 'text',
      val: '',
      iconFile: '',
      placeholder: 'Mobile Phone number'
    },
    {
      name: 'verificationCode',
      imgIcon: 'code',
      type: 'text',
      val: '',
      iconFile: 'register',
      placeholder: 'Verification code'
    },
  ],
  isReadPwd: false,
  showAreaCodeOpt: false,
  areaCode: 225,
  codeList: [],
  checked: false
})
function showSelect() {
  state.showAreaCodeOpt = !state.showAreaCodeOpt
}
function readPwd(item) {
  state.isReadPwd = !state.isReadPwd
  item.type = state.isReadPwd ? 'text' : 'password'
}
function isChecked() {
  state.checked = !state.checked
}
function goback() {
  router.go(-1)
}
function selectAreaNum(item) {
  state.areaCode = item.num
}
onMounted(() => {
  console.log(http);
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
const { userInfo, isReadPwd, areaCode, showAreaCodeOpt, codeList, checked } = toRefs(state)
</script>
<style lang="scss" scoped>
.register {
  height: 100%;
  background: url('@/assets/images/register/registerBg.png')no-repeat;
  background-size: cover;
  padding-bottom: 60px;
  box-sizing: border-box;
  overflow: auto;

  .registerMain {
    padding: 40px 20px 0;
    @include flex();

    flex-direction: column;

    .backBox {
      width: $width;
      @include flex(flex-start)
    }

    .registerForm {
      box-sizing: border-box;
      margin-top: 163px;

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
      @include flex('', flex-start);
      width: 335px;
      margin-top: 18px;

      img {
        vertical-align: middle;
      }

      span {
        font-family: normal;
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
