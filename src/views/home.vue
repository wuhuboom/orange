<template>
    <div class="home maxWidth">
        <div class="fSwiper">
            <Swiper slides-per-view="auto" :space-between="12" :centeredSlides="true" :loop="true"
                :autoplay="swiperAutoPlay" class="homeSwiper">
                <swiper-slide v-for="(item, index) in swiper" :key="index">
                    <img :src="item?.imageUrl" />
                </swiper-slide>
            </Swiper>
            <div class="fTips lrPadding">
                <div class="tips_left">
                    <van-notice-bar scrollable background="#1F1F21" text="Welcome to CTER Football!">
                        <template #left-icon>
                            <img src="../assets/images/home/notice.webp" class="notice" alt="">
                        </template>
                    </van-notice-bar>
                </div>
                <img src="../assets//images/home/listIcon.webp" class="listIcon" alt="">
            </div>
        </div>
        <div class="main">
            <div>
                <div class="title lrPadding">
                    <span class="t_left">Upcoming</span>
                    <span class="t_right">See All</span>
                </div>
                <div class="foretell">
                    <Swiper slides-per-view="auto" :freeMode="true" :space-between="12">
                        <swiper-slide v-for="(item, index) in upcomingSwiper" :key="index"
                            :class="{ s_active: upcomingIndex === index }" @click="changeSwiper(index)">
                            <div class="f_title">{{ item.allianceName }}</div>
                            <div class="f_vs">
                                <div class="u_left">
                                    <img :src="item.mainLogo" class="vs_left" alt="">
                                    <span class="name_left">{{ getSplitName(item.mainName) }}</span>
                                </div>
                                <div class="vs_content">
                                    <h2>vs</h2>
                                    <p class="uDate">{{ formatDate(item.startTime, 'HH:mm') }}</p>
                                </div>
                                <div class="u_right">
                                    <img :src="item.guestLogo" class="vs_right" alt="">
                                    <span class="name_right">{{ getSplitName(item.guestName) }}</span>
                                </div>
                            </div>
                        </swiper-slide>
                    </Swiper>
                </div>
            </div>
            <div class="list">
                <div class="title lrPadding">
                    <span class="t_left">Top events</span>
                    <span class="t_right">See All</span>
                </div>
                <div class="e_lists lrPadding">
                    <div class="item" v-for="(item, index) in gameList" :key="index">
                        <div class="itemLeft">
                            <div class="name">{{ item.mainName }}</div>
                            <img :src="item.mainLogo" class="listlIcon" alt="">
                        </div>
                        <div class="itemCenter">
                            <p class="date">{{ formatDate(item.startTime, 'YYYY-MM-DD') }}</p>
                            <p class="time">{{ formatDate(item.startTime, 'HH:mm:ss') }}</p>
                        </div>
                        <div class="itemRight">
                            <img :src="item.guestLogo" class="listrIcon" alt="">
                            <div class="name">{{ item.guestName }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs } from 'vue'
import { formatDate } from '@/utils/utils'
import http from '@/utils/axios'


import { Swiper, SwiperSlide } from 'swiper/vue';

