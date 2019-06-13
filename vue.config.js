const express = require('express')
const app = express()//请求server
var appData = require('./data.json')//加载本地数据文件
var seller = appData.seller//获取对应的本地数据
var goods = appData.goods
var ratings = appData.ratings
var apiRoutes = express.Router()
//app.use('/api', apiRoutes)//通过路由请求数据
module.exports = {
	devServer: {
    port: 8080, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    open: true,
    proxy:{
      '/api':{
      target:"https://raw.githubusercontent.com/keepingpace/data/master/mock1.json",
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
        }
       }
      },
     // productionSourceMap: false,
      // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
     before(app) {
     	app.get('/api/seller',function(req,res){
     		res.json({
     			errno: 0,
     			data: seller
     		})
     	}),
      app.get('/api/goods',function (req,res) {
     	  res.json({
     		errno: 0,
     		data: goods
     	  })
       }),
      app.get('/api/ratings',function (req,res) {
     	  res.json({
     		errno: 0,
     		data: ratings
      	  })
        })
      }
	},
  //baseUrl: process.env.NODE_ENV === 'production' ? '/online/' : '/',这个已经弃用了
  publicPath: ''
}