<template>
    <div class="addWalletAddress maxWidth lrPadding">
        <div class="sendBox">
            <div class="title">{{ $t('addWalletAddress.type.text') }}</div>
            <input type="number" v-model="walletType" :placeholder="$t('addWalletAddress.walletType.plaaceholder.text')">
        </div>
        <div class="sendBox">
            <div class="title">{{ $t('addWalletAddress.walletId.text') }}</div>
            <input type="number" v-model="walletId" :placeholder="$t('addWalletAddress.walletId.plaaceholder.text')">
        </div>
        <div class="sendBox relative" @click="showSelectOpt">
            <div class="title">{{ $t('addWalletAddress.verify.methods.text') }}</div>
            <div class="verifyOpt cursor " :class="{ hideBr: isShowVerifyMet }">
                <div class="vmType">{{ verifyMetVal }}</div>
                <div class="arrowBox">
                    <van-icon :name="isShowVerifyMet ? 'arrow-up' : 'arrow-down'" />
                </div>
            </div>
            <div class="verifyMethods" :class="{ showVMOpt: isShowVerifyMet }">
                <div class="itemOpt" :class="{ ioAcitve: verifyMetIndex === 0 }" @click="selectVerifyOpt(0)">{{
                    $t('addWalletAddress.verify.phone.text') }}</div>
                <div class="itemOpt" :class="{ ioAcitve: verifyMetIndex === 1 }" @click="selectVerifyOpt(1)">{{
                    $t('addWalletAddress.verify.email.text') }}</div>
            </div>
        </div>
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="number" v-model="walletId" :placeholder="$t('addWalletAddress.verify.code.text')">
                <div class="sendBtn">
                    {{ $t('forget.send') }}
                </div>
            </div>
        </div>

        <div class="confirm">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const state = reactive({
    walletType: '',
    walletId: '',
    isShowVerifyMet: false,
    verifyMetIndex: 1,
    verifyMetVal: ''
})
function selectVerifyOpt(index) {
    state.verifyMetIndex = index
    if (index === 0) {
        state.verifyMetVal = t('addWalletAddress.verify.phone.text')
    } else {
        state.verifyMetVal = t('addWalletAddress.verify.email.text')
    }
}
function showSelectOpt() {
    state.isShowVerifyMet = !state.isShowVerifyMet
}
onMounted(() => {
    if (state.verifyMetIndex === 0) {
        state.verifyMetVal = t('addWalletAddress.verify.phone.text')
    } else {
        state.verifyMetVal = t('addWalletAddress.verify.email.text')
    }
})
const { walletType, walletId, isShowVerifyMet, verifyMetIndex, verifyMetVal } = toRefs(state)
</script>
<style scoped lang='scss'>
.addWalletAddress {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    .sendBox {
        width: 100%;
        box-sizing: border-box;
        @include flex(center);
        flex-direction: column;
        margin-top: 20px;

        .title {
            width: 350px;
            display: block;
            margin: 0 auto;
            font-family: SFProText;
            font-size: 14px;
            color: #9da4b4;
        }

        input {
            width: 350px;
            height: 49px;
            border-radius: 10px;
            border: none;
            background-color: #333;
            color: #fff;
            margin-top: 8px;
            box-sizing: border-box;
            padding-left: 15px;
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
                font-family: Helvetica;
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
                font-family: SFProText;
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
    }

    .confirm {
        width: 351px;
        height: 48px;
        border-radius: 14px;
        background-color: #ff7c43;
        box-sizing: border-box;
        @include flex(center);
        font-size: 14px;
        color: #fff;
        margin: 20vh auto 0;
    }
}
</style>