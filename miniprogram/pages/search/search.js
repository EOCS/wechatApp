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
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

    const list = res.data
    list.forEach((item, index) => {
      item.content = item.content.replace(/<[^>]+>/g, '')
      item.date = this.formateDate(item.date)
    })

    this.setData({list: res.data})

    if(!res.data.length) {
      wx.showToast({
        title: '没有你要找的病例',
        icon: 'none'
      })
    }
  },
  back() {
    wx.navigateBack()
  },
  formateDate(date) {
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return `${this.toDouble(m)}.${this.toDouble(d)}`;
  },
  toDouble(num) {
    return +num >= 10 ? num : '0' + num
  },
})