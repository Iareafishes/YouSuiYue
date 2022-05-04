//到上一天
function toLastDay(year, month, day){
  var lastDay = new Date(year, month, day-1)
  var lastDayObj = {
    year: lastDay.getFullYear(),
    month: lastDay.getMonth(),
    day: lastDay.getDate(),
  }
  return lastDayObj
}

//到下一天
function toNextDay(year, month, day){
  var nextDay = new Date(year, month, day+1)
  var nextDayObj = {
    year: nextDay.getFullYear(),
    month: nextDay.getMonth(),
    day: nextDay.getDate(),
  }
  return nextDayObj
}

//到下个月
function toNextMonth(year, month, day){
  var daysNextMonth = new Date(year, month+2, 0).getDate()  //下月总计天数
  var nextMonthObj = {}
  if(day <= daysNextMonth){
    var nextMonthDate = new Date(year, month+1, day)
    nextMonthObj = {
      year: nextMonthDate.getFullYear(),
      month: nextMonthDate.getMonth(),
      day: nextMonthDate.getDate()
    }  
  }
  else{
    var nextMonthDate = new Date(year, month+2, 0)
    nextMonthObj = {
      year: nextMonthDate.getFullYear(),
      month: nextMonthDate.getMonth(),
      day: nextMonthDate.getDate()
    }
  }
  return nextMonthObj
}

//到上个月
function toLastMonth(year, month, day){
  var daysLastMonth = new Date(year, month, 0).getDate()  //上月总计天数
  var LastMonthObj = {}
  if(day <= daysLastMonth){
    var LastMonthDate = new Date(year, month-1, day)
    LastMonthObj = {
      year: LastMonthDate.getFullYear(),
      month: LastMonthDate.getMonth(),
      day: LastMonthDate.getDate()
    }  
  }
  else{
    var LastMonthDate = new Date(year, month, 0)
    LastMonthObj = {
      year: LastMonthDate.getFullYear(),
      month: LastMonthDate.getMonth(),
      day: LastMonthDate.getDate()
    }
  }
  return LastMonthObj
}

module.exports = {
  toLastDay: toLastDay,
  toNextDay: toNextDay,
  toNextMonth: toNextMonth,
  toLastMonth: toLastMonth,
}