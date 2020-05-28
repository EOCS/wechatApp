const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async encourage(e) {
      if (this.encourageLock) return
      this.encourageLock = true
      wx.showToast({
        title: '为你加油！',
      })
      const { id, index } = e.target.dataset
      this.setData({
        [`list[${index}].encourage`]: ++this.data.list[index].encourage
      })

      await db.collection('cases').doc(id).update({
        data: {
          encourage: _.inc(1)
        }
      })

      this.encourageLock = false
    },
    async follow(e) {
      const index = e.target.dataset.index
      const list = this.data.list
      if (list[index].collected) {
        delete list[index].collected
        // 云函数
        wx.cloud.callFunction({
          name: 'rmCollection',
          data: {
            collectionId: list[index]._id,
          }
        })
      } else {
        list[index].collected = true
        db.collection('collection').add({
          data: {
            title: list[index].title,
            collectionId: list[index]._id
          }
        })
      }
      this.setData({ list })
    },
  }
})
