<template>
  <div>
    <div class="goods">
      <!-- 左侧栏 -->
      <div class="menu-title" ref="menuTitle">
        <ul>
          <li v-for="(item,index) in goods " class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
            <span class="text border-1px">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <!-- 右侧栏 -->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-Right food-Right-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="des">{{food.description}}</p>
                  <div class="extra_info">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartset-wrapper">
                    <cartset :food="food"></cartset>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 把selectFood方法传递给底栏购物车组件 -->
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopCart"></shopcart>
  </div>
  <food :food="selectedFood" ref="food"></food>
</div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import axios from 'axios'
import shopcart from '../shopcart/shopcart.vue'
import cartset from '../cartset/cartset.vue'
import food from '../food/food'
// import {goods} from '../../common/js/data'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      RightHeight: [],
      // 右侧列表滑动的y轴坐标,是better-scroll的属性
      scrollY: 0,
      rightLiTops: [],
      selectedFood: {}
    }
  },
  // 右侧栏的情况稍复杂，所以先统计右侧的高度，遍历右侧所有的数组，统计每个
  // 子项的高度值范围，累加并添加到一个数组。再使用on方法监视右侧的滑动值的
  // 变化，并取高度值。当点击左侧时，得到点击的索引值，使用ScrollToElement
  // 方法将界面滑动至点击的索引值对应的数据
  computed: {
    // 右侧滑动时记录右侧的
    currentIndex () {
      for (var i = 0; i < this.RightHeight.length; i++) {
        var height1 = this.RightHeight[i]
        var height2 = this.RightHeight[i + 1]
        // 遍历到最后的时候返回i的值
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          // 9
          return i
        }
      }
      return 0
    },
    //foods会传入购物车组件中，作为购物车的数据来源
    //selectFoods返回一个数组
    selectFoods () {
      let foodsChosen = []
      if (!this.goods) { return }
      this.goods.forEach ((good) => {
        // 遍历goods数组内的所有子元素，然后再度遍历每个子元素中的foods数组,
        // 在foods
        good.foods.forEach ((food) => {
          // foods数组的任意子元素只要有count属性，便把这个子元素添加到
          // foodsChosen数组中
          if (food.count) {
            foodsChosen.push(food)
          }
        })
      })
      return foodsChosen
    }
  },
  created () {
     // axios.get('/api/goods').then((response) => {
    axios.get('https://raw.githubusercontent.com/keepingpace/data/master/mock1.json').then((response) => {
      this.goods = response.data.goods
      this.$nextTick(() => {
        this._initScroll()
        this._calculateHeight()
      })
    }).catch(error => { alert('请求失败') })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    shopcart,
    cartset,
    food
  },
  methods: {
    // 左侧点击事件
    // 点击元素计算索引值
    selectMenu (index, event) { 
      // 如果不存在这个属性,则为原生点击事件，不执行下面的函数
      // better-scroll派发的event事件和原生js的event有属性上的区别，其中有一个属性为event._constructed。
      // better-scroll派发的事件中event._constructed为true，原生点击事件中没有这个属性
      if (!event._constructed) {
        return
      }
      let foodRight = this.$refs.foodsWrapper.getElementsByClassName('food-Right-hook')
      let el = foodRight[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    // 点击进入此商品的详情页
    selectFood (food, event) {
      //被选中的商品
      this.selectedFood = food
      this.$refs.food.show()
    },
    _initScroll () {
      // 给左右两边添加滑动滚动效果    
      this.menuScroll = new BScroll(this.$refs.menuTitle, {
        click: true,
        mouseWheel: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        mouseWheel: true,
        //监听事件的触发时间，1为即时触发，3为延迟到事件完毕后触发
        probeType: 3
      })
      // 监听scroll，滚动时判断右边的值,y为scroll纵轴坐标值
      this.foodsScroll.on('scroll', (CurrentPos) => {
        this.scrollY = Math.abs(Math.round(CurrentPos.y))
      })
    },
    // 计算右侧每个内容的高度，数组foodRight是动态的，所以先遍历数据，高度累加并传递进RightHeight数组
    // 得到RightHeight数组，数组内容是每个元素的top值
    _calculateHeight () {
      // 获取 foodsWrapper的一级子元素
      let foodRight = this.$refs.foodsWrapper.getElementsByClassName('food-Right-hook')
      let height = 0
      this.RightHeight.push(height)
      // 判断 foodRight的长度
      for (let i = 0; i < foodRight.length; i++) {
        let item = foodRight[i]
        height += item.clientHeight
        this.RightHeight.push(height)
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menu-title
    flex 0 0 80px
    width 80px
    background #f3f5f7
    >ul
      margin 0
      padding 0
      .menu-item
        display table
        height 50px
        width 56px
        line-height 14px
        margin 0 auto
        text-align center
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #00a0dc
          font-weight bold
          color #fff
          .text
            border-none
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7,17,27,0.1))
          .icon
            display inline-block
            width 12px
            height 12px
            background-size 12px 12px
            background-repeat no-repeat
            vertical-align top
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
  .foods-wrapper
    flex 1
    & ul
      margin 0
      padding 0
      Right-style none
      .title
        text-indent 15px
        margin 0
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background #f3f5f7
      & ul
        margin 0
        padding 0
        Right-style none
        .food-item
          display flex
          margin 18px
          border-1px(rgba(7,17,27,0.1))
          padding-bottom 18px
          &:last-child
            border-none()
            margin-bottom 0
          .icon
            flex 0 0 57px
            margin-right 10px
          .content
            flex 1
            .name
              margin 2px 0 8px 0
              height 14px
              line-height 14px
              font-size 14px
              color rgb(7,17,27)
            .des
              margin-bottom 5px
            .des, .extra_info
              line-height 12px
              font-size 10px
              color rgb(147,153,159)
            .extra_info
              .count
                margin-right 12px
            .price
              line-height 24px
              font-weight bold
              .now
                margin-right 8px
                font-size 14px
                color rgb(240,20,20)
              .old
                text-decoration line-through
                font-size 10px
                color rgb(147,153,159)
            .cartset-wrapper
              position absolute
              right 0
              bottom 12px
</style>
