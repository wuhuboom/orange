<template>
    <div class="addWalletAddress maxWidth lrPadding">
        <div class="sendBox">
            <div class="title">Type</div>
            <input type="number" v-model="walletType" placeholder="请输入钱包类型">
        </div>
        <div class="sendBox">
            <div class="title">Wallet ID</div>
            <input type="number" v-model="walletId" placeholder="请输入钱包id">
        </div>
        <div class="sendBox">
            <div class="title">Please select verification method</div>
            <div class="verifyOpt cursor">
                <input type="number" v-model="walletId" placeholder="Email verification method">
                <div class="arrowBox">
                    <van-icon name="arrow-down" />
                </div>
            </div>
        </div>
        <div class="sendBox">
            <div class="verifyOpt cursor">
                <input type="number" v-model="walletId" placeholder="Enter Verification Code">
                <div class="sendBtn">
                    Send
                </div>
            </div>
        </div>

        <div class="confirm">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, } from 'vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const state = reactive({
    walletType: '',
    walletId: ''
})
const { walletType, walletId } = toRefs(state)
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