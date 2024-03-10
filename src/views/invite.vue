<template>
    <div class="invite maxWidth lrPadding">
        <div class="title">{{ $t('invite.title1.text') }}</div>
        <div class="title">{{ $t('invite.title2.text') }}</div>
        <div class="qcBox">
            <div class="qrCodeBox">
                <img :src="qrCodeImg" v-if="qrCodeImg" class="qrCode" alt="" @click="downLoadImg">
            </div>
            <div class="btnBox">
                {{ accountInfo.invitationCode }}
                <img src="../assets/images/invite/copy.webp" class="copyImg" alt=""
                    @click="copyBtn(accountInfo.invitationCode)">
            </div>
            <div class="btnBox">
                <p class="shareUrl">{{ shareLink }}</p>
                <img src="../assets/images/invite/copy.webp" class="copyImg" alt="" @click="copyBtn(shareLink)">
            </div>
        </div>
        <van-dialog v-model:show="tipDialog" width="310px" className="fundDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <p class="wtitle">{{$t('invite.tip.title.text')}}</p>
                <p class="wsubtitle">{{$t('invite.tip.subtitle.text')}}</p>
                <img src="../assets/images/invite/logoIcon.webp" class="warningIcon" alt="">
                <p class="wcontent">{{$t('invite.tip.content.text')}}</p>
                <div class="btn" @click="tipDialog = false">{{$t('invite.tip.btn.text')}}</div>
            </template>
        </van-dialog>
    </div>
</template>
<script setup >
import { reactive, computed, toRefs, watchEffect } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router';
import http from '@/utils/axios'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/index'
import { showToast } from 'vant'
import QRCode from 'qrcode';
import useClipboard from "vue-clipboard3";

const { toClipboard } = useClipboard()

const store = useStore()
const accountInfo = computed(() => store.accountInfo)
const { t, locale } = useI18n()
const state = reactive({
    shareLink: '',
    qrCodeImg: '',
    tipDialog: false
})
async function copyBtn(val) {
    console.log(val);
    try {
        await toClipboard(val)
        // showToast(t('transfer.copy.success.text'))
        state.tipDialog = true
    } catch (error) {
        console.log(error);
    }

}
async function downLoadImg() {
    const a = document.createElement('a');
    a.href = qrCodeImg;
    a.download = 'qrcode.jpg';
    a.click();
}
watchEffect(async () => {
    if (accountInfo.value.invitationCode) {
        let url = window.location.href
        url = url.replace('/invite','') + '/register';
        state.shareLink = `${url}?code=${accountInfo.value.invitationCode}`
        // console.log(state.shareLink);
        const qrCodeCanvas = document.createElement('canvas');
        qrCodeCanvas.width = 194; // 根据需要调整二维码尺寸
        qrCodeCanvas.height = 194;

        await QRCode.toCanvas(qrCodeCanvas, state.shareLink);
        state.qrCodeImg = qrCodeCanvas.toDataURL()
        // console.log(qrCodeCanvas.toDataURL());
    }
})
const { qrCodeImg, shareLink,tipDialog } = toRefs(state)
</script>
<style scoped lang='scss'>
.invite {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 105px;
    overflow-y: auto;
    background: url('../assets/images/invite/inviteBg.webp')no-repeat;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    .title {
        font-size: 14px;
        color: #d9d9d9;
        text-align: center;
        margin-bottom: 8px;
    }

    .qcBox {
        width: 100%;
        border-radius: 16px;
        border: solid 1px #373747;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 40px 12px 27px;
        box-sizing: border-box;

        .qrCodeBox {
            min-height: 194px;
        }

        .qrCode {
            width: 194px;
            height: 194px;
            margin: 0 auto;
        }

        .btnBox {
            @include flex(center);
            border-radius: 16px;
            border: solid 1px rgba(255, 255, 255, .15);
            background-color: rgba(32, 34, 45, .15);
            padding: 18px 0 19px 0;
            position: relative;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.3px;
            color: #fff;
            margin-top: 27px;

            .copyImg {
                width: 30px;
                height: 30px;
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }

            .shareUrl {
                width: 75%;
                text-align: center;
                padding-right: 20px;
                // white-space: ;
            }
        }
    }
    :deep(.fundDialog) {
        border-radius: 16px;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 0 30px;
        .warningIcon {
            width: 100%;
            height: 54px;
            margin: 10px auto 0;
        }
        .wtitle {
            font-family: 'Roboto';
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            color: #ff6c00;
            margin-top: 20px;
            text-transform: uppercase;
        }
        .wsubtitle{
            font-family: 'Roboto';
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.3px;
            text-align: left;
            color: #fff;
            margin-top: 15px;
        }
        .wcontent {
            font-family: 'Roboto';
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.3px;
            text-align: left;
            color: #d9dbe9;
            padding: 15px 10px 20px 10px;
        }
        .btn{
            margin: 0 8px 0 0;
            padding: 13.3px 104px 16px 105px;
            border-radius: 14px;
            background-color: #ff6c00;
            text-transform: uppercase;
            color: #fff;
            margin-bottom: 20px;
        }
    }
}
</style>