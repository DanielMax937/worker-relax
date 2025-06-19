Page({
  data: {
    imagePath: '',
    analysisResult: null as any,
    showResult: false,
  },

  onLoad() {},

  onOpenCamera() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res) => {
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          this.setData({ 
            imagePath: res.tempFilePaths[0],
            showResult: false 
          })
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
          this.setData({ 
            imagePath: res.tempFilePaths[0],
            showResult: false 
          })
        }
      },
      fail: () => {
        wx.showToast({ title: '未能选择图片', icon: 'none' })
      }
    })
  },

  onAnalyzeFreshness() {
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先选择图片', icon: 'none' })
      return
    }

    wx.showLoading({ title: '分析中...' })

    const fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: this.data.imagePath,
      encoding: 'base64',
      success: (res) => {
        console.log(res.data)
        wx.request({
          url: 'https://vegetable.bitstripe.cn/api/analyze-vegetable',
          method: 'POST',
          data: {
            image: 'data:image/jpeg;base64,' + res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: (response) => {
            wx.hideLoading()
            console.log('Analysis result:', response.data)
            
            const result = response.data as any
            
            // Handle both food and non-food results
            this.setData({
              analysisResult: result,
              showResult: true
            })
            
            // Show appropriate success message
            if (result && result.isFood === true) {
              wx.showToast({ 
                title: `${result.itemType}分析完成`, 
                icon: 'success' 
              })
            } else {
              wx.showToast({ 
                title: '分析完成', 
                icon: 'success' 
              })
            }
          },
          fail: (error) => {
            wx.hideLoading()
            console.error('Analysis failed:', error)
            wx.showToast({ title: '分析失败', icon: 'none' })
          }
        })
      },
      fail: (error) => {
        wx.hideLoading()
        console.error('Failed to read file:', error)
        wx.showToast({ title: '读取图片失败', icon: 'none' })
      }
    })
  },

  onGetRecipe() {
    if (!this.data.analysisResult) return
    
    wx.showToast({ 
      title: '获取推荐食谱中...', 
      icon: 'loading' 
    })
    // TODO: Implement recipe recommendation
  },

  onReanalyze() {
    this.onAnalyzeFreshness()
  }
}) 