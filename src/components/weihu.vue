<template>
    <div class="weihu maxWidth lrPadding hideScrollbar">
          <van-dialog v-model:show="tipDialog" width="310px" className="weihuDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <img src="../assets/images/home/warningIcon.webp" class="warningIcon" alt="">
                <!-- <p class="wtitle">{{$t('withdraw.success.title.text')}}</p> -->
                <p class="wcontent">{{tipMsg}}</p>
            </template>
        </van-dialog>
    </div>
</template>
<script setup>
import { reactive, toRefs,onMounted } from 'vue'
import http from '@/utils/axios'

const state = reactive({
    tipDialog: false,
    tipMsg:''
})

async function getConfig(){
    let url = '/player/auth/sys_config'
    try {
        let res = await http.get(url)
        // res = {
        //     "code": 188,
        //     "msg": "Dear user\n\nIn order to provide better services and optimize platform performance, we will upgrade the platform. During this period, the platform will be inaccessible. Please stop using the platform and wait for a while during the upgrade. Estimated time is 2 hours\n\nIn order to provide better services and optimize platform performance, we will upgrade the platform. During this period, the platform will be inaccessible. Please stop using the platform and wait for a while during the upgrade. Estimated time is 2 hours",
        //     "data": null
        // }
        const code = res.code || 200
        if(code ==188){
            state.tipDialog = true
            state.tipMsg = res.msg
        }else{
            state.tipDialog = false
        }
    } catch (error) {
        console.log(error);
    }
    setTimeout(getConfig,3000)
}
 
onMounted(() => {
    getConfig()
})
const {tipDialog,tipMsg} = toRefs(state)
</script>
<style scoped lang='scss'>
.weihu {
    :deep(.weihuDialog) {
        border-radius: 16px;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 10px 10px;
        z-index: 9999;
        .warningIcon {
            width: 70px;
            height: 70px;
            margin: 10px auto 0;
        }
        .wtitle {
            text-align: center;
            color: #fff;
            margin-top: 18px;
            font-family: $fontFamily;
            font-size: 13px;
            font-weight: bold;
            color: #fff;
        }
        .wcontent {
            font-family: Roboto;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.3px;
            text-align: left;
            color: #d9dbe9;
            padding: 15px 10px 20px 10px;
            max-height: 220px;
            overflow: auto;
        }
    }
}
</style>