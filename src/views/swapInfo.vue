<template>
    <div class="swapInfo maxWidth lrPadding">
        <p class="title">Scan this QR code to receive usdt</p>
        <div class="qrCode">
            <!-- <img src="" alt=""> -->
        </div>
        <p class="address">
            THmFQ2wyTz9rcypdiDbPvooDjRbtDEUqpij
        </p>
        <div class="copy">
            Copy <img src="../assets/images/common/copy.webp" class="copyImg" alt="">
        </div>
        <div class="list">
            <p class="item">
                <span>Type: </span>
                <span>usdt</span>
            </p>
            <van-divider :hairline="true" :style="{ background: '#333' }" />
            <p class="item">
                <span>Recharge Amount: </span>
                <span>155.00</span>
            </p>
            <van-divider :hairline="true" :style="{ background: '#333' }" />
            <p class="item">
                <span>Order Number: </span>
                <span>USSA24020112330414081</span>
            </p>
        </div>
        <div class="Confirm">
            Confirm
        </div>
    </div>
</template>
<script setup >
</script>
<style scoped lang='scss'>
.swapInfo {
    height: 100%;
    overflow: auto;
    background-color: #0b0b0b;
    box-sizing: border-box;

    .title {
        text-align: center;
        font-size: 14px;
        color: #8a929a;
        margin: 20px 0;
    }

    .qrCode {
        width: 259px;
        height: 259px;
        border-radius: 30px;
        border: solid 1px #ff7c43;
        background-color: #333;
        margin: 0 auto;
    }

    .address {
        width: 100%;
        height: 48px;
        border-radius: 9.5px;
        border: solid 1px #ff7c43;
        margin-top: 30px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 48px;
    }

    .copy {
        width: 135px;
        height: 52px;
        border-radius: 10px;
        background-color: #333;
        @include flex(center);
        margin: 20px auto 17px;
        font-size: 18px;
        color: #fff;

        .copyImg {
            width: 18px;
            height: 18px;
            margin-left: 10px;
        }
    }

    .list {
        box-sizing: border-box;
        width: 100%;
        padding: 16px 10px;
        border-radius: 15px;
        border: solid 1px #333;

        p {
            @include flex(space-between);

            span:first-child {
                font-size: 14px;
                color: #8a929a;
            }

            span:last-child {
                font-size: 12px;
                color: #fff;
            }
        }
    }

    .Confirm {
        height: 48px;
        text-align: center;
        line-height: 48px;
        border-radius: 14px;
        background-color: #ff7c43;
        margin: 20px 0 10px 0;
        font-size: 14px;
        color: #fff;
    }
}
</style>