<template>
    <div class="purchaseAmount maxWidth ">
        <div class="textBox">
            <p>purchase amount</p>
            <p>limit range 100.00-10000.00</p>
        </div>
        <div class="moneyInput" :class="{ errorStyle: isError }">
            <div class="top">
                <div class="opt">
                    <span>Max</span>
                    <span>Half</span>
                </div>
                <div class="obtain">obtain 0.00 USD</div>
            </div>
            <input type="number" v-model="money">
        </div>
        <div class="buy" :class="{ isDisabled: money <= 0 }" @click="toPage">
            BUY
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/utils/axios'
const router = useRouter()
const route = useRoute()
const state = reactive({
    money: 0,
    isError: false,
})
function toPage() {
    router.push({
        path: '/confirmBuy'
    })
}
getPageInfo()
async function getPageInfo() {
    let url = '/player/fb/info/saler'
    let data = {
        id: route.query.id
    }
    try {
        const res = await http.post(url, data)
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}
const { money, isError } = toRefs(state)
</script>
<style scoped lang='scss'>
.purchaseAmount {
    height: 100%;
    background-color: #27272a;
    box-sizing: border-box;
    overflow: auto;

    .textBox {
        p {
            height: 45px;
            line-height: 45px;
            padding-left: 12px;
            font-family: SegoeUI;
            font-size: 13px;
            color: #fff;
        }

        p:first-child {
            border-bottom: 1px solid rgba(93, 86, 105, 0.48);
        }

        p:last-child {
            font-family: SegoeUI;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.48);
        }
    }

    .moneyInput {
        padding: 11.5px 12.9px 13px 11.5px;
        border-radius: 15.5px;
        border: solid 1px rgba(255, 255, 255, 0.08);
        margin: 13px 20px 0 12px;
        background-color: #1e1e20;

        .top {
            @include flex(space-between);

            .opt {
                span {
                    height: 20px;
                    line-height: 20px;
                    padding: 0 9px;
                    border-radius: 10px;
                    background-color: rgba(93, 86, 105, 0.48);
                    font-family: SegoeUI;
                    font-size: 12px;
                    color: #dbd6e3;
                    margin-right: 5px;
                }
            }

            .obtain {
                font-family: SegoeUI;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.48);
            }
        }

        input {
            outline: none;
            background-color: #1e1e20;
            border: none;
            font-family: SegoeUI;
            font-size: 24px;
            color: rgba(255, 255, 255, 0.36);
            margin-top: 15px;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    .errorStyle {
        border: solid 1px #fe7b42;

        input {
            color: #fe7b42;
        }
    }

    .buy {
        margin: 12px 0 0 12px;
        width: 85px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 16px;
        background-color: #f87871;
        font-family: SegoeUI;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
    }

    .isDisabled {
        opacity: 0.3;
    }
}
</style>