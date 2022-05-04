// pages/dateSelect/dateSelect.js
const dateFormat = require('../../utils/date/dateFormat')
const dateTrans = require('../../utils/date/dateTrans')

Page({
  date: "",
  today: {},
  menu: {},
  lastTime: 0,
  noticeMap: getApp().globalData.noticeMap,

  /**
   * 页面的初始数据
   */
  data: {
    day: 0,
    month: 0,
    year: 0,
    weekDayNum: 0,
    dateArr: [],
    weekDays: ['日','一','二','三','四','五','六'],
    inputVal: '',
    isMenuVisible: false,
    menuAnimation: {},
    messageText: "",
    userNoteToShow: ""
  },
  
  onLoad: function (options) {
    //加载菜单
    this.menu = this.selectComponent("#menu")

    //获取今天的日期
    this.today = {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
    
    //获取用户记事
    this.userNoteMap = new Map(wx.getStorageSync('userNoteArray') || [])

    //初始化选定日期，如果之前没有选定日期，就将选定的日期设定为今天
    var selectDate = options.date || dateFormat.getDateStr(this.today.year, this.today.month-1, this.today.day)
    var day = new Date(selectDate).getDate()
    var month = new Date(selectDate).getMonth()
    var year = new Date(selectDate).getFullYear()
    this._refreshDateBox(year, month, day)
  },
 
  //打开菜单
  showMenu: function(){
    this.menu.setChosenDate(this.data.year, this.data.month, this.data.day)
    this.menu.callMenu()
  },

  //打开输入框
  callModal: function (e) {
    var that = this
    var dateStr = dateFormat.getDateStr(that.data.year, that.data.month, that.data.day)
    var userNoteMap = that.userNoteMap
    console.log(userNoteMap)
    var userNoteArray = []              //用户笔记
    wx.showModal({
      title: `更新${dateStr}的记事为`,
      cancelColor: 'cancelColor',
      editable: true,
      success(res){
        //输入笔记修改值
        if(res.confirm){
          //如果输入不为空
          if(res.content){
            userNoteMap.set(dateStr, res.content)
            userNoteMap.forEach(function(key, val){
              userNoteArray.push([val, key])
            })
            wx.setStorageSync('userNoteArray', userNoteArray)
            that.setData({
              userNoteToShow: res.content
            })
            }
            //如果输入为空
            else{
            wx.showToast({
              title: '输入不能为空！',
              icon: 'error',    
            })
          }
        }
      }
    })
  },

  //刷新页面内的数据
  _refreshDateBox: function (year, month, day) {
   //获取格式化后的日期
    var dateStr = dateFormat.getDateStr(year, month, day)
    //读取小程序预设的记事
    var noticeMap = this.noticeMap
    var messageText = noticeMap.get(dateStr)

    //读取用户自定义的记事
    var userNoteMap = this.userNoteMap
    var userNoteToShow = userNoteMap.has(dateStr)? userNoteMap.get(dateStr) : ""

    //更新日期
    var firstWeekDay = new Date(year, month, 1).getDay()        //获取本月一号是星期几
    var lastWeekDay = new Date(year, month + 1, 0).getDay()     //获取本月最后一天是星期几
    var thisMonthLen = new Date(year, month + 1, 0).getDate()   //获取本月日期数
    var lastMonthLen = new Date(year, month , 0).getDate()      //获取上月日期数
    var weekDayNum = new Date(year, month , day).getDay()       //获取今天是星期几
    var lastMonthArr = []
    var thisMonthArr = []
    var nextMonthArr = []
    var dateArr = []

    this.setData({
      day: day,
      month: month,
      year: year,
      weekDayNum: weekDayNum,
      messageText: messageText? messageText: "",
      userNoteToShow: userNoteToShow
    })

    //初始化日期选择面板数据
    for(var i = 1; i <= thisMonthLen; i++){
      var date = {
        day: i,
        month: month + 1,
        year: year,
        dateWeight: this._getDateWeight(year, month + 1, i),
      }
      thisMonthArr.push(date)
    }
    for(var i = 1; i <= 6 - lastWeekDay; i++){
      var date = {
        day: i,
        month: (month == 11)? 1 : month + 2,  
        year: (month == 11)? year + 1 : year,
        dateWeight: this._getDateWeight((month == 11)? year + 1 : year, (month == 11)? 1 : month + 2, i),
      }
      nextMonthArr.push(date)
    }
    for(var k = 0; k < firstWeekDay ; k++){
      var date = {
        day: lastMonthLen - k,
        month: (month == 0)? 12 : month ,  
        year: (month == 0)? year - 1 : year,
        dateWeight: this._getDateWeight((month == 0)? year - 1 : year, (month == 0)? 12 : month , lastMonthLen - k,),
      }
      lastMonthArr.unshift(date)
    }
    dateArr = dateArr.concat(lastMonthArr, thisMonthArr,nextMonthArr);

    this.setData({
      dateArr : dateArr,
    })
  },

  //返回选定页面
  toSelectPage: function(e) {
    //取两次点击时间差
    var curTime = e.timeStamp
    var lastTime = this.lastTime
    //获取点击日期的信息
    var selectDate = e.currentTarget.dataset
    //console.log(selectDate)
    var selectDay = selectDate.date.day
    var selectMonth = selectDate.date.month
    var selectYear = selectDate.date.year
    var selectDateStr = dateFormat.getDateStr(selectYear, selectMonth - 1, selectDay)
    this._refreshDateBox(selectYear, selectMonth - 1, selectDay)
    //console.log(this.date)
    if(lastTime != 0){
      //快速双击（0.3s内）跳转
      if(curTime - lastTime < 300){
        wx.redirectTo({
          url: `/pages/dayView/dayView?date=${selectDateStr}`,
        })
      }
    }
    this.lastTime = curTime
  },

  //转到上月面板
  toLastMonth: function() {
    var lastMonthObj = dateTrans.toLastMonth(this.data.year, this.data.month, this.data.day)
    this._refreshDateBox(lastMonthObj.year, lastMonthObj.month, lastMonthObj.day)
  },

  //转到下月面板
  toNextMonth: function() {
    var nextMonthObj = dateTrans.toNextMonth(this.data.year, this.data.month, this.data.day)
    this._refreshDateBox(nextMonthObj.year, nextMonthObj.month, nextMonthObj.day)
  },

  /*获取日期权值
  权值2是现实的今天，并且被选定
  1是选定的日期（但不是现实的今天），
  0为其他日期
  */
  _getDateWeight: function(year, month, day){
    var dateWeight = 0
    if(year == this.data.year && month == this.data.month + 1 && day == this.data.day){
      if(year == this.today.year && month == this.today.month && this.today.day == day){
        dateWeight = 2
      }
      else{
        dateWeight = 1
      }
    }
    return dateWeight
  },

})