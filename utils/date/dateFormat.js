function getDateStr(year, month, day){
  return `${year}-${month+1}-${day}`
}

module.exports = {
  getDateStr: getDateStr
}