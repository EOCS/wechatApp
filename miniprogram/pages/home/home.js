const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    menuHeight: app.globalData.menuHeight,
    list: [],
    collection: [],
    swiperCurrent: 0,
  },
  onLoad(options) {

  },

  onShareAppMessage () {},

  swiperChange(e) {
    if (e.detail.source === 'touch') {
      this.setData({ swiperCurrent: e.detail.current })
    }
  },
  btnSelect(e) {
    this.setData({ swiperCurrent: e.target.dataset.index })
  }
})