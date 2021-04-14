<template>
  <div class="homeheader">
    <div class="header-left">
      <span class="iconfont">&#xe641;</span>
    </div>
    <div class="header-input">
       <span class="iconfont">&#xe614;</span>
        输入城市/景点
    </div>
    <div class="header-right">
      城市
       <span class="iconfont">&#xe67e;</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      
    }
  }
}
</script>

<style scoped >
    .homeheader{height:34px;display:flex;background:#00bcd4;padding: 5px 0px;}
    .header-left{width:50px;display:flex;align-items: center;justify-content: center;color: #fff;font-size: 15px;}
    .header-input{flex:1;background:#fff;border-radius:4px;}
    .header-right{width:60px;color: #fff;font-size: 15px;display: flex;align-items: center;justify-content: center;}
</style>
