<template>
    <div class="cardManager maxWidth lrPadding">
        <div class="card-item"  v-for="(item,index) in cardList" :key="index" :class="'bgImg'+ index">
            <div class="row1">
                <span class="l_left">{{item.bankName}}</span>
                <img :src="getImg('card', 'delete')" class="iconImg" @click="deleteCard(item)">
            </div>
            <div class="row2">
                <span>{{splitNum(item.cardNumber)}}</span>
            </div>
            <div class="row3">
                <span class="l_left">{{item.cardName}}</span>
                <img :src="getImg('card', 'edit')" class="iconImg" @click="editCard(item)">
            </div>
        </div>
        <div class="add-card-btn" @click="addCard(item)">
            <span>{{$t('withdraw.add.way.text')}}</span>
            <img :src="getImg('card', 'plus')" class="iconImg" >
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
    cardList:[]
})

onMounted(() => {
    window.scrollTo(0, 0); 
    getBankCard()
})
function deleteCard(item) {
    
}
function editCard(item){

}
function addCard(){
    router.push({
        path:'/withdraw'
    })
}
async function getBankCard() { 
    state.cardList = []
    let url = '/player/bank_card_info'
    try {
        const res = await http.get(url)
        if(res){
            state.cardList.push(res)
        }
        state.cardList.push(
            {
            "createdAt": "日期",
            "bankName": "银行名",
            "backEncoding": "银行编码",
            "cardNumber": "123452651854123",
            "cardName": "卡姓名",
            "country": "国家",
            "province": "省",
            "city": "市",
            "subBranch": "支行名",
            "img": "withdraw/2503090ee177451d85ac4e7eea5d42f5.jpg",
            }
        )
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
 const { cardList } = toRefs(state)
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
    .card-item{
        height: 180.6px;
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
        @include flex(center);
        border-radius: 12px;
        height: 42px;
        line-height: 42px;
         border-radius: 12px;
        border: solid 1px #fff;
        background-color: #1c1c1c;
        margin-top: 10px;
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