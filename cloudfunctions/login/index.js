// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  // 可执行其他自定义逻辑

  const { OPENID, UNIONID } = cloud.getWXContext()
  const dbc = db.collection('userInfo')
  
  const r = await dbc.where({
    openid: OPENID
  }).get()

  // 初始化 用户名 和 头像
  let avatar = '';
  let username = ''

  if (!r.data.length) {
    username = 'mid' + new Date().getTime()
    dbc.add({
      data: {
        username,
        avatar,
        openid: OPENID
      }
    })
  } else {
    avatar = r.data[0].avatar
    username = r.data[0].username
  }

  return {
    OPENID,
    UNIONID,
    avatar,
    username,
  }
}

