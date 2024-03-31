<template>
    <div class="home maxWidth">
        <div class="fSwiper">
            <Swiper :modules="modules" v-bind="swiperOption" class="homeSwiper">
                <swiper-slide v-for="(item, index) in swiper" :key="index">
                    <img :src="item?.imageUrl" />
                </swiper-slide>
            </Swiper>
            <div class="fTips lrPadding">
                <div class="tips_left">
                    <van-notice-bar scrollable background="#1F1F21" :text="$t('home.wellcome')">
                        <template #left-icon>
                            <img src="../assets/images/home/notice.webp" class="notice" alt="">
                        </template>
                    </van-notice-bar>

                </div>
                <img src="../assets/images/home/listIcon.webp" class="listIcon" alt="" @click="toNotice">
            </div>
        </div>
        <div class="main">
            <div>
                <div class="title lrPadding">
                    <span class="t_left">{{ $t('home.upcoming') }}</span>
                    <span class="t_right" @click="toMatch">{{ $t('home.seeAll') }}</span>
                </div>
                <div class="foretell">
                    <Swiper slides-per-view="auto" :freeMode="true" :space-between="12">
                        <swiper-slide v-for="(item, index) in upcomingSwiper" :key="index"
                            :class="{ s_active: upcomingIndex === index }" @click="changeSwiper(item, index)">
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
                    <span class="t_left">{{ $t('home.topEvevnts') }}</span>
                    <span class="t_right" @click="toMatch">{{ $t('home.seeAll') }}</span>
                </div>
                <div class="e_lists lrPadding">
                    <div class="item cursor" v-for="(item, index) in gameList" :key="index" @click="toBetPage(item)">

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
        <!-- 设置资金密码弹窗 -->
        <van-dialog v-model:show="tradingDialog" width="310px" className="fundDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <img src="../assets/images/common/dialogIcon.webp" class="dialogIcon" alt="">
                <p class="title">{{ $t('home.dialog.trading.title1.text') }}</p>
                <p class="title mt4">{{ $t('home.dialog.trading.title.text') }}</p>
                <div class="pwdBox">
                    <img src="../assets/images/common/pwdIcon.webp" class="pwdIcon" alt="">
                    <input type="password" :maxlength="6"
                        @input="() => { tradingObj.payPwd = tradingObj.payPwd.replace(/\D/g, '') }"
                        v-model="tradingObj.payPwd" :placeholder="$t('home.dialog.input.placeholder.text')">
                </div>
                <div class="pwdBox">
                    <img src="../assets/images/common/pwdIcon.webp" class="pwdIcon" alt="">
                    <input type="password" :maxlength="6"
                        @input="() => { tradingObj.payPwdAgain = tradingObj.payPwdAgain.replace(/\D/g, '') }"
                        v-model="tradingObj.payPwdAgain" :placeholder="$t('form.confirm.password.text')">
                </div>
                <div class="dialogBtn" @click="setPwdBtn">
                    {{ $t('modal.confirm.text') }}
                </div>
            </template>
        </van-dialog>

        <!-- 设置公告弹窗 -->
        <van-dialog v-model:show="noticeDialog.show" width="310px" className="fundDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <img src="../assets/images/home/warningIcon.webp" class="warningIcon" alt="">
                <p class="wtitle">{{ $t('home.dialog.notice.title.text') }}</p>
                <p class="wcontent">{{noticeDialog.content  }}</p>
                 
                <div class="dialogBtn" @click="closeNoticeDialog">
                    {{ $t('modal.confirm.text') }}
                </div>
            </template>
        </van-dialog>
         <!-- 设置版本升级弹窗 -->
        <van-dialog v-model:show="versionDialog.show" width="310px" className="fundDialog versionDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <img src="../assets/images/home/updateIcon.webp" class="warningIcon" alt="">
                <p class="wcontent">{{versionDialog.content  }}</p>
                 
                <div class="dialogBtn" @click="updateVersion" v-if="!versionDialog.isUpdate">
                    {{ $t('update.now') }}
                </div>
                <van-progress class="processBar" :percentage="versionDialog.process" :show-pivot="false" color="#f2826a" v-else/>
            </template>
        </van-dialog>
    </div>
