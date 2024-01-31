<template>
    <div class="contest maxWidth lrPadding">
        <van-search v-model="value" placeholder="Type to search" clearable background="#252528">
            <template #left-icon>
                <img src="../assets/images/contest/searchIcon.webp" class="searchIcon" alt="">
            </template>
        </van-search>

        <div class="list">
            <div class="list-item">
                <van-collapse v-model="activeNames" @change="handleCollapse">
                    <van-collapse-item name="1">
                        <template #title>
                            <div class="title">
                                <div class="leftTit">
                                    <img src="../assets/images/contest/fIcon.webp" class="fIcon" alt="">
                                    <span>Friendlies Clubs</span>
                                </div>
                            </div>
                        </template>
                        <template #right-icon>
                            <img :src="getImg('contest', (activeNames.includes('1') ? 'arrowUp' : 'arrowDown'))"
                                class="arrowIcon" alt="">
                        </template>
                        <template #default>
                            <div class="content" v-for="(item, index) in list" :key="index" @click="toBetPage">
                                <div class="c_header">
                                    <span class="contentId">ID: {{ item.id }}</span>
                                    <img src="../assets/images/contest/copy.webp" alt="" class="copy"
                                        @click="copyBtn(item)">
                                </div>
                                <div class="cMain">
                                    <div class="main_left">
                                        <div class="date">
                                            <p>24</p>
                                            <p>Jan</p>
                                        </div>
                                        <div class="main_name">
                                            <p>
                                                <img src="../assets/images/contest/topIcon.webp" alt="">
                                                <span>Liverpool</span>
                                            </p>
                                            <p>
                                                <img src="../assets/images/contest/bottomIcon.webp" alt="">
                                                <span>Aston Villa</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="main_right">
                                        09.00 AM
                                    </div>
                                </div>
                            </div>
                        </template>
                    </van-collapse-item>
                    <!-- <van-collapse-item title="标题2" name="2" icon="shop-o">
                        技术无非就是那些开发它的人的共同灵魂。
                    </van-collapse-item> -->
                </van-collapse>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs } from 'vue'
import { showToast } from 'vant'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router'

import useClipboard from "vue-clipboard3";

const { toClipboard } = useClipboard()
const router = useRouter()

const state = reactive({
    activeNames: ["1"],
    list: [
        {
            id: '56598989',
        },
        {
            id: '56598233',
        },
        {
            id: '56598453',
        },
        {
            id: '56598234',
        },
        {
            id: '56598989',
        },
        {
            id: '56598989',
        },
        {
            id: '56598989',
        },
    ]
})
function toBetPage() {
    router.push({
        path: '/betPage'
    })
}
function handleCollapse() {
    console.log(state.activeNames);
}
function copyBtn(item) {
    toClipboard(item.id).then(() => {
        showToast('copy Success')
    })
}
const { activeNames, list } = toRefs(state)
</script>
<style scoped lang='scss'>
.contest {
    height: 100%;
    background-color: #18181b;
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
        }
    }

    .list {

        .list-item {
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
                                        @include flex();

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

                                            }
                                        }
                                    }

                                    .main_right {
                                        height: 32px;
                                        padding: 8px 10px;
                                        border-radius: 16px;
                                        box-sizing: border-box;
                                        background-color: #3d3d3d;
                                        @include flex();
                                        font-family: SegoeUI;
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
</style>