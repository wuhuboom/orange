<template>
    <div class="selectCom relative" @click="showSelectOpt">
        <div class="title">{{ selectedObj.title }}</div>
        <div class="verifyOpt cursor " :class="{ hideBr: isShowSelectedOpt }">
            <div class="vmType">{{ selectedObj.selectedVal }}</div>
            <div class="arrowBox">
                <van-icon :name="isShowSelectedOpt ? 'arrow-up' : 'arrow-down'" />
            </div>
        </div>
        <div class="verifyMethods" :class="{ showVMOpt: isShowSelectedOpt }">
            <div class="itemOpt" :class="{ ioAcitve: optIndex === index }" v-for="(item, index) in selectedObj.options"
                :key="index" @click="handleSelectOpts(index)">{{ item.label }}</div>
        </div>
    </div>
</template>
<script setup >
import { ref, defineEmits } from 'vue'
const props = defineProps(['selectedObj'])
const emit = defineEmits(['sendSelectVal'])
const isShowSelectedOpt = ref(false)
let optIndex = ref(0)
function showSelectOpt() {
    isShowSelectedOpt.value = !isShowSelectedOpt.value
}
function handleSelectOpts(index) {
    optIndex.value = index
    let emitObj = {
        val: props.selectedObj.options[index],
        type: props.selectedObj.dataType
    }
    emit('sendSelectVal', emitObj)
}
</script>
<style scoped lang='scss'>
.selectCom {
    width: 100%;
    box-sizing: border-box;
    @include flex(center);
    flex-direction: column;
    margin-top: 20px;

    .title {
        width: 100%;
        display: block;
        margin: 0 auto;
        font-family: SFProText;
        font-size: 14px;
        color: #9da4b4;
    }

    input {
        width: 100%;
        height: 49px;
        border-radius: 10px;
        border: none;
        background-color: #333;
        color: #fff;
        margin-top: 8px;
        box-sizing: border-box;
        padding-left: 15px;
    }

    .wtStyle {
        @extend input;
        @include flex(flex-start);
    }

    .verifyOpt {
        width: 100%;
        background-color: #333;
        border-radius: 10px;
        @include flex();
        box-sizing: border-box;
        margin-top: 10px;
        padding-right: 16px;

        input {
            width: 90%;
            margin: 0;
        }

        .vmType {
            @extend input;
            @include flex(flex-start);
        }

        .arrowBox {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #d9dbe8;
            @include flex(center);
        }

        .sendBtn {
            width: 70px;
            height: 32px;
            border-radius: 8px;
            background-color: #ff7c43;
            @include flex(center);
            font-family: Helvetica;
            font-size: 13px;
            color: #fff;

        }
    }

    .hideBr {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }


    .verifyMethods {
        width: 100%;
        position: absolute;
        top: 73px;
        background-color: #333;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        max-height: 0;
        transition: max-height .5s ease-out;
        overflow: hidden;

        .itemOpt {
            height: 50px;
            line-height: 50px;
            padding-left: 15px;
            font-family: SFProText;
            font-size: 14px;
            color: #fff;

        }

        .ioAcitve {
            background-color: rgba(255, 124, 67, 0.18);
        }
    }

    .showVMOpt {
        max-height: 100px;
    }
}
</style>