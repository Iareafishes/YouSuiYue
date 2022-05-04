function compare(date){
  return function(a, b){
    var val1 = new Date(a[date])
    var val2 = new Date(b[date])
    return val1 - val2
  }
}

module.exports = {
  compare: compare
}