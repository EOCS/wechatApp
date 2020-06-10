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

  onLoad() {
    db.collection('cases').get().then(res => {
      console.log(res, 99)
      this.setData({ list: res.data })
    })
  }
  
})