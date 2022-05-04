// miniprogram/pages/test/test.js
const app = getApp()
const dateFormat = require('../../utils/date/dateFormat')
const dateTrans = require('../../utils/date/dateTrans')

const animeEndDelay = 100     //动画结束后的缓冲时间，单位ms
const animeDuration = 600     //动画持续时间

Page({
  dateStr: "",
  menu:{},
  //在视图层渲染的数据
  data: {
    pageIndex:0,              //图册对应页号码
    startX:0,                 //滑动
    slidePrior:false,         //是否在向前滑动状态
    slideNext:false,          //是否在向后滑动状态
    animationDataPrior:{},    //向前滑动的动画
    animationDataNext:{},     //向后滑动的动画
    dateArray: [],            //日期数组
    imageSrc: [],             //图册资源
    currentImage: "",         //当前页面（今天）
    priorImage: "",           //前一页（昨天）
    nextImage: "",            //后一页（明天）
    year:0,                   //显示在卡片顶部的年份
    month:0,                  //显示在卡片顶部的月份，显示时要+1
    day:0,                    //显示在卡片顶部的日期
    isTextShown: true,
    coverImage: false,
  },
  onLoad: function (options) {
    //读取插件
    this.menu = this.selectComponent("#menu")
    //读取图片url
    //console.log("origin dateArray is:\n",app.globalData.dateArray)
    //console.log("origin imageSrc is:\n",app.globalData.imageSrc)
    this.setData({
      dateArray: app.globalData.dateArray,
      imageSrc: app.globalData.imageSrc
    })
    //如果从月视图跳转到日视图，设定当前页面日期为跳转时传递过来的日期id值
    if(options.date){
      //console.log(options.date)
      this.dateStr = options.date
    }
    //从主页进入，设定今天为当前页面日期
    else{
      var today = new Date()
      this.dateStr = dateFormat.getDateStr(today.getFullYear(), today.getMonth(), today.getDate())
      //console.log(this.dateStr)
    }
    this.setData({
      year: new Date(this.dateStr).getFullYear(),
      month: new Date(this.dateStr).getMonth(),
      day: new Date(this.dateStr).getDate(),
    })
  },

  onReady: function () {
    //console.log("imageSrc is:\n",this.data.imageSrc)
    var imageSrc = this.data.imageSrc
    var pageIndex = this._findPage(this.dateStr)
    //console.log("pageIndex is:\n",pageIndex)
    //加载页面
    var currentImage = imageSrc[pageIndex]
    var priorImage = pageIndex ? imageSrc[pageIndex - 1] : ""
    var nextImage = pageIndex != imageSrc.length - 1 ? imageSrc[pageIndex + 1] : ""
    this.setData({
      currentImage: currentImage,
      priorImage: priorImage,
      nextImage: nextImage,
      pageIndex: pageIndex,
    })
  },

  //点击开始事件
  touchstart:function(e) {
    this.setData({
        startX: e.changedTouches[0].clientX,
    })
  },

  //点击结束事件
  touchend:function(e) {
    var startX = this.data.startX;
    var endX = e.changedTouches[0].clientX;
    if (this.data.slider){
      return;
    }
    //下一页
    if (endX - startX > 50){
      this._toLastPage(this.data.pageIndex);
    }
    // 上一页
    if (startX - endX > 50){
      this._toNextPage(this.data.pageIndex);
    }
    //console.log('now page is:',this.data.pageIndex);
  },

  //展开菜单
  showMenu:function(){
    this.menu.setChosenDate(this.data.year, this.data.month, this.data.day)
    this.menu.callMenu()
  },

  //查看今日事件和用户记事
  showNotice:function(){
    var dateStr = dateFormat.getDateStr(this.data.year, this.data.month, this.data.day)
    var noticeMap = app.globalData.noticeMap;
    var userNoteMap = new Map(wx.getStorageSync('userNoteArray'))
    var notice = noticeMap.has(dateStr)? noticeMap.get(dateStr) : ""
    var userNote = userNoteMap.has(dateStr)? userNoteMap.get(dateStr) : ""
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
    else{
      wx.showToast({
        title: '今天好像没有重要的事哦~',
        icon: 'none',
      })
    }
  },

  //跳转至下一天
  _toNextDay:function (year, month, day) {
    var nextDayObj = dateTrans.toNextDay(year, month, day)
    this.setData({
      year: nextDayObj.year,
      month: nextDayObj.month,
      day: nextDayObj.day
    })
  },

  //转至前一天
  _toLastDay:function (year, month, day) {
    var lastDayObj = dateTrans.toLastDay(year, month, day)
    this.setData({
      year: lastDayObj.year,
      month: lastDayObj.month,
      day: lastDayObj.day
    })
  },

  //翻到下一页动画
  _toNextPage:function(pageIndex){
    var that = this;
    if(this.data.slideNext){
      wx.showToast({
        title: '翻页太快啦！',
        icon: 'none'
      })
      return;
    }
    if(pageIndex == that.data.imageSrc.length - 1){
        wx.showToast({
          title: '已经到达末尾页啦！',
          icon: 'none'
        })
        return;
      }
      else{
        //动画开始
        var animationDataNext_1 = wx.createAnimation({
          duration: animeDuration,
        })
        animationDataNext_1.translateX('-150%').translateY('-150%').rotate(60).step();
        that.setData({
          slideNext: true,
          animationDataNext: animationDataNext_1.export(),
        })

        //翻页动画完成后
        setTimeout(function(){
          //复位
          var animationDataNext_2 = wx.createAnimation({
            duration: 0,
            timingFunction: 'ease-in-out'
          })
          animationDataNext_2.translateX('-50%').translateY('-50%').rotate(0).step()
          that.setData({
            currentImage: that.data.imageSrc[pageIndex + 1],
            coverImage: true,
            animationDataNext: animationDataNext_2.export(),
          })

          //更新剩余页面
          setTimeout(function(){
            that.setData({
              pageIndex: pageIndex + 1,
              priorImage: that.data.imageSrc[pageIndex],
              nextImage: pageIndex == that.data.imageSrc.length - 2? "": that.data.imageSrc[pageIndex + 2],
              coverImage: false,
            })
            //缓冲翻页
            setTimeout(function(){
              that.setData({
                slideNext: false
              })
            },animeEndDelay)

          },50)

        },animeDuration)
        this._toNextDay(this.data.year, this.data.month, this.data.day)
      }
  },

  //翻到上一页动画
  _toLastPage:function(pageIndex){
    var that = this;
    if(that.data.slidePrior){
      wx.showToast({
        title: '翻页太快啦！',
        icon: 'none'
      })
      return;
    }
    if(pageIndex == 0){
        wx.showToast({
          title: '已经到达第一页啦！',
          icon: 'none'
        })
        return;
      }
      else{
        that.setData({
          slidePrior: true,
        })
        //创建动画1，将前一页移至起始位置
        var animationDataPrior_1 = wx.createAnimation({
          duration: 0,
        })
        animationDataPrior_1.translateX('-150%').translateY('-150%').rotate(animeEndDelay).step();
        that.setData({
          animationDataPrior: animationDataPrior_1.export(),
          nextImage: that.data.imageSrc[pageIndex],   //设置好下一页（保持隐藏，不影响动画操作）
        })

        setTimeout(function(){
          //开始移动前一页
          var animationDataPrior_2 = wx.createAnimation({
            duration: animeDuration,
          })
          animationDataPrior_2.translateX('-50%').translateY('-50%').rotate(0).step();
            that.setData({
            animationDataPrior : animationDataPrior_2.export(),
          })
        },50)

        //更新页面
        setTimeout(function(){
          that.setData({
            currentImage: that.data.imageSrc[pageIndex - 1],
          })
          setTimeout(function(){
            that.setData({
              priorImage: pageIndex == 1? "" : that.data.imageSrc[pageIndex - 2],
              pageIndex: pageIndex - 1,
            })
            //缓冲翻页
            setTimeout(function(){
              that.setData({
                slidePrior: false
              },animeEndDelay)
            })

          },10)

        },animeDuration)
        this._toLastDay(this.data.year, this.data.month, this.data.day)
      }
  },

  //查找相应页
  _findPage:function(dateStr){
    var dateArray = this.data.dateArray
    var j = dateArray.indexOf(dateStr)
    //判断是否找到了有图片的对应页面，如果没有就转回月视图
    if(j == -1) {
      wx.showToast({
        title: '这张图片还没有哦，2s后回到月历页面',
        icon: 'none'
      })
      setTimeout(function(){
        wx.reLaunch({
          url: '/pages/monthView/monthView',
        })
      },2000)
    }
    else{
      return j
    }
  },

})