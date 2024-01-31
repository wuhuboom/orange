<template>
    <div class="betPage maxWidth lrPadding">
        <div class="top_container maxWidth">
            <div class="parallelogram_wrapper">
                <span> <img src="../assets/images/betpage/mainIcon.webp" class="mainIcon" alt=""></span>
                <span><img src="../assets/images/betpage/guest.webp" class="guestIcon" alt=""></span>

            </div>
            <div class="parallelogram_wrapper">
                <div class="parallelogram_left">Liverpool</div>
                <div class="parallelogram_right">Aston Villa</div>
                <img src="../assets/images/betpage/vs.webp" class="vsImg" alt="">
            </div>
            <div class="time">
                <div class="bowling">
                    <span>1</span>
                    <span class="colon">:</span>
                    <span>0</span>
                </div>
                <span class="date">1-28-2024</span>
                <span class="t">12：00PM</span>
            </div>
        </div>
        <div class="tab">
            <div :class="{ tabActive: tabIndex === index }" v-for="(item, index) in tabArr" @click="handleClickTab(index)">
                {{ item }}</div>
        </div>
        <div class="betMain">
            <div class="betItem" v-for="(item, index) in betData[tabIndex]" :key="index"
                @click="handleBetClick(item, index)">
                <p class="score">{{ item.score }}</p>
                <div class="odds" :class="{ oddsActive: betIndex === index }">{{ item.odds }}</div>
            </div>
        </div>
        <!-- 投注面板 -->
        <div class="betPanel maxWidth" :class="{ showBetPanel: isShowBetPanel }">
            <div class="panelBar"></div>
            <div class="panel_top">
                <div class="flex left_box">
                    <div class="money">
                        <img :src="getImg('header', 'mIcon')" class="mIcon" alt="">
                        <span class="moneyNum">5093.76</span>
                    </div>
                    <div class="panel_tit">Create Order</div>
                </div>
                <van-icon name="cross" color="#fff" @click="closePanel" />
            </div>
            <div class="panel_main">
                <div class="clubs_name flex">
                    <img src="../assets/images/contest/fIcon.webp" alt="">
                    <p>Friendlies Clubs</p>
                </div>
                <div class="team flex">
                    <p class="flex">
                        <img src="../assets/images/betpage/mainIcon.webp" alt="">
                        Liverpool
                    </p>
                    <span>vs</span>
                    <p class="flex">
                        <img src="../assets/images/betpage/guest.webp" alt="">
                        Aston Villa
                    </p>
                </div>
                <div class="betDetal">
                    <p class="betScore">
                        <span>Events</span>
                        <span>0-1</span>
                    </p>
                    <p class="betOdds">
                        <span>Odds</span>
                        <span>1.83</span>
                    </p>
                </div>
                <p class="betRange">Betting Range: Minimum 10.00 - 10000.00</p>
                <p class="betWinNum">Potential winnings: <span>18.30</span></p>
                <div class="counter">
                    <div class="count-left flex">
                        <input type="number" v-model="betNum">
                        <img src="../assets/images/betpage/subtraction.webp" class="subtraction" alt="">
                        <img src="../assets/images/betpage/add.webp" class="add" alt="">
                    </div>
                    <div class="betBtn" @click="betSubmit">Confirm</div>
                </div>
                <p class="serviceFee">Service Fee：<span class="num">0</span></p>
                <p class="quickBet">Quick bets</p>
                <div class="betButton">
                    <div>100</div>
                    <div>200</div>
                    <div>ALL</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import { getImg } from '@/utils/utils'
import { showToast } from 'vant'

const successIcon = getImg('betpage', 'successIcon')

