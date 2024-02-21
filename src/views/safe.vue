<template>
    <div class="safe maxWidth lrPadding">
        <div class="relative cardBox">
            <div class="cardBg1"></div>
            <div class="cardBg2"></div>
            <div class="card">
                <div class="cb">
                    {{ $t('wallet.index.balance.text') }}
                    <img src="../assets/images/safe/refresh.webp" ref="refreshRef" class="refresh cursor"
                        @click="getbalance" alt="">
                </div>
                <div class="moneyusd">
                    {{ getAmount(safeData?.money) || 0 }} <span class="usd">{{ safeData?.symbol ||
                        'USDT' }}</span>
                </div>
                <div class="Cbottom">
                    <p>
                        <span>{{ $t('safe.todayIsAmount.text') }}</span>
                        <span>{{ $t('safe.cumulativeAmount.text') }}</span>
                    </p>
                    <p class="num">
                        <span>{{ getAmount(safeData?.todayIncome) || 0 }}</span>
                        <span>{{ getAmount(safeData?.totalIncome) || 0 }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="menubox">
            <div class="item cursor" v-for="(item, index) in menu" :key="index" @click="toPage(item)">
                <img :src="getImg('safe', item.imgName)" alt="">
                <p>{{ item.name }}</p>
            </div>
        </div>
        <p class="title">{{ $t('safe.illustrate.text') }}</p>
        <p class="text">
            {{ $t('safe.illustrate.one.text') }}
        </p>
        <p class="text">
            {{ $t('safe.illustrate.two.text') }}
        </p>
        <p class="text">
            {{ $t('safe.illustrate.three.text') }}
        </p>
        <p class="text">
            {{ $t('safe.illustrate.four.text') }}
        </p>
    </div>
</template>
<script setup >
import { toRefs, reactive, ref, computed } from 'vue'
import { getImg, getAmount } from '@/utils/utils'
import { useRouter } from 'vue-router'
import http from '@/utils/axios'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const router = useRouter()
const refreshRef = ref(null)
const menu = computed(() => {
    let menuArr =
        [
            {
                imgName: 'send',
                name: t('forget.send'),
                link: '/send'
            },
            {
                imgName: 'recharge',
                name: t('home.index.recharge.text'),
                link: '/recharge'
            },
            {
                imgName: 'buy',
                name: t('deal.orderDetail.197148-2'),
                link: '/buy'
            },
            {
                imgName: 'transfer',
                name: t('wallet.index.transfer.text'),
                link: '/transfer'
            },
        ]
    return menuArr
})
const state = reactive({
    safeData: {},
    angle: 0
})
getSafeInfo()
async function getSafeInfo() {
    let url = '/player/safe/info'
    try {
        const res = await http.get(url)
        if (res?.id) {
            state.safeData = res
            refreshRef.value.style.transform = "none"
        }
    } catch (error) {
        console.log(error);
    }
}
function getbalance() {
    state.angle -= 360
    getSafeInfo()
    refreshRef.value.style.transform = `rotate(${state.angle}deg)`
}
function toPage(item) {
    if (item.link === '/recharge') {
        router.push({
            path: item.link,
            query: {
                rechargeType: 'safe'
            }
        })

    } else {
        router.push(item.link)

    }
}
const { safeData } = toRefs(state)
</script>
<style scoped lang='scss'>
.safe {
    height: 100%;
    overflow: auto;
    background-color: $mainBg;
    box-sizing: border-box;
    padding-top: 20px;

    .cardBox {
        width: 100%;
        box-sizing: border-box;

        .cardBg1 {
            width: 276px;
            height: 147px;
            position: absolute;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.2;
            border-radius: 20px;
            background-image: linear-gradient(to right, #ff6c00, #ffa031);
        }

        .cardBg2 {
            width: 316px;
            height: 168px;
            position: absolute;
            top: 32px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.2;
            border-radius: 20px;
            background-image: linear-gradient(to right, #ff6c00, #ffa031);
        }

        .card {
            width: 100%;
            height: 186px;
            position: absolute;
            top: 47px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 12px;
            background-image: linear-gradient(to right, #ff6c00, #ffa031);
            padding: 30px 25px 13px 23px;
            box-sizing: border-box;
            font-size: 15px;
            color: #fff;

            .cb {
                @include flex(flex-start);

                .refresh {
                    width: 35px;
                    height: 35px;
                    transition: transform 1s ease;
                }
            }

            .moneyusd {
                font-size: 31px;
                font-weight: bold;
                color: #fff;

                span {
                    font-size: 15px;
                }
            }

            .Cbottom {
                margin-top: 30px;

                p {
                    @include flex(space-between);

                    span {
                        width: 50%;
                    }
                }

                .num {
                    margin-top: 10px;
                }
            }
        }

    }

    .menubox {
        margin-top: 253px;
        @include flex();

        .item {
            @include flex();
            flex-direction: column;

            img {
                width: 60px;
                height: 60px;
            }

            p {
                font-size: 14px;
                color: #fff;
                margin-top: 5px;
            }
        }
    }

    .title {
        margin-top: 12vh;
        font-size: 18px;
        color: #fff;
        margin-bottom: 10px;
    }

    .text {
        font-size: 12px;
        line-height: 1.33;
        color: #a6a6a6;
    }
}
</style>