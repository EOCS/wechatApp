const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var $ = db.command.aggregate
  return await db.collection('cases').aggregate()
    .lookup({
      from: "userInfo",
      localField: "_openid",
      foreignField: "openid",
      as: "list"
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$list', 0]), '$$ROOT'])
    })
    .project({
      list: 0
    })
    .end()
}