const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showAdd: { // 属性名
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false,
    sexRange: ['女', '男'],
    sexIndex: -1,
    ageRange: [],
    ageIndex: -1,
    addr: '',
    title: '',
    latitude: '',
    longitude: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({ showAdd: false })
    },
    selectSex(e) {
      this.setData({ sexIndex: e.detail.value })
    },
    selectAge(e) {
      this.setData({ ageIndex: e.detail.value })
    },
    getLocation() {
      wx.showLoading({
        title: '正在定位……',
        icon: 'none'
      })
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.chooseLocation(res)
        },
        fail(err) {
          console.log(err, 'err')
        },
        complete() {
          wx.hideLoading()
        }
      })
    },
    chooseLocation(res) {
      const { latitude, longitude } = res
      wx.chooseLocation({
        latitude,
        longitude,
        success: res => {
          this.setData({ addr: res.name, latitude: res.latitude, longitude: res.longitude })
        },
        fail(err) {
          console.log(err)
        }
      })
    },
    inputDesc(e) {
      this.setData({ title: e.detail.value })
    },
    submit() {
      const { title, sexRange, sexIndex, ageRange, ageIndex, addr, latitude, longitude, loading } = this.data
      if (!title || loading) return;
      this.setData({ loading: true })
      const date = new Date().getTime();
      db.collection('cases').add({
        data: {
          title,
          desc: '',
          sex: sexRange[sexIndex] || '',
          age: ageRange[ageIndex] || '',
          addr,
          latitude,
          longitude,
          date, // 初始时间
          showDate: date, // 展示的出来的时间，一般为最近的更新时间
          aoligei: 0,   // 加油
          comments: 0,  // 回复
        }
      }).then(res => {
        console.log(res, 'res')
        wx.navigateTo({
          url: `/pages/addDetail/addDetail?id=${res._id}`
        })
      }).then(() => {
        this.setData({ loading: false, showAdd: false })
      }).catch(() => {
        wx.showToast({
          title: '网络差，请重试',
          icon: 'none',
        })
        this.setData({ loading: false })
      })
    }
  },
  attached() {
    let ageRange = []
    for (let i = 0; i < 110; i++) {
      ageRange.push('' + i)
    }
    this.setData({ ageRange })
  }
})
