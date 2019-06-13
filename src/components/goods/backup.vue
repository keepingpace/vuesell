<template>
  <div>
    <div class="goods">
      <div class="menu-title" ref="menuTitle">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px">
              <!-- @click="selectFood(food,$event)" -->
                <div class="icon">
                  <img :src="food.icon" width="57px" height="57px">
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
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
  <!-- <food :food="selectedFood" ref="food"></food> -->
</div>
</template> 
<script type="text/ecmascript-6">
import scrollnav from 'scrollnnav'
import BScroll from 'better-scroll'
import axios from 'axios'
import shopcart from '../shopcart/shopcart.vue'
import cartset from '../cartset/cartset.vue'
//import food from '../food/food'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [], 
      listHeight: [],
      scrollY: 0,
      //selectedFood: {}
    }
  },
  computed: {
  	currentIndex() {
  		for(let i=0; i<this.listHeight.length;i++) {
  			let height1 = this.listHeight[i]
  			let height2 =this.listHeight[i+1]
  			if(this.scrollY>height1 && this.scrollY<height2) {
  				return i
  			}
  		}
  		return 0
  	},
    selectFoods() {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    axios.get('/api/goods').then(response => {
      response = response.data.data
      this.goods = response
      this.$nextTick(() => {
      	this._initScroll()
      	this._calculateHeight();
      })
    }).catch(error => { alert('请求失败') })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    shopcart,
    cartset,
    //food
  },
  events: {
    'cart.add'(target) {
      this._drop(target)
    }
  },
  methods: {
    selectMenu(index, event) {
    	//如果不存在这个属性,则为原生点击事件，不执行下面的函数
    	// if (!event._constructed) {
    	//   return 
    	// }
      let foodList =this.$refs.foodsWrapper.getElementsByClassName("food-list-hook")
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el,300)
    },
    // selectFood(food,event){
    //   this.selectedFood = food
    //   this.$refs.food.show()
    // },
  	_initScroll() {
  		// 获取左右两边的dom结构
  		this.menuScroll = new BScroll(this.$refs.menuTitle,{
  			click: true
  		})
  		this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
  			click: true,
  			probeType: 3
  		})
  		this.foodsScroll.on('scroll',(pos)=>{
  			this.scrollY = Math.abs(Math.round(pos.y))
  		})
  	},
  	_calculateHeight() {
  		// 获取 foodsWrapper的一级子元素
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      // 判断 foodList的长度
      for(let i = 0; i<foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
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
          background #fff
          font-weight bold
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
      list-style none
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
        list-style none
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
