<template>
    <div class="leftNav maxWidth" v-if="showLeftNav">
        <van-popup v-model:show="showLeftNav" position="left">
            <div class="top">
                <img src="../assets/images/leftNav/avatar.webp" class="avatar" alt="">
                <div class="user">
                    <p class="name">{{ perInfo?.username }}</p>
                    <p class="vip">
                        <img src="../assets/images/leftNav/vipIcon.webp" alt="">
                        <span class="bg">{{ $t('leftNav.vip.text') }}{{ perInfo?.vipLevel }} </span>
                    </p>
                </div>
            </div>
            <div class="van-hairline--bottom"></div>
            <div class="list">
                <div class="assetsBox">
                    <p>{{ $t('wallet.index.balance.text') }}</p>
                    <div class="money cb">
                        {{ accountInfo.currRate || 0 }}
                        <img src="../assets/images/leftNav/refresh.webp" ref="refreshRef" class="refresh cursor"
                            @click="getbalance" alt="">
                    </div>
                    <div class="btn">
                        <router-link @click="toPage" to="/withdraw">{{ $t('leftNav.withdrawal.text') }}</router-link>
                        <router-link @click="toPage" class="rechargeBtn"
                            :to="{ path: '/frecharge', query: { rechargeType: 'football' } }">{{
                                $t('leftNav.recharge.text') }}</router-link>
                    </div>
                </div> 
                <ul>
                    <li v-for="(item, index) in listArr" :key="index">
                        <div class="li_top" @click="showSecondList(item, index)">
                            <div class="li_left">
                                <img :src="getImg('leftNav', item.icon)" alt="">
                                <div class="name">{{ item.name }}</div>
                            </div>
                            <van-icon :name="item.isOpen ? 'arrow-down' : 'arrow-up'" color="#fff" v-if="item.isArrow" />
                        </div>
                        <!-- v-if="item.isOpen" -->
                        <div class="secondList" :class="{ addShowClass: item.isOpen }">
                            <p v-for="(it, k ) in item.menu" :key="k" :class="{ pActive: it.highlight }"
                                @click="selectList(it, k)">{{ it.name }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="langBox">
                <div class="langSelect" @click.stop="showSelect">
                    <div class="l_left">
                        <img :src="getImg('login', langTarget)" class="langImg" alt="">
                        <span class="l_name">{{ langTarget }}</span>
                    </div>
                    <van-icon :name="showLangOpt ? 'arrow-up' : 'arrow-down'" />
                </div>
                <div class="options" :class="{ showOpt: showLangOpt }">
                    <div class="o_item" :class="{ lfc: item.name === langTarget }" v-for="(item, index) in langList"
                        :key="index" @click="selectLang(item)">
                        <img :src="getImg('login', item.name)" class="langImg" alt="">
                        <span class="l_name">{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <div class="logout" @click="logOut">
                <div class="dot">
                    <img src="../assets/images/leftNav/logIcon.webp" alt="">
                </div>
                {{ $t('leftNav.logOut.text') }}
            </div>
        </van-popup>
    </div>
</template>
<script setup >
import { reactive, computed, watchEffect, toRefs, ref } from 'vue'
import http from '@/utils/axios'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
const refreshRef = ref(null)

const store = useStore()
const { showLeftNav, accountInfo } = storeToRefs(store)
// console.log(showLeftNav);
const { t, locale } = useI18n()
const router = useRouter()

const state = reactive({
    perInfo: {},
    showLangOpt: false,
    langTarget: 'EN',
    menuIndex: -1,
    langList: [
        {
            name: 'ZH'
        },
        {
            name: 'EN'
        },
        {
            name: 'DE'
        },
        {
            name: 'ES'
        },
        {
            name: 'FR'
        },
        {
            name: 'INS'
        },
    ],
    cList: [],
    angle: 0
})
const listArr = computed(() => {
    // state.cList解决listArr不会响应式
    state.cList = [
        {
            icon: 'order',
            name: t('leftNav.myOrder.text'),
            isOpen: false,
            isArrow: false,
            link: '/order'
        },
        {
            icon: 'partners',
            name: t('leftNav.partners.text'),
            isOpen: false,
            isArrow: false,
            link: '/partner'
        },
        {
            icon: 'tournaments',
            name: t('leftNav.tournaments.text'),
            isOpen: false,
            isArrow: true,
            menu: [
                {
                    name: t('leftNav.marketList.text'),
                    link: '/match',
                    highlight: false
                },
                {
                    name: t('leftNav.result.text'),
                    link: '/result',
                    highlight: false
                },
            ]
        },
        {
            icon: 'acc',
            name: t('leftNav.myAccount.text'),
            isOpen: false,
            isArrow: true,
            menu: [
                {
                    name: t('leftNav.fundsRecords.text'),
                    link: '/fundsRecords',
                    highlight: false
                },
                {
                    name: t('leftNav.trading.text'),
                    link: '/rebateReport',
                    highlight: false
                },
                {
                    name: t('leftNav.personalInformation.text'),
                    link: '/personalInfomation',
                    highlight: false
                },
                {
                    name: t('leftNav.cardManagement.text'),
                    link: '/cardManage',
                    highlight: false
                },
            ]
        },
        {
            icon: 'invite',
            name: t('leftNav.invite.text'),
            link: '/invite',
            isOpen: false,
            isArrow: false
        },
        {
            icon: 'msg',
            name: t('leftNav.aboutCTER.ONLINE.text'),
            isOpen: false,
            isArrow: false
        },
    ]
    return state.cList
})
function showSecondList(item, index) {
    state.menuIndex = index
    listArr.value.forEach((j, i) => {
        if (i != state.menuIndex) {
            j.isOpen = false
        }
        if (j.hasOwnProperty('menu')) {
            j.menu.forEach(k => {
                k.highlight = false
            })
        }
    })
    item.isOpen = !item.isOpen
    if (item.link) {
        store.showLeftNav = false
        router.push({
            path: item.link
        })
    }
}
function selectList(k, index) {
    listArr.value.forEach(item => {
        if (item.hasOwnProperty('menu')) {
            item.menu.forEach(j => {
                j.highlight = false
            })
        }
    })
    k.highlight = true
    if (k.link) {
        store.showLeftNav = false
        if (k.link === '/recharge') {
            router.push({
                path: k.link,
                query: {
                    rechargeType: 'football'
                }
            })
        } else {
            router.push({
                path: k.link
            })
        }

        k.highlight = false
    }
}
watchEffect(() => {
    // console.log('leftName', accountInfo);
    state.perInfo = accountInfo.value
    // listArr.value[0].name = accountInfo.value.currRate
})
function showSelect() {
    let langList = [
        {
            name: 'EN'
        },
        {
            name: 'DE'
        },
        {
            name: 'ES'
        },
        {
            name: 'FR'
        },
        {
            name: 'INS'
        },
    ]
    state.langList = langList.filter(item => item.name != state.langTarget)
    state.showLangOpt = !state.showLangOpt
}
function selectLang(item) {
    state.langTarget = item.name
    let language = item.name.toLowerCase()
    localStorage.setItem('lang', language)
    locale.value = language
    state.showLangOpt = false
}
async function logOut() {
    let url = '/player/auth/logout'
    try {
        const res = await http.get(url)
        if (res == null) {
            localStorage.removeItem('userInfo')
            store.showLeftNav = false
            setTimeout(() => {
                localStorage.removeItem('toaddFlag')
                router.push({
                    path: '/login'
                })
            }, 500);
        }
    } catch (error) {
        console.log(error);
    }
}
function toPage() {
    store.showLeftNav = false
}
function getbalance() {
    state.angle -= 360
    store.getUserInfo()
    refreshRef.value.style.transform = `rotate(${state.angle}deg)`
}
const { perInfo, showLangOpt, langTarget, langList } = toRefs(state)
</script>
<style scoped lang='scss'>
.leftNav {
    height: 100%;
    position: fixed;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: 30;
    box-sizing: border-box;

    :deep(.van-overlay) {
        max-width: 400px;
        left: 50%;
        transform: translateX(-50%);
    }

    :deep(.van-popup) {
        height: 100%;
        width: 285px;
        background: #151515;
        padding-bottom: 25px;

        .top {
            width: 100%;
            @include flex(flex-start);
            box-sizing: border-box;
            padding: 30px 16px 16px 12px;

            .avatar {
                width: 60px;
                height: 60px;
                margin-right: 11px;
            }

            .user {
                .name {
                    font-family: $fontFamily;
                    font-size: 18px;
                    font-weight: bold;
                    letter-spacing: 0.75px;
                    color: #fff;
                }

                .vip {
                    font-family: $fontFamily;
                    font-size: 14px;
                    letter-spacing: 0.75px;
                    color: #ff7c43;
                    margin-top: 10px;
                    @include flex(flex-start);

                    .bg {
                        width: 47px;
                        height: 13px;
                        text-align: center;
                        background: url('../assets/images/leftNav/vipBg.webp')no-repeat;
                        background-size: cover;
                        font-size: 12px;
                        padding-left: 5px;
                        box-sizing: border-box;
                    }


                    img {
                        width: 21px;
                        height: 21px;
                        margin-right: -9px;
                        z-index: 2;
                    }
                }
            }
        }

        .list {
            padding: 30px 16px 16px 12px;

            .assetsBox {
                width: 100%;
                height: 135px;
                background: url('../assets/images/leftNav/assetsbg.webp') no-repeat;
                background-size: cover;
                margin-bottom: 28px;
                padding: 13px 20px 18px 13px;
                box-sizing: border-box;
                font-family: $fontFamily;

                .cb {
                    @include flex(flex-start);

                    .refresh {
                        width: 22px;
                        height: 22px;
                        transition: transform 1s ease;
                    }
                }

                .money {
                    font-size: 31px;
                    font-weight: bold;
                    color: #000;
                    margin: 5px 0;
                }

                .btn {
                    @include flex(space-between);
                    margin-top: 16px;

                    a {
                        font-family: $fontFamily;
                        width: 102px;
                        height: 31px;
                        @include flex(center);
                        border-radius: 15px;
                        border: solid 1px #000;
                        color: #000;
                        font-size: 12px;
                        font-weight: normal;
                    }

                    .rechargeBtn {
                        background-color: #000;
                        color: #fff;
                    }
                }
            }

            ul {
                li {
                    width: 100%;
                    @include flex(space-between);
                    margin-bottom: 30px;
                    flex-direction: column;
                    box-sizing: border-box;

                    .li_top {
                        box-sizing: border-box;
                        width: 100%;
                        @include flex();
                        cursor: pointer;
                        padding-left: 13px;

                        .li_left {
                            @include flex();

                            .name {
                                font-family: $fontFamily;
                                font-size: 16px;
                                color: #fff;
                                margin-left: 12px;
                            }

                            img {
                                width: 20px;
                                height: 20px;
                            }

                        }

                    }

                    .secondList {
                        width: 100%;
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height .5s ease-out;

                        p {
                            font-size: 14px;
                            color: #d9dbe9;
                            padding-left: 45px;
                            margin: 26px 0 30px 0;
                            cursor: pointer;
                        }

                        .pActive {
                            color: #ff7c43;
                        }
                    }

                    .addShowClass {
                        max-height: 300px;
                    }
                }

                li:first-child {
                    .li_top {
                        border-radius: 12px;
                        //background-color: #ff7c43;
                        padding: 11px 10px 9px 13px;

                    }

                }
            }
        }

        .langBox {
            width: 100%;
            @include flex(flex-start);
            position: relative;
            box-sizing: border-box;
            padding: 20px 16px 16px 24px;

            .langSelect {
                @include flex();
                color: #fff;
                width: $selectWidth;
                height: $selectHeight;
                padding: 0 6px 0 4px;
                border-radius: 3.5px;
                border: solid 1px #fff;
                cursor: pointer;

                .l_left {
                    @include flex(flex-start)
                }
            }

            .langImg {
                width: 19px;
                height: 19px;
            }

            .l_name {
                margin-left: 6px;
                font-family: $fontFamily;
                font-size: 15px;
                color: #fff;
            }

            .options {
                width: calc($selectWidth + 12px);
                position: absolute;
                top: 58px;
                left: 12px;
                color: #000;
                border-radius: 4px;
                background: rgba(0, 0, 0, .56);
                height: 0;
                overflow: hidden;
                transition: height .5s ease-out;
                cursor: pointer;

                .o_item {
                    height: 28px;
                    padding: 0 6px 0 7px;
                    font-family: $fontFamily;
                    font-size: 15px;
                    color: #fff;
                    @include flex(flex-start);
                    margin-top: 9px;
                }

                .lfc {
                    .l_name {
                        color: #ff7c43;
                    }
                }
            }

            .showOpt {
                transition: height .5s ease-out;
                height: 160px;
            }
        }

        .logout {
            // width: 125px;
            height: 43px;
            margin: 20px 107px 0 24px;
            padding: 9px 16px 8px 9px;
            border-radius: 25px;
            background-color: #ff7c43;
            box-sizing: border-box;
            color: #FFF;
            @include flex(center, center);
            cursor: pointer;

            .dot {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background-color: #fff;
                margin-right: 9px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    .van-popup::-webkit-scrollbar {
        width: 0px;
        /* 设置滚动条宽度 */
    }

    .van-popup::-webkit-scrollbar-track {
        background-color: rgb(0, 0, 0);
        /* 设置滚动条轨道背景色 */
    }

    .van-popup::-webkit-scrollbar-thumb {
        background-color: rgb(0, 0, 0);
        /* 设置滚动条滑块颜色 */
    }

    .van-popup::-webkit-scrollbar-thumb:hover {
        background-color: rgb(0, 0, 0);
        /* 设置滚动条滑块在鼠标悬停时的颜色 */
    }
}
</style>