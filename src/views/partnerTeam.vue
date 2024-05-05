<template>
    <div class="partnerTeam maxWidth lrPadding">
        <div :class="'head'+type">{{ $t('partner.team.user.total') }}:{{ records.length }}</div>
        <van-pull-refresh v-model="listStatus.refreshing" @refresh="onRefresh" :loading-text="$t('load.loading.text')" :pulling-text="$t('load.loading.text')" :loosing-text="$t('match.loosing.text')">
            <van-list v-model:loading="listStatus.loading" :loading-text="$t('load.loading.text')"
                :finished="listStatus.finished" :finished-text="$t('load.no.more.text')" @load="onLoad">
                <div class="record-header">
                    <div>{{ $t('partner.team.username') }}</div>
                    <div>{{ $t('partner.team.bettingDays') }}</div>
                </div>
                <div class="record-item" v-for="(item, index) in records" :key="index">
                    <div class="left">{{ item.playerName }}</div>
                    <div :class="'right'+type">{{ item.aimCount }} {{ $t('partner.team.days') }}</div>
                </div>
            </van-list>
        </van-pull-refresh>
        
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted,computed } from 'vue'
import { useRouter,useRoute } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/index'
const store = useStore()
const accountInfo = computed(() => store.accountInfo)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
console.log(route)
const state = reactive({
    page: {
        pageNo: 1,
        pageSize: 10,
    },
    records:[],
    type:route.query.type,
    listStatus: {
        loading: false,
        finished: false,
        refreshing: false,
    },
})

onMounted(() => {
    orderList('refresh')
})

function onLoad() {
    state.timer && clearTimeout(state.timer)
    state.timer = setTimeout(() => {
        state.page.pageNo += 1
        if (state.page.hasNext) {
            orderList()
        }
    }, 2000);
}
function onRefresh() {
    state.page.pageNo = 1
    state.page.pageSize = 10
    orderList('refresh')
}
async function orderList(val) {
    let url = '/player/group/unaim'
    let data = {
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    try {
        const res = await http.post(url, data)
        if (val === 'refresh') {
            state.records = []
        }
        state.records = [...state.records, ...res.results] || []
        state.page.pageNo = res.pageNo
        state.page.pageSize = res.pageSize
        state.page.hasNext = res.hasNext
        state.listStatus.loading = false
        state.listStatus.refreshing = false
        if (res.totalCount > (res.pageSize * res.pageNo)) {
            state.page.hasNext = true
        } else {
            state.page.hasNext = false
            state.listStatus.finished = true
        }
    } catch (error) {
        console.log(error);
    }
}
const { page,records,type,listStatus } = toRefs(state)
</script>
<style scoped lang='scss'>
.partnerTeam {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    .head1{
        width: 100%;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background-color:#ff6c00;
        color:#fff;
        font-size:13px;

    }
    .head2{
        width: 100%;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background-color:#10ab61;
        color:#fff;
        font-size:13px;

    }
    .record-header{
        display: flex;
        justify-content: space-between;
        align-content: center;
        color: rgba(255, 255, 255, 0.48);
        font-size: 12px;
        line-height:34px;
    }
    .record-item{
        display: flex;
        justify-content: space-between;
        align-content: center;
        border-radius: 6px;
        background-color: #1f1f1f;
        margin-bottom: 3px;
        font-size: 13px;
        .left{
            padding:15px 10px;
            color:#fff;
        }
        .right1{
            padding:15px 10px;
            color: #ff6c00;
        }
        .right2{
            padding:15px 10px;
            color: #10ab61;
        }

    }

}
</style>