</template>
<script setup >
import { reactive, toRefs, computed } from 'vue'
import { formatDate } from '@/utils/utils'
import http from '@/utils/axios'
import { useRouter } from 'vue-router'

import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'

const store = useStore()
const { isShowNotice } = storeToRefs(store)
const router = useRouter()

import Cookies from 'js-cookie'
import { Swiper, SwiperSlide } from 'swiper/vue';
// 引入swiper核心和所需模块
import {
    Autoplay, Navigation, Pagination, Scrollbar, A11y,
} from "swiper/modules";
import { showToast } from 'vant'
// 在modules加入要使用的模块
const modules = [Autoplay, Pagination, Navigation, Scrollbar];

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
let swiperOption = {
    spaceBetween: '15',
    slidesPerView: 'auto', // 一屏显示的slide个数  'auto'
    slidesPerGroup: 1, //每组多少个swiper滑块
    centeredSlides: true, // 居中的slide是否标记为active，默认是最左active,这样样式即可生效
    slideToClickedSlide: true, // 点击的slide会居中
    loop: true, // 循环播放, 可有无限滚动效果，初始加载即是滚动后的效果
    autoplay: {
        delay: 3000,
        disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay
        pauseOnMouseEnter: true, //鼠标置于swiper是否时暂停自动切换
    },
};

