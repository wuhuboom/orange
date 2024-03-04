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
                <p class="num"><span> </span>{{ partnerObj.totalBalance / 100 || 0 }}</p>
            </div>
            <div class="item trade">
                <img :src="getImg('partner', 'trade')" alt="">
                <p class="name">{{ $t('partner.trade.user.text') }}</p>
                <p class="num">{{ partnerObj.playerCount || 0 }}</p>
            </div>
            <div class="item win">
                <img :src="getImg('partner', 'win')" alt="">
                <p class="name">{{ $t('partner.winning.text') }}</p>
                <p class="num"><span> {{ partnerObj?.netProfit || 0 }} </span></p>
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
                <p>{{ $t('backapi.report.account.change.query.type.team.motivation.text') }} </p>
                <p>{{ $t('partner.achievement.text') }}: <span class="tangerine">{{ partnerObj?.groupAim || 0 }}</span></p>
                <p class="mt">{{ $t('partner.team.incentives.text') }}</p>
                <p>{{ $t('partner.not.up.to.par') }}: <span class="blue">{{ partnerObj?.groupUnAim || 0 }}</span></p>
            </div>
            <div class="p_right">
                <van-circle v-model:current-rate="groupAim" :speed="100" :rate="groupUnAim" color="#0b4de6"
                    layer-color="#ff7c43" :stroke-width="80" :text="passRate" />
            </div>
        </div>
        <div class="teamList">
            <p class="title">{{ $t('partner.team.list.text') }}</p>
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
        </div>
        <div class="loading-div" v-if="loadCircle.show">
             <van-circle v-model:current-rate="loadCircle.curRate" :speed="100" :rate="loadCircle.rate" color="#0b4de6" size="150px"
                    layer-color="#ffffff" :stroke-width="80" :text="loadCircle.text" />
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, computed } from 'vue'
import { getImg, formatDate } from '@/utils/utils'
import http from '@/utils/axios'
import { getPercent } from '@/utils/utils'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
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
        pageSize: 10,
    },
    userArr: []
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
loadData()
getTeamData(1)
 async function loadData(){
    state.loadCircle.show = true
    let process = 0
    while(process < 100){
        var randomNum = Math.floor(Math.random() * 10 + 1);
        process += 10 + randomNum
        await new Promise((resolve) => setTimeout(resolve, 500));
        state.loadCircle.curRate = process
        state.loadCircle.text = state.loadCircle.curRate + '%'
    }
    state.loadCircle.curRate = 0
    state.loadCircle.text = state.loadCircle.curRate + '%'
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
            state.groupUnAim = state.partnerObj.groupUnAim / (state.partnerObj.groupUnAim + state.partnerObj.groupAim) * 100
            state.passRate = getPercent(state.partnerObj.groupAim, 100)
        }
    } catch (error) {
        console.log(error);
    }
}
getUserList()
async function getUserList() {
    let url = '/player/sub_players'
    let data = {
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
        state.userArr = [...state.userArr, ...res.results] || []
        state.page.pageNo = res.pageNo
        state.page.pageSize = res.pageSize
        state.page.hasNext = res.hasNext
    } catch (error) {
        console.log(error);
    }
}
function handleClickTab(item, index) {
    state.tabsIndex = index
    getTeamData(1)
}
const { tabsIndex, groupUnAim, groupAim, partnerObj, passRate, userArr,loadCircle } = toRefs(state)
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

            .mt {
                margin-top: 30px!important;
            }
            p{
                margin-top: 3px;
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

        .title {
            margin: 17px 0;
            font-size: 16px;
            color: #fff;
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