// pages/userNote/userNote.js
const utils = require('../../utils/utils')

Page({
  menu: {},

  data: {
    noteInfoArray: [],
    showWarning: false,
    startX: 0,
  },

  onLoad: function (options) {
    this.menu = this.selectComponent("#menu")
    //防止菜单跳转回去时时间出错
    if(options.date){
      var date = new Date(options.date)
      this.menu.setChosenDate(date.getFullYear(), date.getMonth(), date.getDate())
    }
    else{
      var date = new Date()
      this.menu.setChosenDate(date.getFullYear(), date.getMonth(), date.getDate())
    }
    
    //读取所有的用户记事
    var userNoteMap = new Map(wx.getStorageSync('userNoteArray'))
    var noteInfoArray = this.data.noteInfoArray || []
    userNoteMap.forEach(function(note, date) {
      noteInfoArray.push({date: date, note: note})
    })
    noteInfoArray.sort(utils.compare('date'))
    
    this.setData({
      noteInfoArray: noteInfoArray,
      showWarning: !noteInfoArray,
    })
  },

  showMenu:function(){
    this.menu.callMenu()
  },

  editNote:function(e) {
    var that = this
    var userNoteMap = new Map(wx.getStorageSync('userNoteArray'))
    var noteInfo = e.currentTarget.dataset.noteinfo
    console.log(noteInfo)
    wx.showActionSheet({
      itemList: ["修改","删除"],
      success(res){
        if(res.tapIndex == 0){
          wx.showModal({
            title: '将日程修改为:',
            editable: true,
            cancelColor: 'cancelColor',
            success(res){
              //点击确认修改条目
              if(res.confirm){
                if(res.content){
                  userNoteMap.set(noteInfo.date, res.content)
                  var userNoteArray = []        //准备缓存的数据
                  var noteInfoArray = []        //将要重新显示的数据
                  userNoteMap.forEach(function(note, date) {
                    userNoteArray.push([date, note])
                    noteInfoArray.push({date: date, note: note})
                  })
                  //console.log(userNoteArray)
                  wx.setStorageSync('userNoteArray', userNoteArray)
                  //console.log(userNoteMap)
                  noteInfoArray.sort(utils.compare('date'))
                  that.setData({
                    noteInfoArray: noteInfoArray,
                    showWarning: !noteInfoArray,
                  })
                }
                else{
                  wx.showToast({
                    title: '输入不能为空！',
                    icon: 'error'
                  })
                }
              }
            }
          })
        }
        else if(res.tapIndex == 1){
          wx.showModal({
            title: '确认删除吗？',
            cancelColor: 'cancelColor',
            success(res){
              //点击确认删除条目
              if(res.confirm){
                userNoteMap.delete(noteInfo.date)
                var userNoteArray = []        //准备缓存的数据
                var noteInfoArray = []        //将要重新显示的数据
                userNoteMap.forEach(function(note, date) {
                  userNoteArray.push([date, note])
                  noteInfoArray.push({date: date, note: note})
                })
                wx.setStorageSync('userNoteArray', userNoteArray)
                noteInfoArray.sort(utils.compare('date'))
                that.setData({
                  noteInfoArray: noteInfoArray,
                  showWarning: !noteInfoArray,
                })
              }
            }
          })
        }
      }
    })
  }
})