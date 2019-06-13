<template>
  <div>
    <v-header :seller="seller"></v-header>
  <div class="tab">
    <div class="tab-item">
    <router-link to="./goods" active-class="active">商品</router-link>
    </div>
    <div class="tab-item">
    <router-link to="./ratings" active-class="active">
    评价</router-link></div>
    <div class="tab-item" active-class="active">
    <router-link to="./seller">
    商家</router-link></div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
import { urlParse } from './common/js/util'
import header from './components/header/header.vue'
import axios from 'axios'
export default {
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          console.log(queryParam)
          return queryParam.id
        })()
      }
    }
  },
  created () {
    axios.get('https://easy-mock.com/mock/5d01eda69887f83de1a91810/example/?id=' + this.seller.id).then((response) => {
        this.seller = response.data.seller
        this.seller = Object.assign({},this.seller,response.data)
    }).catch(error => { alert('请求失败') })
  },
  components: {
    'v-header': header
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/mixin.styl"
  .tab
    display flex
    height 40px
    line-height 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      text-align center
      & > a
        display block
        text-decoration none
        font-size 14px
        color rgb(77,85,93)
        &.active
          color rgb(240,20,20)
</style>
