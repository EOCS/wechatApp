// miniprogram/pages/add/add.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    value: '',
    cure: 'cure',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {


  },

  searchInpt(e) {
    this.setData({ value: e.detail.value.trim() });
  },
  upload() {
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.data.imgList = this.data.imgList.concat(res.tempFilePaths)
        this.setData({ imgList: this.data.imgList })
      }
    })
  },
  async submit() {
    if (!this.data.value) {
      return wx.showToast({
        title: '请填写诊断项',
        icon: 'none'
      })
    } else if (!this.data.imgList.length) {
      return wx.showToast({
        title: '请上传诊断证明',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在上传……',
    })
    const images = await this.uploadImage()
    const resImg = images.map(item => item.fileID)
    // 上传并生成_id
    this.saveDB(resImg, this.data.value)
  },
  uploadImage() {
    let pArr = [];
    this.data.imgList.forEach((filePath, index) => {
      const temp = wx.cloud.uploadFile({
        cloudPath: `${new Date().getTime()}${index}.png`,// 文件名
        filePath, // 文件路径
      })
      pArr.push(temp)
    })
    return Promise.all(pArr)
  },
  saveDB(images, value) {
    db.collection('cases').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: value,
        images,
        cure: this.data.cure,
        date: new Date(),
        encourage: Math.floor(Math.random() * 1000 + 100),
      }
    }).then(res => {
      wx.redirectTo({
        url: `/pages/addDetail/addDetail?id=${res._id}`,
      })
    }).then(() => {
      wx.hideLoading()
    }).catch(console.error)
  },
  checkboxChange(e) {
    this.setData({
      cure: e.detail.value[0] || ''
    })
  }
})