const state = reactive({
    tabIndex: 0,
    betIndex: -1,
    tabArr: ['Inverse Score', 'First Half Counter Score'],
    betData: [
        [
            {
                score: '0-1',
                odds: '4.25'
            },
            {
                score: '0-2',
                odds: '1.25'
            },
            {
                score: '0-3',
                odds: '2.25'
            },
            {
                score: '0-4',
                odds: '3.25'
            },
            {
                score: '0-5',
                odds: '4.25'
            },
            {
                score: '0-6',
                odds: '5.25'
            },
            {
                score: '0-6',
                odds: '5.25'
            },
            {
                score: '0-6',
                odds: '5.25'
            },
            {
                score: '0-6',
                odds: '5.25'
            },
        ],
        [
            {
                score: '0-1',
                odds: '4.25'
            },
            {
                score: '0-2',
                odds: '1.25'
            },
            {
                score: '0-3',
                odds: '2.25'
            },
            {
                score: '0-4',
                odds: '3.25'
            },
            {
                score: '0-5',
                odds: '4.25'
            },
            {
                score: '0-6',
                odds: '5.25'
            },
            {
                score: '0-3',
                odds: '2.25'
            },
            {
                score: '0-3',
                odds: '2.25'
            },
        ],

    ],
    betNum: 10,
    isShowBetPanel: false
})
function betSubmit() {
    showToast({
        icon: successIcon,
        iconSize: '46px',
        message: 'successfully',
        position: 'bottom',
    })
}
function closePanel() {
    state.isShowBetPanel = false
}
function handleBetClick(item, index) {
    console.log(index);
    state.betIndex = index
    state.isShowBetPanel = true
}
function handleClickTab(index) {
    state.tabIndex = index
    state.betIndex = -1
}
const { tabIndex, tabArr, betData, betIndex, betNum, isShowBetPanel } = toRefs(state)
</script>
<style scoped lang='scss'>
$bgHeight: 280px;

