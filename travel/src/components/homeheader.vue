<template>
  <div class="homeheader">
    <div class="header-left">
      <span class="iconfont">&#xe641;</span>
    </div>
    <div class="header-input">
       <span class="iconfont">&#xe614;</span>
       <span>输入城市/景点</span>
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

<style scoped lang="stylus">
    // @import '~@/assets/styles/varibles.styl'
    @import '~style/varibles.styl'
    // 正常浏览器：1rem=16px 12px=0.75rem 10px=0.625rem
    .homeheader{height:2.1875rem;display:flex;background:$bgColor;padding: 0.315rem 0rem;}
    .header-left{width:1.875rem;display:flex;align-items: center;color: #fff;font-size: 0.9375rem;}
    .header-input{flex:1;background:#fff;border-radius:4px;padding:0.315rem 0.315rem;font-size: 0.875rem;display: flex;align-items: center;color: #999;}
    .header-right{width:3.75rem;color: #fff;font-size: 14px;display: flex;align-items: center;justify-content: center;}
</style>
