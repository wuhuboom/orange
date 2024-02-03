<template>
    <div class="send maxWidth lrPadding">
        <div class="sendBox">
            <div class="title">please enter the amount</div>
            <input type="text" v-model="amount" placeholder="please enter amount">
        </div>
        <div class="balance">
            <p>
                Current exchang rate:: <span class="money">56556.3</span>
            </p>
        </div>
        <div class="balance">
            <p>
                Actual receivedamount：: <span class="money">56556.3</span>
            </p>
        </div>
        <div class="confirm" @click="toPage">
            Confirm
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, } from 'vue'
import { useRouter } from "vue-router";
const router = useRouter()
const state = reactive({
    useName: '',
    amount: '0.0',
    payPwd: ''
})
function toPage() {
    router.push({
        path: '/swapInfo'
    })
}
const { useName, amount, payPwd } = toRefs(state)
</script>
<style scoped lang='scss'>
.send {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    padding-top: 20px;

    // @include flex();
    // flex-direction: column;
    .sendBox {
        width: 100%;
        box-sizing: border-box;
        @include flex(center);
        flex-direction: column;

        .title {
            width: 350px;
            text-align: left;
            font-size: 14px;
            color: #fff;
            display: block;
            margin: 0 auto;
        }

        input {
            width: 350px;
            height: 49px;
            border-radius: 10px;
            border: solid 1px #ff7c43;
            background-color: #333;
            color: #fff;
            margin-top: 8px;
            box-sizing: border-box;
            padding-left: 15px;
        }
    }

    .arrow-down {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        background-color: #333;
        margin: 26px auto 15px;
    }

    .balance {
        width: 350px;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #8a929a;
        @include flex(space-between);
        margin: 14px auto 34px;

        .money {
            color: #fff;
        }

        .all {
            color: #ff7c43;
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
        margin: 40vh auto 0;
    }
}
</style>