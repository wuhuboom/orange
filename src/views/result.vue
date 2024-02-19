<template>
    <div class="result maxWidth lrPadding">
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
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <van-collapse v-model="activeNames">
                    <van-collapse-item name="1">
                        <template #title>
                            <div class="title">
                                Premier League
                            </div>
                        </template>
                        <template #right-icon>
                            <img :src="getImg('match', (activeNames[0] === '1' ? 'arrowUp' : 'arrowDown'))"
                                class="arrowIcon" alt="">
                        </template>
                        <template #default>
                            <div class="content">
                                <div class="cLeft">
                                    <p class="date">21:00</p>
                                    <p class="score">1-2</p>
                                </div>
                                <div class="cRight">
                                    <div class="rfirst">
                                        <div class="firstInfo">
                                            <img src="../assets/images/match/bottomIcon.webp" alt="">
                                            <span>Liverpool</span>
                                        </div>
                                        <div class="num">3</div>
                                    </div>
                                    <div class="rLast">
                                        <div class="lastInfo">
                                            <img src="../assets/images/match/topIcon.webp" alt="">
                                            <span>Aston Villa</span>
                                        </div>
                                        <div class="num">1</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </van-collapse-item>
                </van-collapse>
            </van-list>
        </van-pull-refresh>

    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted, watchEffect } from 'vue'
import { getImg } from '@/utils/utils'
const state = reactive({
    dateIndex: 0,
    totalCount: 0,
    activeNames: ['1'],
    teamName: '',
    page: {
        pageNo: 1,
        pageSize: 10,
        hasNext: false,
    },
    list: [],
    teamLs: [],
    loading: false,
    finished: true,
    refreshing: false,
    timer: null,
    refreshTimer: null,
    loadTime: null,
    showClearIcon: false
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
function onload() {

}
function refresh() {

}
watchEffect(() => {
    if (state.teamName == '') {
        state.showClearIcon = false
    }
})
const { activeNames, list, teamName, loading, finished, refreshing, dateIndex, totalCount, showClearIcon } = toRefs(state)
</script>
<style scoped lang='scss'>
.result {
    height: 100%;
    box-sizing: border-box;
    padding-top: 5px;
    overflow-y: auto;
    background-color: #18181b;

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

    :deep(.van-collapse) {

        .van-collapse-item {
            .van-cell {
                background-color: #18181b;
                @include flex();
                padding: 0;

                .van-cell__title {
                    .title {
                        font-family: SegoeUI;
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.48);

                    }
                }

                .arrowIcon {
                    width: 22px;
                    height: 22px;

                }
            }

            .van-collapse-item__title--expanded:after {
                display: none;
            }

            .van-collapse-item__wrapper {
                margin-top: 8px;

                .van-collapse-item__content {
                    background-color: #18181b;
                    padding: 0;

                    .content {
                        height: 60px;
                        border-radius: 8px;
                        background-color: rgba(255, 255, 255, 0.06);

                        @include flex();

                        .cLeft {
                            width: 50px;
                            height: 100%;
                            background-color: rgba(255, 255, 255, 0.06);
                            @include flex(center);
                            flex-direction: column;

                            .date {
                                font-family: SegoeUI;
                                font-size: 12px;
                                color: #fff;
                            }

                            .score {
                                font-family: SegoeUI;
                                font-size: 12px;
                                color: rgba(255, 255, 255, 0.48);

                            }
                        }

                        .cRight {
                            width: calc(100% - 50px);
                            @include flex();
                            flex-direction: column;
                            box-sizing: border-box;

                            .spanStyle {
                                font-family: Poppins;
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
                                        font-family: Poppins;
                                        font-size: 13px;
                                        letter-spacing: 0.42px;
                                        color: #fff;
                                    }
                                }
                            }
                        }
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