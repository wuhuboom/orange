<template>
    <div class="cancelOrder maxWidth lrPadding">
        <div class="title">
            <img src="" alt="">
            {{ $t('cancelorder.friendlyReminder.text')}}
        </div>
        <p class="text"> {{ $t('cancelorder.friendlyReminder.tips1.text') }}</p>

        <p class="text"> {{ $t('cancelorder.friendlyReminder.tips2.text') }}</p>

        <p class="text"> {{ $t('cancelorder.friendlyReminder.tips3.text' ) }}</p>
        <h5>{{ $t('cancelorder.reason.head.text') }}</h5>
        <van-divider />
        <ul class="list">
            <li class="cursor " :class="{ pactive: reasonsIndex === index }" v-for="(item, index) in listData" :key="index"
                @click="selectReasons(index)">
                <img :src="getImg('common', reasonsIndex === index ? `${item.icon}Active` : item.icon)" class="circle"
                    alt="">
                {{ item.text }}
            </li>
        </ul>
        <div class="confirm cursor" @click="cancelOrder">
            {{ $t('modal.confirm.text') }}
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs } from "vue";
import { getImg } from '@/utils/utils'
import http from '@/utils/axios'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
const router = useRouter()
const state = reactive({
    reasonsIndex: -1,
    listData: [
        {
            icon: 'dot',
            text: t('cancelorder.reason1.text')
        },
        {
            icon: 'dot',
            text: t('cancelorder.reason2.text')
        },
        {
            icon: 'dot',
            text: t('cancelorder.reason3.text')
        },
        {
            icon: 'dot',
            text: t('cancelorder.reason4.text')
        },
        {
            icon: 'dot',
            text: t('cancelorder.reason5.text')
        },
        {
            icon: 'dot',
            text: t('cancelorder.reason6.text')
        },
        {
            icon: 'dot',
            text: t('cancelorder.reason7.text')
        },
        {
            icon: 'dot',
            text: t('cancelorder.reason8.text')
        },
    ]
})
function selectReasons(index) {
    state.reasonsIndex = index
    router.push({
        path: '/orderStatus'
    })
}
async function cancelOrder(){
    let url = '/player/fb/buy/cancel'
    if(state.reasonsIndex < 0){
        showToast($t('ruls.xxx.empty', { type: t('reason') }))
        return
    }
    let para = {
        id:state.id,
        remark: state.listData[state.reasonsIndex].text
    }
    const res = await http.post(url, para)
    
}
const { listData, reasonsIndex } = toRefs(state)
</script>
<style scoped lang='scss'>
.cancelOrder {
    height: 100%;
    background: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;

    .title {
        @include flex(flex-start);
        font-family: $fontFamily;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 14px;

        img {
            width: 20px;
            height: 20px;
        }
    }

    .text {
        font-size: 12px;
        line-height: 1.33;
        color: #a6a6a6;
        margin-bottom: 10px;
    }

    h5 {
        font-family: $fontFamily;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        margin-top: 24px;
    }

    .list {
        li {
            @include flex(flex-start);
            font-family: $fontFamily;
            font-size: 13px;
            color: #fff;
            margin-bottom: 26px;

            .circle {
                width: 18px;
                height: 18px;
                margin-right: 12px;
            }
        }

        .pactive {
            color: #ff7c43;
        }
    }
}
</style>