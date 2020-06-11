const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    username: '',
    avatar: '',
    showEdit: false,
    showEditAvatar: false,
    value: '',
    showInputModal: false
  },

  onLoad () {
    const d = app.globalData.userInfo
    if (d) {
      this.setData({
        username: d.username,
        avatar: d.avatar || '/images/tabbar/icon_signal_fill.png',
        showEdit: /mid\d+/.test(d.username),
        showEditAvatar: !d.avatar
      })
    }
  },

  uploadImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.cloud.uploadFile({
          cloudPath: `avatar/${new Date().getTime()}.png`,// 文件名
          filePath: res.tempFilePaths[0], // 文件路径
        }).then(r => {
          const avatar = r.fileID
          app.globalData.userInfo.avatar = avatar
          this.setData({ avatar, showEditAvatar: false })
          
          wx.cloud.callFunction({
            name: 'updateAvatar',
            data: { avatar }
          }).then(res => {
            console.log(res)
          }).catch(console.error)
        })
      }
    })
  },
  showModal() {
    this.setData({showInputModal: true})
  },
  cancel() {
    this.setData({ showInputModal: false })
  },
  
  inputName(e) {
    const { value } = e.detail
    this.setData({ value })
  },

  uploadName() {
    const username = this.data.value
    if (!username) return;
    this.setData({ username, showInputModal: false })
    app.globalData.userInfo.username = username
    wx.cloud.callFunction({
      name: 'updateAvatar',
      data: { username }
    }).catch(console.error)
  },
})