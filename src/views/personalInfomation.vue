<template>
    <div class="personalInfomation hideScrollbar maxWidth lrPadding">
        <div v-for="(item,index) in menulist" :key="index" class="menu-item">
            <span class="menu-name">{{ item.name }}</span>
            <div class="menu-icon" @click="go(item)">
                <span v-if="item.showText" :class="item.showIcon ? 'menu-tip':''">{{ item.showText }}</span>
                <van-icon name="arrow" color="#fff" v-if="item.showIcon"/>
            </div>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted,computed } from 'vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import {formatDate} from '@/utils/utils'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

import { useStore } from '@/stores/index'
const store = useStore()
const accountInfo = computed(() => store.accountInfo)
const { t } = useI18n()
const router = useRouter()
const state = reactive({
    menulist: [
        { name: t('personal.menu.password'), path: '/loginPwdSet',showIcon:true,showText:'' },
        { name: t('personal.menu.withdrawpwd'), path: '/withdrawPwdSet',showIcon:true,showText:'' },
        { name: t('personal.menu.phone'), path: '/updatePhone',showIcon:true,showText:maskString(accountInfo.value.phone) },
        { name: t('personal.menu.email'), path: '/updateEmail',showIcon:true,showText:accountInfo.value.email },
        { name: t('personal.menu.loginlog'), path: '',showIcon:false,showText:getLoginLog() },
    ]
})    
function getLoginLog(){
    const time = formatDate(new Date())
    return time
}
function maskString(str) {
    if (!str || str.length <= 4) {
        return str;
    }
    const maskedPart = '*'.repeat(str.length - 4);
    const visiblePart = str.slice(4);
    return visiblePart + maskedPart;
}
function go(item){
    router.push({
        path:item.path
    })
}
const {  menulist} = toRefs(state)
</script>
<style scoped lang='scss'>
.personalInfomation {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    .menu-item{
        @include flex(space-between,center);
        height: 45px;
        border-radius: 7px;
        margin-top: 10px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #1f1f1f;
        color: #ffffff;
        font-size: 12px;
        .menu-tip{
            color: #ff6c00;
            margin-right: 12px;
        }
        .menu-icon{
            min-width: 50px;
            height: 100%;
            @include flex(flex-end);
        }
    }
 
}
</style>