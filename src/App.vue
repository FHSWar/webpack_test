<template>
    <div>
        <div>好家伙</div>

        <div class="wrapper">
            <span>来个svg</span>
            <div><img src="./images/cat.svg" width="200" alt="svg"></div>
            <span>来两个jpg</span>
            <div class="big-pic">
                <img src="./images/tree.jpg" width="200" alt="jpg">
            </div>
            <div class="small-pic"></div>
            <span>来个png</span>
            <img src="./images/png.png" width="200" alt="png">
        </div>
    </div>
</template>

<style lang="scss">
// @use "./styles/index.scss";


.wrapper {
    display: flex;
    >div{
      display: inline-block;
    }
}
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
</style>
