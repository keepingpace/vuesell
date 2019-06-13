<!-- 这个组件没啥大用，就是一个深灰色背景的长方形给其他组件用来相互区分的 -->
<template>
  <div class="split"></div>
</template>
<script type="text/ecmscript-6">
export default {}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.split
  width 100%
  height 16px
  border-top 1px solid rgba(7,17,27,0.1)
  border-bottom 1px solid rgba(7,17,27,0.1)
  background #f3f5f7
</style>
