<template>
    <div class="orderStatus maxWidth lrPadding">
        <!-- 取消订单成功 ， 和交易成功是一个页面 -->
        <!-- <div>
            <div class="title">
                Cancel order
            </div>
            <p class="text">You have voluntarily canceled the order.</p>
            <div class="cancellationReason">
                <p class="reason">Cancellation reason:</p>
                <p class="reasonText">I no longer want to purchase.</p>
            </div>
            <p class="buyUsdt">
                <img src="../assets/images/common/usdt.webp" alt="">
                BUY USDT
            </p>
            <div class="cList">
                <p>
                    <span>total amount</span>
                    <span>100.000.00</span>
                </p>
                <p>
                    <span>unit price</span>
                    <span>7.23</span>
                </p>
                <p>
                    <span>order number</span>
                    <span>232656598989</span>
                </p>
                <p>
                    <span>creation time</span>
                    <span>17:43:16 2023-12-13</span>
                </p>
                <p>
                    <span>seller’s name</span>
                    <span>Nana</span>
                </p>
            </div>
        </div> -->

        <div class="title">
            <img src="../assets/images/common/check.webp" class="check" alt="">
            Completed
        </div>
        <p class="text">You have successfully purchased 56.93 USDT.</p>
        <div class="completed">
            <p class="Ctitle"><span class="">Buy </span>USDT</p>
            <div class="top cList">
                <p>
                    <span>unit price</span>
                    <span>100.000.00</span>
                </p>
                <p>
                    <span>quantity</span>
                    <span>7.23</span>
                </p>
                <p>
                    <span>total amount</span>
                    <span class="amount">
                        $122
                        <img src="../assets/images/common/copy.webp" alt="">
                    </span>
                </p>
                <p>
                    <span>payment method</span>
                    <span>17:43:16 2023-12-13</span>
                </p>
            </div>
            <van-divider />
            <div class="top cList">
                <p>
                    <span>seller’s nickname</span>
                    <span class="flex">
                        Nana
                        <img src="../assets/images/common/avatar.webp" alt="">
                        <van-icon name="arrow" color="#fff" size="20" />
                    </span>
                </p>
                <p>
                    <span>order number</span>
                    <span class="orderNo">
                        23102326565989
                        <img src="../assets/images/common/copy.webp" alt="">
                    </span>
                </p>
                <p>
                    <span>creation time</span>
                    <span>10/21/2023 22:00:56</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script setup >
</script>
<style scoped lang='scss'>
.orderStatus {
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    background-color: #111111;

    .title {
        font-family: SegoeUI;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        margin-top: 26px;
        @include flex(flex-start);

        .check {
            width: 26px;
            height: 26px;
            margin-right: 9px;
        }
    }

    .text {
        font-family: SegoeUI;
        font-size: 14px;
        color: #8d8d8d;
        margin: 13px 0;
    }

    .cancellationReason {
        height: 86px;
        padding: 1.3px 0 19.3px;
        border-radius: 10px;
        background-color: #1a1a1a;
        padding: 17px 0 20px 15px;
        box-sizing: border-box;

        .reason {
            font-family: SegoeUI;
            font-size: 14px;
            color: #9f9f9f;
        }

        .reasonText {
            font-family: SegoeUI;
            font-size: 14px;
            color: #fff;
            margin-top: 19px;
        }
    }

    .buyUsdt {
        font-family: SegoeUI;
        font-size: 14px;
        color: #fff;
        @include flex(flex-start);
        margin-top: 38px;

        img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }
    }

    .cList {
        padding: 20px 9px 19px 12px;
        border-radius: 10px;
        background-color: #1a1a1a;
        margin-top: 18px;

        p {
            @include flex();
            margin-bottom: 24px;

            span:first-child {
                font-family: SegoeUI;
                font-size: 13px;
                color: #9f9f9f;
            }

            span:last-child {
                font-family: SegoeUI;
                font-size: 13px;
                color: #fff;
            }
        }

        p:last-child {
            margin-bottom: 0;
        }
    }

    .completed {
        border-radius: 10px;
        background-color: #1a1a1a;
        margin-top: 15px;
        box-sizing: border-box;

        .Ctitle {
            font-family: SegoeUI;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.16px;
            color: #fff;

            span {
                color: #ff7c43;
            }
        }

        .top {
            padding: 18px 10px 20px 12px;
            box-sizing: border-box;

            .flex {
                align-items: center;

                img {
                    width: 24px;
                    height: 24px;
                    margin: 0 3px 0 7px;
                }
            }

            .orderNo {
                display: flex;
                align-items: center;

                img {
                    width: 20px;
                    height: 20px;
                    margin-left: 5px;
                }
            }

            .amount {
                display: flex;
                align-items: center;

                img {
                    width: 20px;
                    width: 20px;
                    margin-left: 5px;
                }
            }
        }
    }
}
</style>