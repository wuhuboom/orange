<template>
    <div class="download maxWidth lrPadding ">
        <div class="logo">
            <img :src="getImg('down', 'icon')" />
        </div>
        <div class="btn-div">
            <input type="button" :value="$t('fuc.app.download')" @click="getDownObj()" class="btn" />
        </div>
    </div>
</template>
<script setup>
 import { reactive, toRefs, onMounted, watchEffect } from 'vue'
import { GridItem, showToast } from 'vant'
import { getImg } from '@/utils/utils'
import { useRouter } from 'vue-router'
import http from '@/utils/axios'
import { useStore } from '@/stores/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const store = useStore()
const router = useRouter()

const state = reactive({
    osType:'',
    downObj:{},
    loading:false
})
getOsType()
//getDownObj()
async function getDownObj(){
    if(state.loading){
        return
    }
    let url ='/player/home/app_url'
    const res = await http.get(url)
    state.loading = true
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
const { osType, downObj, loading } = toRefs(state)
</script>
<style scoped lang="scss">
.download {
    height: 100%;
    background-color: $mainBg;
    box-sizing: border-box;
    padding-top: 5px;
    overflow-y: auto;
    background-image: url('../assets/images/down/bg.webp');
    background-size: 100% 100%;
    @include flex(spave-around,center);
    flex-direction: column;
    align-items: center;
    .logo{
        width: 88px;
        height:113px;
        margin-top: 15vh;
    }
    .btn-div{
        margin-top: 35vh;
        .btn{
            width: 267px;
            height: 48px;
            border-radius: 24px;
            box-shadow: 0 3px 6px 0 rgba(245, 195, 130, 0.51);
            background-image: linear-gradient(to right, #fbe5c9, #f4c07d);
            text-transform: uppercase;
        }
    }
}
</style>
