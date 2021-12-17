<script setup lang="ts">
import tsxTest from './views/tsxTest'
import { ref } from 'vue'
const year = ref(2020)
year.value = 2021
</script>

<template>
  <div>
    <h1>页面一</h1>
    {{ year }}
    <!-- 写个模版注释测试打包去除注释 -->
    <div class="wrapper">
      <span>来个svg</span>
      <div>
        <img :src="require('@images/cat.svg')" width="200" alt="svg" />
      </div>
      <span>来两个jpg</span>
      <div class="big-pic">
        <img :src="require('@images/tree.jpg')" width="200" alt="jpg" />
      </div>
      <div class="small-pic" />
      <span>来个png</span>
      <img :src="require('@images/png.png')" width="300" alt="png" />
    </div>
    <tsxTest/>
    <router-link to="/">Home</router-link>|
    <router-link to="/about">About</router-link>
    <router-view />
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
    background-image: url(@images/me.jpg);
    background-size: contain;
  }
}
</style>
