<template>
    <div class="download">

    </div>
</template>
<script setup>
 import { reactive, toRefs, onMounted, watchEffect } from 'vue'
import { GridItem, showToast } from 'vant'
import { useRouter } from 'vue-router'
import http from '@/utils/axios'
import { useStore } from '@/stores/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const store = useStore()
const router = useRouter()

const state = reactive({
    osType:'',
    downObj:{}
})
getOsType()
getDownObj()
async function getDownObj(){
    let url ='/player/home/app_url'
    const res = await http.get(url)
    res.forEach(item => {
        if(item.appType==state.osType){
            state.downObj = item
        }
    });
    if(state.downObj.appUrl){
        url = '/player/home/app_url_count?id=' + state.downObj.id
        await http.get(url)  
        setTimeout(() => {
            window.location.href = state.downObj.appUrl
        }, 1000)
    }
}

function getOsType() {
    if (navigator.userAgent.indexOf('iPhone') !== -1) {
        state.osType = 1
    } else if (navigator.userAgent.indexOf('Android') !== -1) {
        state.osType = 0
    }
}
</script>
<style scoped lang="scss">
.download {
    height: 100%;
    background-color: $mainBg;
    box-sizing: border-box;
    padding-top: 5px;
    overflow-y: auto;
}
</style>
