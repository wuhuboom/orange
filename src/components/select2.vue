<template>
  <div class="langBox">
        <div class="langSelect" @click.stop="showSelect">
            <div class="l_left">
                <span class="l_name">{{ langTarget }}</span>
            </div>
            <van-icon :name="showLangOpt ? 'arrow-up' : 'arrow-down'" />
        </div>
        <div class="options" :class="{ showOpt: showLangOpt }">
            <div class="o_item" :class="{ lfc: item.name === langTarget }" v-for="(item, index) in langList"
                :key="index" @click="selectLang(item)">
                <span class="l_name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, defineEmits, toRefs, ref, onMounted, nextTick } from 'vue'
const props = defineProps(['datas','defaultVal'])
const emit = defineEmits(['sendSelectVal'])


const state = reactive({
    langList: props.datas,
    langTarget: props.defaultVal,
    showLangOpt: false,
})
function showSelect(){
    state.showLangOpt = !state.showLangOpt
}
function selectLang(item) {
    state.langTarget = item.name
    state.showLangOpt = false
    emit('sendSelectVal', item)
} 
const { langList, langTarget, showLangOpt } = toRefs(state)
</script>

<style scoped lang="scss">
    .langBox {
            width: 100%;
            @include flex(flex-start);
            position: relative;
            box-sizing: border-box;
            height: 49px;
            border-radius: 10px;
            border: none;
            background-color: #333;
            color: #fff;
            margin-top: 8px;
            box-sizing: border-box;

            .langSelect {
                @include flex();
                color: #fff;
                width: 100%;
                height: 100%;
                padding: 0 6px 0 4px;
                .l_left {
                    @include flex(flex-start);
                    color: #fff;
                    margin-right: 20px;
                }
            }
            .l_name {
                margin-left: 6px;
                font-family: $fontFamily;
                font-size: 15px;
                color: #fff;
            }

            .options {
                width: calc($selectWidth + 12px);
                position: absolute;
                top: 58px;
                left: 12px;
                color: #fff;
                border-radius: 4px;
                background: rgba(0, 0, 0, .56);
                height: 0;
                overflow: auto;
                transition: height .5s ease-out;
                cursor: pointer;
                .o_item {
                    height: 24px;
                    padding: 0 6px 0 7px;
                    font-family: $fontFamily;
                    font-size: 15px;
                    color: #fff;
                    @include flex(flex-start);
                    margin-top: 6px;
                }

                .lfc {
                    .l_name {
                        color: #ff7c43;
                    }
                }
            }

            .showOpt {
                transition: height .5s ease-out;
                height: 160px;
            }
        }
</style>