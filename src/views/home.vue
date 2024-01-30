<template>
    <div class="home maxWidth">
        <div class="fSwiper">
            <Swiper slides-per-view="auto" :space-between="12" :centeredSlides="true" :loop="true" :autoplay="3000"
                class="homeSwiper">
                <swiper-slide v-for="(item, index) in swiper" :key="index">
                    <img :src="getImg('home', item.link)" />
                </swiper-slide>
            </Swiper>
            <div class="fTips lrPadding">
                <div class="tips_left">
                    <img src="../assets/images/home/notice.webp" class="notice" alt="">
                    <span>Welcome to CTER Football!</span>
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
                            <div class="f_title">{{ item.title }}</div>
                            <div class="f_vs">
                                <img src="../assets/images/home/vs_left.webp" class="vs_left" alt="">
                                <div class="vs_content">
                                    <h2>vs</h2>
                                    <p>{{ item.date }}</p>
                                </div>
                                <img src="../assets/images/home/vs_right.webp" class="vs_right" alt="">
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
                            <img src="../assets/images/home/listlIcon.webp" class="listlIcon" alt="">
                        </div>
                        <div class="itemCenter">
                            <p class="date">27 Aug 2024</p>
                            <p class="time">01:40</p>
                        </div>
                        <div class="itemRight">
                            <img src="../assets/images/home/listrIcon.webp" class="listrIcon" alt="">
                            <div>Chelsea</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemLeft">
                            <div>Chelsea</div>
                            <img src="../assets/images/home/listlIcon.webp" class="listlIcon" alt="">
                        </div>
                        <div class="itemCenter">
                            <p class="date">27 Aug 2024</p>
                            <p class="time">01:40</p>
                        </div>
                        <div class="itemRight">
                            <img src="../assets/images/home/listrIcon.webp" class="listrIcon" alt="">
                            <div>Chelsea</div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="itemLeft">
                            <div>Chelsea</div>
                            <img src="../assets/images/home/listlIcon.webp" class="listlIcon" alt="">
                        </div>
                        <div class="itemCenter">
                            <p class="date">27 Aug 2024</p>
                            <p class="time">01:40</p>
                        </div>
                        <div class="itemRight">
                            <img src="../assets/images/home/listrIcon.webp" class="listrIcon" alt="">
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
    upcomingIndex: 0,
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
function changeSwiper(index) {
    state.upcomingIndex = index
}
const { swiper, upcomingSwiper, upcomingIndex } = toRefs(state)
</script>
<style scoped lang='scss'>
.home {
    height: 100%;
    background-color: #202020;
    padding-top: 27px;

    .fSwiper {
        padding-left: 12px;

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

            .notice {
                width: 20px;
                height: 20px;
            }



            span {
                font-size: 12px;
                color: #fff;
                margin-left: 13px;
            }
        }

        .listIcon {
            width: 22px;
            height: 22px;
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
                    background-color: #2b2b2b;
                    padding: 0 11px 0 15px;
                    box-sizing: border-box;
                    margin-bottom: 10px;

                    .itemLeft {
                        @include flex();

                        .listlIcon {
                            width: 40px;
                            height: 40px;
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
                            width: 40px;
                            height: 40px;
                            margin-right: 16px;
                        }
                    }
                }
            }
        }
    }
}
</style>