const state = reactive({
    swiper: [],
    upcomingIndex: 0,
    upcomingSwiper: [],
    gameList: [],
    tradingDialog: false,
    noticeDialog: {
        show:false,
        content:''
    },
    versionDialog:{
        show:false,
        isUpdate:false,
        content:'',
        process:0,
        version:''
    },
    tradingObj: {
        payPwd: '',
        payPwdAgain: '',
        pwdErrTips: false,
        pwdAgainErrTips: false
    },
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
function changeSwiper(item, index) {
    state.upcomingIndex = index
    router.push({
        path: '/betPage',
        query: { gameId: item.id }
    })
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
function toNotice() {
    router.push({
        path: '/sysNotice'
    })
}
function toBetPage(item) {
    router.push({
        path: '/betPage',
        query: {
            gameId: item.id
        }
    })
}
function toMatch() {
    router.push({
        path: '/match'
    })
}
//查询版本号
getVersion()
async function getVersion(){
    let url = '/player/home/version'
    try {
        const curVersion = Cookies.get('cur_version') || '0'
        const res = await http.get(url)
        console.log(res,curVersion,'--------')
        if(res != curVersion && curVersion > 0){
            state.versionDialog.content = t('version.update')
            state.versionDialog.show = true
            state.versionDialog.isUpdate = false
            state.versionDialog.version = res
        }else{
            state.versionDialog.show = false
            state.versionDialog.isUpdate = false
            state.versionDialog.content = ''
             Cookies.set('cur_version', res)
        }
    }catch (error) {
        console.log(error);
    }
}
async function updateVersion(){
    Cookies.set('cur_version', state.versionDialog.version)
    state.versionDialog.process = 0
    state.versionDialog.isUpdate = true
    state.versionDialog.content = t('version.updating')
    while(state.versionDialog.process < 100){
        state.versionDialog.process += 10
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    state.versionDialog.show = false
    window.location.reload()
}

// 查看公告
getShowNotice()
async function getShowNotice(){
   let url = '/player/home/dialog'
    try {
        const res = await http.get(url)
        let noticeId = localStorage.getItem('showNoticeId') || ''
        if(noticeId != res.id){
            state.noticeDialog.content = res.content
            state.noticeDialog.show = true
            localStorage.setItem('showNoticeId',res.id)
        }
    }catch (error) {
        console.log(error);
    }
}
function closeNoticeDialog() {
    state.noticeDialog.show = false
    
}
// 是否设置资金密码
isSetPwd()
async function isSetPwd() {
    let url = '/player/getPwdPay'
    try {
        const res = await http.get(url)
        state.tradingDialog = res.paySet === 2
    } catch (error) {
        console.log(error);
    }
}
async function setPwdBtn() {
    if (state.tradingObj.payPwd == '') {
        showToast(t('ruls.pwd2.empty'))
        return
    }
    if (state.tradingObj.payPwdAgain == '') {
        showToast(t('ruls.passtwo.empty'))
        return
    }
    let data = {
        payPwd: state.tradingObj.payPwd,
        payPwdAgain: state.tradingObj.payPwdAgain,
    }
    let url = '/player/setPwdPay'
    try {
        const res = await http.post(url, data)
        console.log(res);
        if (res === null) {
            showToast(t('tips.success.text'))
            state.tradingDialog = false
            state.tradingObj.payPwd = ''
            state.tradingObj.payPwdAgain = ''
        }
    } catch (error) {
        console.log(error);
    }
}
// 获取系统类型
function getOsType() {
    let osType = ''
    if (navigator.userAgent.indexOf('iPhone') !== -1) {
        osType = 'ios'
    } else if (navigator.userAgent.indexOf('Android') !== -1) {
        osType = 'android'
    }
    return osType
}
const { swiper, upcomingSwiper, upcomingIndex, gameList, swiperAutoPlay, tradingDialog,noticeDialog,versionDialog, tradingObj } = toRefs(state)
</script>
<style scoped lang='scss'>
.home {
    min-height: 100%;
    background-color: $mainBg;
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

                    img {
                        border-radius: 10px;

                    }
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
                        font-family: $fontFamily;
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
        background-color: $mainBg;

        .title {
            @include flex(space-between);
            margin-bottom: 12px;

            .t_left {
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.26px;
                color: #fff;
                font-family: $fontFamily;
            }

            .t_right {
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 0.26px;
                color: #ff7c43;
                font-family: $fontFamily;
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
                                    height: 20px;
                                    text-align: center;
                                    margin-top: 5px;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;
                                    font-family: $fontFamily;
                                }
                            }

                            .u_right {
                                @extend .u_left;

                                .name_right {
                                    text-align: center;
                                    margin-top: 5px;
                                    height: 20px;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;
                                    font-family: $fontFamily;
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
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            font-family: $fontFamily;
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
                        font-family: $fontFamily;

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
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            font-family: $fontFamily;
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

    :deep(.fundDialog) {
        // background-color: #211f32 !important;
        border-radius: 16px;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 0 30px;

        .van-dialog__header {
            padding-top: 15px;
            color: #fff;
        }

        .dialogIcon {
            width: 54px;
            height: 54px;
            margin: 30px auto 0;
        }

        .title {
            text-align: center;
            color: #fff;
            margin-top: 18px;
            font-family: $fontFamily;
            font-size: 13px;
            font-weight: bold;
            color: #fff;
        }

        .mt4 {
            margin-top: 4px;
        }

        .pwdBox {
            margin-top: 18px;
            @include flex(center);
            background-color: #313038;
            height: 48px;
            border-radius: 22px;
            box-sizing: border-box;
            padding: 0 5px;

            .pwdIcon {
                width: 28px;
                height: 28px;
            }


            input {
                height: 40px;
                background-color: #313038;
                outline: none;
                border: none;
                color: #fff;
                flex: 1;
                border-radius: 22px;
            }

            img {
                width: 28px;
                height: 28px;
            }
        }

        .dialogBtn {
            @include flex();
            height: 48px;
            justify-content: center;
            flex: 1;
            border-radius: 16px;
            color: #fff;
            background-color: $btnBgColor;
            margin: 18px 0 26px 0;
        }

        .van-dialog__footer {
            background-color: #211f32 !important;
        }
    }
    :deep(.versionDialog){
        .wcontent{
            padding-top: 30px;
            padding-bottom: 20px;
            text-align: center;
        }
        .processBar{
            margin-bottom: 20px;
        }
    }

    :deep(.van-overlay) {
        width: 100%;
        max-width: 400px;
        left: 50%;
        transform: translateX(-50%);
    }
    .warningIcon{
        width: 96px;
        height: 96px;
        margin: 8px auto 0;
    }
    .wtitle{
            text-align: left;
            color: #fff;
            font-size: 15px;
            margin-bottom: 10px;
    }
    .wcontent{
        font-size: 15px;
        color: #d9dbe9;
        margin-bottom: 20px;
    }
}
</style>