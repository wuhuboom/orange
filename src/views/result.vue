<template>
    <div class="result hideScrollbar maxWidth lrPadding">
        <div class="fixed maxWidth lrPadding">
            <van-search v-model="teamName" @blur="inputBlur" @focus="showClearIcon = true"
                :placeholder="$t('match.search.text')" :clearable="false" background="#252528"
                @update:model-value="getSearchGameRes">
                <template #left-icon>
                    <img src="../assets/images/match/searchIcon.webp" class="searchIcon" alt="">
                </template>
                <template #right-icon>
                    <div @click="clearContent" v-if="showClearIcon">
                        <van-icon name="cross" />
                    </div>
                </template>
            </van-search>
            <div class="dateOpt">
                <div class="today" :class="{ dateActive: dateIndex === 0 }" @click="handleChangeDate(0)">{{
                    $t('match.records.today.text') }}</div>
                <div class="yestoday" :class="{ dateActive: dateIndex === 1 }" @click="handleChangeDate(1)">{{
                    $t('match.records.yes.text') }}</div>
                <div class="week" :class="{ dateActive: dateIndex === 2 }" @click="handleChangeDate(2)">{{
                    $t('match.records.nearly7.text') }}</div>
            </div>
        </div>
        <div class="listBox">
            <van-pull-refresh class="pageRefresh" :immediate-disable="true" v-model="refreshing" @refresh="onRefresh"
                :loading-text="$t('load.loading.text')">
                <van-list v-model:loading="loading" :finished="finished" :finished-text="$t('load.no.more.text')"
                    :loading-text="$t('load.loading.text')" @load="onLoad" :immediate-check="true" :offset='50'>
                    <template #default>
                        <div class="listContent" v-for="(item, index) in grList" :key="index">
                            <div class="cLeft">
                                <p class="date">{{ formatDate(item.finishTime, 'HH:mm') }}</p>
                                <p class="score">{{ item.homeHalf }}-{{ item.guestHalf }}</p>
                            </div>
                            <div class="cRight">
                                <div class="rfirst">
                                    <div class="firstInfo">
                                        <img :src="item.mainLogo" alt="">
                                        <span>{{ item.mainName }}</span>
                                    </div>
                                    <div class="num">{{ item.homeFull }}</div>
                                </div>
                                <div class="rLast">
                                    <div class="lastInfo">
                                        <img :src="item.guestLogo" alt="">
                                        <span>{{ item.guestName }}</span>
                                    </div>
                                    <div class="num">{{ item.guestFull }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </van-list>
            </van-pull-refresh>

        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted, watchEffect } from 'vue'
import http from '@/utils/axios'
import { formatDate, getImg } from '@/utils/utils'

const state = reactive({
    totalCount: 0,
    activeNames: ['1'],
    teamName: '',
    dateIndex: 0,
    page: {
        pageNo: 1,
        pageSize: 10,
        hasNext: false,
    },
    //比赛结果
    grList: [],
    teamLs: [],
    loading: false,
    finished: false,
    refreshing: false,
    timer: null,
    refreshTimer: null,
    loadTime: null,
    showClearIcon: false,
    loadTimer: null
})
function getSearchGameRes() {
    // state.showClearIcon = true
}
function clearContent() {
    state.teamName = ''
    state.showClearIcon = false
}
function inputBlur() {
    if (state.teamName == '') {
        state.showClearIcon = false
    }
}
function handleChangeDate(index) {
    state.dateIndex = index
    getGameResList('refresh')
}
// getGameResList()
async function getGameResList(val) {
    let url = '/player/game/finished'
    let data = {
        startTime: state.dateIndex,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    state.loading = true
    try {
        const res = await http.post(url, data)
        console.log(res);
        if (res?.results) {
            if (val == 'refresh' || val == 'search') {
                state.grList = []
            }
            state.grList = [...state.grList, ...res.results]
            state.page.pageNo = res.pageNo
            state.page.pageSize = res.pageSize

            if (!res.hasNext) {
                state.finished = true
            }

            state.loading = false
            state.refreshing = false
        }
    } catch (error) {
        console.log(error);
    }

}
function onLoad() {
    state.loadTime && clearTimeout(state.loadTime)
    state.loadTime = setTimeout(() => {
        if (state.page.hasNext) {
            state.page.pageNo += 1
        }
        getGameResList()
    }, 1000);
}
function onRefresh() {
    console.log(11123);
    state.page.pageNo = 1
    getGameResList('refresh')
}
watchEffect(() => {
    if (state.teamName == '') {
        state.showClearIcon = false
    }
})
const { activeNames, grList, teamName, loading, finished, refreshing, dateIndex, totalCount, showClearIcon } = toRefs(state)
</script>
<style scoped lang='scss'>
.result {
    height: 100%;
    box-sizing: border-box;
    padding-top: 105px;
    overflow-y: auto;
    background-color: #18181b;

    .fixed {
        position: fixed;
        top: 44px;
        left: 0;
        right: 0;
        background-color: #18181b;
        z-index: 2;
        box-sizing: border-box;

        :deep(.van-search) {
            padding: 4px 8px;
            border-radius: 21px;
            box-sizing: border-box;
            margin-bottom: 10px;

            .van-search__content {
                background-color: #252528;

                .searchIcon {
                    width: 22px;
                    height: 22px;
                }

                .van-cell {
                    .van-cell__value {
                        .van-field__body {
                            .van-field__control {
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }

        .dateOpt {
            width: 100%;
            @include flex(space-between);
            color: #fff;
            margin-bottom: 20px;

            >div {
                width: 30%;
                height: 35px;
                line-height: 35px;
                text-align: center;
                background-color: #24232a;
                border-radius: 10px;
                cursor: pointer;
            }

            .dateActive {
                background-color: #ff7c43;
            }
        }

    }


    .listBox {
        height: calc(100vh - 107px);
        // overflow: auto;
        padding-top: 20px;
    }

    .listContent {
        height: 60px;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.06);
        margin-bottom: 10px;
        @include flex();

        .cLeft {
            width: 50px;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.06);
            @include flex(center);
            flex-direction: column;

            .date {
                font-family: $fontFamily;
                font-size: 12px;
                color: #fff;
            }

            .score {
                font-family: $fontFamily;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.48);
                margin-top: 3px;
            }
        }

        .cRight {
            width: calc(100% - 50px);
            @include flex();
            flex-direction: column;
            box-sizing: border-box;

            .spanStyle {
                font-family: $fontFamily;
                font-size: 13px;
                letter-spacing: 0.42px;
                color: #fff;
            }

            .rfirst {
                @include flex();
                width: 100%;
                padding: 0 8px;
                box-sizing: border-box;

                .firstInfo {
                    @include flex(flex-start);

                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                    }

                    span {
                        @extend .spanStyle;
                    }
                }

                .num {
                    @extend .spanStyle;
                }
            }

            .rLast {
                @extend .rfirst;
                margin-top: 8px;

                .lastInfo {
                    @include flex();

                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                    }

                    span {
                        font-family: $fontFamily;
                        font-size: 13px;
                        letter-spacing: 0.42px;
                        color: #fff;
                    }
                }
            }
        }
    }

    .van-hairline--top-bottom::after {
        display: none;
    }
}
</style>