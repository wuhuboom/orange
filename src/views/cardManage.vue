<template>
    <div class="cardManager maxWidth lrPadding">
        <div class="card-item"  v-for="(item,index) in cardList" :key="index" :class="'bgImg0'">
            <div class="row1">
                <span class="l_left">{{item.bankName}}</span>
                <!-- <img :src="getImg('card', 'delete')" class="iconImg" @click="deleteCard(item)"> -->
            </div>
            <div class="row2">
                <span>{{splitNum(item.cardNumber)}}</span>
            </div>
            <div class="row3">
                <span class="l_left">{{item.cardName}}</span>
                <img :src="getImg('card', 'edit')" class="iconImg" @click="editCard(item,1)">
            </div>
        </div>
        <div class="card-item"  v-for="(item,index) in usdtList" :key="index" :class="'bgImg1'">
            <div class="row1">
                <span class="l_left">{{item.protocol}}</span>
                <!-- <img :src="getImg('card', 'delete')" class="iconImg" @click="deleteCard(item)"> -->
            </div>
            <div class="row2">
                <span>{{splitNum(item.address)}}</span>
            </div>
            <div class="row3">
                <span class="l_left">{{item.username}}</span>
                <img :src="getImg('card', 'edit')" class="iconImg" @click="editCard(item,2)">
            </div>
        </div>
        <div class="card-item"  v-for="(item,index) in walletList" :key="index" :class="'bgImg2'">
            <div class="row1">
                <span class="l_left">{{item.type}}</span>
                <!-- <img :src="getImg('card', 'delete')" class="iconImg" @click="deleteCard(item)"> -->
            </div>
            <div class="row2">
                <span>{{splitNum(item.address)}}</span>
            </div>
            <div class="row3">
                <span class="l_left">{{item.account}}</span>
                <img :src="getImg('card', 'edit')" class="iconImg" @click="editCard(item,4)">
            </div>
        </div>
        <div>
            <template v-for="(item,index) in types" :key="index">
                <div class="add-card-btn" @click="addCard(item)" v-if="item.data?.length == 0">
                    <img class="logo" :src="item.img" />
                    <span>{{item.name}}</span>
                    <img :src="getImg('card', 'plus')" class="iconImg" >
                </div>
            </template>
        </div>
        
    </div>
</template>
<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
import { getImg } from '@/utils/utils'
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { showConfirmDialog } from 'vant';

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const state = reactive({
    cardList:[],
    walletList:[],
    usdtList:[],
    types:[]
})

onMounted(() => {
    getBankCard()
    getUsdtWalletList()
    eWalletList()
    withdrawpre()
})

async function withdrawpre(){
    let url = '/player/withdrawal_pre'
    try {
        const res = await http.get(url)
        res?.forEach(item => {
            if (item.name == 'E-Wallet') {
                item.data = state.walletList
            } else if (item.name === 'Bank') {
                item.data = state.cardList
            } else if (item.name === 'USDT') {
                item.data = state.usdtList
            }
        });
        state.types = res
    
    } catch (error) {
        console.log(error);
    }
}
function editCard(item,type){
    if (type == 4) {
        router.push({
            path:'/editWallet',
            query:{
                item:JSON.stringify(item)
            }
        })
    } else if (type==1) {
        router.push({
            path:'/editBankCard',
            query:{
                card:JSON.stringify(item)
            }
        })
    } else if (type==2) {
        router.push({
            path: '/editWalletAddress',
            query: {
                item:JSON.stringify(item)
            }
        })
    }
}
function addCard(item){
    localStorage.setItem('toaddFlag', 1)

    if (item.name == 'E-Wallet') {
        router.push({
            path: '/addWallet'
        })
    } else if (item.name === 'Bank') {
        router.push({
            path: '/addBankCard',
        })
    } else if (item.name === 'USDT') {
        router.push({
            path: '/addWalletAddress',
            query: {
                addType: item.name
            }
        })
    }
    return
}
async function getBankCard() { 
    state.cardList = []
    let url = '/player/bank_card_info'
    try {
        const res = await http.get(url)
        if(res){
            state.cardList.push(res)
        }
    } catch (error) {
        console.log(error);
    }
}
async function getUsdtWalletList() {
    let url = '/player/virtual_currency_list'
    try {
        const res = await http.post(url)
        if (res.length > 0) {
            res.forEach(item => {
                item.address = item.addr.slice(0, 4) + '****' + item.addr.slice(-4)
            })
            state.usdtList = res
        }
    
    } catch (error) {
        console.log(error);
    }
}
async function eWalletList() {
    let url = '/player/wallet_info'
    try {
        const res = await http.get(url)
        if (Array.isArray(res) && res.length > 0) {
            res.forEach(item => {
                item.addr = item.address
            })
            state.walletList = res
        }
    } catch (error) {
        console.log(error);
    }
}
function splitNum(num) {
     var reg = /^[0-9]*$/;
     if(reg.test(num)){
         var formattedNumber = "";
         for (let i = 0; i < num.length; i++) {
            if ((i + 1) % 4 === 0 && i !== 0) {
                formattedNumber += " "; // 在每4位数字后添加空格
            }
            formattedNumber += num[i];
        }
        return formattedNumber
     }else{
        return num
     }
}
 const { cardList,usdtList,walletList,types } = toRefs(state)
</script>
<style scoped lang='scss'>
.cardManager{
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    padding-top: 10px;
    .bgImg0{
        background-image: url(../assets/images/card/yellow.webp);
    }
    .bgImg1{
        background-image: url(../assets/images/card/blue.webp);
    }
    .bgImg2{
        background-image: url(../assets/images/card/green.webp);
    }
    .card-item{
        height: 180.6px;
        margin-top: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-size: 100% 100%;
        @include flex(space-around,center);
        flex-direction: column;
        .row1,.row3{
            @include flex(space-between,center);
            width: 80%;
            span{
                font-size: 18px;
                color: #fff;
                display: block;
                width: 100px;
            }
            img{
                width: 22px;
                height: 22px;
            }
        }
        .row2{
            width: 80%;
            margin-top: 50px;
            span{
                font-size: 20px;
                color: #ffffff;
                letter-spacing: 0.74px;
            }
        }
        .row3 span{
            font-size: 16px!important;
        }
    }
    .add-card-btn{
        @include flex(space-between,center);
        border-radius: 12px;
        height: 42px;
        line-height: 42px;
         border-radius: 12px;
        border: solid 1px #fff;
        background-color: #1c1c1c;
        margin-top: 10px;
        padding-right: 20px;
        .logo{
            width: 55px;
            height: 36px;
        }
        span{
            font-size: 14px;
            color: #fff;
        }
        img{
            margin-left: 20px;
            width: 22px;
            height: 22px;
        }
    }
}
</style>