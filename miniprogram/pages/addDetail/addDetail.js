const app = getApp();
const db = wx.cloud.database()
import { formatDesc, formatDate, getImgSrc } from '../../utils/format.js'
Page({
  data: {
    editPopup: false,
    showPreview: false,
    formats: {},
    html: '',
    navBarHeight: app.globalData.navBarHeight,
    statusBarHeight: app.globalData.statusBarHeight,
  },
  onLoad(options) {
    this.id = options.id
    this.date = options.date  // 编辑的时候有date参数
  },
  showEditPopup() {
    this.setData({ editPopup: !this.data.editPopup })
  },
  hideEditPopup() {
    this.setData({ editPopup: false })
  },
  // 编辑器初始化完成时触发
  onEditorReady() {
    wx.createSelectorQuery().select('#editor').context(res => {
      this.editorCtx = res.context;
    }).exec();
  },
  changeTextColor() {
    const { color } = this.data.formats
    let hex = ''
    if (!color) {
      hex = '#999999'
    } else if (color === '#999999') {
      hex = '#333333'
    } else {
      hex = '#999999'
    }
    this.editorCtx.format('color', hex);
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let { name, value } = e.target.dataset;
    if (!name) return;
    this.editorCtx.format(name, value);
  },
  onStatusChange(e) {
    this.setData({ editPopup: false })
    this.setData({ formats: e.detail })
  },
  insertDivider() {
    this.editorCtx.insertDivider()
  },
  async insertImage(e) {
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async res => {
        wx.showLoading({
          title: '正在加载图片',
        })
        const resImg = await this.uploadImage(res.tempFilePaths)
        resImg.forEach(item => {
          this.editorCtx.insertImage({
            src: item.fileID,
            width: '66%',
            extClass: 'upload-img'
          })
        })
        wx.hideLoading()
      }
    })
  },
  uploadImage(images) {
    let pArr = [];
    images.forEach((filePath, index) => {
      const temp = wx.cloud.uploadFile({
        cloudPath: `detailImg/${new Date().getTime()}${index}.png`, // 文件名
        filePath, // 文件路径
      })
      pArr.push(temp)
    })
    return Promise.all(pArr)
  },
  preview() {
    this.editorCtx.getContents({
      success: res => {
        this.setData({ html: res.html, showPreview: true });
      }
    });
  },
  reEdit() {
    this.setData({ showPreview: false });
  },
  back() {
    wx.navigateBack()
  },
  submit() {
    wx.showLoading({
      title: '正在发布',
    })
    const date = date || new Date().getTime();
    const key = `content.${date}`
    db.collection('cases').doc(this.id)
      .update({
        data: {
          [key]: this.data.html,
          desc: formatDesc(this.data.html),
          showDate: formatDate(date),
          showImg: getImgSrc(this.data.html),
        },
        success: () => {
          wx.hideLoading()
          wx.redirectTo({
            url: `/pages/detail/detail?id=${this.id}`,
          })
        }
      })
  },
})