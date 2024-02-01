<template>
    <div class="partner maxWidth lrPadding">
        <div class="totalData">
            <div class="left">
                <img src="../assets/images/partner/totalIcon.webp" class="totalIcon" alt="">
                <span>Total Data Summary</span>
            </div>
            <img src="../assets/images/partner/arrow-right.webp" class="arrow-right" alt="">
        </div>
        <div class="balanceBox">
            <div class="item" :class="item.img" v-for="(item, index) in balance" :key="index">
                <img :src="getImg('partner', item.img)" alt="">
                <p class="name">{{ item.name }}</p>
                <p class="num"><span v-if="item.img != 'trade'">$ </span>{{ item.num }}</p>
            </div>
        </div>
        <div class="tabs">
            <div v-for="(item, index) in tabArr" :key="index" :class="{ tabActive: index === tabsIndex }">
                {{ item.name }}
            </div>
        </div>
        <p class="teamReport">Team Report: <span> Not up to standard</span></p>
        <div class="progressBar">
            <div class="p_left">
                <p>Team Motivation</p>
                <p>Achievement: <span class="tangerine">0</span></p>
                <p class="mt">Team incentives</p>
                <p>not up to par: <span class="blue">0</span></p>
            </div>
            <div class="p_right">
                <van-circle v-model:current-rate="currentRate" :rate="rate" color="#ff7c43" layer-color="#0b4de6"
                    :stroke-width="80" text="60%" />
            </div>
        </div>
        <div class="teamList">
            <p class="title">Team list</p>
            <div class="item">
                <p>
                    <span class="name">name</span>
                    <span>Logir Time</span>
                </p>
                <p>
                    <span>id:565655</span>
                    <span>07/11/2023 20:41:13</span>
                </p>
            </div>
            <div class="item">
                <p>
                    <span class="name">name</span>
                    <span>Logir Time</span>
                </p>
                <p>
                    <span>id:565655</span>
                    <span>07/11/2023 20:41:13</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs } from 'vue'
import { getImg } from '@/utils/utils'
import http from '@/utils/axios'
const state = reactive({
    balance: [
        {
            img: 'balance',
            name: 'Balance',
            num: 0
        },
        {
            img: 'trade',
            name: 'Trade User',
            num: 0
        },
        {
            img: 'win',
            name: 'Winning',
            num: 0
        },
    ],
    tabsIndex: 0,
    tabArr: [
        {
            name: 'Today'
        },
        {
            name: 'Week'
        },
        {
            name: 'Last Ten days'
        },
    ],
    currentRate: 40,
    rate: 60
})
const { balance, tabsIndex, tabArr, currentRate, rate } = toRefs(state)
</script>
<style scoped lang='scss'>
.partner {
    height: 100%;
    background-color: #18181b;
    box-sizing: border-box;
    padding-top: 13px;
    overflow: auto;

    .totalData {
        width: 351px;
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
            padding: 10px 16px;
            box-sizing: border-box;

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
                color: #d9dbe9;
            }

            .blue {
                color: #ff7c43;
            }

            .mt {
                margin-top: 30px;
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
        .title {
            margin: 17px 0;
            font-size: 16px;
            color: #fff;
        }

        .item {
            width: 351px;
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
</style>