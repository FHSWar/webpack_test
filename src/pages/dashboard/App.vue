<script setup>
</script>

<template>
  <!-- 即使图片放在了 images 里面，由于 pulic/images 里面有相同图片，打包出来就只有一份 -->
  <div>
    <h1>页面二</h1>
    <!-- 写个模版注释测试打包去除注释 -->
    <div class="wrapper">
      <span>来个svg</span>
      <div>
        <img
          src="./images/cat.svg"
          width="200"
          alt="svg"
        >
      </div>
      <span>来两个jpg</span>
      <div class="big-pic">
        <img
          src="./images/tree.jpg"
          width="200"
          alt="jpg"
        >
      </div>
      <div class="small-pic" />
      <span>来个png</span>
      <img
        src="./images/png.png"
        width="300"
        alt="png"
      >
    </div>
  </div>
</template>



<style lang="scss">
.wrapper {
    display: flex;
    .big-pic {
        width: 200px;
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
