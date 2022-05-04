// pages/index/index.js
const app = getApp();
const dateFormat = require('../../utils/date/dateFormat')
Page({

  /**
   * 页面的初始数据
   */

  data: {
    backgroundPic: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(wx.getStorageSync('showNotice')){
      var today = new Date()
      var todayStr = dateFormat.getDateStr(today.getFullYear(), today.getMonth(), today.getDate())
      var noticeMap = app.globalData.noticeMap
      var userNoteMap = new Map(wx.getStorageSync('userNoteArray'))
      var notice = noticeMap.has(todayStr)? noticeMap.get(todayStr) : ""
      var userNote = userNoteMap.has(todayStr)? userNoteMap.get(todayStr) : ""
      var textToShow = ""
      if(notice){
        textToShow = userNote? `今日提醒:\n${notice},\n\n我的记事:\n${userNote}` : `今日提醒:\n${notice}`
      }
      else{
        textToShow = userNote? `我的记事:${userNote}` : ""
      }

      if(textToShow){
        wx.showModal({
          title: textToShow
        })
      }
      wx.setStorageSync('showNotice', false)
    }
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
  //转到日视图图册
  toDayView: function () {
    wx.navigateTo({
      url: '/pages/dayView/dayView',
    })
  },

  toMonthView: function(){
    wx.navigateTo({
      url: '/pages/monthView/monthView',
    })
  },
  toUserNote: function(){
    wx.navigateTo({
      url: '/pages/userNote/userNote',
    })
    },

  showHelp: function(){
    app.callHelp()
  }
})