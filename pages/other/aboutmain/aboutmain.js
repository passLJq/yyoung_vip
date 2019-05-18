// pages/other/aboutmain/aboutmain.js
const app = getApp()
const util = require("../../../utils/util.js")
const WxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options: options
    })
    this.Databind()
  },
 Databind(){
   var that=this
    util.http({
      url: app.globalData.siteUrl + '/Main/Main/GetColumnListJson',
      data: {
        columntype: 'aboutus',
        columnid: that.data.options.columnid
      },
      successBack: function (ret, err) {
        ret=ret.data
          if (ret.success) {
            var data = ret.Data;
              console.log(ret)
            wx.setNavigationBarTitle({
              title: ret.Data[0].columnname
            })
            WxParse.wxParse('description', 'html', ret.Data[0].content, that, 0);
            } else {
            app.promsg(ret.err)
            }
        }
      });
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