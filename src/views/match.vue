<template>
    <div class="contest maxWidth lrPadding">
        <van-search v-model="teamName" @blur="inputBlur" @focus="showClearIcon = true"
            :placeholder="$t('match.search.text')" :clearable="false" background="#252528"
            @update:model-value="getSearchGameRes" @clear="clearContent">
            <template #left-icon>
                <img src="../assets/images/match/searchIcon.webp" class="searchIcon" alt="">
            </template>
            <template #right-icon>
                <div @click="clearContent" v-if="showClearIcon">
                    <van-icon name="cross" />
                </div>
            </template>
        </van-search>

        <div class="dateOption">
            <p @click="selectDate(0)" :class="{ dateActive: dateIndex === 0 }">{{ $t('match.all.text') }} <span
                    v-if="dateIndex === 0 && totalCount > 0">({{
                        totalCount }})</span></p>
            <p @click="selectDate(1)" :class="{ dateActive: dateIndex === 1 }">{{ $t('match.today.text') }} <span
                    v-if="dateIndex === 1 && totalCount > 0">({{
                        totalCount }})</span></p>
            <p @click="selectDate(2)" :class="{ dateActive: dateIndex === 2 }">{{ $t('match.tomorrow.text') }}
                <span v-if="dateIndex === 2 && totalCount > 0">({{ totalCount }})</span>
            </p>
        </div>

        <div class="list">
            <div class="list-item">
                <van-pull-refresh v-model="refreshing" :immediate-disable="true" @refresh="onRefresh"
                    :loading-text="$t('load.loading.text')" :loosing-text="$t('match.loosing.text')">
                    <van-list v-model:loading="loading" :finished="finished" :loading-text="$t('load.loading.text')"
                        :finished-text="$t('load.no.more.text')" @load="onLoad" :immediate-check="true">
                        <van-cell v-for="(item, index) in list" :key="index">
                            <van-collapse v-model="activeNames" accordion @change="handleCollapse">
                                <van-collapse-item :name="index">
                                    <template #title>
                                        <div class="title">
                                            <div class="leftTit">
                                                <img src="../assets/images/match/fIcon.webp" class="fIcon" alt="">
                                                <span>{{ item.allianceName }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <template #right-icon>
                                        <img :src="getImg('match', (activeNames === index ? 'arrowUp' : 'arrowDown'))"
                                            class="arrowIcon" alt="">
                                    </template>
                                    <template #default>
                                        <div class="content" v-for="(it, index) in item.games" :key="index"
                                            @click="toBetPage(it)">
                                            <div class="c_header">
                                                <span class="contentId">ID: {{ it.id }}</span>
                                                <img src="../assets/images/match/copy.webp" alt="" class="copy"
                                                    @click.stop="copyBtn(it)">
                                            </div>
                                            <div class="cMain">
                                                <div class="main_left">
                                                    <div class="date">
                                                        <p>{{ new Date(it.startTime).getDate() }}</p>
                                                        <p>{{ getENMonth(it.startTime) }}</p>
                                                    </div>
                                                    <div class="main_name">
                                                        <p>
                                                            <img :src="it.mainLogo" alt="">
                                                            <span>{{ getSplitName(it.mainName) }}</span>
                                                        </p>
                                                        <p>
                                                            <img :src="it.guestLogo" alt="">
                                                            <span>{{ getSplitName(it.guestName) }}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="main_right">
                                                    {{ formatDate(it.startTime, 'HH:mm') }} {{ getAmOrPm(it.startTime)
                                                    }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </van-collapse-item>
                            </van-collapse>
                        </van-cell>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted, watchEffect } from 'vue'
import { showToast } from 'vant'
import { getImg, getSplitName, formatDate, getAmOrPm, getENMonth } from '@/utils/utils'
import { useRouter } from 'vue-router'
import http from '@/utils/axios'
import { useStore } from '@/stores/index'

import useClipboard from "vue-clipboard3";
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const store = useStore()

const { toClipboard } = useClipboard()
const router = useRouter()

const state = reactive({
    dateIndex: 0,
    totalCount: 0,
    activeNames: 0,
    teamName: '',
    page: {
        pageNo: 1,
        pageSize: 10,
        hasNext: false,
    },
    list: [],
    teamLs: [],
    loading: false,
    finished: false,
    refreshing: false,
    timer: null,
    refreshTimer: null,
    loadTime: null,
    showClearIcon: false
})
function getSearchGameRes() {
    state.timer && clearTimeout(state.timer)
    state.timer = setTimeout(() => {
        state.page.pageNo = 1
        getGameList('search')
    }, 500);
}
onMounted(()=>{
    store.getUserInfo ()
})
getGameList()
async function getGameList(val) {
    let url = '/player/game/g'
    // startTime 日期选项0全部,1今天,2明日, status状态选项0未开始
    let data = {
        startTime: state.dateIndex,
        status: 0,
        teamName: state.teamName,
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    state.loading = true
    // state.refreshing = true
    try {
        const res = await http.post(url, data)
        if (res && res.results.length > 0) {
            if (val == 'refresh' || val == 'search') {
                state.list = []
            }
            state.list = [...state.list, ...res.results]
            state.page.pageNo = res.pageNo
            state.page.pageSize = res.pageSize
            if (res.totalCount > (res.pageSize * res.totalPage)) {
                state.page.hasNext = true
            } else {
                state.page.hasNext = false
                state.finished = true
            }
            if (!res.hasNext) {
                state.finished = true
            }
            state.page.totalPage = res.totalPage
            state.totalCount = res.totalCount
            state.loading = false
            state.refreshing = false
        }
    } catch (error) {
        state.loading = false
        console.log(error);
    }
}
function onLoad() {
    state.loadTime && clearTimeout(state.loadTime)
    state.loadTime = setTimeout(() => {
        if (state.page.hasNext) {
            state.page.pageNo += 1
        }
        getGameList()
    }, 1000);
}
function onRefresh() {
    // state.refreshTimer && clearTimeout(state.refreshTimer)
    // state.refreshTimer = setTimeout(() => {
    state.page.pageNo = 1
    getGameList('refresh')
    // }, 1000);

}
function selectDate(num) {
    state.totalCount = 0
    state.dateIndex = num
    getGameList('refresh')
}
function toBetPage(item) {
    router.push({
        path: `/betPage`,
        query: {
            gameId: item.id
        }
    })
}
function handleCollapse() {
    console.log(state.activeNames);
}
async function copyBtn(item) {
    let copyText = item.id.toString()
    try {
        await toClipboard(copyText)
        showToast(t('transfer.copy.success.text'))
    } catch (error) {
        console.log(error);
    }
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
watchEffect(() => {
    if (state.teamName == '') {
        state.showClearIcon = false
    }
})
const { activeNames, list, teamName, loading, finished, refreshing, dateIndex, totalCount,showClearIcon } = toRefs(state)
</script>
<style scoped lang='scss'>
.contest {
    height: 100%;
    background-color: $mainBg;
    box-sizing: border-box;
    padding-top: 5px;
    overflow-y: auto;

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

    .dateOption {
        width: 100%;
        margin-top: 12px;
        @include flex(space-between);

        p {
            min-width: 80px;
            background-color: #252528;
            border-radius: 15px;
            padding: 8px 14px;
            font-size: 14px;
            color: #8d8d8d;
            text-align: center;
            font-family: $fontFamily;
        }

        .dateActive {
            background-color: #fe7c43;
            color: #fff;
        }
    }

    .list {
        margin-top: 17px;

        .list-item {
            .van-list {
                .van-cell {
                    background-color: #18181b;
                    line-height: normal;
                    padding: 0px 0 5px 0;
                }
            }

            :deep(.van-collapse) {
                background-color: #18181b;

                &::after {
                    border: none;
                }

                .van-collapse-item {
                    background-color: #18181b;

                    &::after {
                        border-color: #fff;
                    }

                    .van-cell {
                        background-color: #18181b;

                        .van-cell__title {

                            .title {
                                .leftTit {
                                    @include flex(flex-start);

                                    span {
                                        font-size: 14px;
                                        color: #fff;
                                        margin-left: 7px;
                                        font-family: $fontFamily;
                                    }

                                    .fIcon {
                                        width: 16px;
                                        height: 16px;
                                    }
                                }
                            }
                        }

                        .arrowIcon {
                            width: 22px;
                            height: 22px;
                        }
                    }

                    .van-collapse-item__wrapper {
                        .van-collapse-item__content {
                            background-color: #18181b;

                            .content {
                                margin-bottom: 12px;
                                cursor: pointer;
                                font-family: $fontFamily;

                                .c_header {
                                    height: 35px;
                                    padding: 0 13px;
                                    border-top-left-radius: 8px;
                                    border-top-right-radius: 8px;
                                    background-color: #39393a;
                                    @include flex();

                                    .contentId {
                                        font-size: 12px;
                                        letter-spacing: -0.24px;
                                        color: #8d8d8d;
                                    }

                                    .copy {
                                        width: 20px;
                                        height: 20px;
                                    }
                                }

                                .cMain {
                                    border-bottom-left-radius: 8px;
                                    border-bottom-right-radius: 8px;
                                    background-color: rgba(255, 255, 255, 0.06);
                                    @include flex();
                                    padding: 10px 15px 10px 11px;

                                    .main_left {
                                        width: calc(100% - 75px);
                                        @include flex(flex-start);

                                        .date {
                                            border-right: 1px solid rgba(255, 255, 255, 0.1);
                                            padding-right: 14px;
                                            margin-right: 15px;

                                            p {
                                                text-align: center
                                            }

                                        }

                                        .main_name {
                                            p {
                                                @include flex(flex-start);

                                                img {
                                                    width: 16px;
                                                    height: 16px;
                                                    margin-right: 4px;
                                                }

                                                span {
                                                    text-align: left;
                                                }
                                            }
                                        }
                                    }

                                    .main_right {
                                        width: 80px;
                                        height: 32px;
                                        padding: 8px 10px;
                                        border-radius: 16px;
                                        box-sizing: border-box;
                                        background-color: #3d3d3d;
                                        @include flex();
                                        font-family: $fontFamily;
                                        font-size: 12px;
                                        font-weight: 600;
                                        letter-spacing: -0.24px;
                                        color: #eaeaea;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.contest::-webkit-scrollbar {
    width: 0px;
    /* 设置滚动条宽度 */
}

.contest::-webkit-scrollbar-track {
    background-color: rgb(0, 0, 0);
    /* 设置滚动条轨道背景色 */
}

.contest::-webkit-scrollbar-thumb {
    background-color: rgb(0, 0, 0);
    /* 设置滚动条滑块颜色 */
}

.contest::-webkit-scrollbar-thumb:hover {
    background-color: rgb(0, 0, 0);
    /* 设置滚动条滑块在鼠标悬停时的颜色 */
}
</style>