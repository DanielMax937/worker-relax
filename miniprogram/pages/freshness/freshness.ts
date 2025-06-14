Page({
  data: {
    imagePath: '',
  },

  onLoad() {},

  onOpenCamera() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res) => {
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          this.setData({ imagePath: res.tempFilePaths[0] })
        }
      },
      fail: () => {
        wx.showToast({ title: '未能打开相机', icon: 'none' })
      }
    })
  },

  onSelectFromAlbum() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          this.setData({ imagePath: res.tempFilePaths[0] })
        }
      },
      fail: () => {
        wx.showToast({ title: '未能选择图片', icon: 'none' })
      }
    })
  }
}) 