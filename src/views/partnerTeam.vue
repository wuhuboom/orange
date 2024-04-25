<template>
    <div class="partnerTeam maxWidth lrPadding">
        
        
        
    </div>
</template>
<script setup >
import { reactive, toRefs, onMounted,computed } from 'vue'
import { useRouter } from "vue-router";
import http from '@/utils/axios'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/index'
const store = useStore()
const accountInfo = computed(() => store.accountInfo)

const { t } = useI18n()
const router = useRouter()
const state = reactive({
    page: {
        pageNo: 1,
        pageSize: 10,
    },
    records:[]
})

onMounted(() => {
    init()
})

function init(){

}
async function getUserList() {
    let url = '/player/sub_players'
    let data = {
        pageNo: state.page.pageNo,
        pageSize: state.page.pageSize
    }
    try {
        const res = await http.post(url, data)
        console.log(
            '%c res: ',
            'background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;',
            res
        )
        state.userArr = [...state.userArr, ...res.results] || []
        state.page.pageNo = res.pageNo
        state.page.pageSize = res.pageSize
        state.page.hasNext = res.hasNext
    } catch (error) {
        console.log(error);
    }
}
const { page,records } = toRefs(state)
</script>
<style scoped lang='scss'>
.partnerTeam {
    height: 100%;
    background-color: #0b0b0b;
    overflow: auto;
    box-sizing: border-box;
    overflow-x: hidden;

}
</style>