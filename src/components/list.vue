<template>
    <div class="list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
                <slot name="list-item"></slot>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script setup >
import { reactive, toRefs, defineEmits } from 'vue'
const emit = defineEmits(['getListData'])
const props = defineProps(['listStatus'])
const { loading, finished, refreshing, finishedText } = toRefs(props)
const state = reactive({
    // loading: false,
    // finished: false,
    // refreshing: false,
    timer: null
})
function onLoad() {
    state.timer && clearTimeout(state.timer)
    state.timer = setTimeout(() => {
        emit('getListData')
    }, 300);
    // setTimeout(() => {
    //     if (state.refreshing) {
    //         state.list = [];
    //         state.refreshing = false;
    //     }

    //     for (let i = 0; i < 10; i++) {
    //         state.list.push(state.list.length + 1);
    //     }
    //     state.loading = false;

    //     if (state.list.length >= 40) {
    //         state.finished = true;
    //     }
    // }, 1000);
};
function onRefresh() {
    // // 清空列表数据
    // state.finished = false;

    // // 重新加载数据
    // // 将 loading 设置为 true，表示处于加载状态
    // state.loading = true;
    // onLoad();
};
</script>
<style scoped lang='scss'>
.list {
    color: #fff;
}
</style>