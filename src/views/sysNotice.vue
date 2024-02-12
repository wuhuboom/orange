<template>
    <div class="sysNotice maxWidth lrPadding">
        <div class="tabs">
            <span class="sn" :class="{ tabActive: tabIndex === index }" v-for="(item, index) in tabArr" :key="index"
                @click="handleClickTab(index)">{{
                    item.name }}</span>
        </div>
        <div class="list" v-for="(item, index) in list" :key="index">
            <div class="list_tit">
                <div class="tit_left">
                    <!-- 0未读 1已读 -->
                    <span class="dot" :class="{ activeDot: item.readStatus == 0 }"></span>
                    <span class="title">{{ item.title }}</span>
                </div>
                <div class="date">{{ formatDate(item.createdAt) }}</div>
            </div>
            <div class="content">
                {{ item.content }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, toRefs } from 'vue'
import http from '@/utils/axios'
import { formatDate } from '@/utils/utils'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const state = reactive({
    tabIndex: 0,
    tabArr: [
        {
            name: t('sysNotice.System.Notice.text')
        },
        {
            name: t('sysNotice.Personal.Notice.text')
        },
    ],
    list: []
})
function handleClickTab(index) {
    state.tabIndex = index
    state.list = []
    if (index === 0) {
        getNoticeList()
    }
}
getNoticeList()
async function getNoticeList() {
    let url = '/player/home/notice'
    let lang = localStorage.getItem('lang') || navigator.language
    try {
        const res = await http.get(`${url}?lang=${lang}`)
        state.list = res || []
    } catch (error) {
        console.log(error);
    }
}
const { tabArr, tabIndex, list } = toRefs(state)
</script>
<style scoped lang='scss'>
.sysNotice {
    min-height: 100%;
    background-color: #1c1b20;
    box-sizing: border-box;
    padding-top: 15px;
    overflow: auto;
    padding-bottom: 60px;

    .tabs {
        height: 32px;
        @include flex();
        background-color: #2c2c2c;
        border-radius: 15px;
        cursor: pointer;

        span {
            flex: 1;
            height: 100%;
            text-align: center;
            line-height: 32px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.48);
        }

        .tabActive {
            border-radius: 15px;
            background-color: #ff7c43;
            color: #fff;
        }
    }

    .list {
        padding: 18px 10px 15px 14px;
        background-color: #262628;
        margin-top: 14px;
        border-radius: 7px;

        .list_tit {
            @include flex();
            border-bottom: 1px dashed #707070;
            padding-bottom: 12px;

            .tit_left {
                @include flex();

                .dot {
                    width: 10px;
                    height: 10px;
                    display: block;
                    margin-right: 7px;
                    border-radius: 50%;
                    background-color: #262628;
                }

                .activeDot {
                    background-color: #ff4343;

                }

                .title {
                    color: #fff;
                    font-size: 14px;
                    line-height: 1.14;
                    color: #fff;
                }
            }

            .date {
                min-width: 130px;
                font-size: 12px;
                color: #8d8d8d;
                text-align: right;
            }
        }

        .content {
            margin-top: 16px;
            font-size: 13px;
            line-height: 1.5;
            letter-spacing: 0.39px;
            color: #ddd;
        }
    }

}
</style>