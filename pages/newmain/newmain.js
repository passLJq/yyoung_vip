// pages/newmain/newmain.js
const utils = require('../../utils/util.js')
const CheckLoginStatus = require("../../utils/CheckLoginStatus.js")
const app = getApp()
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clasdata:'',//头部分类
    urllist: [],
    cliwidth: 0,
    louwidth: '',
    data: '',
    classallprodata: '',
    noticeshow: true,
		rushbuyImg: '',
    // timeCount: {
    //   timetext: '',
    //   day: 0,
    //   hour: 0,
    //   minute: 0,
    //   second: 0
    // },
    noticeheight: 150,
    gotopshow: false,
    tep_allvipnum: '',//模板基数
    tep_zuannum: '',//模板基数
    allvipnum: '',
    zuannum: '',
    noticedata: [],
    top: 0,
    boxheight:'',
    activeline:'0%',
    classid:'00',
    currpage:1,
    headactive:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log(options)
		//邀请注册红包放进一个全局,注册时用
		if(options.scene){
			let aall = []
			var scene = decodeURIComponent(options.scene)
			aall = scene.split(",")
			console.log(aall)
			if (aall[0] != wx.getStorageSync('SessionUserID') && aall[0] != '111111111111111111'){
				wx.setStorageSync('zhuce', aall[0] )
			}
		}
		if (options.type=='qiandao'){
			if (options.ruid != wx.getStorageSync('SessionUserID') && options.ruid != '111111111111111111') {
				wx.setStorageSync('zhuce', options.ruid)
			}			
		}
    this.bindata()
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
  bindata(){
    var that = this
    //头部分类条
    utils.http({
      url: app.globalData.siteUrl + '/Main/Main/GetAllClassJson',
      successBack: function (ret) {
        ret=ret.data
        if (ret.status == 1 && ret.success && ret.Data != null) {
          var data = []
          data.push({
            name: '首页',
            classid: '00'
          })
          ret.Data.forEach((item, index) => {
            data.push({
              name:item.cla.name,
              classid:item.cla.classid
            })
          });
          that.setData({
            clasdata :data
          })

        } else {
          app.promsg(ret.err);
        }
      }
    })
    //首页轮播
    utils.http({
      url: app.globalData.siteUrl + '/Main/Main/GetAdsJson',
      successBack: function (ret) {
        ret = ret.data
        if (ret.status == 1 && ret.success&&ret.Data!=null) {
          var data = JSON.parse(ret.Data)
          console.log(JSON.parse(ret.Data))
          data.AdsList.forEach(function(item,index){
            data.AdsList[index].LinkContent = JSON.parse(item.LinkContent)
          })
          that.setData({
            urllist: data
          })
        } else {
          app.promsg(ret.err)
        }
      }
    })
    //首页模板数据
    utils.http({
      url: app.globalData.siteUrl + '/Main/Main/GetAppTempShopIndexJson',
      data: {
        userid: wx.getStorageSync("SessionUserID"),
        fxshopid: wx.getStorageSync("fxshopid"),
        code:"youyanindex"
      },
      successBack: function (ret) {
        ret=ret.data
        if (ret.status == 1 && ret.success) {
          // that.data = ret.Data.template
          // that.classallprodata = JSON.parse(ret.Data.template.classallprodata)
          // that.tep_allvipnum = ret.Data.template.allvipnum
          // that.tep_zuannum = ret.Data.template.zuannum
          that.setData({
          data : ret.Data.template,
          classallprodata : JSON.parse(ret.Data.template.classallprodata),
          tep_allvipnum :ret.Data.template.allvipnum,
          tep_zuannum : ret.Data.template.zuannum
          })
          that.noticelist()
          wx.stopPullDownRefresh()
        } else {
          app.promsg(ret.err)
        }
      }
    })
    //限时抢购倒计时
    utils.http({
      url: app.globalData.siteUrl + '/Marketing/Rushbuy/GetOneRushBuy',
      data: {
        comid: ''
      },
      successBack: ret => {
        ret=ret.data
        // if (ret.success && ret.status == 1) {
        //   that.data.rushMsg = ret.Data[0]
        //   that.setData({
        //     rushMsg : ret.Data[0]
        //   })
        //   that.countTime(that.data.rushMsg)
        // }
				if (ret) {
					that.setData({
						rushbuyImg: ret.img
					})
				}
      }
    })
  },
  noticelist() {
    var that = this
    utils.http({
      url: app.globalData.siteUrl + '/Main/Main/GetNewFxShopAndVIP',
      successBack: ret => {
        ret=ret.data
        if (ret.status == 1 && ret.success) {
          // if(!that.onenotice){
          // if (ret.Data.length > 0) {
          //   that.noticedata = ret.Data.sort(that.sortBy('_Time', false))
          //   Vue.nextTick(function () {
          //     that.showMarquee()
          //   })
          // }
          that.setData({
            allvipnum :Number(that.data.tep_allvipnum) + Number(ret.allvipnum),
            zuannum: Number(that.data.tep_zuannum) + Number(Number(ret.zuannum).toFixed(0))           
          })
          // window.clearInterval(sheng)
          // var n = 0
          // let sheng = window.setInterval(() => {
          //   if (n == 50) {
          //     window.clearInterval(sheng)
          //     return
          //   }
          //   n++
          //   that.allvipnum = Number(that.allvipnum) + 1
          //   that.zuannum = Number(that.zuannum) + 1
          // }, 100)
        } else {
          app.promsg(ret.err)
        }
      }
    })   
  },
  // countTime(data) {
  //   let begintimeticks = new Date(data.begindate.replace(/-/g, '/')).getTime()
  //   let nowtimetick = Date.now()
  //   let endtimeticks = new Date(data.enddate.replace(/-/g, '/')).getTime()
  //   console.log(begintimeticks)
  //   console.log(nowtimetick)
  //   if (begintimeticks > nowtimetick) {
  //     var now = (Number(begintimeticks) - Number(nowtimetick)) / 1000
  //     this.count(now, 1)
  //   } else {
  //     var now = (Number(endtimeticks) - Number(nowtimetick)) / 1000
  //     this.count(now, 2)
  //   }
  // },
  // count(times, index) {
  //   var that = this
  //   var idx = index
  //   var timetick = times
  //   clearInterval(timer)
  //    timer = setInterval(function () {
  //     var timetext = '',
  //       day = 0,
  //       hour = 0,
  //       minute = 0,
  //       second = 0;//时间默认值
  //     if (timetick > 0) {
  //       day = Math.floor(timetick / (60 * 60 * 24))
  //       hour = Math.floor(timetick / (60 * 60)) - (day * 24)
  //       minute = Math.floor(timetick / 60) - (day * 24 * 60) - (hour * 60)
  //       second = Math.floor(timetick) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
  //     }
  //     if (day <= 9) day = '0' + day;
  //     if (hour <= 9) hour = '0' + hour;
  //     if (minute <= 9) minute = '0' + minute;
  //     if (second <= 9) second = '0' + second;
  //     //
  //     if (idx == 1) {
  //       timetext = "距开始"
  //     }
  //     else {
  //       timetext = "进行中"
  //     }
  //     if (timetick <= 0) {
  //       if (idx == 1) {
  //         timetext = '进行中'
  //         let nowtimetick = Date.now()
  //         let endtimeticks = new Date(that.rushMsg.enddate.replace(/-/g, '/')).getTime()
  //         timetick = (Number(endtimeticks) - Number(nowtimetick)) / 1000
  //         idx = 2
  //       } else {
  //         clearInterval(timer)
  //         timetext = '已结束'
  //       }
  //     }
  //     if (second == 0 && day == 0 && hour == 0 && minute == 0) {
  //       if (idx == 1) {
  //         timetext = '已开抢'
  //         idx = 2
  //       } else {
  //         timetext = '已结束'
  //       }
  //     }
  //     let atime = {
  //       timetext,
  //       day,
  //       hour,
  //       minute,
  //       second
  //     }
  //     that.setData({
  //       timeCount: atime
  //     })
  //     timetick--
  //   }, 1000);
  // },
  boxheight:function(e){
    var that=this
    const query = wx.createSelectorQuery()
    query.select('#id0').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        boxheight: res[0].height
      })
    })
  },
  newheight:function(e){
    var that = this
    const query = wx.createSelectorQuery()
    query.select('#new0').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        newheight: res[0].height
      })
    })
  },
  comheight:function(e){
    var that = this
    const query = wx.createSelectorQuery()
    query.select('#com0').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
			console.log(res)
      that.setData({
        comheight: res[0].height
      })
    })
  },
  //轮播跳转
  golink: function (e) {
    var types = e.currentTarget.dataset.link
    utils.and.clickAds(types.type, types.title, types.ref)
  },
  gostr: function (e) {
    var types = e.currentTarget.dataset.type
    var title = e.currentTarget.dataset.title
    var ref = e.currentTarget.dataset.ref
    utils.and.clickAds(types, title, ref)
  },
  gotimebuy:function(e){
    wx.navigateTo({
      url: '/pages/rushbuy_list/rushbuy_list'
    })    
  },
  gopros:function(e){
    var pro = e.currentTarget.dataset.pro
    wx.navigateTo({
      url: '/pages/productdetail/productdetail?pid='+pro
    })   
  },
  urlgowhere:function(e){
    var types = JSON.parse(e.currentTarget.dataset.link)
    utils.and.clickAds(types.type, types.title, types.ref)
  },
  qiemain:function(e){
    var index = e.currentTarget.dataset.index
    var width=(index*20)+'%'
    this.setData({
      activeline: width,
      classid: this.data.clasdata[index].classid,
      currpage: 1,
      headactive:index
    })
  },
  gogaoyong(e){
    wx.navigateTo({
      url: '../gaoyonglist/gaoyonglist?idx=' + e.currentTarget.dataset.idx,
    })
  },
	// 返回第一选项页
	goFristTab() {
		this.setData({
			activeline: '0%',
			classid: '00',
			currpage: 1,
			headactive: 0
		})
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
    this.setData({
      currpage: 1
    })
    if (this.data.classid=='00'){
      this.bindata()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var num = Number(this.data.currpage)+1
    this.setData({
      currpage: num
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})