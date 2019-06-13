<template>
  <div class="cartset">
    <transition name="move">
    <!-- 点击减少购买数量,只在购物车数量大于1的时候才显示 -->
    <div class="cart-minus" v-show="food.count>0" @click.stop="decreaseCart">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    </transition>
    <!-- 点击增加购买数量 -->
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-plus icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    // 点击增加购买数量 则设置food.count为1
    addCart (event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        // 使用set方法可以改变数据属性并且能够自动刷新
        Vue.set(this.food, 'count', 1)
      }
      else {
        this.food.count++
      }
    },
    // 点击减少购买数量
    decreaseCart (event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.cartset
  font-size 0
  .cart-minus
    display inline-block
    padding 6px
    .inner
      display inline-block
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
      transition all 0.4s linear
      transform rotate(0)
    &.move-enter-active, &.move-leave-active
      transition all 0.4s linear
    &.move-enter, &.move-leave-active
      opacity 0
      transform translate3d(24px,0,0)
      .inner
        transform rotate(180deg)
  .cart-count
    display inline-block
    vertical-align top
    width 12px
    padding-top 6px
    line-height 24px
    text-align center
    font-size 10px
    color rgb(147,153,159)
  .cart-plus
    display inline-block
    padding 6px
    line-height 24px
    font-size 24px
    color rgb(0, 160, 220)
</style>
