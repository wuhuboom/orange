<template>
    <div class="order maxWidth lrPadding">
        <div class="o_tabs">
            <div class="item" :class="{ itemActive: index === tabIndex }" v-for="(item, index) in tabsArr" :key="index"
                @click="changeTabs(item, index)">
                {{ item.name }}
            </div>
        </div>
        <van-pull-refresh v-model="listStatus.refreshing" @refresh="onRefresh" loading-text="loading">
            <van-list v-model:loading="listStatus.loading" :finished="listStatus.finished"
                :finished-text="listStatus.finishedText" @load="onLoad">
                <div class="lItem" v-for="(item, index) in    dataList   " :key="index">
                    <div class="lTop">
                        <div class="topBox">
                            <div class="name">{{ item.allianceName }}</div>
                            <div class="date">{{ item.ymd }}</div>
                        </div>
                        <div class="statusBox">
                            <div class="statusLeft">
                                <p class="trading">Trading：{{ item.betMoney }}</p>
                                <p class="profit">Profit：<span class="num">{{ item.winningAmount }}</span></p>
                            </div>
                            <div class="statusRight">
                                <!-- 0未开奖 1已中奖 2未中奖, -->
                                <div class="cancel" v-if="item.statusOpen === 0" @click="cancelCurrOrder(item)">
                                    Cancel
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
                            NO.{{ item.orderNo }}
                        </div>
                        <div class="btn">
                            {{ item.statusOpen === 0 ? 'in Progress' : 'details' }}
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>

        <van-dialog v-model:show="cancelShow" title="You sure you want to cancel the game?" className="cancelModal">
            <template #footer>
                <div class="fBtn">
                    <div class="cancelBtn" @click="cancelShow = false">
                        Cancel
                    </div>
                    <div class="yesBtn" @click="cancelOrder">
                        Yes
                    </div>
                </div>
            </template>
        </van-dialog>
    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import http from '@/utils/axios'
import List from '@/components/list.vue'
const state = reactive({
    tabIndex: 0,
    tabsArr: [
        {
            name: 'Today',
            time: 1
        },
        {
            name: 'Yesterday',
            time: 2
        },
        {
            name: 'week',
            time: 3
        },
        {
            name: 'All',
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
        finishedText: 'no more'
    },
    dataList: [],
    timer: null,
    cancelShow: false,
    targetItem: {}
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
        console.log(
            '%c res: ',
            'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
            res
        )
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
        console.log(
            '%c state.dataList: ',
            'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
            state.dataList
        )

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
async function cancelOrder() {
    let url = `/player/unbet?betId=${state.targetItem.id}`
    console.log(state.targetItem);
    try {
        const res = await http.get(url)
        console.log(
            '%c res: ',
            'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
            res
        )
    } catch (error) {
        console.log(error);
    }
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
const { tabsArr, tabIndex, dataList, listStatus, cancelShow } = toRefs(state)
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
                    padding: 9px 15px;
                    border-radius: 16px;
                    background-color: #ff7c43;
                    font-family: SFProText;
                    font-size: 12px;
                    font-weight: 500;
                    color: #fff;
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
}
</style>