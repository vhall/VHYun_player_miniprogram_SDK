// pages/player/player.js
import Player from '../../minisdk/vhall-mpsdk-player-2.0.0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 播放地址，默认空。初始化vhall播放器后设置
    videoUrl: '',
    // 默认当前清晰度，初始化vhall播放器后设置
    quality: '',
    // 清晰度映射表
    qualitys: [],
    qualitysIndex: 0,
    showControl: true,
    fullscreen: true
  },
  currentStatus: null,
  player: null,
  options: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 保持屏幕常亮
    wx.setKeepScreenOn({ keepScreenOn: true })
    this.options = options
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    let url
    try {
      url = await this.initSdk(this.options)
      await this.initialParameters(url)
      this.player.play({
        success: () => {
          wx.showToast({ title: '开始播放' })
        }
      })
      this.currentStatus = 'play'
    } catch (error) {
      console.error(error)
    }
  },

  async initSdk(options) {
    let playerUrl = ''
    this.player = new Player()
    try {
      const { url } = await this.player.createInstance({
        token: options.token,
        accountId: options.accountId,
        aid: options.roomId,
        appId: options.appId,
        type: 'live',
        playerId: 'live-player',
        THIS: this
      })
      playerUrl = url
    } catch (error) {
      return Promise.reject(error)
    }
    return playerUrl
  },
  initialParameters(url) {
    const qualitys = this.player.getQualityList()
    let temp = []
    for (const iterator of qualitys) {
      let name
      switch (iterator) {
        case 'same':
          name = '原画'
          break
        case '720p':
          name = '高清'
          break
        case '480p':
          name = '标清'
          break
        case '360p':
          name = '流畅'
          break
        case 'a':
          name = '音频'
          break
        default:
          break
      }
      temp.push({ name, value: iterator })
    }
    console.log(url)
    return new Promise(resolve => {
      this.setData({ videoUrl: url, qualitys: temp, showControl: false }, () => {
        resolve()
      })
    })
  },
  bindPickerChange(e) {
    const videoUrl = this.player.switchQualityLevel(this.data.qualitys[e.detail.value].value)
    console.log('切换清晰度，新播放地址为:', videoUrl)
    this.setData({ qualitysIndex: e.detail.value, videoUrl }, () => {
      if (this.currentStatus == 'play') {
        this.player.play()
        this.setData({ showControl: false })
      }
    })
  },
  control() {
    if (this.data.showControl) {
      switch (this.currentStatus) {
        case 'pause':
          this.resume({
            success: () => {
              wx.showToast({ title: '恢复播放' })
            }
          })
          break
        case 'stop':
          this.play({
            success: () => {
              wx.showToast({ title: '开始播放' })
            }
          })
          break
        default:
          break
      }
    } else {
      this.pause({
        success: () => {
          wx.showToast({ title: '暂停播放' })
        }
      })
    }
  },
  fullscreenControl() {
    if (this.data.fullscreen) {
      this.requestFullScreen({
        direction: 90,
        success: () => {
          wx.showToast({ title: '横屏' })
        }
      })
    } else {
      this.exitFullScreen({
        direction: 90,
        success: () => {
          wx.showToast({ title: '竖屏' })
        }
      })
    }
    this.setData({ fullscreen: !this.data.fullscreen })
  },
  enterpictureinpicture() {
    wx.navigateTo({
      url: '../next/next'
    })
  },
  // 播放
  play(param) {
    this.player.play(param)
    this.setData({ showControl: false })
    this.currentStatus = 'play'
  },

  // 暂停
  pause(param) {
    this.player.pause(param)
    this.setData({ showControl: true })
    this.currentStatus = 'pause'
  },
  resume(param) {
    this.player.resume(param)
    this.setData({ showControl: false })
    this.currentStatus = 'resume'
  },
  stop(param) {
    this.player.stop(param)
    this.setData({ showControl: true })
    this.currentStatus = 'stop'
  },
  requestFullScreen(param) {
    this.player.requestFullScreen(param)
  },
  exitFullScreen(param) {
    this.player.exitFullScreen(param)
  },

  // 开关静音
  mute() {
    this.player.mute({
      success: res => {
        console.log(res)
      }
    })
  },
  snapshot() {
    this.player.snapshot({
      success: res => {
        this.savePoster(res.tempImagePath)
      }
    })
  },
  // 播放器状态变更
  onStateChange(wxevent) {
    this.player.onStateChange(wxevent)
  },

  // 网络状态变更
  onNetstatus(wxevent) {
    this.player.onNetStatus(wxevent)
  },
  //点击保存到相册
  savePoster(url) {
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success() {
        wx.showToast({ title: '已保存到相册' })
      },
      fail(res) {
        // 拒绝授权时，则进入手机设置页面，可进行授权设置
        if (res.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' || res.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success() {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({ title: '获取权限成功,再次点击图片即可保存' })
                  } else {
                    wx.showToast({ title: '获取权限失败，将无法保存到相册哦~' })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  testReconnect() {
    this.setData({ videoUrl: this.data.videoUrl + '111' }, () => {
      this.player.play()
    })
  },
  async getStreamUrl() {
    const url = await this.player.getStreamUrl()
    this.setData({ videoUrl: url }, () => {
      this.player.play()
      wx.showToast({ title: '已重新获取拉流地址并播放', icon: 'none' })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.stop()
    this.player.destory()
    this.player = null
  }
})
