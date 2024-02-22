<template>
    <div class="tradingOrder maxWidth lrPadding">
        <div class="fixed maxWidth lrPadding">
            <div class="dateBox">
                <div v-for="(item, index) in optArr" :key="index" class="dateBtn cursor"
                    :class="{ dateActive: dateIndex === index }" @click="handleChangeDate(index)">
                    {{ item.name }}
                </div>
            </div>
            <div class="status relative cursor">
                <span v-for="(item, index) in statusArr" :key="index" :class="{ spanActive: statusIndex === index }"
                    @click="handleStausChange(index)">{{ item.name }}</span>
            </div>
        </div>
        <div class="list">
            <div class="lItem">
                <div class="top">
                    <span>sell</span>
                    <span>120,90</span>
                </div>
                <div class="bottom">
                    <span>07/16 2023 16:46:36</span>
                    <span>+5.0 commission</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, } from 'vue'
import { useRouter, useRoute } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const state = reactive({
    optArr: [
        {
            name: 'Toady',
            id: '',
        },
        {
            name: 'Yesterday',
            id: '',
        },
        {
            name: '7 Days',
            id: '',
        },
        {
            name: '30 Days',
            id: '',
        },
    ],
    dateIndex: 0,
    statusArr: [
        {
            name: 'Completed'
        },
        {
            name: 'Canceled'
        }
    ],
    statusIndex: 0
})
function handleChangeDate(index) {
    state.dateIndex = index
}
function handleStausChange(index) {
    state.statusIndex = index
}
const { optArr, dateIndex, statusArr, statusIndex } = toRefs(state)
</script>
<style scoped lang='scss'>
.tradingOrder {

    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    padding-top: 110px;

    .fixed {
        position: fixed;
        top: 44px;
        left: 0;
        right: 0;
        box-sizing: border-box;
        padding-top: 10px;

        .dateBox {
            @include flex();

            .dateBtn {
                height: 33px;
                padding: 0 15px;
                border-radius: 7px;
                background-color: rgba(255, 255, 255, 0.06);
                @include flex(space-between);
                font-family: $fontFamily;
                font-size: 12px;
                color: #9f9f9f;
            }

            .dateActive {
                background-color: #ff7c43;
                color: #fff;
            }

        }

        .status {
            margin-top: 24px;

            span {
                font-family: $fontFamily;
                font-size: 14px;
                color: #8d8d8d;
                margin-right: 23px;
                padding-bottom: 8px;
                display: inline-block;
                border-bottom: 1px solid #404040;
                position: relative;
                z-index: 2;
            }

            .spanActive {
                border-bottom: 1px solid $btnBgColor;
                color: $btnBgColor;
            }
        }

        .status::after {
            content: '';
            width: 100%;
            border-bottom: 1px solid #404040;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;

        }
    }

    .list {
        color: #fff;

        .lItem {
            border-radius: 6px;
            background-color: #1f1f1f;
            padding: 13px 13px 13px 12px;

            .top {
                font-family: $fontFamily;
                font-size: 14px;
                color: #fff;
                @include flex(space-between);
            }

            .bottom {
                font-family: $fontFamily;
                font-size: 12px;
                color: #9f9f9f;
                margin-top: 6px;
                @include flex(space-between);

                span:last-child {
                    color: $btnBgColor;
                }
            }
        }
    }

}
</style>