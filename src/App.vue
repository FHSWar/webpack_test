<template>
    <div>
        <h1>好家伙</h1>
        <!-- 写个模版注释测试打包去除注释 -->
        <div class="wrapper">
            <span>来个svg</span>
            <div><img src="./images/cat.svg" width="200" alt="svg"></div>
            <span>来两个jpg</span>
            <div class="big-pic">
                <img src="./images/tree.jpg" width="200" alt="jpg">
            </div>
            <div class="small-pic"></div>
            <span>来个png</span>
            <img src="./images/png.png" width="300" alt="png">
        </div>
    </div>
</template>

<script>
// 写个 script 单行注释测试打生产包去除注释
/* 写个 script 多行注释测试打生产包去除注释 */
export default {

}
</script>


<style lang="scss">
// @use "./styles/index.scss";


.wrapper {
    display: flex;
    .big-pic {
        width: 200px;
        // height: 200px;
        overflow: hidden;
    }
    .small-pic {
        width: 200px;
        height: 200px;
        background-image: url(./images/me.jpg);
        background-size: contain;
    }
}

</style>
