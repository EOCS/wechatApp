// miniprogram/pages/home/home.js
const app = getApp()
const db = wx.cloud.database()
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    db.collection('cases').get().then(res => {
      console.log(res)
      const list = res.data
      list.forEach((item, index) => {
        item.content = item.content.replace(/<[^>]+>/g, '')
        item.date = this.formateDate(item.date)
      })
      this.setData({ list })
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
  toDetail() {
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  comeon() {
    wx.showToast({
      title: '加油',
    })
  },
  follow() {
    wx.showToast({
      title: '关注后续',
    })
  }
})