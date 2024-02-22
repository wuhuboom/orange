<template>
    <div class="fundsRecords maxWidth lrPadding">
        <div class="fixed maxWidth lrPadding">
            <div class="tabBox cursor">
                <span v-for="(item, index) in tabArr" :key="index" :class="{ tabItemAct: tabIndex === index }"
                    @click="changeTabIndex(index)">{{ item.name
                    }}</span>
            </div>
            <div class="type cursor">
                <div v-for="(item, index) in typeArr" :class="{ itemAct: typeIndex === index }" :key="index"
                    @click="changeIndex(index)">
                    {{ item.name }}
                </div>
            </div>
            <div class="title">
                <span>{{ $t('fundsRecords.left.title.text') }}</span>
                <span>{{ $t('fundsRecords.right.title.text') }}</span>
            </div>
        </div>

        <van-pull-refresh class="pageRefresh" :immediate-disable="true" v-model="refreshing" @refresh="onRefresh"
            :loading-text="$t('load.loading.text')">
            <van-list v-model:loading="loading" :finished="finished" :finished-text="$t('load.no.more.text')"
                :loading-text="$t('load.loading.text')" @load="onLoad" :immediate-check="true" :offset='50'>
                <div class="list">
                    <div class="lItem" v-for="(item, index) in recordList" :key="index">
                        <div class="row">
                            <span class="rLeft" v-if="typeIndex === 0">{{ { 1: 'online', 2: 'offline' }[item.type] }}</span>
                            <span class="rLeft" v-if="typeIndex === 1">{{ getType(item.type) }}</span>
                            <span class="rLeft" v-if="typeIndex === 2">{{ getTabName(item?.balanceChangeType) }}</span>
                            <span v-if="typeIndex === 0 || typeIndex === 1">{{ getAmount(item.money) }}</span>
                            <span v-if="typeIndex === 2"
                                :style="{ color: getAmount(item.changeMoney) > 0 ? '#10ab61' : 'red' }">{{
                                    getAmount(item.changeMoney) }}</span>
                        </div>
                        <div class="row">
                            <span class="rLeft">{{ formatDate(item.createdAt) }}</span>
                            <span v-if="typeIndex === 0">{{ $t('fundsRecords.discount.text') }}: {{
                                getAmount(item.moneyDiscount) }}</span>
                            <span v-if="typeIndex === 1">{{ $t('fundsRecords.commission.text') }}: {{
                                getAmount(item.commission) }}</span>
                            <span v-if="typeIndex === 2">{{ $t('fundsRecords.Balance.text') }}: {{ getAmount(item.dnedMoney)
                            }}</span>
                        </div>
                        <div class="row">
                            <span class="rLeft" v-if="typeIndex === 0 || typeIndex === 1">{{ $t('fundsRecords.orderNo.text')
                            }}:{{ item.orderNo }}</span>
                            <span class="rLeft" v-if="typeIndex === 2">{{ $t('fundsRecords.type.text') }}:{{
                                getTabName(item?.balanceChangeType) }}</span>

                            <span class="color10ab61" v-if="typeIndex === 0 || typeIndex === 1"
                                :style="{ color: statusList[item.status]?.color }">{{ getStatus(item.status)
                                }}</span>
                            <span class="rLeft" v-if="typeIndex === 2">{{ $t('fundsRecords.initMoney.text') }}:{{
                                getAmount(item?.initMoney) }}</span>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { formatDate, getAmount } from '@/utils/utils'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const state = reactive({
    tabArr: [
        {
            name: t('match.today.text'),
            id: 1,
        },
        {
            name: t('match.records.yes.text'),
            id: 2,
        },
        {
            name: t('match.records.nearly7.text'),
            id: 7,
        },
    ],
    tabIndex: 0,
    typeArr: [
        {
            name: t('leftNav.recharge.text')
        },
        {
            name: t('leftNav.withdrawal.text')
        },
        {
            name: t('fundsRecords.balance.text')
        },
    ],
    typeIndex: 0,
    page: {
        hasNext: false,
        pageNo: 1,
        pageSize: 10
    },
    recordList: [],

    statusList: [
        {
            label: t("order.search.all.text"),
            active: true,
            color: '#9F9F9F'
        },
        {
            label: t("recharge.record.status.pendding.text"),
            active: false,
            color: '#B5DB1C'
        },
        {
            label: t("recharge.record.status.paid.text"),
            active: false,
            color: '#B5DB1C'
        },
        {
            label: t("recharge.record.status.scored.text"),
            active: false,
            color: '#FF0000'
        },
        {
            label: t("recharge.record.status.pay.timeout.text"),
            active: false,
            color: '#fff'
        }
    ],

    typeList: [{
        nameStr: t('withdraw.record.center.show.detail.type.bank.text'),
        valueNum: 1
    }, {
        nameStr: t('withdraw.record.center.show.detail.usdt.bank.text'),
        valueNum: 2
    }, {
        nameStr: t('backapi.self.whitdraw.type.ewallet.form.wallet.addr.text'),
        valueNum: 4
    }],
    tabsList: [
        {
            label: t("dropdown.billing.all.title.text"),
            value: 0,
        },
        {
            label: t("dropdown.billing.income.online.recharge.text"),
            value: 1,
        },
        {
            label: t("dropdown.billing.income.withdraw.text"),
            value: 2,
        },
        {
            label: t("dropdown.billing.expenditure.bet.text"),
            value: 3,
        },
        {
            label: t("dropdown.billing.income.bet.rebate.text"),
            value: 4,
        },
        {
            label: t("dropdown.billing.income.lower.level.rebate.text"),
            value: 5,
        },
        {
            label: t("dropdown.billing.income.manually.add.money.text"),
            value: 6,
        },
        {
            label: t("dropdown.billing.income.bet.cancel.text"),
            value: 7,
        },
        {
            label: t("dropdown.billing.expenditure.manual.reduction.text"),
            value: 8,
        },
        {
            label: t("dropdown.billing.expenditure.rebate.deduction.text"),
            value: 9,
        },
        {
            label: t("dropdown.billing.expenditure.online.cancel.text"),
            value: 10,
        },
        {
            label: t("dropdown.billing.income.offline.recharge.text"),
            value: 11,
        },
        {
            label: t("dropdown.billing.income.withdraw.return.text"),
            value: 12
        },
        {
            label: t("dropdown.billing.income.bets.return.text"),
            value: 13,
        },
        {
            label: t("dropdown.billing.income.bet.back.text"),
            value: 14,
        },
        {
            label: t("dropdown.billing.income.register.gift.text"),
            value: 15,
        },
        {
            label: t("dropdown.billing.bonus.text"),
            value: 16,
        },
        {
            label: t("dropdown.billing.income.vip.cash.text"),
            value: 17,
        },
        {
            label: t("dropdown.billing.income.activity.cash.text"),
            value: 18,
        },
        {
            label: t("dropdown.billing.income.recharge.gift.text"),
            value: 19,
        },
        {
            label: t("dropdown.billing.transaction.fee.text"),
            value: 20,
        },
        {
            label: t("dropdown.billing.income.lower.level.recharge.rebate.text"),
            value: 21,
        },
        {
            label: t("dropdown.billing.income.lower.level.bet.rebate.text"),
            value: 22,
        },
        {
            label: t("dropdown.billing.income.invite.rewards.text"),
            value: 23,
        },
        {
            label: t("dropdown.billing.income.first.charge.text"),
            value: 24,
        },
        {
            label: t("dropdown.billing.income.active.profit.text"),
            value: 25,
        },
        {
            label: t("dropdown.billing.income.sufficient.reward.text"),
            value: 26,
        },
        {
            label: t("dropdown.billing.income.fixed.day.text"),
            value: 27,
        },
        {
            label: t("dropdown.billing.invite.first.charge.text"),
            value: 28,
        },
        // {
        //     label: t("backapi.report.account.change.query.type.turntable.lottery.text"),
        //     value: 29,
        // },
        // {
        //     label: t("backapi.report.account.change.query.type.turntable.jackpot.text"),
        //     value: 30,
        // },
        {
            label: t("dropdown.billing.offline.activity.text"),
            value: 31,
        },
        {
            label: t("dropdown.billing.report.score.text"),
            value: 32,
        },
        {
            label: t("dropdown.billing.redo.text"),
            value: 33,
        },
        {
            label: t("backapi.self.safe.huaz.transfer.text"),
            value: 34,
        },
        {
            label: t("backapi.report.account.change.query.type.team.motivation.text"),
            value: 35,
        },
        {
            label: t("dropdown.billing.recharge.compensation.text"),
            value: 36,
        },
        {
            label: t("dropdown.billing.report.score.text"),
            value: 37,
        },
    ],
    loading: false,
    finished: false,
    refreshing: false,
    loadTime: null,
})
onMounted(() => {
    window.scrollTo(0, 0);
    getInit()
})

