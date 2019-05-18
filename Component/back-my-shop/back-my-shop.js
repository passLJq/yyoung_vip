// Component/back-my-shop/back-my-shop.js
const app = getApp()
const util = require("../../utils/util.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ruid: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    uid: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    fxshopid: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    ruidok:{
      type:Boolean,
      value:'',
      observer: function (newVal, oldVal) { 
        if(newVal){
          this.uiddata()
        }
      } 
    }
  },
  pageLifetimes: {
    show() {
      var that=this
      this.uiddata()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ruid: wx.getStorageSync('ruid'),//当前进来的店铺ID
    uid: wx.getStorageSync('SessionUserID'),
    fxshopid: wx.getStorageSync('fxshopid'),
    userinfo:'',
    once:false,
    hideboxs:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backMyshop(e) {
      if (!wx.getStorageSync('SessionUserID')) {
        wx.navigateTo({
          url: '/pages/yshopapply/yshopapply',
        })
      } else if (!wx.getStorageSync('fxshopid')){
        wx.navigateTo({
          url: '/pages/yshopapply/yshopapply',
        })
      } else{
        wx.setStorageSync('ruid', "")
        wx.redirectTo({
          url: '/pages/newmain/newmain'
        })
      }
    },
    uiddata(){
      var that=this
      if (wx.getStorageSync('ruid')){
      util.http({
        url: app.globalData.siteUrl + '/Main/Member/GetUserShopJson',
        data: {
          uid: wx.getStorageSync('SessionUserID'),
          ruid: wx.getStorageSync('ruid')
        },
        header: 1,
        loading_icon: 1,
        successBack: (ret) => {
          var ret = ret.data
          if (ret.status == 1 && ret.success) {
            console.log(ret.Data)
            that.setData({
              userinfo: ret.Data,
            })
            var pages = getCurrentPages()
            console.log(pages.length)
            if (!that.data.once && that.properties.ruidok) {
              if (pages.length == 1 && pages[0].route == 'pages/productdetail/productdetail') {
                that.setData({
                  once: true,
                  hideboxs: true
                })
              }
            }
          } else {
            app.promsg(ret.err)
          }
        }
      })
    }
    },
    hidebox(){
      this.setData({
        hideboxs:false
      })
    }
  }
})
