<template>
    <div class="betPage maxWidth lrPadding">
        <div class="top_container maxWidth">
            <div class="parallelogram_wrapper">
                <span v-if="gameInfo?.game"> <img :src="gameInfo?.game?.mainLogo" class="mainIcon" alt=""></span>
                <span v-if="gameInfo?.game"><img :src="gameInfo?.game?.guestLogo" class="guestIcon" alt=""></span>

            </div>
            <div class="parallelogram_wrapper">
                <div class="parallelogram_left" v-if="gameInfo?.game">{{ getSplitName(gameInfo?.game?.mainName) }}</div>
                <div class="parallelogram_right" v-if="gameInfo?.game">{{ getSplitName(gameInfo?.game?.guestName) }}</div>
                <img src="../assets/images/betpage/vs.webp" class="vsImg" alt="">
            </div>
            <div class="time">
                <div class="bowling" v-if="betPreData?.lossPerCent">
                    <span>{{ betPreData?.lossPerCent?.scoreHome }}</span>
                    <span class="colon">:</span>
                    <span>{{ betPreData?.lossPerCent?.scoreAway }}</span>
                </div>
                <span class="date">{{ formatDate(gameInfo?.game?.startTime, 'YYYY-MM-DD') }}</span>
                <span class="t">{{ formatDate(gameInfo?.game?.startTime, 'HH:mm') }}{{ getAmOrPm(gameInfo?.game?.startTime)
                }}</span>
            </div>
        </div>
        <div class="tab">
            <div :class="{ tabActive: tabIndex === index }" v-for="(item, index) in tabArr" @click="handleClickTab(index)">
                {{ item }}</div>
        </div>
        <div class="betMain">
            <div class="betItem" v-for="(item, index) in betData" :key="index" @click="handleBetClick(item, index)">
                <p class="score">{{ item.scoreHome }}-{{ item.scoreAway }}</p>
                <div class="odds" :class="{ oddsActive: betIndex === index }">{{ item.antiPerCent }}</div>
            </div>
        </div>
        <!-- 投注面板 -->
        <div class="betPanel maxWidth" :class="{ showBetPanel: isShowBetPanel }">
            <div class="panelBar"></div>
            <div class="panel_top">
                <div class="flex left_box">
                    <div class="money">
                        <img :src="getImg('header', 'mIcon')" class="mIcon" alt="">
                        <span class="moneyNum">{{ accountInfo?.currRate }}</span>
                    </div>
                    <div class="panel_tit">{{ $t('betPage.create.order.text') }}</div>
                </div>
                <van-icon name="cross" color="#fff" @click="closePanel" />
            </div>
            <div class="panel_main">
                <div class="clubs_name flex">
                    <img src="../assets/images/match/fIcon.webp" alt="">
                    <p>{{ gameInfo?.game?.allianceName }}</p>
                </div>
                <div class="team flex">
                    <p class="flex">
                        <img :src="gameInfo?.game?.mainLogo" alt="">
                        {{ gameInfo?.game?.mainName }}
                    </p>
                    <span>vs</span>
                    <p class="flex">
                        <img :src="gameInfo?.game?.guestLogo" alt="">
                        {{ gameInfo?.game?.guestName }}
                    </p>
                </div>
                <div class="betDetal">
                    <p class="betScore">
                        <span>{{ $t('betPage.panel.events.text') }}</span>
                        <span>{{ betPreData?.lossPerCent?.scoreHome }}-{{ betPreData?.lossPerCent?.scoreAway }}</span>
                    </p>
                    <p class="betOdds">
                        <span>{{ $t('bet.detail.odds.text') }}</span>
                        <span>{{ targetBetOpt.antiPerCent }}</span>
                    </p>
                </div>
                <p class="betRange"
                    :class="{ errorStyle: (errorTips?.code === 103 && errorTips?.msgkey === 'betMoneyTooMuch') }">
                    {{ $t('betPage.betting.range.minimum.text') }} {{ gameInfo?.game?.minBet }} - {{ gameInfo?.game?.maxBet
                    }}
                </p>
                <p class="betWinNum">{{ $t('betPage.potential.winnings.text') }}: <span>{{ potentialWinnings }}</span></p>
                <div class="counter">
                    <div class="count-left flex">
                        <input type="number" v-model="betNum" @input="getWinMoney">
                        <img src="../assets/images/betpage/subtraction.webp" class="subtraction" alt=""
                            @click="subtraction">
                        <img src="../assets/images/betpage/add.webp" class="add" alt="" @click="add">
                    </div>
                    <div class="betBtn cursor" @click="betSubmit">{{ $t('modal.confirm.text') }}</div>
                </div>
                <p class="serviceFee">{{ $t('match.order.detail.proce.fee.text') }}：<span class="num">{{
                    betPreData?.betHandMoneyRate }}</span></p>
                <p class="quickBet">{{ $t('betPage.quick.bets.text') }}</p>
                <div class="betButton">
                    <div @click="quickBets(betPreData?.fastMoney)">{{ betPreData?.fastMoney }}</div>
                    <div @click="quickBets('all')">{{ $t('order.search.all.text') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs, computed } from 'vue'
import { getImg, getSplitName, getAmOrPm, formatDate } from '@/utils/utils'
import { showToast } from 'vant'
import { useRoute } from 'vue-router'
import http from '@/utils/axios'
import { useStore } from '@/stores/index'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const store = useStore()

const accountInfo = computed(() => store.accountInfo)
const tabArr = computed(() => {
    return [
        t('match.cmopetition.score.text'),
        t('match.cmopetition.half.score.text')
    ]
})
const successIcon = getImg('betpage', 'successIcon')

const route = useRoute()

const state = reactive({
    tabIndex: 0,
    betIndex: -1,
    betData: [],
    betNum: 0,
    isShowBetPanel: false,
    gameInfo: {},//游戏详情
    firstHalfScore: [],
    secondHalfScore: [],
    targetBetOpt: {}, //投注项
    betPreData: {},
    potentialWinnings: 0,//
    errorTips: {}
})
getGameInfo()
async function getGameInfo() {
    let gameId = route.query?.gameId
    let url = `/player/game?gameId=${gameId}`
    try {
        const res = await http.get(url)
        if (res?.game && res?.lossPerCent) {
            state.gameInfo = res
            // gameType 比赛类型 1上半场 2全场,
            // 上半场得分
            state.firstHalfScore = res?.lossPerCent.filter(item => item.gameType == 1)
            // 下半场得分
            state.secondHalfScore = res?.lossPerCent.filter(item => item.gameType == 2)
            // console.log(state.firstHalfScore, state.secondHalfScore);
            state.betData = state.tabIndex == 0 ? state.secondHalfScore : state.firstHalfScore
        }
    } catch (error) {
        console.log(error);
    }
}
async function betPrepare() {
    let url = '/player/bet/pre'
    let data = {
        gameId: route.query?.gameId,
        oddsId: state.targetBetOpt?.id
    }
    try {
        const res = await http.post(url, data)
        state.betPreData = res
        state.isShowBetPanel = true
    } catch (error) {
        console.log(error);
    }
}
function quickBets(params) {
    if (params === 'all') {
        state.betNum = Number(accountInfo?.value.currRate)
    } else {
        state.betNum = Number(params)
    }
    state.potentialWinnings = getPotentialWin()
}
async function betSubmit() {
    let url = '/player/bet'
    let data = {
        gameId: route?.query?.gameId,
        oddsId: state.targetBetOpt?.id,
        type: '2',
        money: state.betNum
    }
    try {
        const res = await http.post(url, data)
        if (res?.id) {
            showToast({
                icon: successIcon,
                iconSize: '46px',
                message: t('betPage.successfully.text'),
                position: 'bottom',
                className: 'betPageToast'
            })

            store.getUserInfo()
            state.betIndex = -1
            state.isShowBetPanel = false
            state.betNum = 0
            state.potentialWinnings = 0

        } else {
            state.errorTips = res
            console.log(state.errorTips);
        }
    } catch (error) {
        console.log(error);
    }
}
function getPotentialWin() {
    // 赔率
    let antiPerCent = state.betPreData?.lossPerCent?.antiPerCent
    // 手续费
    let serviceFee = state.betPreData?.betHandMoneyRate
    return (antiPerCent * state.betNum / 100 - serviceFee).toFixed(4)
}
function getWinMoney() {
    state.errorTips = {}
    if (state.betNum < 0) {
        state.betNum = 0
    }
    if (state.betNum >= accountInfo?.value.currRate) {
        state.betNum = Number(accountInfo?.value.currRate)
        return
    }
    state.potentialWinnings = getPotentialWin()
}
function subtraction() {
    state.errorTips = {}
    state.betNum -= 1
    if (state.betNum <= 0) {
        state.betNum = 0
    }
    state.potentialWinnings = getPotentialWin()
}
function add() {
    state.errorTips = {}
    if (state.betNum >= accountInfo?.value.currRate) {
        state.betNum = Number(accountInfo?.value.currRate)
        return
    }
    state.betNum += 1
    state.potentialWinnings = getPotentialWin()
}
function closePanel() {
    state.isShowBetPanel = false
    state.betNum = 0
    state.potentialWinnings = 0
    state.betIndex = -1
}
function handleBetClick(item, index) {
    state.targetBetOpt = item
    betPrepare()
    state.betIndex = index
}
function handleClickTab(index) {
    state.tabIndex = index
    state.betIndex = -1
    state.betData = state.tabIndex == 0 ? state.secondHalfScore : state.firstHalfScore
}
const { tabIndex, betData, betIndex, betNum, isShowBetPanel, gameInfo, targetBetOpt, betPreData, potentialWinnings, errorTips } = toRefs(state)
</script>
<style scoped lang='scss'>
$bgHeight: 280px;

.betPage {
    height: 100%;
    background-color: #100f13;
    // 减去header的高度
    padding-top: calc($bgHeight - 44px);
    overflow: auto;
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
            width: calc((100% - 26px) / 3);
            margin-right: 13px;

            .score {
                font-size: 13px;
                color: #a6a9b8;
                text-align: center;
                margin-bottom: 9px;
            }

            .odds {
                padding: 10px 0px 11px 0px;
                text-align: center;
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

            .errorStyle {
                color: red;
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
                @include flex(flex-start);
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
                    margin-right: 5px;
                }
            }
        }
    }

    .showBetPanel {
        height: 460px;
    }
}
</style>