.betPage {
    height: 100%;
    background-color: #100f13;
    // 减去header的高度
    padding-top: calc($bgHeight - 44px);
    overflow: hidden;
    box-sizing: border-box;

    .top_container {
        width: 100%;
        height: $bgHeight;
        background: url('../assets/images/betpage/betBg.jpg')no-repeat;
        background-size: cover;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        @include flex(center);
        flex-direction: column;

        .parallelogram_wrapper {
            width: 312px;
            display: flex;
            justify-content: space-between;
            position: relative;

            >div {
                width: 156px;
                height: 30px;
                position: absolute;
                @include flex(center);
                font-size: 14px;
                font-weight: 500;
                font-style: italic;
                letter-spacing: 0.55px;
                color: #fff;
            }

            .parallelogram_left {
                top: 0;
                left: 8px;
                background: url('../assets/images/betpage/tangerine.webp')no-repeat;
                background-size: cover;
                box-sizing: border-box;
            }

            .parallelogram_right {
                top: 0;
                right: 5px;
                background: url('../assets/images/betpage/blue.webp')no-repeat;
                background-size: cover;
                box-sizing: border-box;
            }

            .vsImg {
                width: 57px;
                height: 90px;
                position: absolute;
                top: -30px;
                left: 51%;
                transform: translateX(-50%);
                mix-blend-mode: color-dodge;
            }

            span {
                flex: 1;
                margin-bottom: 5px;

                .mainIcon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto;
                }

                .guestIcon {
                    @extend .mainIcon;
                }

            }

            span:first-child {
                padding-left: 8px;
            }

            span:last-child {
                padding-right: 5px;
            }
        }



        .time {
            margin-top: 58px;
            font-size: 15px;
            letter-spacing: 1.73px;
            color: #fff;
            margin-left: -8px;

            .bowling {
                font-size: 36px;
                font-weight: bold;
                font-style: italic;
                color: #fff;
                @include flex(center);
                margin-bottom: 4px;

                .colon {
                    font-style: normal;
                    margin: 0 25px;
                }
            }

            .date {
                margin-right: 20px;
            }
        }
    }

    .tab {
        margin-top: 26px;
        @include flex(space-between);
        font-size: 14px;
        color: #fff;
        cursor: pointer;

        div {
            flex: 1;
            @include flex(center, center);
            border-bottom: 1px solid #404247;
            padding-bottom: 12px;
        }

        .tabActive {
            color: #ff7c43;
            border-color: #ff7c43;
            ;
        }
    }

    .betMain {
        margin-top: 24px;
        // height: calc(100% - 357px);
        @include flex(flex-start);
        flex-wrap: wrap;
        font-size: 14px;
        color: #fff;

        .betItem {
            width: 108px;
            margin-right: 13px;

            .score {
                font-size: 13px;
                color: #a6a9b8;
                text-align: center;
                margin-bottom: 9px;
            }

            .odds {
                padding: 10px 40px 11px 41px;
                border-radius: 7.5px;
                background-color: #3d3d3d;
                margin-bottom: 14px;
                border: 1px solid #3d3d3d;
            }

            .oddsActive {
                color: #ff7c43;
                border-color: #ff7c43;
            }
        }

        .betItem:nth-of-type(3n) {
            margin: 0;
        }
    }

    .betPanel {
        position: fixed;
        left: 50%;
        bottom: 0;
        height: 0;
        background-color: #1c1b20;
        box-sizing: border-box;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        transition: height .5s ease-out;
        transform: translateX(-50%);

        .panelBar {
            width: 35px;
            height: 5px;
            margin: 8px auto 10px;
            border-radius: 3px;
            background-color: #3b3a42;
        }

        .panel_top {
            padding: 0 16px;
            @include flex();
            border-bottom: 1px solid #313038;
            padding-bottom: 15px;

            .left_box {
                align-items: center;

                .money {
                    width: fit-content;
                    height: 32px;
                    @include flex();
                    margin-right: 23px;
                    border-radius: 16px;
                    background-color: #2b2b2b;
                    padding: 0px 9px 0px 4px;

                    .moneyNum {
                        margin: 0px 0 0px 6px;
                        font-family: Roboto;
                        font-size: 14px;
                        color: #fff;
                    }

                    .mIcon {
                        width: 24px;
                        height: 24px;
                    }
                }

                .panel_tit {
                    font-family: SegoeUI;
                    font-size: 17px;
                    font-weight: 600;
                    letter-spacing: -0.17px;
                    color: #fff;
                    margin-left: 15px;
                }

            }
        }

        .panel_main {
            padding: 0 16px;

            .clubs_name {
                margin-top: 18px;
                align-items: center;
                padding-left: 5px;

                img {
                    width: 16px;
                    height: 16px;
                }

                p {
                    font-size: 14px;
                    color: #8d8d8d;
                    margin-left: 5px;
                }
            }

            .team {
                align-items: center;
                margin-top: 15px;

                p {
                    align-items: center;
                    font-size: 14px;
                    color: #fff;

                    img {
                        width: 22px;
                        height: 22px;
                    }
                }

                span {
                    font-size: 12px;
                    color: #fff;
                    margin: 0 11px 0;
                }
            }

            .betDetal {
                border-radius: 8px;
                background-color: #24232a;
                padding: 9px 10px 8px 12px;
                margin-top: 15px;

                p {
                    @include flex(space-between);
                    font-size: 14px;
                    color: #9f9f9f;

                    span:last-child {
                        font-size: 14px;
                        font-weight: bold;
                        letter-spacing: -0.14px;
                        color: #fff;
                    }
                }

                .betOdds {
                    margin-top: 5px;

                }
            }

            .betRange {
                font-size: 14px;
                color: #9f9f9f;
                margin-top: 16px;
            }

            .betWinNum {
                margin: 7px 0 12px 0;
                font-family: SegoeUI;
                font-size: 14px;
                letter-spacing: -0.14px;
                color: #fff;

                span {
                    font-weight: bold;
                }
            }

            .counter {
                @include flex(space-between);

                .count-left {
                    flex: 1;
                    height: 36px;
                    background-color: #24232a;
                    align-items: center;
                    padding-right: 5px;
                    border-radius: 8px;

                    input {
                        width: 150px;
                        border: none;
                        outline: none;
                        background-color: #24232a;
                        color: #fff;
                        padding-left: 12px;
                    }

                    img {
                        width: 28px;
                        height: 28px;
                    }

                    .subtraction {}

                    .add {
                        margin-left: 8px;
                    }
                }

                .betBtn {
                    width: 110px;
                    height: 36px;
                    text-align: center;
                    line-height: 36px;
                    margin: 0 4px 0 7px;
                    border-radius: 8px;
                    background-color: #ff7c43;
                    font-size: 14px;
                    font-weight: bold;
                    letter-spacing: -0.14px;
                    color: #fff;
                }
            }

            .serviceFee {
                margin-top: 8px;
                font-size: 14px;
                color: #a6a9b8;

                span {
                    color: #fff;
                }
            }

            .quickBet {
                font-size: 14px;
                color: #e2e2e2;
                margin-top: 12px;
            }

            .betButton {
                @include flex();
                margin-top: 6px;

                div {
                    width: 110px;
                    height: 36px;
                    text-align: center;
                    line-height: 36px;
                    margin: 0 5px 14px 0px;
                    border-radius: 8px;
                    background-color: #4d5fff;
                    font-size: 14px;
                    color: #fff;
                }
            }
        }
    }

    .showBetPanel {
        height: 460px;
    }
}
</style>