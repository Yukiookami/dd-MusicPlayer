/**
 * @param {Number} num 输入数字
 * @param {Number} n 需要补齐的位数
 * 自动补位
*/
export let PrefixInteger = (num, n) => {
  return (Array(n).join(0) + num).slice(-n)
}

/**
 * @param {Number} num 输入数字
 * @param {Number} decimal 保留位数
 * 保留小数不四舍五入
*/
export let formatDecimal = (num, decimal) => {
  num = num.toString()
  let index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

/**
 * 音乐API
 */
export let getAPI = () => {
  // return 'http://127.0.0.1:2233/music'
  return 'http://zouxinyu.top:2233/music'
  // return 'https://zouxinyu.top/music'
} 

/**
 * 用户API
 */
export let getUserAPI = () => {
  // return 'http://127.0.0.1:2233/user'
  return 'http://zouxinyu.top:2233/user'
  // return 'https://zouxinyu.top/user'
}


/**
 * 文件上传api
 */
export let getUpAPI = () => {
  return 'http://47.100.7.207:2893/zouxinyu/admin/fileUpload'
}

/**
 * 模糊搜索
 * 
 * @param {*} keyWord 搜索关键字
 * @param {Object} arr 需要搜索的数组
 * @returns {Array} 结果数组
 */
export let fuzzySearch = (keyWord, arr) => {
  return arr.filter(ele => {
    return Object.keys(ele).some(key => {
      if (key === 'title' || key === 'singer') {
        return String(ele[key]).toLowerCase().includes(keyWord)
      }
    })
  })
}