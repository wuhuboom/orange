<template>
    <div class="riskModal maxWidth lrPadding hideScrollbar">
        <van-dialog v-model:show="riskDialog" width="310px" className="fundDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <div class="riskMain">
                    <img src="../assets/images/withdraw/riskIcon.png"/>
                    <div class="riskTitle">{{ $t("withdraw.risk.warning") }}</div>
                    <div class="riskText">
                        {{ $t("withdraw.risk.content") }}
                    </div>
                    <div class="btn-box">
                        <div class="uploadBtn" @click="jumpIdcard">{{getBtnClickText()}}</div>
                    </div>
                </div>
            </template>
        </van-dialog>
    </div>
</template>
<script setup>
import { reactive, toRefs,onMounted,onUnmounted,defineExpose  } from 'vue'
import http from '@/utils/axios'
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'
const router = useRouter()
const { t, locale } = useI18n()
const props = defineProps(['riskCode', 'submitted'])

const state = reactive({
    riskDialog: false
})
const openModal = ()=>{
    state.riskDialog = true
}
defineExpose({
    openModal
})
function  getBtnClickText() {
    let lang = locale.value
    let text = props.submitted === 0 ? t("withdraw.risk.upload") :t("withdraw.risk.audit")
    return t("withdraw.risk.uploadIdCard", { text: text })
}
async function initFaceRecognition() {
    // 在调用服务端初始化请求时需要传入该MetaInfo值
    var MetaInfo = window.getMetaInfo();

    let data = {
        info: JSON.stringify(MetaInfo),
        // playerId: uni.getStorageSync('userInfoFootball').id,
        returnUrl: location.href
    }
    try {
        let reqUrl = '/player/risk/secure3'
        const res = await http.post(reqUrl,data)
        let url  = res.url
        // 接下来您进行调用服务端初始化请求获取TransactionUrl
        var TransactionUrl = url; // 此处值应为调用服务端初始化接口返回的TransactionUrl
        // 接下来直接跳转TransactionUrl即可开始服务
        window.location.href = TransactionUrl;
    } catch (error) {
        console.log(error);
    }
}
function jumpIdcard() {
    // withdrawalRisk: 提现被风控(data=1手机验证码 2身份证 3人脸验证 4.人脸验证(自制) 5水电账单 6whatapp人2)
    state.riskDialog = false
    if (props.riskCode == 2) {
        // this.routingJump('pages/wallet/uploadIdCard')
    } else if (props.riskCode == 3 || props.riskCode === 4) {
        initFaceRecognition()
    }
}
onMounted(() => {
    
})
onUnmounted(() => {
   
})
const {riskDialog,tipMsg,timer} = toRefs(state)
</script>
<style scoped lang='scss'>
.riskModal {
    :deep(.fundDialog) {
        border-radius: 16px;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 10px 10px;
        z-index: 9999;
        border-radius: 13px !important;
        background-color: #1c1b20 !important;

        .riskMain {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 18px;
            img{
                width: 60px;
                height: 60px;
            }
            .riskTitle {
                font-size: 20px;
                font-weight: bold;
                color: #f8f9fd;
                margin: 10px 0 20px 0;
            }

            .riskText {
                width: 100%;
                font-size: 15px;
                text-align: center;
                color: #fff;
                line-height: 1.2;
            }

            .uploadBtn {
                width: 100%;
                height: 50px;
                margin: 21px 0;
                line-height: 50px;
                border-radius: 10px;
                background-color: #ff7c43;
                font-size: 17px;
                font-weight: bold;
                letter-spacing: -0.17px;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                // flex-wrap: wrap;

                &:after {
                    display: none;
                }
            }

            .u-default-hover {
                background-color: #b5db1c !important;
                color: #2d2d2d !important;
            }
        }
    }     
}
</style>