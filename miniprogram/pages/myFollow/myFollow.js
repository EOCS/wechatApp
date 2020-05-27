const db = wx.cloud.database()
const app = getApp()
const MAX_LIMIT = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    this.pages = 0
    this.fetchList()
  },

  async fetchList() {
    if (this.lock) return
    this.lock = true
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    })
    const res = await db.collection('collection').where({
      _openid: app.globalData.openid,
    }).skip(this.pages * MAX_LIMIT).limit(20).get();
    const list = this.data.list.concat(res.data)
    this.setData({ list })
    this.pages++
    this.lock = res.data.length < MAX_LIMIT
    wx.hideLoading()
    this.setData({ showList: true })
  },

  onReachBottom () {
    this.fetchList()
  },
})