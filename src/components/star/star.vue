<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>
<script type="text/ecmascript-6">
// 定义这些常量便于后续可能的修改
const LENGTH = 5
const C_ON = 'on'
const C_HALF = 'half'
const C_OFF = 'off'
export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    // size值 后续调用的时候会直接通过行内样式赋值，从而控制大小
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      // 创建数组接收评分
      let result = []
      // 把接收到的score值转换成整数再除以2 得到的结果要么是整数，要么是整数 + 0.5
      let score = Math.floor(this.score * 2) / 2
      // 判断是否是小数
      let hasDecimal = score % 1 !== 0
      // 取整数
      let integer = Math.floor(score)
      // 根据评分来选择样式
      for (let i = 0; i < integer; i++) {
        result.push(C_ON)
      }
      if (hasDecimal) {
        result.push(C_HALF)
      }
      // 如果评分不足0.5，便不添加样式
      while (result.length < LENGTH) {
        result.push(C_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
