<template>
    <div class="home maxWidth">
        <div class="fSwiper">
            <!-- <van-swipe :show-indicators="false" :initial-swipe="1" :loop="false" :width="310">
                <van-swipe-item v-for="(item, index) in swiper" :key="index">
                    <img :src="getImg('home', item.link)" />
                </van-swipe-item>
            </van-swipe> -->
            <Swiper :slides-per-view="3" :space-between="12" :centeredSlides="true" :loop="true" :autoplay="3000"
                class="homeSwiper">
                <swiper-slide v-for="(item, index) in swiper" :key="index">
                    <img :src="getImg('home', item.link)" />
                </swiper-slide>
            </Swiper>
            <div class="fTips lrPadding">
                <div class="tips_left">
                    <img src="../assets/images/home/notice.png" alt="">
                    <span>Welcome to CTER Football!</span>
                </div>
                <img src="../assets//images/home/listIcon.png" class="listIcon" alt="">
            </div>
        </div>
        <div class="main">
            <div>
                <div class="title lrPadding">
                    <span class="t_left">Upcoming</span>
                    <span class="t_right">See All</span>
                </div>
                <div class="foretell">
                    <!-- <van-swipe :show-indicators="false" :loop="false" :width="222">
                        <van-swipe-item v-for="(item, index) in upcomingSwiper" :key="index">
                            <div class="f_title">{{ item.title }}</div>
                            <div class="f_vs">
                                <img src="../assets/images/home/vs_left.png" alt="">
                                <div class="vs_content">
                                    <h2>vs</h2>
                                    <p>{{ item.date }}</p>
                                </div>
                                <img src="../assets/images/home/vs_right.png" alt="">
                            </div>
                            <div class="name">
                                <span class="name_left">{{ item.firstName }}</span>
                                <span class="name_right">{{ item.lastName }}</span>
                            </div>
                        </van-swipe-item>
                    </van-swipe> -->

                    <Swiper :slides-per-view="2" :space-between="12">
                        <swiper-slide v-for="(item, index) in swiper" :key="index">
                            <div class="f_title">{{ item.title }}</div>
                            <div class="f_vs">
                                <img src="../assets/images/home/vs_left.png" alt="">
                                <div class="vs_content">
                                    <h2>vs</h2>
                                    <p>{{ item.date }}</p>
                                </div>
                                <img src="../assets/images/home/vs_right.png" alt="">
                            </div>
                            <div class="name">
                                <span class="name_left">{{ item.firstName }}</span>
                                <span class="name_right">{{ item.lastName }}</span>
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
                    <div class="item">
                        <div class="itemLeft">
                            <div>Chelsea</div>
                            <img src="../assets/images/home/listlIcon.png" class="listlIcon" alt="">
                        </div>
                        <div class="itemCenter">
                            <p class="date">27 Aug 2024</p>
                            <p class="time">01:40</p>
                        </div>
                        <div class="itemRight">
                            <img src="../assets/images/home/listrIcon.png" class="listrIcon" alt="">
                            <div>Chelsea</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemLeft">
                            <div>Chelsea</div>
                            <img src="../assets/images/home/listlIcon.png" class="listlIcon" alt="">
                        </div>
                        <div class="itemCenter">
                            <p class="date">27 Aug 2024</p>
                            <p class="time">01:40</p>
                        </div>
                        <div class="itemRight">
                            <img src="../assets/images/home/listrIcon.png" class="listrIcon" alt="">
                            <div>Chelsea</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemLeft">
                            <div>Chelsea</div>
                            <img src="../assets/images/home/listlIcon.png" class="listlIcon" alt="">
                        </div>
                        <div class="itemCenter">
                            <p class="date">27 Aug 2024</p>
                            <p class="time">01:40</p>
                        </div>
                        <div class="itemRight">
                            <img src="../assets/images/home/listrIcon.png" class="listrIcon" alt="">
                            <div>Chelsea</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs } from 'vue'
import { getImg } from '@/utils/utils'

import { Swiper, SwiperSlide } from 'swiper/vue';

const state = reactive({
    swiper: [
        {
            link: 'swiper1'
        },
        {
            link: 'swiper2'
        },
        {
            link: 'swiper3'
        },
        {
            link: 'swiper3'
        },
        {
            link: 'swiper3'
        },
        {
            link: 'swiper3'
        },
    ],
    upcomingSwiper: [
        {
            title: 'Friendlies Clubs',
            date: '03：09：31',
            firstName: 'Chelsea',
            lastName: 'Leicester'
        },
        {
            title: 'Friendlies Clubs',
            date: '03：09：31',
            firstName: 'Chelsea',
            lastName: 'Leicester'
        },
        {
            title: 'Friendlies Clubs',
            date: '03：09：31',
            firstName: 'Chelsea',
            lastName: 'Leicester'
        },

    ]
})
const { swiper, upcomingSwiper } = toRefs(state)
</script>
<style scoped lang='scss'>
.lrPadding {
    padding: 0 12px;
}

.home {
    height: 100%;
    background-color: #202020;
    padding-top: 27px;

    .fSwiper {
        padding-left: 12px;
        // :deep(.van-swipe) {
        //     width: 100%;

        //     .van-swipe__track {

        //         .van-swipe-item {
        //             width: 310px !important;
        //             margin-right: 12px;


        //         }
        //     }
        // }
        .homeSwiper {
            :deep(.swiper-wrapper) {
                .swiper-slide {
                    width: 310px !important;
                }
            }
        }
    }

    .fTips {
        @include flex(space-between);
        padding: 10px 12px 7px;
        background-color: #131313;

        .tips_left {
            @include flex(space-between);

            span {
                font-size: 12px;
                color: #fff;
                margin-left: 13px;
            }
        }
    }

    .main {
        margin-top: 15px;
        background-color: #202020;

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

                        .name {
                            font-size: 10px;
                            font-weight: 500;
                            color: #fff;
                            @include flex(space-between);
                            padding: 0 19px 0 10px;

                            span {
                                width: 45px;
                            }

                            .name_left {}

                            .name_right {}
                        }
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
                    background-color: #2b2b2b;
                    padding: 0 11px 0 15px;
                    box-sizing: border-box;
                    margin-bottom: 10px;

                    .itemLeft {
                        @include flex();

                        .listlIcon {
                            margin-left: 15px;
                        }
                    }

                    .itemCenter {

                        @include flex();
                        flex-direction: column;

                        .time {
                            margin-top: 4px;
                        }
                    }

                    .itemRight {

                        @include flex();

                        .listrIcon {
                            margin-right: 16px;
                        }
                    }
                }
            }
        }
    }
}
</style>