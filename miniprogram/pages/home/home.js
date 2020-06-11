const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAdd: false,
    navBarHeight: app.globalData.navBarHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    menuHeight: app.globalData.menuHeight,
    list: [],
    collection: [],
    swiperCurrent: 1,
  },
  addModal() {
    this.setData({ showAdd: !this.data.showAdd })
  },
  swiperChange(e) {
    if (e.detail.source === 'touch') {
      this.setData({ swiperCurrent: e.detail.current })
    }
  },
  btnSelect(e) {
    this.setData({ swiperCurrent: e.target.dataset.index })
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  onLoad() {
    // todo: 触底加载更多
    // 连表查询
    return wx.cloud.callFunction({
      name: 'getCasesLookup',
    }).then(res => {
      this.setData({ list: res.result.list })
      console.log(res.result.list)
    }).catch(console.error)
  },
  async onTabItemTap(item) {
    if (this.doubleTap) {
      wx.vibrateShort()
      await this.onLoad()
    } else {
      this.doubleTap = 1
      setTimeout(() => {
        this.doubleTap = 0
      }, 300)
    }
  }
})