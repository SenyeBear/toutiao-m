<template>
  <div id="app">
    <!-- 路由的出口 一级路由挂载点-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.box {
  width: 100px;
  height: 100px;
  background-color: pink;
}
</style>
