const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: null,
    isAuthor: false,
  },

  onLoad(options) {
    this.id = options.id
    this.init(true)
  },
  onShow () {
    
  },

  onPullDownRefresh () {
    this.init()
  },

  onShareAppMessage () {

  },

  init(loading) {
    loading && wx.showNavigationBarLoading()
    db.collection('cases').doc(this.id).get().then(res => {
      console.log(res, 1)
      wx.setNavigationBarTitle({
        title: res.data.title
      })
      this.setData({ res: res.data, isAuthor: res.data._openid === app.globalData.userInfo.OPENID })
    }).then(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  }
})