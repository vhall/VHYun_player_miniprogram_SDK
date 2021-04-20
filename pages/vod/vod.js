// pages/player/player.js
import Player from '../../minisdk/vhall-mpsdk-player-2.0.0'
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
    this.options = options
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    let url
    try {
      url = await this.initSdk(this.options)
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
    // this.player && this.play  er.play()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // this.player && this.player.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.player.destory()
    this.player = null
  },
  async initSdk(options) {
    this.player = new Player()
    let vodUrl = ''
    try {
      const { url } = await this.player.createInstance({
        token: options.token,
        accountId: options.accountId,
        aid: options.recordId,
        appId: options.appId,
        type: 'vod',
        playerId: 'video-player',
        defaultQuality: '480p',
        THIS: this
      })
      vodUrl = url
    } catch (error) {
      console.log(error)
    }
    return vodUrl
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
    const status = this.data.showPlay
    const videoUrl = this.player.switchQualityLevel(this.data.qualitys[e.detail.value].value)
    const data = {
      qualitysIndex: e.detail.value,
      videoUrl,
      initialTime: this.data.currentTime,
      rateIndex: this.data.rateIndex,
      isAuto: this.data.qualitys[e.detail.value].value === 'a' ? true : false
    }
    console.log('切换清晰度，data入参:', data)
    this.setData(data, () => {
      this.seek(this.data.currentTime)
      if (!status) this.play()
    })
  },
  bindRateChange(e) {
    this.playbackRate(this.data.rate[e.detail.value])
    this.setData({ rateIndex: e.detail.value })
  },
  async getStreamUrl() {
    const url = await this.player.getStreamUrl()
    this.setData({ videoUrl: url, initialTime: this.data.currentTime }, () => {
      this.play()
      wx.showToast({ title: '已重新获取拉流地址并播放', icon: 'none' })
    })
  },
  // 播放
  play(param) {
    this.player.play(param)
    this.setData({ showPlay: false })
    this.playbackRate(this.data.rate[this.data.rateIndex])
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
  enterpictureinpicture() {
    wx.navigateTo({
      url: '../next/next'
    })
  },
  onEnterpictureinpicture() {
    console.log('进入小窗')
  },
  onVideoPlay(e) {
    console.log('onVideoPlay')
    this.player.onVideoPlay(e)
    this.setData({ showPlay: false })
  },
  onVideoPause(e) {
    console.log('onVideoPause')
    this.player.onVideoPause(e)
    this.setData({ showPlay: true })
  },
  onVideoEnd(e) {
    this.player.onVideoEnd(e)
    this.setData({ showPlay: true })
  },
  onVideoError(e) {
    this.player.onVideoError(e)
  },
  onVideoWaiting(e) {
    this.player.onVideoWaiting(e)
  },
  onTimeUpdate({ detail: { currentTime, duration } }) {
    if (this.stopTimeUpdate) return
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
