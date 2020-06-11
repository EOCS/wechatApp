// miniprogram/pages/home/home.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuBotton: app.globalData.menuBotton,
    menuHeight: app.globalData.menuHeight,
    list: [],
    collection: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    await db.collection('cases').get().then(res => {
      const list = res.data
      list.forEach((item, index) => {
        if (item.content) {
          item.content = item.content.replace(/<[^>]+>/g, '')
        }
        item.date = this.formateDate(item.date)
      })
      this.setData({ list }, () => {
        this.getAllCollection()
      })
    })
  },
  formateDate(date) {
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return `${this.toDouble(m)}.${this.toDouble(d)}`;
  },
  toDouble(num) {
    return +num >= 10 ? num : '0' + num
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  async getAllCollection() {
    const MAX_LIMIT = 20
    const countResult = await db.collection('collection').where({
      _openid: app.globalData.userInfo.OPENID,
    }).count()
    const total = countResult.total
    if(total == 0) return;
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    
    const tasks = []

    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('collection').where({
        _openid: app.globalData.userInfo.OPENID,
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    
    const res = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
    this.setData({ collection: res.data })
    this.initListCollection()
  },
  initListCollection() {
    const { list, collection } = this.data
    list.forEach((item, index) => {
      collection.forEach(el => {
        if(el.collectionId == item._id) {
          list[index].collected = true
        }
      })
    })
    this.setData({ list })
  },
})