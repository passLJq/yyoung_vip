// pages/gaoyonglist/gaoyonglist.js

const app = getApp()
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    currentPage: 1,
    stops: false,
    listdata: [],
    userprecommax: 50,
    userprecommin: 0,
    current: 0,
    wh: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.idx) {
      var index = options.idx
      let userprecommax, userprecommin
      if (index == 0) {
        userprecommax = 50
        userprecommin = 0
      } else if (index == 1) {
        userprecommax = 100
        userprecommin = 50
      } else if (index == 2) {
        userprecommax = 300
        userprecommin = 100
      }
      this.setData({
        userprecommax,
        userprecommin,
        current: options.idx
      })
      console.log(options.idx)
    }
    this.getheight()
    this.bindata()
  },
  chehuan(e) {
    var that = this
    var index = e.currentTarget.dataset.idx
    var { userprecommax, userprecommin} = that.data
    if (index == 0) {
      userprecommax = 50
      userprecommin = 0
    } else if (index == 1) {
      userprecommax = 100
      userprecommin = 50
    } else if (index == 2) {
      userprecommax = 300
      userprecommin = 100
    }
    this.setData({
      userprecommax,
      userprecommin,
      currentPage: 1,
      current: index
    })
    that.bindata()
  },
  bindata() {
    var that = this
    utils.http({
      url: app.globalData.siteUrl + '/Main/Main/GetProductListJson',
      data: {
        currpage: that.data.currentPage,
        pagesize: 8,
        userid: wx.getStorageSync('SessionUserID'),
        isuserpre: 'true',
        clsid: '',
        fxshopid: wx.getStorageSync('fxshopid'),
        act: "search",
        skey: '',
        userprecommax: that.data.userprecommax,
        userprecommin: that.data.userprecommin
      },
      headers: 1,
      successBack: function (ret) {
        console.log(ret)
        if (ret.data.success && ret.data.status == 1 && ret.data.Data.length > 0) {
          if (that.data.currentPage == 1) {
            that.setData({
              stops: false,
              listdata: ret.data.Data
            })
          } else {
            var data = that.data.listdata
            data.concat(ret.data.Data)
            that.setData({
              listdata: data
            })
          }
        } else if (ret.data.success && ret.data.status == 0) {
          if (that.data.currentPage == 1) {
            that.setData({
              listdata: []
            })
          }
          that.setData({
            stops: true
          })
        }
        else {
          app.promsg(ret.err)
        }
      }
    })
  },
  onScroll() {
    // var that = this
    // //可滚动容器的高度
    // let innerHeight = that.$refs.boxwai.scrollHeight;
    // //屏幕尺寸高度
    // let outerHeight = that.boxHeight;
    // //可滚动容器超出当前窗口显示范围的高度
    // let scrollTop = that.$refs.boxwai.scrollTop
    // //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
    // if (innerHeight <= (outerHeight + scrollTop)) {
    //   //加载更多操作
    //   if (!that.stops) {
    //     that.currentPage = Number(that.currentPage) + 1
    //     that.bindata()
    //   }
    // }
  },
  gopid(e) {
    wx.navigateTo({
      url: '../productdetail/productdetail?pid=' + e.currentTarget.dataset.pid,
    })
  },
  getheight() {
    var wh = 0
    var ph = 0
    wx.getSystemInfo({
      success: function (res) {
        wh = res.windowHeight
        console.log(res)
      },
    })
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.ptitle').boundingClientRect(function (rect) {
      console.log(rect)
      ph = rect.height
      that.setData({
        height: wh - ph,
        wh
      })
    }).exec()
  },
  onbottom() {
    if (!this.data.stops) {
      this.setData({
        currentPage: Number(this.data.currentPage) + 1
      })
      this.bindata()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})