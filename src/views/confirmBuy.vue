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
            <!-- step === 0 -->
            <div class="orderSummary" v-if="stepIndex === 0">
                <P class="title">Order summary</P>
                <div class="orderBox">
                    <p class="paymentTime">
                        <span>specified payment duration</span>
                        <span class="time">15 min</span>
                    </p>
                    <p class="merchant">
                        <span>merchant</span>
                        <span class="mbox">
                            <img src="../assets/images/common/avatar.webp" alt="">
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
            <div class="buyUsdt step0" v-if="stepIndex === 0 || stepIndex === 2">
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
            <div class="Instructions" v-if="stepIndex === 0">
                If you agree to use C2C transactions, it means you accept <span>C2C Transaction Legal Disclaimer</span>
            </div>
            <!-- step ===  -->
            <div class="orderSummary step1" v-if="stepIndex === 1 || stepIndex === 2">
                <P class="title">Please make payment to the seller</P>
                <div class="orderBox setp1">
                    <div class="order_left" v-if="stepIndex === 1">
                        <p>100.000.00 <img src="../assets/images/common/copy.webp" class="copyImg" alt=""></p>
                        <p>payment time：<span class="tangerine">14:59</span></p>
                    </div>
                    <div class="order_left" v-if="stepIndex === 2">
                        <div class="flex" style="align-items: center;">
                            <img src="../assets/images/common/avatar.webp" style="width: 45px; height: 45px;" alt="">
                            <span style="color: #fff;margin-left: 11px;font-size: 12px;">Name</span>
                        </div>
                    </div>
                    <div class="order_right">
                        <img src="../assets/images/common/contact.webp" class="contact" alt="">
                        Contact
                    </div>
                </div>
            </div>
            <!-- step 2 -->
            <div class="buyUsdt step2" v-if="stepIndex === 1 || stepIndex === 2">
                <div class="buyInfo">
                    <p>
                        <span>name of the bank</span>
                        <span>100.00
                            <img src="../assets/images/common/copy.webp" alt="">
                        </span>
                    </p>
                    <p>
                        <span>payment method</span>
                        <span style="padding-right: 30px;">
                            7.23
                        </span>
                    </p>
                    <p>
                        <span>name</span>
                        <span>
                            5656565565656
                            <img src="../assets/images/common/copy.webp" alt="">
                        </span>
                    </p>
                    <p>
                        <span>Bank Account Number</span>
                        <span>
                            17:43:16 2023-12-13
                            <img src="../assets/images/common/copy.webp" alt="">
                        </span>
                    </p>
                    <p>
                        <span>order number</span>
                        <span style="padding-right: 30px;">
                            17:43:16 2023-12-13
                        </span>
                    </p>
                </div>
            </div>
            <div class="friendly" v-if="stepIndex === 1">
                <p class="ftitle">Friendly reminder</p>
                <p class="ftext">Please ensure that the name on the payment card matches the real-name information on the
                    platform. If
                    they don’t match, the seller has the right not to release the coins.</p>
                <p class="ftext">Please confirm that you have transferred the payment to the other party. If you click
                    ‘Paid’ without
                    completing the transfer, it may result in your account being frozen!</p>
            </div>
            <div class="btn">
                <div class="cancel" v-if="stepIndex === 0 || stepIndex === 1" @click="toCancelOrder">Cancel</div>
                <div class="cancel" v-if="stepIndex === 2">Customer service</div>
                <div class="confirm" @click="selectPayMet" v-if="stepIndex === 0">Confirm</div>
                <div class="confirm" v-if="stepIndex === 1">Payment made</div>
            </div>
        </div>
        <van-popup class="buyPop" position="bottom" v-model:show="showPayMethod">
            <template #default>
                <div class="content">
                    <div class="line"></div>
                    <p class="title">payment method</p>
                    <van-divider style="margin: 0;" />
                    <div class="pList">
                        <p class="pActive" @click="clickPayMet">MasterCard</p>
                        <p>American Express</p>
                        <p>VISA</p>
                        <p>RuPay</p>
                        <p>Paytm</p>
                    </div>
                </div>
            </template>
        </van-popup>
    </div>
</template>
<script setup >
import { reactive, toRefs } from 'vue'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router'
const router = useRouter()
const state = reactive({
    stepIndex: 0,
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
    showPayMethod: false
})
function selectPayMet() {
    state.showPayMethod = true
}
function clickPayMet() {
    console.log(12);
    state.showPayMethod = false
}
function toCancelOrder() {
    router.push({
        path: '/cancelOrder'
    })
}
const { stepList, stepIndex, countDownTime, showPayMethod } = toRefs(state)
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

            .setp1 {
                @include flex(space-between);

                .order_left {
                    p {
                        font-size: 16px;
                        font-weight: bold;
                        letter-spacing: -0.48px;
                        color: #eee;

                        .copyImg {
                            width: 20px;
                            height: 20px;
                        }

                        .tangerine {
                            font-size: 12px;
                            font-weight: bold;
                            letter-spacing: -0.36px;
                            color: #ff713b;
                        }
                    }

                    p:first-child {
                        margin-bottom: 9px;
                    }
                }

                .order_right {
                    height: 27px;
                    border-radius: 11px;
                    background-color: #ff7e46;
                    @include flex();
                    font-size: 12px;
                    color: #fff;
                    padding: 0 25px;

                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                    }
                }

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
                    font-family: $fontFamily;
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
                        font-family: $fontFamily;
                        letter-spacing: -0.36px;
                        color: #eee;
                        @include flex();

                        img {
                            width: 20px;
                            height: 20px;
                            margin-left: 10px;
                        }


                    }


                }

                p:last-child {
                    margin-bottom: 0;
                }
            }
        }

        .friendly {
            margin-top: 30px;

            .ftitle {
                font-size: 18px;
                color: #fff;
            }

            .ftext {
                font-size: 12px;
                line-height: 1.33;
                color: #a6a6a6;
                margin-top: 10px;
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

    :deep(.buyPop) {
        width: 100%;

        .content {
            width: 100%;
            background-color: #202020;
            padding-top: 8px;

            .line {
                width: 35px;
                height: 5px;
                border-radius: 3px;
                background-color: #3b3a42;
                margin: 0px auto 18px;
            }

            .title {
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                text-align: center;
                padding-bottom: 20px;
            }

            .pList {
                padding: 0 28px;

                p {
                    text-align: left;
                    height: 56px;
                    line-height: 56px;
                    font-size: 17px;
                    letter-spacing: -0.17px;
                    color: #fff;
                    border-bottom: 1px solid #313038;
                    padding-left: 24px;
                }

                .pActive {
                    border-radius: 8px;
                    background-color: #ff7c43;
                }
            }
        }
    }
}

.w20 {
    width: 20px;
    height: 20px;
    margin-left: 10px;

}
</style>