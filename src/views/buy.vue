<template>
    <div class="buy">
        <div class="sort">
            <div class="text">
                buy
            </div>
            <div class="buySort">
                <span>Sort By</span>
                <div class="Transaction">
                    Transaction Rate
                    <img src="../assets/images/buy/arrowBuy.webp" alt="">
                </div>
            </div>
        </div>
        <van-divider style="margin-top: 0;" />
        <div class="list">
            <div class="list-item">
                <div class="top">
                    <div class="user">
                        <div class="avatar"></div>
                        <div class="name"></div>
                    </div>
                    <div class="price">
                        <p>price</p>
                        <p class="num">7.12</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
<style scoped lang='scss'>
.buy {
    height: 100%;
    overflow: auto;
    background-color: #27272a;

    .sort {
        @include flex();
        padding: 10px 12px 10px;

        .text {
            font-family: SegoeUI;
            font-size: 13px;
            color: #fff;
        }

        .buySort {
            font-family: SegoeUI;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.48);
            @include flex();

            .Transaction {
                box-sizing: border-box;
                // width: 115px;
                height: 23px;
                padding: 4px 6px 5px 8px;
                border-radius: 8px;
                background-color: rgba(93, 86, 105, 0.48);
                @include flex();
                margin-left: 15px;

                img {
                    width: 14px;
                    height: 14px;
                    margin-left: 4px;
                }
            }
        }


    }
}
</style>