const state = reactive({
    swiper: [],
    upcomingIndex: 0,
    upcomingSwiper: [],
    gameList: [],
    swiperAutoPlay: {
        delay: 3000, // 自动播放间隔时间，单位为毫秒
        disableOnInteraction: false, // 用户操作后是否停止自动播放，默认为 true
    }
})
getInit()
function getInit() {
    getSwiper()
    getAllGame()
    getHotGame()
}
async function getHotGame() {
    let url = '/player/home/hot'
    try {
        const res = await http.get(url)
        state.gameList = res || []
    } catch (error) {
        console.log(error);
    }
}
async function getAllGame() {
    let url = '/player/game'
    // startTime 日期选项0全部,1今天,2明日
    let data = {
        startTime: 1,
        status: 0,
        pageNo: 1,
        pageSize: 10,
        teamName: ''
    }
    try {
        const res = await http.post(url, data)
        if (res && Array.isArray(res.results)) {
            state.upcomingSwiper = res.results
        }
    } catch (error) {
        console.log(error);
    }
}
async function getSwiper() {
    let url = '/player/home/slider'
    try {
        const res = await http.get(url)
        state.swiper = res || []
    } catch (error) {
        console.log(error);
    }
}
function changeSwiper(index) {
    state.upcomingIndex = index
}
function getSplitName(name) {
    if (name != '') {
        const index = name.indexOf("("); // 查找第一个 "(" 的位置
        if (index !== -1) {
            name = name.slice(0, index); // 截取 "(" 之前的内容
        }
    }
    return name
}
const { swiper, upcomingSwiper, upcomingIndex, gameList, swiperAutoPlay } = toRefs(state)
</script>
<style scoped lang='scss'>
.home {
    min-height: 100%;
    background-color: #18181B;
    padding-top: 27px;
    padding-bottom: 50px;

    .fSwiper {
        padding-left: 12px;
        min-height: 205px;

        .homeSwiper {
            min-height: 164px;

            :deep(.swiper-wrapper) {
                .swiper-slide {
                    width: 310px !important;

                }

            }
        }
    }

    .fTips {
        height: 36px;
        box-sizing: border-box;
        @include flex(space-between);
        // padding: 10px 12px 7px;
        background-color: #1F1F21;
        margin-right: 12px;
        border-radius: 10px;
        margin-top: 13px;

        .tips_left {
            width: 100%;
            height: 36px;
            @include flex(space-between);

            :deep(.van-notice-bar) {
                width: 100%;
                height: 36px !important;
                padding: 0px;

                .van-notice-bar__wrap {
                    height: 36px;

                    .van-notice-bar__content {
                        height: 36px;
                        font-size: 12px;
                        color: #fff;
                        margin-left: 13px;
                        display: flex;
                        align-items: center;
                    }
                }
            }

            .notice {
                width: 20px;
                height: 20px;
            }



            span {
                font-size: 12px;
                color: #fff;
            }
        }

        .listIcon {
            width: 22px;
            height: 22px;
        }
    }

    .main {
        margin-top: 15px;
        background-color: #18181B;

        .title {
            @include flex(space-between);
            margin-bottom: 12px;

            .t_left {
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.26px;
                color: #fff;
            }

            .t_right {
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 0.26px;
                color: #ff7c43;
            }
        }

        .foretell {
            margin-top: 12px;
            padding-left: 12px;

            :deep(.swiper) {
                .swiper-wrapper {
                    .swiper-slide {
                        width: 222px !important;
                        display: flex;
                        flex-direction: column;
                        padding: 11px 0 10px 13px;
                        border-radius: 10px;
                        background-color: #2b2b2b;
                        margin-right: 12px;

                        .f_title {
                            font-size: 10px;
                            font-weight: 500;
                            color: #fff;
                            margin-bottom: 10px;
                        }

                        .f_vs {
                            @include flex();
                            margin-bottom: 10px;
                            padding: 0 19px 0 10px;


                            .u_left {
                                width: 40%;
                                @include flex();
                                flex-direction: column;
                                font-size: 10px;
                                font-weight: 500;
                                color: #fff;

                                .name_left {
                                    text-align: center;
                                    margin-top: 5px;
                                }
                            }

                            .u_right {
                                @extend .u_left;

                                .name_right {
                                    text-align: center;
                                    margin-top: 5px;
                                }
                            }

                            img {
                                width: 45px;
                                height: 45px;
                            }

                            .vs_content {

                                h2 {
                                    font-size: 20px;
                                    font-weight: 600;
                                    text-align: center;
                                    color: #fff;
                                }

                                p {
                                    font-size: 9px;
                                    font-weight: 500;
                                    color: #fff;
                                }

                                img {
                                    width: 45px;
                                    height: 45px;
                                }

                            }
                        }

                        .uDate {
                            text-align: center;
                            font-size: 10px;
                            font-weight: 500;
                            color: #fff;
                        }
                    }

                    .s_active {
                        background: linear-gradient(89deg, #e8763e 1%, #d24509 99%) !important;
                    }
                }
            }
        }

        .list {
            // width: 100%;
            margin: 18px 0 15px 0;

            .e_lists {

                .item {
                    width: 100%;
                    height: 65px;
                    @include flex();
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.24px;
                    color: #fff;
                    border-radius: 5px;
                    background-color: #1F1F21;
                    padding: 0 11px 0 15px;
                    box-sizing: border-box;
                    margin-bottom: 10px;

                    .itemLeft {
                        @include flex();

                        .name {
                            width: 70px;
                            line-height: 16px;
                            text-align: center;
                        }

                        .listlIcon {
                            width: 26px;
                            height: 26px;
                            margin-left: 15px;
                        }
                    }

                    .itemCenter {

                        @include flex();
                        flex-direction: column;

                        .date {
                            text-align: center;
                        }

                        .time {
                            margin-top: 4px;
                        }
                    }

                    .itemRight {

                        @include flex();

                        .name {
                            width: 70px;
                            line-height: 16px;
                            text-align: center;
                        }

                        .listrIcon {
                            width: 26px;
                            height: 26px;
                            margin-right: 16px;
                        }
                    }
                }
            }
        }
    }
}
</style>