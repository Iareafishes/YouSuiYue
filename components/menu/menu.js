// components/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isMenuVisible: false,
    year: 0,
    month: 0,
    day: 0,
  },
  options:{
    addGlobalClass: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //菜单开关
    callMenu(){
      var isMenuVisible = this.data.isMenuVisible
      var that = this
      //打开菜单
      if(!isMenuVisible){
        var menuAnimation = wx.createAnimation({
          duration: 0
        })
        menuAnimation.translateX('-100%').step()
        that.setData({
          menuAnimation: menuAnimation.export(),
          isMenuVisible: true
        })
        setTimeout(function(){
          var menuAnimation = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease-in-out'
          })
          menuAnimation.translateX('0').step()
          that.setData({
            menuAnimation: menuAnimation.export(),
          })
        },400)
      }
  
      //关闭菜单 
      else {
        var menuAnimation = wx.createAnimation({
          duration: 400,
          timingFunction: 'ease-in-out'
        })
        menuAnimation.translateX('-100%').step()
        that.setData({
          menuAnimation: menuAnimation.export(),
        })
        setTimeout(function(){
          that.setData({
            isMenuVisible : false,
            menuAnimation : {}
          })
        },400)
      }
  
    },

    //设定将要跳转的日期
    setChosenDate(year, month, day){
      this.setData({
        year: year,
        month: month,
        day: day
      })
    },

    //打开帮助
    showHelp(){
      getApp().callHelp()
    }
  }
})
