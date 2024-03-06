<template>
    <div class="about">

    </div>
</template>
<script setup>
 import { reactive, toRefs, onMounted, watchEffect } from 'vue'
import { showToast } from 'vant'
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
</script>
<style scoped lang="scss">
.about {
    height: 100%;
    background-color: $mainBg;
    box-sizing: border-box;
    padding-top: 5px;
    overflow-y: auto;
}
</style>
