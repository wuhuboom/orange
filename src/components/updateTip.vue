<template>
    <div class="weihu maxWidth lrPadding hideScrollbar">
          <van-dialog v-model:show="tipDialog" width="310px" className="tipDialog maxWidth" :showConfirmButton="false"
            :showCancelButton="false">
            <template #default>
                <p class="wcontent">{{tipMsg}}</p>
                <div class="btn-box">
                    <div class="btn-cal" @click="closeDialog">{{$t('index.editor.psd.modal.cancel.btn')}}</div>
                    <div class="btn-sub" @click="submit">{{$t('invite.tip.btn.text')}}</div>
                </div>
            </template>
        </van-dialog>
    </div>
</template>
<script setup>
import { reactive, toRefs,onMounted,onUnmounted } from 'vue'
import http from '@/utils/axios'
import { useRouter } from "vue-router";
const router = useRouter()
const props = defineProps(['type'])
const emit = defineEmits('submit','close')
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const state = reactive({
    tipDialog: false,
    tipMsg:''
})

async function getConfig(){
    let url = '/player/auth/sys_config'
    try {
        let res = await http.get(url)
        const status = res.editImportantLogout
        if(status > 0){
            state.tipMsg = t('modify.editImportantLogout.text',{type:props.type,times:status})
            state.tipDialog = true
        }
    } catch (error) {
        console.log(error);
    }
}
async function submit(){
    emit('submit',{})
}
async function closeDialog(){
    state.tipDialog = false
    emit('close',{})
}
onMounted(() => {
    getConfig()
})
const {tipDialog,tipMsg} = toRefs(state)
</script>
<style scoped lang='scss'>
.weihu {
    :deep(.tipDialog) {
        border-radius: 16px;
        background-image: linear-gradient(to bottom, #252531, rgba(24, 24, 38, 0.96));
        padding: 0 30px;
        .warningIcon {
            width: 54px;
            height: 54px;
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
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.3px;
            text-align: left;
            color: #d9dbe9;
            padding: 15px 10px 20px 10px;
        }
        .btn{
            margin: 0 8px 0 0;
            padding: 13.3px 104px 16px 105px;
            border-radius: 14px;
            background-color: #ff6c00;
            text-transform: uppercase;
            color: #fff;
            margin-bottom: 20px;
        }
        .btn-box{
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            margin-bottom: 20px;
            .btn-cal{
                width:30%;
                height: 35px;
                line-height: 35px;
                border-radius: 14px;
                background-color: transparent;
                text-transform: uppercase;
                color: #fff;
                border: 1px solid #fff;
                text-align: center;
            }
            .btn-sub{
                width:30%;
                height: 35px;
                line-height: 35px;
                border-radius: 14px;
                background-color: #ff6c00;
                text-transform: uppercase;
                color: #fff;
                text-align: center;
            }
        }
    }
}
</style>