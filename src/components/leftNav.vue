<template>
    <div class="leftNav maxWidth" v-if="showLeftNav">
        <van-popup v-model:show="showLeftNav" position="left">
            <div class="top">
                <img src="../assets/images/leftNav/avatar.webp" class="avatar" alt="">
                <div class="user">
                    <p class="name">{{ perInfo?.username }}</p>
                    <p class="vip">VIP{{ perInfo?.vipLevel }}</p>
                </div>
            </div>
            <div class="van-hairline--bottom"></div>
            <div class="list">
                <ul>
                    <li v-for="(item, index) in listArr" :key="index">
                        <div class="li_top" @click="showSecondList(item, index)">
                            <div class="li_left">
                                <img :src="getImg('leftNav', item.icon)" alt="">
                                <div class="name">{{ item.name }}</div>
                            </div>
                            <van-icon :name="item.isOpen ? 'arrow-down' : 'arrow-up'" color="#fff" v-if="item.isArrow" />
                        </div>
                        <div class="secondList" v-if="item.isOpen">
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
                Log Out
            </div>
        </van-popup>
    </div>
</template>
<script setup >
import { reactive, defineProps, ref, toRefs } from 'vue'
import http from '@/utils/axios'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'

const store = useStore()
const { showLeftNav } = storeToRefs(store)
console.log(showLeftNav);
const { t, locale } = useI18n()
const router = useRouter()

const state = reactive({
    perInfo: {},
    showLangOpt: false,
    langTarget: 'EN',
    listArr: [
        {
            icon: 'money',
            name: '0.00',
            isOpen: false,
            isArrow: true,
            menu: [
                {
                    name: 'Deposit',
                    link: '',
                    highlight: false
                },
                {
                    name: 'withdrawal',
                    link: '',
                    highlight: false
                },
            ]
        },
        {
            icon: 'order',
            name: 'My Order',
            isOpen: false,
            isArrow: false
        },
        {
            icon: 'partners',
            name: 'Partners',
            isOpen: false,
            isArrow: false
        },
        {
            icon: 'tournaments',
            name: 'Tournaments',
            isOpen: false,
            isArrow: true,
            menu: [
                {
                    name: 'Market list',
                    link: '',
                    highlight: false
                },
                {
                    name: 'Result',
                    link: '',
                    highlight: false
                },
            ]
        },
        {
            icon: 'acc',
            name: 'My account',
            isOpen: false,
            isArrow: true,
            menu: [
                {
                    name: 'history',
                    link: '',
                    highlight: false
                },
                {
                    name: 'Trading',
                    link: '',
                    highlight: false
                },
                {
                    name: 'Personal Information',
                    link: '',
                    highlight: false
                },
                {
                    name: 'Card Management',
                    link: '',
                    highlight: false
                },
            ]
        },
        {
            icon: 'invite',
            name: 'Invite',
            isOpen: false,
            isArrow: false
        },
        {
            icon: 'msg',
            name: 'About CTER.ONLINE',
            isOpen: false,
            isArrow: false
        },
    ],
    langList: [
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
})
const popShow = ref(true)

function showSecondList(item, index) {
    state.listArr.forEach(item => {
        if (item.isOpen) {
            item.isOpen = false
        }
        if (item.hasOwnProperty('menu')) {
            item.menu.forEach(k => {
                k.highlight = false
            })
        }
    })
    item.isOpen = !item.isOpen

}
function selectList(k, index) {
    state.listArr.forEach(item => {
        if (item.hasOwnProperty('menu')) {
            item.menu.forEach(j => {
                j.highlight = false
            })
        }
    })
    k.highlight = true
}
getUserInfo()
async function getUserInfo() {
    let url = '/player/player_info'
    try {
        const res = await http.get(url)
        if (res?.id) {
            state.perInfo = res
            state.listArr[0].name = res.currRate
        }
    } catch (error) {
        console.log(error);
    }
}
function showSelect() {
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
            setTimeout(() => {
                router.push({
                    path: '/login'
                })
            }, 500);
        }
    } catch (error) {
        console.log(error);
    }
}
const { listArr, perInfo, showLangOpt, langTarget, langList } = toRefs(state)
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
                    font-family: DMSans;
                    font-size: 18px;
                    font-weight: bold;
                    letter-spacing: 0.75px;
                    color: #fff;
                }

                .vip {
                    font-family: DMSans;
                    font-size: 14px;
                    letter-spacing: 0.75px;
                    color: #ff7c43;
                    margin-top: 10px;
                }
            }
        }

        .list {
            padding: 30px 16px 16px 12px;

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

                        .li_left {
                            @include flex();

                            .name {
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
                        max-height: 300px;
                        // overflow: hidden;
                        // transition: height .5s ease-out;

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
                        height: 100%;
                        max-height: 300px;
                    }
                }

                li:first-child {
                    .li_top {
                        border-radius: 12px;
                        background-color: #ff7c43;
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
            padding: 30px 16px 16px 12px;

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
                height: 185px;
            }
        }

        .logout {
            width: 117px;
            height: 43px;
            margin: 77.4px 107px 0 15px;
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