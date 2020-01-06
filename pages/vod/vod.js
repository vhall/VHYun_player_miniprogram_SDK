// pages/player/player.js
// import Player from '../../sdk/main'
import Player from '../../minisdk/vhall-mpsdk-player-1.0.0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAuto: false,
    showModel: false,
    showPlay: true,
    isFullscreen: false,
    nativeControl: false,
    videoUrl: '',
    // 清晰度映射表
    qualitys: [],
    rate: [0.5, 0.8, 1.0, 1.25, 1.5, 2.0],
    qualitysIndex: 0,
    rateIndex: 2,
    initialTime: 0,
    currentTime: 0,
    duration: 0
  },
  times: 0,
  stopTimeUpdate: false,
  player: null,

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 保持屏幕常亮
    wx.setKeepScreenOn({ keepScreenOn: true })
    let url
    try {
      url = await this.initSdk(options)
      this.initialParameters(url)
      this.player.play()
      this.setData({ showPlay: false })
    } catch (error) {
      console.error(error)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.player && this.player.play()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.player && this.player.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.player.destory()
    this.player = null
  },
  initSdk(options) {
    return new Promise((resolve, reject) => {
      this.player = new Player()
      this.player.createInstance(
        {
          access_token: options.token,
          account_Id: options.accountId,
          aid: options.recordId,
          app_id: options.appId,
          type: 'vod',
          playerId: 'video-player',
          THIS: this, // 选填，仅用于选中自定义组件中的video，video不在自定义组件中可以不传
          defaultQuality: '480p'
        },
        url => {
          console.log(url)
          resolve(url)
        },
        e => {
          reject(e)
        }
      )
    })
  },
  /**
   * 组装清晰度列表
   */
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
    this.setData({ videoUrl: url, qualitys: temp })
  },
  bindQualityChange(e) {
    const videoUrl = this.player.switchQualityLevel(this.data.qualitys[e.detail.value].value)
    if (this.data.qualitys[e.detail.value].value == 'a') {
      this.setData(
        { qualitysIndex: e.detail.value, videoUrl, initialTime: this.data.currentTime, isAuto: true },
        () => {
          this.player.play()
        }
      )
    } else {
      this.setData(
        { qualitysIndex: e.detail.value, videoUrl, initialTime: this.data.currentTime, isAuto: false },
        () => {
          this.player.play()
        }
      )
    }
  },
  bindRateChange(e) {
    this.playbackRate(this.data.rate[e.detail.value])
    this.setData({ rateIndex: e.detail.value })
  },
  // 播放
  play() {
    this.player.play()
    this.setData({ showPlay: false })
  },
  // 暂停
  pause() {
    this.player.pause()
    this.setData({ showPlay: true })
  },
  stop() {
    this.player.stop()
    this.setData({ showPlay: true, currentTime: 0, initialTime: 0 })
  },
  requestFullScreen(param) {
    this.player.requestFullScreen(param)
    this.setData({ isFullscreen: !this.data.isFullscreen })
  },
  exitFullScreen() {
    this.player.exitFullScreen()
    this.setData({ isFullscreen: !this.data.isFullscreen })
  },
  seek(time) {
    this.player.seek(time)
  },
  sendDanmu(text) {
    this.player.sendDanmu({ text, color: this.getRandomColor() })
  },
  playbackRate(rate) {
    this.player.playbackRate(rate)
  },
  showStatusBar() {
    this.player.showStatusBar()
  },
  hideStatusBar() {
    this.player.hideStatusBar()
  },
  onVideoPlay(e) {
    this.player.onVideoPlay(e)
  },
  onVideoPause(e) {
    this.player.onVideoPause(e)
  },
  onVideoEnd(e) {
    this.player.onVideoEnd(e)
  },
  onVideoError(e) {
    this.player.onVideoError(e)
  },
  onVideoWaiting(e) {
    this.player.onVideoWaiting(e)
  },
  onTimeUpdate({ detail: { currentTime, duration } }) {
    if (this.stopTimeUpdate) {
      return
    }
    this.data.currentTime = currentTime
    this.times++
    this.data.duration == duration ? '' : this.setData({ duration })
    if (this.times >= 3) {
      this.setData({ currentTime })
      this.times = 0
    }
  },
  showModel() {
    this.setData({ showModel: true })
  },
  confirmModal({ detail: { value } }) {
    console.log(value)
    this.sendDanmu(value)
  },
  changeColor(e) {
    this.setData({ [e.currentTarget.dataset.color]: e.detail.value })
    console.log(this.data.r, this.data.g, this.data.b)
  },
  getRandomColor() {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length == 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },
  fullscreen() {
    this.data.isFullscreen ? this.exitFullScreen() : this.requestFullScreen()
  },
  controlButton() {
    this.data.showPlay ? this.play() : this.pause()
  },
  sliderChange(e) {
    this.seek(e.detail.value)
    this.data.currentTime = e.detail.value
    this.setData({ currentTime: e.detail.value }, () => {
      this.stopTimeUpdate = false
    })
  },
  sliderChanging() {
    this.stopTimeUpdate = true
  }
})
