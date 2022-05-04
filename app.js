//app.js
const dateFormat = require('utils/date/dateFormat')

App({
  globalData:{
    dateArray: [],
    imageSrc: [],
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } 
    else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    //获取图片url
    const db = wx.cloud.database();
    db.collection('calendar').get().then(async res=>{
      //console.log("from database get:\n",res.data)
      var dateArray = res.data[1].dateArray
      //console.log("dateArray is:\n",dateArray)
      var imageSrc = res.data[1].imageSrc
      //console.log("imageSrc is:\n",imageSrc)
      var noticeMap = new Map(res.data[0].notice)
      this.globalData.noticeMap = noticeMap
      this.globalData.dateArray = dateArray
      this.globalData.imageSrc = imageSrc

      //读取完成后，默认进行一次本日事件提醒
      if(dateArray && imageSrc && noticeMap){
        var today = new Date()
        var todayStr = dateFormat.getDateStr(today.getFullYear(), today.getMonth(), today.getDate())
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
      }
      //加载失败
      else{
        wx.showToast({
          title: '资源读取失败！请尝试点击右上角菜单重新进入小程序',
        })
      }
    })
  },

  //打开使用帮助
  callHelp: function(){
    wx.showModal({
      title: '在月视图下，快速双击可以跳转到对应的日视图页面；\n\n在日视图下，向左向右滑动回到前一页或后一页。'
    })
  }
})