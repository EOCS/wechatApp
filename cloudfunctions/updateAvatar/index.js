const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { avatar, username } = event
  const { OPENID } = cloud.getWXContext()

  const data = {}
  if (avatar) {
    data.avatar = avatar
  }
  if(username) {
    data.username = username
  }

  await db.collection('userInfo').where({
    openid: OPENID
  }).update({ data })

  return {
    data
  }
}