function onLoad() {
    state.loadTime && clearTimeout(state.loadTime)
    state.loadTime = setTimeout(() => {
        if (state.page.hasNext) {
            state.page.pageNo += 1
        }
        getInit()
    }, 1000);
}
function onRefresh() {
    state.page.pageNo = 1
    getInit('refresh')
}
function getInit(val) {
    if (state.typeIndex === 0) {
        getDeposit(val)
    } else if (state.typeIndex === 1) {
        getWithdraw(val)
    } else if (state.typeIndex === 2) {
        getBaance(val)
    }
}
function getStatus(index) {
    return state.statusList[index]?.label || ''
}
function getTabName(type) {
    return state.tabsList.find(item => item.value == type)?.label || ''

}
function getType(value) {
    return state.typeList.find(item => item.valueNum === value)?.nameStr || ''
}
async function getDeposit(val) {
    let url = '/player/recharge_log'
    // 1今日 2昨日 3.7日 4.10日 5.30日
    let data = {
        time: state.tabArr[state.tabIndex].id,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    state.loading = true
    try {
        const res = await http.post(url, data)
        if (val == 'refresh') {
            state.recordList = []
        }
        state.recordList = [...state.recordList, ...res.results]
        state.page.pageNo = res.pageNo
        state.page.pageSize = res.pageSize

        if (!res.hasNext) {
            state.finished = true
        }

        state.loading = false
        state.refreshing = false
    } catch (error) {
        console.log(error);
    }
}
async function getWithdraw(val) {
    let url = '/player/withdrawal_log'
    // 1今日 2昨日 3.7日 4.10日 5.30日
    let data = {
        time: state.tabArr[state.tabIndex].id,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    state.loading = true
    try {
        const res = await http.post(url, data)
        console.log(res);
        if (val == 'refresh') {
            state.recordList = []
        }
        state.recordList = [...state.recordList, ...res.results]
        state.page.pageNo = res.pageNo
        state.page.pageSize = res.pageSize

        if (!res.hasNext) {
            state.finished = true
        }

        state.loading = false
        state.refreshing = false
    } catch (error) {
        console.log(error);
    }

}
async function getBaance(val) {
    let url = '/player/balance_change'
    // 1今日 2昨日 3.7日 4.10日 5.30日
    let data = {
        time: state.tabArr[state.tabIndex].id,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    state.loading = true
    try {
        const res = await http.post(url, data)
        if (val == 'refresh') {
            state.recordList = []
        }
        state.recordList = [...state.recordList, ...res.results]
        state.page.pageNo = res.pageNo
        state.page.pageSize = res.pageSize

        if (!res.hasNext) {
            state.finished = true
        }

        state.loading = false
        state.refreshing = false
    } catch (error) {
        console.log(error);
    }

}
function changeIndex(index) {
    state.typeIndex = index
    state.recordList = []
    getInit()
}
function changeTabIndex(index) {
    state.tabIndex = index
    state.recordList = []
    getInit()
}
const { tabArr, typeArr, typeIndex, tabIndex, recordList, statusList, typeList, loading, finished, refreshing } = toRefs(state)
</script>
<style scoped lang='scss'>
.fundsRecords {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    padding-top: 108px;

    .fixed {
        position: fixed;
        top: 44px;
        left: 0;
        right: 0;
        box-sizing: border-box;

        .tabBox {
            height: 30px;
            font-size: 13px;
            color: #8d8d8d;
            @include flex(space-between);
            padding-top: 11px;

            span {
                width: 88px;
                height: 31px;
                border-radius: 15.5px;
                background-color: #282828;
                @include flex(center);
            }

            .tabItemAct {
                background-color: $btnBgColor;
                color: #fff;
            }
        }

        .type {
            @include flex();
            font-size: 14px;
            font-weight: normal;
            color: #8d8d8d;
            margin-top: 18px;

            div {
                width: 33.33%;
                text-align: center;
                border-bottom: 1px solid #404040;
                padding-bottom: 8px;
            }

            .itemAct {
                border-bottom-color: $btnBgColor;
                color: $btnBgColor;
            }
        }

        .title {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.48);
            @include flex(space-between);
            margin-top: 16px;
        }
    }

    .list {
        margin-top: 15px;

        .lItem {
            border-radius: 6px;
            background-color: #1f1f1f;
            padding: 14px 12px 12px 12px;
            margin-bottom: 4px;

            .row {
                @include flex(space-between);
                margin-bottom: 7px;

                span {
                    font-size: 12px;
                    color: #8d8d8d;

                }

                .rLeft {}

                .color10ab61 {
                    color: #10ab61;
                }
            }

            .row:first-child {
                span {
                    font-size: 14px;
                    color: #fff;
                }
            }
        }
    }
}</style>