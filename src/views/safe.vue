<template>
    <div class="safe maxWidth lrPadding">
        <div class="relative cardBox">
            <div class="cardBg1"></div>
            <div class="cardBg2"></div>
            <div class="card">
                <div class="cb">
                    balance
                    <img src="../assets/images/safe/refresh.webp" class="refresh" alt="">
                </div>
                <div class="moneyusd">
                    {{ getAmount(safeData?.money) || 0 }} <span class="usd">{{ safeData?.symbol ||
                        'USDT' }}</span>
                </div>
                <div class="Cbottom">
                    <p>
                        <span>Today’s amount</span>
                        <span>Cumulative amount</span>
                    </p>
                    <p class="num">
                        <span>{{ getAmount(safeData?.todayIncome) || 0 }}</span>
                        <span>{{ getAmount(safeData?.totalIncome) || 0 }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="menubox">
            <div class="item" v-for="(item, index) in menu" :key="index">
                <img :src="getImg('safe', item.name.toLocaleLowerCase())" alt="">
                <p>{{ item.name }}</p>
            </div>
        </div>
        <p class="title">illustrate</p>
        <p class="text">
            1. The safe is independent of the footballaccount, and the balance of the footballaccount cannot be transferred
            to the safe
        </p>
        <p class="text">
            2. Transfer function: transfer the money in thesafe to the football account
        </p>
        <p class="text">
            3. Get the latest payment account for eachrecharge
        </p>
        <p class="text">
            4. The transfer function is that you can enterthe player’s username to transfer money to it
        </p>
    </div>
</template>
<script setup >
import { toRefs, reactive } from 'vue'
import { getImg, getAmount } from '@/utils/utils'
import http from '@/utils/axios'
const state = reactive({
    menu: [
        {
            name: 'Send',
        },
        {
            name: 'Recharge',
        },
        {
            name: 'Buy',
        },
        {
            name: 'Transfer',
        },
    ],
    safeData: {}
})
getSafeInfo()
async function getSafeInfo() {
    let url = '/player/safe/info'
    try {
        const res = await http.get(url)
        console.log(
            '%c res : ',
            'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
            res
        )
        if (res?.id) {
            state.safeData = res
        }
    } catch (error) {
        console.log(error);
    }
}
const { menu, safeData } = toRefs(state)
</script>
<style scoped lang='scss'>
.safe {
    height: 100%;
    overflow: auto;
    background-color: $mainBg;
    box-sizing: border-box;

    .cardBox {
        width: 100%;
        box-sizing: border-box;

        .cardBg1 {
            width: 276px;
            height: 147px;
            position: absolute;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.2;
            border-radius: 20px;
            background-image: linear-gradient(to right, #ff6c00, #ffa031);
        }

        .cardBg2 {
            width: 316px;
            height: 168px;
            position: absolute;
            top: 32px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.2;
            border-radius: 20px;
            background-image: linear-gradient(to right, #ff6c00, #ffa031);
        }

        .card {
            width: 350px;
            height: 186px;
            position: absolute;
            top: 47px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 12px;
            background-image: linear-gradient(to right, #ff6c00, #ffa031);
            padding: 30px 25px 13px 23px;
            box-sizing: border-box;
            font-size: 15px;
            color: #fff;

            .cb {
                @include flex(flex-start);

                .refresh {
                    width: 35px;
                    height: 35px;
                }
            }

            .moneyusd {
                font-size: 31px;
                font-weight: bold;
                color: #fff;

                span {
                    font-size: 15px;
                }
            }

            .Cbottom {
                margin-top: 30px;

                p {
                    @include flex(space-between);

                    span {
                        width: 50%;
                    }
                }

                .num {
                    margin-top: 10px;
                }
            }
        }

    }

    .menubox {
        margin-top: 253px;
        @include flex();

        .item {
            @include flex();
            flex-direction: column;

            img {
                width: 60px;
                height: 60px;
            }

            p {
                font-size: 14px;
                color: #fff;
                margin-top: 5px;
            }
        }
    }

    .title {
        margin-top: 12vh;
        font-size: 18px;
        color: #fff;
        margin-bottom: 10px;
    }

    .text {
        font-size: 12px;
        line-height: 1.33;
        color: #a6a6a6;
    }
}
</style>