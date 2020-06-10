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
    swiperCurrent: 1,
    sexRange: ['女', '男'],
    sexIndex: -1,
    ageRange: [],
    ageIndex: 0,
    showAdd: false,
  },
  onLoad() {
    this.formatAgePiker()
  },

  onShareAppMessage () {},
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
  selectSex (e) {
    this.setData({ sexIndex: e.detail.value })
  },
  selectAge(e) {
    this.setData({ ageIndex: e.detail.value })
  },
  formatAgePiker() {
    let ageRange = []
    for (let i = 0; i < 110; i++) {
      ageRange.push('' + i)
    }
    this.setData({ ageRange })
  },
  getLocation() {
    wx.getLocation({
      success(res) {
        console.log(res, 990)
      },
      fail(err) {
        console.log(err, 'err')
      }
    })
  }
})