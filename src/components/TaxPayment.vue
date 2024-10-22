<template>
  <van-dialog
    class="tax-payment-dialog p-x-24"
    :showConfirmButton="false"
    v-model:show="showDialog"
    :close-on-click-overlay="false"
  >
    <div class="tax-payment color-fff">
      <ul>
        <li class="justify-between align-center p-t-16">
          <p class="color-pink">
            {{ $t(`backapi.self.already.money.time.text`) }}
          </p>
          <p>
            <van-count-down :time="obj.time" format="DDD:HH:mm:ss" />
          </p>
        </li>
        <li class="justify-between align-center p-t-16">
          <p class="color-pink">{{ $t(`wallet.index.balance.text`) }}</p>
          <p>{{ money1 }}</p>
        </li>
        <li class="justify-between align-center p-t-16">
          <p class="color-pink">{{ $t(`backapi.self.already.money.text`) }}</p>
          <p>{{ money3 }}</p>
        </li>
        <li class="justify-between align-center p-t-16">
          <p class="color-pink">{{ $t(`backapi.self.need.money.text`) }}</p>
          <p
           @click="copyToClipboard"
          >
            {{ moneyCeil }}
            <i class="el-icon-document-copy copy-button active font16 ml-4"></i>
          </p>
        </li>
      </ul>
      <div class="p-t-16 p-b-16 msg text-center">{{ obj.msg }}</div>
      <ul class="align-center desc">
        <li class="m-r-8">
          <img src="@/assets/images/betpage/131056@2x.webp" alt="" />
        </li>
        <li class="font12 color-pink">
          {{ $t(`backapi.self.all.alert.desc`) }}
        </li>
      </ul>
      <ul class="text-center">
        <li class="center-center m-t-20">
          <van-button
            class="pay-res-btn"
            block
            type="info"
            @click.native="
              $router.push({ name: 'recharge' })
            "
            native-type="button"
            >{{ $t("Pay.Taxes") }}</van-button
          >
        </li>
      </ul>
    </div>
  </van-dialog>
</template>
<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { useStore } from '@/stores/index';
import { getImg, getAmount } from '@/utils/utils';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const store = useStore();
import http from '@/utils/axios'


const showDialog = ref(false);
const obj = ref({});
const trimr = ref(null);

const user = computed(() => store.accountInfo);
const money1 = computed(() => getAmount(obj.value.balance));
const money2 = computed(() => getAmount(obj.value.needMoney));
const money3 = computed(() => getAmount(obj.value.money));
const moneyCeil = computed(() => Math.ceil(money2.value));

const getCopyValue = () => `${moneyCeil.value}`;


const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(`${moneyCeil.value}`);
    showToast(t(`transfer.copy.success.text`));
  } catch (err) {
  }
};

const fbConf = async () => {
  const res = await http.get('/player/safe/conf');
  if(res.code === 411){
    obj.value = res.data;
    showDialog.value = true;
  }else{
    if(showDialog.value){
      location.reload();
    }
    
  }
};

onMounted(() => {
  fbConf();
  trimr.value = setInterval(() => {
    fbConf();
  }, 1000 * 4);
});

onBeforeUnmount(() => {
  if (trimr.value) {
    clearInterval(trimr.value);
  }
});
</script>


<style lang="scss">
.van-dialog.tax-payment-dialog {
  border-radius: 14px;
  border: solid 1px rgba(245, 103, 61, 0.29);
  background-image: linear-gradient(to bottom, #1f2430, #151515);
  font-size: 14px;
  .msg {
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
  }
  .color-pink {
    color: #ef7367;
  }
  .title {
    height: 74px;
    border-bottom: solid 1px #484b4c;
  }
  .desc {
    img {
      display: block;
      width: 28px;
      height: 28px;
    }
  }
  .van-count-down {
    color: #fff;
  }
  .pay-res-btn {
    border-radius: 12px;
    box-shadow: 0 3px 6px 0 #5a3e01;
    background-color: #f5673e;
    border: none;
  }
}
</style>
