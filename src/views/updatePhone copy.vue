<template>
    <div class="updatePhone hideScrollbar maxWidth lrPadding">
        <div class="sendBox">
            <input type="text" class="hideInputBtn" v-model="oldPhoneStr" :placeholder="$t('password.setting.phone.old.phone.text')">
        </div>
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="text" class="hideInputBtn" v-model="code" @input="getVerifyCode"
                    :placeholder="$t('form.vercode.text')">
                <div class="sendBtn" @click="sendVerify">
                    {{ sendBtn }} <span v-if="showSeconds">s</span>
                </div>
            </div>
        </div>
         <div class="sendBox">
             <Select :selectedObj="verifyObj" @sendSelectVal="sendSelectVal" />
             <input type="text" class="hideInputBtn" v-model="phone" :placeholder="$t('form.phoneNum.text')">
        </div>
        <div class="confirm cursor" @click="submit">
            {{ $t('modal.confirm.text') }}
        </div>

         <van-dialog v-model:show="phoneDialog.show" width="310px" className="phoneDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <p class="wtitle">{{ $t('deal.createOrder.354499-23') }}</p>
                <p class="wcontent">
                    {{ $t('edit.tip.text',{time:sysConfig.editImportantLogout,name:$t('form.phoneNum.text')}) }}
                </p>
                 <div class="btn">
                    <div class="dialogBtn" @click="cancleBindPhone">
                        {{ $t('index.editor.psd.modal.cancel.btn') }}
                    </div>
                      <div class="dialogBtn" @click="bindPhone">
                        {{ $t('index.editor.psd.modal.confirm.btn') }}
                    </div>
                 </div>
              
            </template>
        </van-dialog>
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
const store = useStore()
const accountInfo = computed(() => store.accountInfo)
import { showConfirmDialog } from 'vant';

const { t } = useI18n()
const router = useRouter()
const state = reactive({
    verifyMetIndex: 1,
    verifyText:'',
    verifyCode: '',
    newPwd: '',
    twicePwd: '',
    code: '',
    phoneDialog:{
        show:false
    },
    sysConfig:{},
    verifyObj: {
        title: '',
        dataType: 'verify',
        options: [],
        selectedVal: t('addWalletAddress.verify.phone.text'),
        optIndex: 1,
    },
    sendBtn: t('forget.send'),
    showSeconds: false
})

onMounted(() => {
    // initPhone()
})
function cancleBindPhone(){
    router.go(-1)
}
function bindPhone(){
    router.push({
        path:'/bindPhone'
    })
}
function initPhone(){
    if(!accountInfo.value.phone){
        state.phoneDialog.show=true
        // showConfirmDialog({
        // title: '标题',
        // className:'showConfirm',
        // teleport:'.updatePhone',
        // confirmButtonText:'',
        // cancelButtonText:'',
        // message:
        //     '如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
        // })
        // .then(() => {
        //     // on confirm
        // })
        // .catch(() => {
        //     // on cancel
        // });
    }
}
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
getSysConfig()
async function getSysConfig(){
    let url = '/player/auth/sys_config'
    try {
        const res = http.get(url)
        if(res){
            state.sysConfig = res
            let options = res.area_code.map(item => areaCodeList.push({ value: item, label: item }))
            state.verifyObj.options = options
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
const { verifyCode, verifyText,newPwd, verifyObj, sendBtn, showSeconds, twicePwd, subBranch,  phone,code,phoneDialog,sysConfig } = toRefs(state)
</script>
<style scoped lang='scss'>
.updatePhone {
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
    :deep(.phoneDialog) {
        border-radius: 16px;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 0 30px;

        .wtitle {
            font-size: 18px;
            text-align: center;
            padding-top: 15px;
            color: #fff;
        }

        .wcontent {
             padding-top: 20px;
             color: #fff;
             line-height: 16px;
        }

        .btn{
            @include flex(space-between,center);
            .dialogBtn {
                @include flex();
                height: 48px;
                justify-content: center;
                flex: 1;
                border-radius: 16px;
                color: #fff;
                background-color: $btnBgColor;
                margin: 18px 10px 26px 0;
            }
        }
        .van-dialog__footer {
            background-color: #211f32 !important;
        }
    }
    :deep(.showConfirm){
        .van-dialog__header,.van-dialog__content{
            background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
            color: #fff;
        }
        .van-dialog__message--has-title{
            color: #ffffff;
        }
        .van-dialog__cancel{
            border: none;
            background-color: #252531!important;
            color: #fff;
        }
        .van-dialog__confirm{
            border: none;
            background-color: #ed8251!important;
            color: #fff;
        }
    }
}
</style>