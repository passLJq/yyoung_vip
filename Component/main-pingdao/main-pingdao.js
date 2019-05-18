// Component/main-pingdao/main-pingdao.js
const app = getApp()
const util = require("../../utils/util.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classid: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        console.log(newVal)
        console.log(oldVal)
        if (newVal!='00'){
          if (newVal != oldVal){
            this.setData({
              stops: false,
              currpage: 1
            })
          }
          this.binddata()
        }
      }
    },
    currpage: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        if (newVal==1){
          this.setData({
            currpage: newVal,
            stops: false,
          })
        }else{
          this.setData({
            currpage: newVal,
          })
        }
          this.binddata()
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    listdata:[],
    currpage:1,
    stops:false,
    fxshop: wx.getStorageSync('fxshopid')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    binddata() {
      console.log(this.properties.classid)
      var that = this
      if (that.data.stops) {
        return
      }
      util.http({
        url: app.globalData.siteUrl + '/Main/Main/GetProductCategoryList',
        data: {
          currpage: that.data.currpage,
          pageSize: 8,
          clsid: that.properties.classid,
          fxshopid: wx.getStorageSync('fxshopid'),
          userid: wx.getStorageSync('SessionUserID')
          // sort:sort
        },
        successBack: function (ret) {
          console.log(ret)
          ret=ret.data
          if (ret.status == 1 && ret.success && ret.Data.length > 0) {
            if (that.data.currpage == 1) {
              // that.listdata = ret.Data
              that.data.stops = false
              that.setData({
                listdata : ret.Data
              })
            } else {
              that.setData({
                listdata: that.data.listdata.concat(ret.Data)
              })
              // that.listdata = that.listdata.concat(ret.Data)
            }
          } else if (ret.status == 0 && ret.success) {
            if (that.data.currpage == 1) {
              // that.listdata = []
              that.setData({
                listdata: []
              })
            }
            that.data.stops = true
          } else {
            app.promsg(ret.err)
          }
        }
      })
    },
    gopid(e){
      var pro = e.currentTarget.dataset.pid
      console.log(pro)
      wx.navigateTo({
        url: '/pages/productdetail/productdetail?pid=' + pro
      })  
    }
  }
})
