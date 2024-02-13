<template>
    <div class="order maxWidth lrPadding">
        <div class="o_tabs">
            <div class="item cursor" :class="{ itemActive: index === tabIndex }" v-for="(item, index) in tabsArr"
                :key="index" @click="changeTabs(item, index)">
                {{ item.name }}
            </div>
        </div>
        <van-pull-refresh v-model="listStatus.refreshing" @refresh="onRefresh" :loosing-text="$t('match.loosing.text')">
            <van-list v-model:loading="listStatus.loading" :loading-text="$t('load.loading.text')"
                :finished="$t('load.no.more.text')" :finished-text="$t('load.no.more.text')" @load="onLoad">
                <div class="lItem" v-for="(item, index) in dataList" :key="index">
                    <div class="lTop">
                        <div class="topBox">
                            <div class="name">{{ item.allianceName }}</div>
                            <div class="date">{{ item.ymd }}</div>
                        </div>
                        <div class="statusBox">
                            <div class="statusLeft">
                                <p class="trading">{{ $t('order.trading.text') }}: {{ getAmount(item.betMoney) }}</p>
                                <p class="profit">{{ $t('order.profit.text') }}: <span class="num">{{
                                    getAmount(item.winningAmount) }}</span></p>
                            </div>
                            <div class="statusRight">
                                <!-- statusOpen 0未开奖 1已中奖 2未中奖, -->
                                <!-- "status": 状态0.未确认 1已确认 2已取消 3 已撤消 4已回滚, -->
                                <div class="cancel" v-if="item.statusOpen === 0">
                                    <span class="canceled" v-if="item.status === 3 || item.status === 2">
                                        {{ $t('wallet.index.order.state.cancel.text1') }}
                                    </span>
                                    <span class="cancelspan" v-else @click="cancelCurrOrder(item)">
                                        {{ $t('cancel.btn.text') }}
                                    </span>
                                </div>
                                <div :style="{ color: item.statusOpen === 1 ? '#ff7c43' : '#10ab61' }"
                                    v-if="item.statusOpen !== 0">
                                    {{ item.statusOpen === 1 ? 'WIN' : 'LOSE' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lBottom">
                        <div class="orderNo">
                            {{ $t('order.no.text') }} {{ item.orderNo }}
                        </div>
                        <div class="btn" @click="getOrderDetails(item)">
                            {{ item.statusSettlement === 0 ? $t('order.inProgress.text') : $t('table.head.detail.text') }}
                            <img v-if="item.statusSettlement === 1" src="../assets/images/common/arrow_right.webp" alt=""
                                style="width: 14px;height: 14px;">
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
        <!-- 是否取消订单 -->
        <van-dialog v-model:show="cancelShow" :title="$t('order.dialog.title.text')" className="cancelModal">
            <template #footer>
                <div class="fBtn">
                    <div class="cancelBtn" @click="cancelShow = false">
                        {{ $t('cancel.btn.text') }}
                    </div>
                    <div class="yesBtn" @click="cancelOrder">
                        {{ $t('index.editor.psd.modal.confirm.btn') }}
                    </div>
                </div>
            </template>
        </van-dialog>
        <!-- 查看订单详情的弹窗 -->
        <van-dialog v-model:show="orderShow" className="orderModal">
            <template #default>
                <div class="header">
                    <div class="h_left">
                        {{ orderInfo?.game?.mainName }}
                    </div>
                    <div class="h_center">
                        <p class="vs" v-if="orderInfo?.game?.score === ''">vs</p>
                        <p v-if="orderInfo?.game?.score">{{ orderInfo?.game?.score }}</p>
                        <p class="date">{{ orderInfo?.game?.startTimeStr }}</p>
                    </div>
                    <div class="h_right">
                        {{ orderInfo?.game?.guestName }}
                    </div>
                </div>
                <van-divider :style="{ backgroundColor: '#363636' }" />
                <div class="rowDiv">
                    <span>{{ $t('rebate.center.list.nav.type.text') }}</span>
                    <!-- 下注类型1正波2反波, -->
                    <span>{{ orderInfo?.betinfo?.betType }}</span>
                </div>
                <div class="rowDiv">
                    <span>{{ $t('bet.detail.score.text') }}</span>
                    <span>{{ orderInfo?.betinfo?.betScore }}</span>
                </div>
                <div class="rowDiv">
                    <span>{{ $t('match.cmopetition.list.odd.text') }}</span>
                    <span>{{ orderInfo?.betinfo?.betOdds }}</span>
                </div>
                <div class="rowDiv">
                    <span>{{ $t('order.dialog.money.text') }}</span>
                    <span>{{ getAmount(orderInfo?.betinfo?.betMoney) }}</span>
                </div>
                <div class="rowDiv">
                    <span>{{ $t('order.dialog.winAmount.text') }}</span>
                    <span>{{ getAmount(orderInfo?.betinfo?.winningAmount) }}</span>
                </div>
                <div class="rowDiv">
                    <span>{{ $t('order.dialog.start.text') }}</span>
                    <span>{{ formatDate(orderInfo?.betinfo?.createdAt) }}</span>
                </div>
                <div class="rowDiv">
                    <span>{{ $t('order.dialog.status.text') }}</span>
                    <!--  结算状态 0未结算 1已结算, -->
                    <span>{{ orderInfo?.betinfo?.statusSettlement }}</span>
                </div>
                <van-divider :style="{ backgroundColor: '#363636' }" />
            </template>
            <template #footer>
                <div class="fBtn">
                    <div class="closeDialog" @click="orderShow = false">
                        {{ $t('order.dialog.close.btn.text') }}
                    </div>
                </div>
            </template>
        </van-dialog>

    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import http from '@/utils/axios'
import { formatDate, getAmount } from '@/utils/utils'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const state = reactive({
    tabIndex: 0,
    tabsArr: [
        {
            name: t('match.today.text'),
            time: 1
        },
        {
            name: t('match.records.yes.text'),
            time: 2
        },
        {
            name: t('match.week.text'),
            time: 3
        },
        {
            name: t('match.all.text'),
            time: ''
        },
    ],
    page: {
        pageNo: 1,
        pageSize: 10,
        hasNext: false,
    },
    listStatus: {
        loading: false,
        finished: false,
        refreshing: false,
    },
    dataList: [],
    timer: null,
    cancelShow: false,
    targetItem: {},
    orderShow: false,
    orderInfo: {}
})
orderList()
async function orderList(val) {
    // 1今天(用bets/today)，2昨天，3近7日，4近10日，5近30日
    let url = '/player/bets'
    let data = {
        time: state.tabsArr[state.tabIndex].time,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    try {
        const res = await http.post(url, data)
        if (val === 'refresh') {
            state.dataList = []
        }
        state.page.pageNo = res.pageNo
        state.page.pageSize = res.pageSize
        state.page.hasNext = res.hasNext
        state.dataList = [...state.dataList, ...res.results]
        state.listStatus.loading = false
        state.listStatus.refreshing = false
        if (res.totalCount > (res.pageSize * res.totalPage)) {
            state.page.hasNext = true
        } else {
            state.page.hasNext = false
            state.listStatus.finished = true
        }

    } catch (error) {
        console.log(error);
    }
}
async function getOrderDetails(item) {
    let url = `/player/betInfo?betId=${item.id}`
    try {
        const res = await http.get(url)
        if (typeof (res) === 'object') {
            state.orderInfo = res
            state.orderShow = true
        }
    } catch (error) {
        console.log(error);
    }
}
function onLoad() {
    state.timer && clearTimeout(state.timer)
    state.timer = setTimeout(() => {
        state.page.pageNo += 1
        if (state.page.hasNext) {
            orderList()
        }
    }, 300);
}
function onRefresh() {
    state.page.pageNo = 1
    state.page.pageSize = 10
    orderList('refresh')
}
function cancelOrder() {
    let url = `/player/unbet?betId=${state.targetItem.id}`
    http.get(url).then(res => {
        orderList('refresh')
        // showToast(t('wallet.index.order.state.cancel.text1'))
        state.cancelShow = false
    })
    state.cancelShow = false
    // state.targetItem
}
function cancelCurrOrder(item) {
    state.targetItem = item
    state.cancelShow = true
}
function changeTabs(item, index) {
    state.tabIndex = index
    orderList('refresh')
}
const { tabsArr, tabIndex, dataList, listStatus, cancelShow, orderShow, orderInfo } = toRefs(state)
</script>
<style scoped lang='scss'>
.order {
    height: 100%;
    background-color: $mainBg;
    box-sizing: border-box;
    padding-top: 10px;
    overflow: auto;

    .o_tabs {
        @include flex();
        box-sizing: border-box;

        .item {
            height: 30px;
            line-height: 30px;
            padding: 0 20px;
            border-radius: 5.5px;
            border: solid 1px #373737;
            background-color: #282828;
            box-sizing: border-box;
            font-size: 13px;
            color: #8d8d8d;
        }

        .itemActive {
            background-color: #ff7c43;
            color: #fff;
        }
    }

    .lItem {
        margin-top: 8px;

        .itemPadding {
            padding: 12px 11px 7px 12px;
            box-sizing: border-box;
        }

        .lTop {
            width: 100%;
            @extend .itemPadding;
            background-color: #2b2b2b;
            @include flex();
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            flex-direction: column;

            .topBox {
                width: 100%;
                @include flex();

                .name {
                    font-family: SFProText;
                    font-size: 14px;
                    font-weight: 500;
                    color: #fff;
                }

                .date {
                    font-size: 12px;
                    color: #8d8d8d;
                }
            }

            .statusBox {
                margin-top: 16px;
                width: 100%;
                @include flex();

                .statusLeft {
                    .trading {
                        font-family: SFProText;
                        font-size: 14px;
                        color: #fff;
                    }

                    .profit {
                        font-size: 14px;
                        color: #fff;
                        margin-top: 2px;

                        .num {
                            color: #8d8d8d;
                        }
                    }
                }

                .statusRight {
                    font-family: SFProText;
                    font-size: 12px;
                    font-weight: 500;
                    color: #fff;

                    .cancelspan {
                        border-radius: 16px;
                        padding: 9px 15px;
                        background-color: #ff7c43;

                    }

                    .canceled {
                        color: #8d8d8d;
                    }
                }
            }
        }

        .lBottom {
            @include flex(space-between);
            padding: 12px 11px 12px 12px;
            background-color: #1c1c1c;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;

            .orderNo {
                font-size: 12px;
                color: #a2a2a2;
            }

            .btn {
                height: 24px;
                line-height: 24px;
                padding: 5px 8px 5px 10px;
                border-radius: 8px;
                background-color: rgba(93, 86, 105, 0.48);
                font-size: 12px;
                color: #fff;
                @include flex();

                img {
                    margin-left: 5px;
                }
            }
        }
    }

    :deep(.cancelModal) {
        border-radius: 20px;
        background-color: #18181b;

        .van-dialog__header {
            font-size: 14px;
            color: #fff;
        }

        .fBtn {
            @include flex(center);
            padding-bottom: 18px;

            .cancelBtn {
                width: 110px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                border-radius: 16px;
                background-color: rgba(93, 86, 105, 0.48);
                font-family: SegoeUI;
                font-size: 14px;
                color: #fff;
            }

            .yesBtn {
                @extend .cancelBtn;
                margin-left: 27px;
                background-color: #ff7c43;
            }
        }

    }

    :deep(.orderModal) {
        width: 312px;
        border-radius: 15px;
        background-image: linear-gradient(to bottom, #2b2b2b, #1c1c1c);
        color: #fff;

        .van-dialog__content {
            box-sizing: border-box;

            .header {
                padding: 14px 8px 0 16px;
                @include flex();
                font-size: 12px;
                color: #fff;

                .h_left {
                    text-align: center;
                    font-size: 12px;
                    padding-right: 8px;
                    line-height: 1.5;
                }

                .h_center {
                    width: 162px;
                    height: 48px;
                    border: 1px solid #363636;
                    border-top: none;
                    border-bottom: none;
                    @include flex(center, center);
                    flex-direction: column;

                    .vs {
                        font-family: Calibri;
                        font-size: 22px;
                        letter-spacing: -0.28px;
                        color: #fff;
                    }

                    .date {
                        margin-top: 4px;
                        color: #8d8d8d;
                        text-align: center;
                    }
                }

                .h_right {
                    font-size: 12px;
                    text-align: center;
                    padding-left: 8px;
                    line-height: 1.5;
                }
            }

            .rowDiv {
                width: 162px;
                // padding: 0 70px 0 71px;
                margin: 10px auto 0;
                box-sizing: border-box;
                @include flex(space-between);

                span {
                    width: 50%;
                    font-family: Calibri;
                    font-size: 12px;
                    font-weight: 300;
                    letter-spacing: 0.17px;
                    color: #e0e1eb;
                }

                span:first-child {
                    text-align: left;
                }

                span:last-child {
                    text-align: center;
                    margin-left: 0px;
                }
            }

        }

        .fBtn {
            @include flex(center);
            padding-bottom: 18px;

            .closeDialog {
                width: 257px;
                height: 48px;
                margin: 0 auto;
                text-align: center;
                line-height: 48px;
                border-radius: 14px;
                background-color: #ff7c43;
                font-size: 14px;
                color: #fff;
            }


        }


    }
}
</style>