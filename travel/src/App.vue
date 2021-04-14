<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- 当前路由所对应的内容 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
* {margin: 0;padding: 0;box-sizing: border-box;text-decoration: none;list-style: none;
}
body,html{width: 100%;height: 100%;}
#app{width: 100%;height: 100%;}
</style>
