<template>
    <div>
        <h1>页面一</h1>
        <!-- 写个模版注释测试打包去除注释 -->
        <div class="wrapper">
            <span>来个svg</span>
            <div><img :src="require('Images/cat.svg')" width="200" alt="svg"></div>
            <span>来两个jpg</span>
            <div class="big-pic">
                <img :src="require('Images/tree.jpg')" width="200" alt="jpg">
            </div>
            <div class="small-pic"></div>
            <span>来个png</span>
            <img :src="require('Images/png.png')" width="300" alt="png">
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
        // background-image: url(/Users/fhs_war/Documents/trainHall/webpack_test/src/images/me.jpg);
        background-image: url(Images/me.jpg);
        background-size: contain;
    }
}

</style>
