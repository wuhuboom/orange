<template>
    <div class="partner maxWidth lrPadding">
        <!-- <div class="totalData">
            <div class="left">
                <img src="../assets/images/partner/totalIcon.webp" class="totalIcon" alt="">
                <span>{{ $t('partner.total.data.summary.text') }}</span>
            </div>
            <img src="../assets/images/partner/arrow-right.webp" class="arrow-right" alt="">
        </div> -->
        <div class="balanceBox">
            <div class="item balance">
                <img :src="getImg('partner', 'balance')" alt="">
                <p class="name">{{ $t('send.balance.text') }}</p>
                <p class="num"><span> </span>{{ partnerObj.totalBalance / unitNum || 0 }}</p>
            </div>
            <div class="item trade">
                <img :src="getImg('partner', 'trade')" alt="">
                <p class="name">{{ $t('agency.center.teamSize.text') }}</p>
                <p class="num">{{ partnerObj.playerCount || 0 }}</p>
            </div>
            <div class="item win">
                <img :src="getImg('partner', 'win')" alt="">
                
                <p class="name">{{ $t('agency.center.newreg.text') }}</p>
                <p class="num"><span> {{ partnerObj?.newPlayer }} </span></p>
            </div>
        </div>
        <div class="tabs">
            <div v-for="(item, index) in tabArr" :key="index" :class="{ tabActive: index === tabsIndex }"
                @click="handleClickTab(item, index)">
                {{ item.name }}
            </div>
        </div>
        <p class="teamReport">{{ $t('agency.center.title.text') }}: <span> {{ $t('partner.not.up.to.standard.text')
        }}</span></p>
        <div class="progressBar">
            <div class="p_left">
                <div class="p_left_item">
                    <p>{{ $t('partner.team.incentives.text') }} </p>
                    <p>{{ $t('partner.not.up.to.par') }}: <span class="tangerine">{{ partnerObj?.groupUnAim || 0 }}</span></p>
                    <img src="../assets/images/partner/arrow-right.webp" class="arrow-right" alt="" @click="showDetail(1)">
                </div>
                <div class="p_left_item">
                    <p class="mt">{{ $t('partner.team.incentives.text') }}</p>
                    <p>{{ $t('partner.up.to.par') }}: <span class="green">{{ partnerObj?.groupAim || 0 }}</span></p>
                    <!-- <img src="../assets/images/partner/arrow-right.webp" class="arrow-right" alt="" > -->
                </div>
            </div>
            <div class="p_right">
                <van-circle v-model:current-rate="groupAim" :speed="100" :rate="100" color="#ff7c43"
                    layer-color="#1f996b" :stroke-width="80" :text="passRate" />
            </div>
        </div>
        <div class="teamList">
            <div class="teamlist-box">
                <p class="title">{{ $t('partner.team.list.text') }}</p>
                <div class="team-search">
                    <van-search v-model="username" @blur="searchUser" @focus="showClearIcon = true" shape="round"
                        :placeholder="$t('partner.team.search.text')" :clearable="false" background="#000"
                         @clear="clearContent">
                        <template #left-icon>
                            <img src="../assets/images/match/searchIcon.webp" class="searchIcon" alt="">
                        </template>
                        <template #right-icon>
                            <div @click="clearContent" v-if="showClearIcon">
                                <van-icon name="cross" />
                            </div>
                        </template>
                    </van-search>
                </div>
            </div>
            <div class="team-level">
                <div class="team-level-item" :class="level==item.level?'active':''" v-for="(item, index) in levelArr" :key="index" @click="changeLevel(item.level)">
                    {{ item.name}}
                </div>
            </div>
            <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text=""
            @load="getUserList"
            >
            <div class="item" v-for="(item, index) in userArr" :key="index">
                <p>
                    <span class="name">{{ item.username }}</span>
                    <span>{{ $t('partner.login.time.text') }}</span>
                </p>
                <p>
                    <span>id:{{ item.id }}</span>
                    <span>{{ formatDate(item.theNewLoginTime) }}</span>
                </p>
            </div>
           </van-list>
        </div>
        <div class="loading-div" v-if="loadCircle.show">
            <van-circle v-model:current-rate="loadCircle.curRate" :speed="100" :rate="loadCircle.rate" color="#0b4de6" size="150px"
                    layer-color="#ffffff" :stroke-width="80" :text="loadCircle.text" />
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, computed,ref } from 'vue'
import { getImg, formatDate } from '@/utils/utils'
import http from '@/utils/axios'
import { getPercent } from '@/utils/utils'
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";
const { t, locale } = useI18n()
const loading = ref(false);
const finished = ref(false);
const router = useRouter()
const state = reactive({
    tabsIndex: 0,
    partnerObj: {},
    groupUnAim: 0,
    groupAim: 0,
    passRate: '',
    loadCircle: {
        show:false,
        curRate: 0,
        rate:100,
        text:''
    },
    page: {
        pageNo: 1,
        pageSize: 30,
    },
    userArr: [],
    unitNum:window.config.UNIFIED_NUMBER, 
    username:'',
    showClearIcon: false,
    level:1

})
const tabArr = computed(() => {
    return [
        {
            name: t('match.today.text'),
            time: 1
        },
        {
            name: t('match.week.text'),
            time: 3
        },
        {
            name: t('partner.last.ten.days'),
            time: 4
        },
    ]
})
const levelArr = computed(() => {
    return [
        {
            name: t('partner.team.lv1'),
            level: 1
        },
        {
            name: t('partner.team.lv2'),
            level: 2
        },
        {
            name: t('partner.team.lv3'),
            level: 3
        }
    ]
})  
loadData()
getTeamData(1)
 async function loadData(){
    state.loadCircle.curRate = 100
    state.loadCircle.show = true
    let process = 0
    while(process < 100){
        var randomNum = Math.floor(Math.random() * 10 + 1);
        process += 10 + randomNum
        await new Promise((resolve) => setTimeout(resolve, 500));
        state.loadCircle.curRate = process
        state.loadCircle.text = state.loadCircle.curRate + '%'
    }
    state.loadCircle.show = false
}
async function getTeamData(index, key = '') {
    let url = `/player/data_center/${index}`
    let data = {
        time: tabArr.value[state.tabsIndex].time,
        index: index,
        key
    }
    let res = ''
    try {
        res = await http.post(url, data)
        if (res?.key) {
            index += 1
            if (index < 7) {
                getTeamData(index, res.key)
            }
        }
        state.partnerObj = { ...state.partnerObj, ...res }
        if (state.partnerObj.hasOwnProperty('groupUnAim') && state.partnerObj.hasOwnProperty('groupAim')) {
            state.groupAim = 0
            state.groupUnAim = (state.partnerObj.groupUnAim / (state.partnerObj.groupUnAim + state.partnerObj.groupAim) * 100 || 0).toFixed(2)
            state.passRate = state.groupUnAim + '%'
            console.log(state.passRate,state.groupUnAim )
        }
    } catch (error) {
        console.log(error);
    }
}
function searchUser(){
    state.userArr = []
    finished.value = false
    state.page.pageNo = 1
    //getUserList()
    if (state.username == '') {
        state.showClearIcon = false
    }
}
function changeLevel(level){
    state.level = level
    state.userArr = []
    finished.value = false
    state.page.pageNo = 1
    //getUserList()
}
//getUserList()
async function getUserList() {
    let url = '/player/sub_players'
    let data = {
        username:state.username,
        level:state.level,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    try {
        const res = await http.post(url, data)
        loading.value = false
        console.log(
            '%c res: ',
            'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
            res
        )
        state.userArr = [...state.userArr, ...res.results] || []
        state.page.pageNo = res.pageNo+1
        state.page.pageSize = res.pageSize
        state.page.hasNext = res.hasNext
        finished.value = !res.hasNext
    } catch (error) {
        finished.value = true
        console.log(error);
    }
}
function showDetail(type){
    router.push({
        path:'/partnerTeam',
        query:{
            type:type
        }
    })
}
function clearContent() {
    state.username = ''
    state.showClearIcon = false
    getUserList()
}
function inputBlur() {
    if (state.username == '') {
        state.showClearIcon = false
    }
}
function handleClickTab(item, index) {
    state.tabsIndex = index
    loadData()
    getTeamData(1)
}
const { tabsIndex, groupUnAim, groupAim, partnerObj, passRate, userArr,loadCircle,unitNum,username,level,showClearIcon } = toRefs(state)
</script>
<style scoped lang='scss'>
.partner {
    height: 100%;
    background-color: $mainBg;
    box-sizing: border-box;
    padding-top: 13px;
    overflow: auto;
    .loading-div{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 999;
        @include flex(center);
    }
    .totalData {
        // width: 351px;
        height: 60px;
        padding: 18px 15px 14px;
        border-radius: 10px;
        background-color: #2e2e2e;
        box-sizing: border-box;
        @include flex(space-between);

        .left {
            @include flex(flex-start);

            .totalIcon {
                width: 28px;
                height: 28px;
                margin-right: 8px;
            }

            span {
                font-size: 14px;
                color: #fff;
            }
        }

        .arrow-right {
            width: 18px;
            height: 18px;
        }
    }

    .balanceBox {
        margin-top: 22px;
        @include flex();

        .item {
            width: 108px;
            height: 108px;
            border-radius: 10px;
            background-color: #ff7c43;
            @include flex(flex-start, flex-start);
            flex-direction: column;
            padding: 10px 10px;
            box-sizing: border-box;
            
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 添加省略号表示被裁切的文本 */
            white-space: nowrap; /* 保持单行显示 */

            img {
                width: 34px;
                height: 34px;
            }

            .name {
                font-size: 12px;
                color: #fff;
                margin: 10px 0 6px 0;
            }

            .num {
                font-size: 15px;
                font-weight: bold;
                color: #fff;
            }
        }

        .trade {
            background-color: #0b4de6;
        }

        .win {
            background-color: #1f996b;
        }
    }

    .tabs {
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        @include flex(flex-start);
        margin-top: 27px;
        font-size: 16px;
        color: #8d8d8d;

        div {
            margin-right: 32px;
            cursor: pointer;
        }
    }

    .tabActive {
        color: #fff;
    }

    .teamReport {
        font-size: 16px;
        color: #fff;
        margin: 15px 0;
        font-family: $fontFamily;

        span {
            color: #ff7c43;

        }
    }

    .progressBar {
        padding: 30px 20px;
        border-radius: 10px;
        background-color: #2e2e2e;
        @include flex();

        .p_left {
            font-size: 14px;
            letter-spacing: 0.41px;
            color: #d9dbe9;

            .tangerine {
                color: #ff7c43;
            }

            .blue {
                color: #0b4de6;
            }
            .green{
                color:#1f996b;
            }

            .mt {
                margin-top: 30px!important;
            }
            p{
                margin-top: 3px;
            }
            .p_left_item{
                position: relative;
                img{
                    position: absolute;
                    right: -25px;
                    top: -2px;
                    width: 15px;
                    height: auto;
                }
            }
        }

        .p_right {
            width: 97px;
            height: 97px;

            :deep(.van-circle) {
                .van-circle__text {
                    font-family: $fontFamily;
                    font-size: 14px;
                    font-weight: bold;
                    color: #fff;
                }
            }
        }
    }

    .teamList {
        padding-bottom: 20px;
        .teamlist-box{
            @include flex(space-between,center);
            padding-bottom:5px;
            border-bottom:1px solid #8d8d8d;;
            .team-search{
                height: 40px;
                width:205px;
            }
        }
        .title {
            margin: 17px 0;
            font-size: 16px;
            color: #fff;
        }
        .team-level{
            margin: 10px;
            @include flex(flex-start);
            .team-level-item{
                margin-right: 10px;
                background-color: #2b2b2b;
                color:#707070;
                padding:6px 10px;
                border-radius: 2px;
            }
            .active{
                color:#ff6c00;
            }
        }
        .item {
            // width: 351px;
            height: 56px;
            margin: 0 0 8px;
            padding: 9px 12px 8px 13px;
            border-radius: 6px;
            background-color: #2e2e2e;
            box-sizing: border-box;

            p {
                @include flex();
                font-size: 12px;
                color: #8d8d8d;

                .name {
                    font-size: 14px;
                    color: #fff;
                }
            }

            p:first-child {
                margin-bottom: 8px;
            }
        }
    }
}
:deep(.van-search) {
    padding: 4px 8px;
    border-radius: 21px;
    box-sizing: border-box;

    .van-search__content {
        background-color: #252528;

        .searchIcon {
            width: 22px;
            height: 22px;
        }

        .van-cell {
            .van-cell__value {
                .van-field__body {
                    font-family: $fontFamily;

                    .van-field__control {
                        color: #fff;
                    }
                }
            }
        }
    }
}
.partner::-webkit-scrollbar {
    width: 0px;
    /* 设置滚动条宽度 */
}

.partner::-webkit-scrollbar-track {
    background-color: rgb(0, 0, 0);
    /* 设置滚动条轨道背景色 */
}

.partner::-webkit-scrollbar-thumb {
    background-color: rgb(0, 0, 0);
    /* 设置滚动条滑块颜色 */
}

.partner::-webkit-scrollbar-thumb:hover {
    background-color: rgb(0, 0, 0);
    /* 设置滚动条滑块在鼠标悬停时的颜色 */
}
</style>