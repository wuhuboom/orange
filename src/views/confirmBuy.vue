<template>
    <div class="confirmBuy maxWidth ">
        <van-divider style="margin: 0;" />
        <div class="lrPadding main">
            <div class="stepBox">
                <div class="item" :class="`${index <= stepIndex ? 'itemActive' : ''}`" v-for="(item, index ) in stepList"
                    :key="index">
                    <img :src="getImg('confirmBuy', (index <= stepIndex ? 'step1' : item.icon))" alt="">
                    <p class="stepName">{{ item.step }}</p>
                    <p class="desc apostrophe">{{ item.desc }}</p>
                </div>
            </div>
            <div class="orderSummary">
                <P class="title">Order summary</P>
                <div class="orderBox">
                    <p class="paymentTime">
                        <span>specified payment duration</span>
                        <span class="time">15 min</span>
                    </p>
                    <p class="merchant">
                        <span>merchant</span>
                        <span class="mbox">
                            <img src="" alt="">
                            <span class="name">name</span>
                            <van-icon name="arrow" color="#fff" size="20" />
                        </span>
                    </p>
                    <div class="countDown">
                        <img src="../assets/images/common/cd.webp" class="cdImg" alt="">
                        payment time <van-count-down :time="countDownTime" format="mm:ss"
                            style="color: #ff7c43;margin-left: 5px;" />
                    </div>
                </div>
            </div>
            <div class="buyUsdt">
                <P class="title">
                    <img src="../assets/images/common/usdt.webp" alt="">Order summary
                </P>
                <div class="buyInfo">
                    <p>
                        <span>total amount</span>
                        <span>100.00</span>
                    </p>
                    <p>
                        <span>unit price</span>
                        <span>7.23</span>
                    </p>
                    <p>
                        <span>order number</span>
                        <span>5656565565656</span>
                    </p>
                    <p>
                        <span>creation time</span>
                        <span>17:43:16 2023-12-13</span>
                    </p>
                </div>
            </div>
            <div class="Instructions">
                If you agree to use C2C transactions, it means you accept <span>C2C Transaction Legal Disclaimer</span>
            </div>
            <div class="btn">
                <div class="cancel">Cancel</div>
                <div class="confirm">Confirm</div>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs } from 'vue'
import { getImg } from '@/utils/utils'
const state = reactive({
    stepIndex: 1,
    stepList: [{
        icon: 'step1',
        iconActive: 'step1',
        step: 'STEP 1',
        desc: "Order has been generated"
    }, {
        icon: 'step2',
        iconActive: 'step1',
        step: 'STEP 2',
        desc: "Make payment to the seller"
    }, {
        icon: 'step3',
        iconActive: 'step1',
        step: 'STEP 3',
        desc: "waiting for the funds to arrive"
    },],
    countDownTime: 15 * 60 * 1000,
    keywords: ''
})

const { stepList, stepIndex, countDownTime } = toRefs(state)
</script>
<style scoped lang='scss'>
.confirmBuy {
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    background-color: #0b0b0b;

    .main {
        .stepBox {
            width: 100%;
            @include flex(space-between);
            margin-top: 28px;

            .item {
                width: 76px;
                @include flex(center);
                flex-direction: column;
                position: relative;

                img {
                    width: 37px;
                    height: 37px;
                }

                .stepName {
                    font-size: 10px;
                    color: #fff;
                    margin: 7px 0 5px 0;
                }

                .desc {
                    text-align: center;
                    font-size: 11px;
                    color: #8d8d8d;
                }
            }


            .item::after {
                content: '';
                display: block;
                width: 78px;
                height: 2px;
                background-color: #eeeeee;
                position: absolute;
                top: 18px;
                left: 70px;
            }

            .itemActive::after {
                background-color: #ff7c43;
            }


            .item:last-child::after {
                display: none;
            }
        }

        .orderSummary {
            margin-top: 20px;

            .title {
                font-size: 16px;
                font-weight: bold;
                color: #fff;
            }

            .orderBox {
                padding: 12px 10px 11px 16px;
                border-radius: 11px;
                background-color: #202020;
                margin-top: 12px;

                p {
                    @include flex(space-between);
                    font-size: 12px;
                    color: #8d8d8d;
                }

                .paymentTime {

                    .time {
                        color: #eee;
                        padding-right: 10px;
                    }
                }

                .merchant {
                    @include flex();

                    .mbox {
                        @include flex();

                        img {
                            width: 24px;
                            height: 24px;
                            margin-right: 6px;
                            border-radius: 50%;
                        }

                        .name {
                            margin-right: 3px;
                            color: #fff;
                        }

                    }
                }

                .countDown {
                    padding: 11.7px 18.9px 11.3px 17.7px;
                    background-color: rgba(255, 126, 70, 0.29);
                    @include flex();
                    width: fit-content;
                    font-family: Helvetica;
                    font-size: 12px;
                    letter-spacing: -0.36px;
                    color: #ff7c43;
                    border-radius: 15px;
                    margin-top: 10px;

                    .cdImg {
                        width: 17px;
                        height: 17px;
                        margin-right: 6px;
                    }
                }
            }
        }

        .buyUsdt {
            margin-top: 20px;

            .title {
                font-size: 16px;
                color: #fff;
                @include flex(flex-start);

                img {
                    width: 20px;
                    height: 20px;
                    margin-right: 7px;
                }

            }

            .buyInfo {
                padding: 13px 15px 13px 16px;
                background-color: #202020;
                border-radius: 11px;

                margin-top: 7px;

                p {
                    @include flex();
                    margin-bottom: 11px;

                    span:first-child {
                        font-size: 12px;
                        letter-spacing: -0.36px;
                        color: #909090;
                    }

                    span:last-child {
                        font-size: 12px;
                        font-family: Helvetica;
                        letter-spacing: -0.36px;
                        color: #eee;
                    }
                }

                p:last-child {
                    margin-bottom: 0;
                }
            }
        }

        .Instructions {
            font-size: 13px;
            line-height: 1.62;
            text-align: center;
            color: #9f9f9f;
            margin-top: 20px;

            span {
                color: #fff;
                text-decoration: underline;
            }
        }

        .btn {
            display: flex;
            margin-top: 20px;

            div {
                text-align: center;
                border-radius: 14px;
                border: solid 1px #fff;
                flex: 1;
                height: 48px;
                line-height: 48px;
                color: #fff;
            }

            .confirm {
                background-color: #ff7c43;
                border-color: #ff7c43;
                margin-left: 24px;
            }
        }
    }
}
</style>