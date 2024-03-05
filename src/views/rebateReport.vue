<template>
    <div class="rebateReport maxWidth lrPadding">
        <div class="fixed maxWidth lrPadding">
            <div class="tabBox cursor">
                <div class="btnBox">
                     <span v-for="(item, index) in tabArr" :key="index" :class="{ tabItemAct: tabIndex === index }"
                        @click="changeTabIndex(index)">{{ item.name
                        }}</span>
                </div>
                <div class="dateBox" v-if="tabIndex==1">
                    <div class="dateSelect" @click.stop="showSelect">
                        <img :src="getImg('rebate', 'dateIcon')" class="langImg" alt="">
                        <div class="l_left">
                            <span class="l_name">{{ dateTarget }}</span>
                        </div>
                        <van-icon :name="showDateOpt ? 'arrow-up' : 'arrow-down'" />
                    </div>
                    <div class="options" :class="{ showOpt: showDateOpt }">
                        <div class="o_item" :class="{ lfc: item.name === dateTarget }" v-for="(item, index) in dateSelectList"
                            :key="index" @click="selectDate(item)">
                            <span class="l_name">{{ item.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rebateBox" v-if="tabIndex==0">
                <div class="row">
                    <div class="l_left bl">
                        <div class="name">{{ $t('backapi.self.rebate.top.content.total.text') }}</div>
                        <div class="num">{{fomarNoney(rebate.total)}}</div>
                    </div>
                    <div class="l_right">
                        <div class="name">{{ $t('backapi.self.rebate.top.content.today.text') }}</div>
                        <div class="num">{{fomarNoney(rebate.today)}}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="l_left bl">
                        <div class="name">{{ $t('backapi.self.rebate.top.content.week.text') }}</div>
                        <div class="num">{{fomarNoney(rebate.week)}}</div>
                    </div>
                    <div class="l_right">
                        <div class="name">{{ $t('backapi.self.rebate.top.content.lastweek.text') }}</div>
                        <div class="num">{{fomarNoney(rebate.lastWeek)}}</div>
                    </div>
                </div>
            </div>
            <div class="title" v-if="tabIndex==0">
                <span>{{ $t('rebateReport.left.title.text') }}</span>
                <span>{{ $t('rebateReport.right.title.text') }}</span>
            </div>
        </div>
        <van-pull-refresh class="pageRefresh" :immediate-disable="true" v-model="refreshing" @refresh="onRefresh" v-if="tabIndex==0"
            :loading-text="$t('load.loading.text')">
            <van-list v-model:loading="loading" :finished="finished" :finished-text="$t('load.no.more.text')"
                :loading-text="$t('load.loading.text')" @load="onLoad" :immediate-check="true" :offset='50'>
                <div class="list">
                    <div class="lItem" v-for="(item, index) in recordList" :key="index">
                        <div class="row-left">
                            <span class="top">{{getStatus(item.type)}}</span>
                            <span class="date">{{item.ymd}}</span>
                        </div>
                         <div class="row-right">
                            <span>+{{fomarNoney(item.money)}}</span>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
        <van-pull-refresh class="pageRefresh" :immediate-disable="true" v-model="refreshing" @refresh="onRefresh" v-else
            :loading-text="$t('load.loading.text')">
            <van-list v-model:loading="loading" :finished="finished" :finished-text="$t('load.no.more.text')"
                :loading-text="$t('load.loading.text')" @load="onLoad" :immediate-check="true" :offset='50'>
                <div class="list">
                    <div class="reportItem" v-for="(item, index) in reportList" :key="index">
                        <div class="row">
                            <span class="date-span">{{ $t('personal.report.date') }} :  {{ item.date }}</span>
                        </div>
                        <div class="row">
                            <span>{{ $t("personal.report.recharge") }} :  {{ fomarNoney(item.recharge) }}</span>
                            <span>{{ $t("personal.report.withdraw") }} :  {{ fomarNoney(item.withdrawal) }}</span>
                        </div>
                        <div class="row">
                            <span>{{ $t("personal.report.bet") }} :  {{ fomarNoney(item.bet) }}</span>
                            <!-- <span>{{ $t("personal.report.bingo") }} :  {{ fomarNoney(item.bingo) }}</span> -->
                            <span>{{ $t("personal.report.rebate") }} :  {{ fomarNoney(item.rebate) }}</span>
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
import { getImg,fomarNoney } from '@/utils/utils'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { formatDate, getAmount } from '@/utils/utils'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const state = reactive({
    tabArr: [
         {
            name: t('rebateReport.rebate.title.text'),
            id: 1,
        },
        {
            name: t('rebateReport.report.title.text'),
            id: 2,
        }
    ],
    statuslist:[
        {val:'1',label:t('rebate.center.list.cell.bet.text')},
        {val:'2',label:t('rebate.center.list.cell.profit.text')},
        {val:'3',label:t('rebate.center.list.cell.recharge.text')}
    ],
    tabIndex: 0,
    showDateOpt:false,
    dateTarget:'month',
    dateTargetId:5,
    dateSelectList: [
        {name: t('rebateReport.select.today.text'),id:1},
        {name: t('rebateReport.select.yesterday.text'),id:2},
        {name: t('rebateReport.select.week.text'),id:3},
        {name: t('rebateReport.select.day10.text'),id:4},
        {name: t('rebateReport.select.month.text'),id:5}
    ],
    
    page: {
        hasNext: false,
        pageNo: 1,
        pageSize: 10
    },
    rebate:{
        total:0,
        week:0,
        today:0,
        lastWeek:0
    },
    recordList: [],
    reportList:[],

    loading: false,
    finished: false,
    refreshing: false,
    loadTime: null,
})
onMounted(() => {
    window.scrollTo(0, 0);
    getInit()
})
function getStatus(type){
    const arr = state.statuslist.filter(item => {
        return item.val == type
    })
    if(arr && arr.length > 0){
        return arr[0].label
    }
}
function showSelect() {
    state.showDateOpt = !state.showDateOpt
}
function selectDate(item) {
    state.dateTarget = item.name
    state.dateTargetId = item.id
    state.showDateOpt = false
}
function onLoad() {
    state.page.pageNo += 1
    getInit()
}
function onRefresh() {
    state.page.pageNo = 1
    getInit('refresh')
}
function changeTabIndex(index) {
    state.tabIndex = index
    state.recordList = []
    state.reportList = []
    state.page = {
        hasNext: false,
        pageNo: 1,
        pageSize: 10
    },
    getInit()
}
function getInit(val) {
   if(state.tabIndex == 0){
        getRebate()
        getRebateList(val)
   }else{
      getReportList(val)
   }
}
async function getRebate() { 
    let url = '/player/rebate_statis'
    try {
        const res = await http.get(url)
        state.rebate = res
    } catch (error) {
        console.log(error);
    }
}
async function getRebateList(val) {
    let url = '/player/rebate_list'
    let data = {
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
        if (!res.hasNext) {
            state.finished = true
        }else{
            state.finished = false
        }
        state.loading = false
        state.refreshing = false
    } catch (error) {
        console.log(error);
    }
} 

async function getReportList(val) {
    let url = '/player/report_form'
    let data = {
        time: state.dateTargetId,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    state.loading = true
    try {
        const res = await http.post(url, data)
        if (val == 'refresh') {
            state.reportList = []
        }
        state.reportList = [...state.reportList, ...res]
        if (!res.hasNext) {
            state.finished = true
        }else{
            state.finished = false
        }

        state.loading = false
        state.refreshing = false
    } catch (error) {
        console.log(error);
    }
} 

const { tabArr, typeArr,showDateOpt, dateTarget,dateTargetId,dateSelectList, tabIndex,rebate,recordList, reportList,loading, finished, refreshing } = toRefs(state)
</script>
<style scoped lang='scss'>
.rebateReport {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    .fixed {
        box-sizing: border-box;
        .tabBox {
            height: 30px;
            font-size: 13px;
            color: #8d8d8d;
            @include flex(space-between);
            padding-top: 11px;
            .btnBox{
                width: 50%;
                height: 100%;
                @include flex(space-between);
                align-items: flex-end;
                span {
                    padding: 8.5px 20px;
                    border-radius: 15.5px;
                    background-color: #282828;
                    @include flex(center);
                }
            }

            .tabItemAct {
                background-color: $btnBgColor!important;
                color: #fff;
            }
            .dateBox {
                width: 50%;
                @include flex(flex-end);
                position: relative;
                box-sizing: border-box;
                .dateSelect {
                    @include flex();
                    color: #fff;
                    width: 130px;
                    height: 22px;
                    padding: 4.7px 6px 5.3px 5.5px;
                    border-radius: 15.5px;
                    background-color: #282828;
                    cursor: pointer;
                    .l_left {
                        @include flex(flex-start);
                        margin-right: 25px;
                        .l_name{
                             @include flex(flex-start);
                            width: 60px;
                            color: #ff7c43;
                            overflow: hidden;
                            text-overflow: ellipsis; /* 显示省略号 */
                            white-space: nowrap; /* 不换行 */
                        }
                    }
                }

                .langImg {
                    width: 22px;
                    height: 22px;
                }
                .l_name {
                    margin-left: 6px;
                    font-family: $fontFamily;
                    font-size: 15px;
                    color: #fff;
                }

                .options {
                    width: 125px;
                    position: absolute;
                    top: 38px;
                    color: #000;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, .56);
                    height: 0;
                    overflow: hidden;
                    transition: height .5s ease-out;
                    cursor: pointer;

                    .o_item {
                        width: 100%;
                        height: 28px;
                        padding: 0 6px 0 7px;
                        font-family: $fontFamily;
                        font-size: 15px;
                        color: #fff;
                        @include flex(flex-start);
                    }

                    .lfc {
                        .l_name {
                            color: #ff7c43;
                        }
                    }
                }

                .showOpt {
                    transition: height .5s ease-out;
                    height: 150px;
                    z-index: 99999
                }
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
        .rebateBox{
            width: 100%;
            height: 160px;
            .row{
                height: 69px;
                border-radius: 8px;
                margin-top: 18px;
                border: solid 1px #707070;
                @include flex(space-around,center);
                .bl{
                    border-right: 1px solid rgb(255,255,255,0.2);
                }
                .l_left,.l_right {
                    width: 50%;
                    height: 45px;
                    @include flex(space-around,center);
                    flex-direction: column;
                    .name{
                        height: 16px;
                        font-family: Roboto;
                        font-size: 14px;
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: normal;
                        letter-spacing: normal;
                        color: #707070;
                    }
                    .num{
                        height: 21px;
                        font-family: Roboto;
                        font-size: 18px;
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: normal;
                        letter-spacing: normal;
                        color: #fff;
                    }
                }
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
             @include flex(space-between,center);
            .row-left{
                @include flex(space-around,flex-start);
                flex-direction: column;
                span {
                    font-size: 12px;
                    margin-top: 5px;
                    font-size: 15px
                }
                .top{
                    font-size: 14px;
                    color: #ffffff;
                }
                .date{
                    font-size: 14px;
                    color: rgb(255,255,255,0.3);
                }
            }
            .row-right{
                @include flex(center);
                span{
                    color: green;
                    font-size: 15px;
                }
            }
        }
        .reportItem{
            border-radius: 6px;
            background-color: #1f1f1f;
            color: #ffffff;
            margin-top: 10px;
            padding: 10px 10px 5px 10px;
            .row{
                @include flex(space-between);
                flex-wrap: nowrap;
                margin-bottom: 5px;
                span{
                    display:block;
                    font-size: 12px;
                }
                .date-span{
                    font-size: 14px;
                    color: #ff6c00;
                }
            }
        }
    }
}</style>