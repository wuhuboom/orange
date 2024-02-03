<template>
    <div class="buy">
        <div class="sort">
            <div class="text">
                buy
            </div>
            <div class="buySort relative">
                <span>Sort By</span>
                <div class="Transaction" @click="showSelect = !showSelect">
                    Transaction Rate
                    <img src="../assets/images/buy/arrowBuy.webp" alt="">
                </div>
                <div class="select" :class="{ addSelectClass: showSelect }">
                    <p>trade volume</p>
                    <p>trade volume</p>
                    <p>trade volume</p>
                    <p>trade volume</p>
                </div>
            </div>
        </div>
        <van-divider style="margin-top: 0;" />
        <div class="list lrPadding">
            <div class="list-item">
                <div class="top">
                    <div class="user">
                        <div class="avatar"></div>
                        <div class="name wrap">name</div>
                    </div>
                    <div class="price">
                        <p>price</p>
                        <p class="num">7.12</p>
                    </div>
                    <div class="quantity">
                        <p>quantity</p>
                        <p class="num">2,061.00</p>
                    </div>
                    <div class="transaction">
                        <p>transaction</p>
                        <p class="num">90%</p>
                    </div>
                </div>
                <div class="bottom">
                    <div>payment：Adapay VISA</div>
                    <div>buy</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs } from "vue";
const state = reactive({
    showSelect: false
})
const { showSelect } = toRefs(state)
</script>
<style scoped lang='scss'>
.buy {
    height: 100%;
    overflow: auto;
    background-color: #27272a;

    .sort {
        @include flex();
        padding: 10px 12px 10px;

        .text {
            font-family: SegoeUI;
            font-size: 13px;
            color: #fff;
        }

        .buySort {
            font-family: SegoeUI;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.48);
            @include flex();

            .Transaction {
                box-sizing: border-box;
                // width: 115px;
                height: 23px;
                padding: 4px 6px 5px 8px;
                border-radius: 8px;
                background-color: rgba(93, 86, 105, 0.48);
                @include flex();
                margin-left: 15px;

                img {
                    width: 14px;
                    height: 14px;
                    margin-left: 4px;
                }
            }

            .select {
                width: 120px;
                position: absolute;
                right: 0;
                top: 28px;
                border-radius: 8px;
                background-color: #403d48;
                z-index: 3;
                max-height: 0;
                overflow: hidden;
                transition: max-height .5s ease-out;

                p {
                    height: 27px;
                    line-height: 27px;
                    padding-left: 8px;
                }

                .pActive {
                    color: #ff7c43;

                }
            }

            .addSelectClass {
                max-height: 140px;
            }
        }


    }

    .list {

        .list-item {
            height: 82.5px;
            padding: 8px 10px 10px 10px;
            border-radius: 11px;
            border: solid 1px rgba(255, 255, 255, 0.08);
            background-color: #131317;
            @include flex();
            flex-direction: column;

            .top {
                @include flex();
                width: 100%;

                .user {
                    @include flex();

                    .avatar {
                        width: 28px;
                        height: 28px;
                        background-color: red;
                        border-radius: 50%;
                    }

                    .name {
                        width: 40px;
                        height: 26px;
                        font-size: 11px;
                        color: #fff;
                        margin-left: 3px;
                    }
                }

                .price {
                    p {
                        font-size: 10px;
                        color: rgba(255, 255, 255, 0.48);

                    }

                    .num {
                        font-size: 12px;
                        color: #69cfb5;
                        margin-top: 10px;
                        text-align: center;
                    }
                }

                .quantity {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.48);

                    .num {
                        font-family: SegoeUI;
                        font-size: 12px;
                        color: #f87871;
                        margin-top: 10px;
                        text-align: center;

                    }
                }

                .transaction {

                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.48);

                    .num {
                        font-family: SegoeUI;
                        font-size: 12px;
                        color: #fff;
                        margin-top: 10px;
                        text-align: center;
                    }
                }
            }

            .bottom {
                width: 100%;
                @include flex();

                div:first-child {
                    font-size: 12px;
                    color: #a2a0a8;
                }

                div:last-child {
                    width: 70px;
                    height: 23px;
                    text-align: center;
                    line-height: 23px;
                    border-radius: 8px;
                    background-color: #ff7c43;
                    font-family: SegoeUI;
                    font-size: 11px;
                    color: #fff;
                }
            }
        }
    }
}
</style>