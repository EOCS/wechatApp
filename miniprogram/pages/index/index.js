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
        item.content = item.content.replace(/<[^>]+>/g, '')
        item.date = this.formateDate(item.date)
      })
      this.setData({ list }, () => {
        this.getAllCollection()
      })
    })
    console.log(this.data.list)
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
  toDetail() {
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  async encourage(e) {
    if (this.encourageLock) return
    this.encourageLock = true
    wx.showToast({
      title: '为你加油！',
    })
    const { id, index } = e.target.dataset
    this.setData({
      [`list[${index}].encourage`]: ++this.data.list[index].encourage
    })

    await db.collection('cases').doc(id).update({
      data: {
        encourage: _.inc(1)
      }
    })

    this.encourageLock = false
  },
  async follow(e) {
    const index = e.target.dataset.index
    const list = this.data.list
    if (list[index].collected) {
      delete list[index].collected
      // 云函数
      wx.cloud.callFunction({
        name: 'rmCollection',
        data: {
          collectionId: list[index]._id,
        }
      })
    } else {
      list[index].collected = true
      db.collection('collection').add({
        data: {
          title: list[index].title,
          collectionId: list[index]._id
        }
      })
    }
    this.setData({ list })
  },
  async getAllCollection() {
    const MAX_LIMIT = 20
    const countResult = await db.collection('collection').where({
      _openid: app.globalData.openid,
    }).count()
    const total = countResult.total
    if(total == 0) return;
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    
    const tasks = []

    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('collection').where({
        _openid: app.globalData.openid,
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
  }
})