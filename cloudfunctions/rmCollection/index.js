// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
  try {
    return await db.collection('collection').where({
      _openid: OPENID,
      collectionId: event.collectionId,
    }).remove()
  } catch (e) {
    console.error(e)
    return e;
  }
}
