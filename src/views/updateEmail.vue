<template>
    <div class="bind-phone hideScrollbar maxWidth lrPadding">
         <div class="sendBox">
            <input type="text" class="hideInputBtn" v-model="form.oldEmail" :disabled="true" :placeholder="$t('updata.email.success.text')">
        </div>
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="text" class="hideInputBtn" v-model="form.email" :placeholder="$t('form.email.text')">
                <div class="append-str">
                {{form.append}}
                </div>
            </div>
        </div>
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="text" class="hideInputBtn" v-model="form.code" @input="getVerifyCode"
                    :placeholder="$t('form.vercode.text')">
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
import { reactive, toRefs, onMounted,computed } from 'vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/index'
const store = useStore()
const accountInfo = computed(() => store.accountInfo)

const { t } = useI18n()
const router = useRouter()
const state = reactive({
    verifyMetIndex: 1,
    verifyText:'',
    sysConfig:{},
    form:{
        oldEmail:'',
        email: '',
        code: '',
        append:'@gmail.com'
    },
    phoneDialog:{
        show:false
    },
    sendBtn: t('forget.send'),
    showSeconds: false
})

onMounted(() => {
    init()
})
function init(){
    if(!accountInfo.value.email){
        router.push({
            path:'/bindEmail'
        })
    }
    state.form.oldEmail = accountInfo.value.email
}
async function sendVerify() {
    if (state.form.email === '') {
        showToast(t('ruls.email.empty'))
        return
    }
    let url = '/player/mail/code'
    try {
        let para = {
            email: state.form.email + state.form.append
        }
        const res = await http.post(url,para)
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
    state.code = state.form.code.replace(/\D/g, '')
}
async function submit() {
    if (state.form.phone === '') {
        showToast(t('ruls.email.empty'))
        return
    }
    if (state.form.code === '') {
        showToast(t('ruls.vercode.empty'))
        return
    }
    let url = '/player/mail/bind'
    let data = {
        email: state.form.email + state.form.append,
        code: state.form.code
    }
    try {
        const res = await http.post(url, data)
        if (res === null) {
            showToast(t('tips.success.text'))
            state.form.phone = ''
            state.form.code = ''
            state.form.areaCode = ''
            setTimeout(() => {
                router.go(-1)
            }, 500);
        }
    } catch (error) {
        console.log(error);
    }
}
const { form, verifyText, verifyObj, sendBtn, showSeconds, subBranch,areaCodeList,sysConfig,phoneDialog } = toRefs(state)
</script>
<style scoped lang='scss'>
.bind-phone {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    .sendBoxNum{
        flex-direction: row!important;
        align-items: center;
        .append-str{
            color: #fff;
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
            .append-str{
                color: #fff;
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
}
</style>