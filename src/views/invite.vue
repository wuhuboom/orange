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
console.log(accountInfo);
const { t, locale } = useI18n()
const state = reactive({
    shareLink: '',
    qrCodeImg: ''
})
async function copyBtn(val) {
    console.log(val);
    try {
        await toClipboard(val)
        showToast(t('transfer.copy.success.text'))
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
        state.shareLink = `${window.location.href}?code=${accountInfo.value.invitationCode}`
        // console.log(state.shareLink);
        const qrCodeCanvas = document.createElement('canvas');
        qrCodeCanvas.width = 194; // 根据需要调整二维码尺寸
        qrCodeCanvas.height = 194;

        await QRCode.toCanvas(qrCodeCanvas, state.shareLink);
        state.qrCodeImg = qrCodeCanvas.toDataURL()
        // console.log(qrCodeCanvas.toDataURL());
    }
})
const { qrCodeImg, shareLink } = toRefs(state)
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
                // white-space: ;
            }
        }
    }
}
</style>