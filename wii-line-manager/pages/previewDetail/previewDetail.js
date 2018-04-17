// pages/previewDetail/previewDetail.js
import wxJs from '../../util/wxjs'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spotId: '', //地点id
    spotDetail: {},
    intros: '',
    winHeight: '',
    sid: '',
    detailData: {},
    coLove: 0, //点赞数
    bklove: false //点赞
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wxJs.getSystemInfo((res) => {
      // 可使用窗口宽度、高度
      let windowHeight = res.windowHeight
      that.setData({
        // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
        winHeight: windowHeight
      })
    })
    let item = JSON.parse(options.item)
    let id = (item.id).substring(5)
    let sid = wx.getStorageSync('sid')
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url+'/baike/baikeView?sid=' + sid
      let postData = {
        'id':id,
        'app':appValue,
        'platform':platform,
        'ver':ver
      }
      that.setData({
        sid: sid,
        detailUrl: url,
        detailData: postData
      })
      that.getDetails(url, postData)
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
  
  },

  getDetails (url, postData) {
    let that = this
    wxJs.postRequest(url, postData, (res) => {
      let details = res.data.result.Baike
      let intros = details.content.replace(/(^\s*)|(\s*$)/g, "")
      let coLove = details.coLove
      that.setData({
        spotDetail: details,
        intros: intros,
        coLove: coLove
      })
    })
  },

  // 点赞
  bkLove() {
    let that = this
    let sourceId = that.data.spotDetail.id
    let targetId = that.data.spotDetail.myId
    let url = app.globalData.url + '/bkLove/bkLove?sid=' + that.data.sid
    let bklove = that.data.bklove
    let postData = {
      'sourceType': 'Baike',
      'sourceId': sourceId * 1,
      'realType': '',
      'realId': 0,
      'targetId': targetId * 1,
      'app': appValue,
      'platform': platform,
      'ver': ver
    }
    if (bklove) {

    } else{
      wxJs.postRequest(url, postData, (res) => {
        let data = res.data.result.Delete
        let url = that.data.detailUrl
        if (data) {
          that.setData({
            coLove: that.data.coLove * 1 + 1,
            bklove: !bklove
          })
        }
        // let details = res.data.result.Baike
        // let intros = details.content.replace(/(^\s*)|(\s*$)/g, "")
        // that.setData({
        //   spotDetail: details,
        //   intros: intros,
        //   sid: sid,
        //   lastUrl: url
        // })
      })
    }
  }

})