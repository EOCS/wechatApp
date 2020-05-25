const app = getApp();
const db = wx.cloud.database()
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
  },
  showEditPopup() {
    this.setData({ editPopup: !this.data.editPopup })
  },
  // 编辑器初始化完成时触发
  onEditorReady() {
    wx.createSelectorQuery().select('#editor').context(res => {
      this.editorCtx = res.context;
    }).exec();
  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let { name, value } = e.target.dataset;
    if (!name) return;
    this.editorCtx.format(name, value);
    this.setData({ editPopup: false })
  },
  onStatusChange(e) {
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
        cloudPath: '' + new Date().getTime() + index, // 文件名
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
    db.collection('cases').doc(this.id)
      .update({
        data: {
          content: this.data.html
        },
        success: () => {
          wx.hideLoading()
          wx.redirectTo({
            url: `/pages/detail/detail?id=${this.id}`,
          })
        }
      })
  }
})