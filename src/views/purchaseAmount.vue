<template>
    <div class="purchaseAmount maxWidth ">
        <div class="textBox">
            <p>{{$t('purchaseamount.text')}}</p>
            <p>{{ $t('deal_limit_range_2061_206400_cny') }} {{saler.minBalance}} - {{saler.maxBalance}}</p>
        </div>
        <div class="moneyInput" :class="{ errorStyle: isError }">
            <div class="top">
                <div class="opt">
                    <span @click="changeAmount(1)">{{$t('purchaseamount.max.text')}}</span>
                    <span @click="changeAmount(2)">{{$t('purchaseamount.half.text')}}</span>
                </div>
                <div class="obtain">
                    <span class="title">{{$t('purchaseamount.obtain.text')}} </span>
                    <span class="money">{{fomarUsdt(saler.balance)}} USD</span>
                </div>
            </div>
            <input :class="isError ? 'money-num':''" type="number" v-model="money" @click="isError = false">
        </div>
        <p class="errorText" v-if="isError">{{errorText}}</p>
        <div class="buy" :class="{ isDisabled: money <= 0 }" @click="toPage" >
            {{$t('deal.buyDetail.387081-12')}}
        </div>
        <div class="agree-div">
            <span class="agree">{{$t('purchaseamount.agree.text')}}</span>
            <span class="link">{{$t('purchaseamount.link.text')}}</span>
        </div>
    </div>
</template>
<script setup >
import { reactive, toRefs,watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import http from '@/utils/axios'
import {fomarUsdt} from '@/utils/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const state = reactive({
    money: 0,
    rateMoney:0,
    isError: false,
    errorText:'',
    saler:{}
})
watchEffect(() => {
    // state.rateMoney = state.money / (state.saler?.price || 1)
})
function changeAmount(type){
    if(type==1){
        state.money = fomarUsdt(state.saler.balance)
    }else{
        state.money = fomarUsdt(state.saler.balance/2)
    }
}
async function toPage() {
    if(state.money <= 0) {
        // state.isError = true
        // state.errorText = t('deal.buyDetail.387081-13')
        return 
    }
    if(Number(state.money) > Number(state.saler.maxBalance)){
        state.isError = true
        state.errorText = t('backapi.payMoneyTooMinOrMax')
        return
    }
    if(Number(state.money) < Number(state.saler.minBalance)){
        state.isError = true
        state.errorText = t('backapi.payMoneyTooMinOrMax')
        return
    }
    let url = '/player/fb/buy'
    let para = {
        id: state.saler.id,
        money: state.money
    }
    let res = await http.post(url,para)
    res = 123 
    console.log(res)
    if(res){
        router.push({
            path: '/confirmBuy',
            query: {
                id: res
            }
        })
    }
    
}
getPageInfo()
async function getPageInfo() {
    let url = '/player/fb/info/saler'
    let data = {
        id: route.query.id
    }
    try {
        const res = await http.post(url, data)
        state.saler = res
    } catch (error) {
        console.log(error);
    }
}
const { money,rateMoney, isError,saler,errorText } = toRefs(state)
</script>
<style scoped lang='scss'>
.purchaseAmount {
    height: 100%;
    background-color: #27272a;
    box-sizing: border-box;
    overflow: auto;

    .textBox {
        p {
            height: 45px;
            line-height: 45px;
            padding-left: 12px;
            font-family: $fontFamily;
            font-size: 13px;
            color: #fff;
        }

        p:first-child {
            border-bottom: 1px solid rgba(93, 86, 105, 0.48);
        }

        p:last-child {
            font-family: $fontFamily;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.48);
        }
    }

    .moneyInput {
        padding: 11.5px 12.9px 13px 11.5px;
        border-radius: 15.5px;
        border: solid 1px rgba(255, 255, 255, 0.08);
        margin: 13px 20px 0 12px;
        background-color: #1e1e20;
        height: 70px;
        .top {
            @include flex(space-between);

            .opt {
                span {
                    height: 20px;
                    line-height: 20px;
                    padding: 0 9px;
                    border-radius: 10px;
                    background-color: rgba(93, 86, 105, 0.48);
                    font-family: $fontFamily;
                    font-size: 12px;
                    color: #dbd6e3;
                    margin-right: 5px;
                }
            }

            .obtain {
                font-family: $fontFamily;
                font-size: 12px;
                .title{
                    color: #dbd6e3;
                    margin-right: 10px;
                }
                .money{
                    color: #fff;
                }
            }
        }

        input {
            outline: none;
            background-color: #1e1e20;
            border: none;
            font-family: $fontFamily;
            font-size: 24px;
            color: rgba(255, 255, 255, 0.36);
            margin-top: 15px;
        }
        .money-num{
            color: #f87871;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
            
        }
    }

    .errorStyle {
        border: solid 1px #f87871;
    }
    .errorText{
        height: 36px;
        margin-top: 10px;
        color: #f87871;
        font-size: 12px;
        text-align: right;
        margin-right: 20px;
    }
    .buy {
        margin: 12px 0 0 12px;
        width: 85px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 16px;
        background-color: #ff6c00;
        font-family: $fontFamily;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
    }

    .isDisabled {
        opacity: 0.3;
    }
    .agree-div{
        position: fixed;
        bottom: 70px;
        padding: 10px;
        text-align: center;
        font-size: 13px;
        line-height: 1.5;
        .agree{
            color: #9f9f9f;
        }
        .link{
            color: #fff;
            text-decoration: underline;
        }
    }
}
</style>