const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    navBarHeight: app.globalData.navBarHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    menuHeight: app.globalData.menuHeight,
    list: []
  },

  onLoad: function(options) {

  },


  onReachBottom: function() {

  },

  confirmSearch() {
    this.confirmSearchBtn()
  },
  searchInpt(e) {
    this.value = e.detail.value.trim();
  },
  async confirmSearchBtn() {
    if(!this.value) return
    const params = {
      regexp: '.*' + this.value,
      options: 'i',
    }

    const res = await db.collection('cases').where(_.or([{
        title: db.RegExp(params)
      },
      {
        content: db.RegExp(params)
      }
    ])).get()
    

    if(!res.data.length) {
      wx.showToast({
        title: '没有你要找的内容',
        icon: 'none'
      })
    } else {
      this.setData({ list: res.data })
    }
  },
  back() {
    wx.navigateBack()
  },
})