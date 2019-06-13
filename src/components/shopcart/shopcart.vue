<template>
  <div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}">
            </span>
          </div>
          <div class="num" v-show="totalCount>0 ">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">{{totalPrice}}元</div>
        <div class="des">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDes}}
        </div>
      </div>
    </div>
    <transition name="fold">
      <!-- 购物车详情折叠部分 -->
    <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content"  ref="listContent">
        <ul>
          <!-- 默认情况下selectFoods为空数组 -->
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price*food.count}}</span>
            </div>
            <div class="cartset-wrapper">
              <cartset :food="food"></cartset>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </transition>
  </div>
  <transition name="fade">
  <div class="mask" v-show="listShow" @click="hide"></div>
  </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cartset from '../cartset/cartset.vue'
export default {
  props: {
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 10,
            count: 1
          }
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      fold: true
    }
  },
  computed: {
    // 购买总价=单价*数量
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    //遍历购物车中的数组，累加购买数量
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    // 根据购买总价给出提示信息
    payDes () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    // 根据购买总价渲染样式
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    // 当购买总数量为0时，listShow默认不会显示
    listShow () {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    // 切换 shopcart-list的隐藏/显示效果
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    // 点击后所有购买数量归零，
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hide () {
      this.fold = true
    },
    // 提示购买总价
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付 ${this.totalPrice}元`)
    }
  },
  components: {
    cartset
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.shopcart
  position fixed
  left 0
  bottom 0
  z-index 50
  width 100%
  height 48px
  background #000
  .content
    display flex
    background #141d27
    font-size 0
    color rgba(255,255,255,0.4)
    .content-left
      flex 1
      .logo-wrapper
        display inline-block
        vertical-align top
        position relative
        top -10px
        margin 0 12px
        padding 6px
        width 56px
        height 56px
        box-sizing border-box
        border-radius 50%
        background #141d27
        .logo
          width 100%
          height 100%
          border-radius 50%
          text-align center
          background #2b343c
          &.highlight
            background rgb(0,160,220)
          .icon-shopping_cart
            line-height 44px
            font-size 24px
            color #80858a
            &.highlight
              color #fff
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          border-radius 16px
          font-size 9px
          font-weight bold
          color #fff
          background rgb(240,20,20)
          box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
      .price
        display inline-block
        vertical-align top
        margin-top 12px
        line-height 24px
        padding-right 12px
        box-sizing border-box
        border-right 1px solid rgba(255,255,255,0.1)
        font-size 16px
        font-weight bold
        &.highlight
          color #fff
      .des
        display inline-block
        vertical-align top
        margin 12px 0 0 12px
        line-height 24px
        margin-left 12px
        font-size 10px
    .content-right
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-size 12px
        font-weight bold
        background #2b333b
        &.not-enough
          background #2b333b
        &.enough
          background #00b43c
          color #fff
  .shopcart-list
    position absolute
    left 0
    top 0
    z-index -1
    width 100%
    transform translate3d(0,-100%,0)
    &.fold-enter-active, &.fold-leave-active
      transition all 0.5s
    &.fold-enter, &.fold-leave-active
      transform translate3d(0,0,0)
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background #f3f5f7
      border-bottom 1px solid rgba(7,17,27,0.1)
      .title
        float left
        color rgb(7,17,27)
      .empty
        float right
        font-size 12px
        color rgb(0,160,220)
    .list-content
      padding 0 18px
      max-height 217px
      background #fff
      overflow hidden
      background #fff
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7,17,27,0.1))
        .name
          line-height 24px
          font-size 14px
          color rgb(7,17,27)
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight bold
          color rgb(240,20,20)
        .cartset-wrapper
          position absolute
          right 0
          bottom 6px
.mask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 40
  backdrop-filter blur(10px)
  background rgba(7,17,27,0.7)
  &.fade-enter-active, &.fade-leave-active
    transition all 0.5s
  &.fade-enter, &.fade-leave-active
    opacity 1
    background rgba(7,17,27,0)
</style>
