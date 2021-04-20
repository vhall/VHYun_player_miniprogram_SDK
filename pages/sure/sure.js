import indexData from '../../const/const'
Page({
  /**
   * 页面的初始数据
   */
  name: null,
  data: {
    appId: '',
    accountId: '',
    roomId: '',
    token: ''
  },

  gotoPlay() {
    let url
    if (this.name == 'player') {
      url = `../player/player?appId=${this.data.appId}&accountId=${this.data.accountId}&token=${this.data.token}&roomId=${this.data.roomId}`
    } else {
      url = `../vod/vod?appId=${this.data.appId}&accountId=${this.data.accountId}&token=${this.data.token}&recordId=${this.data.recordId}`
    }
    wx.navigateTo({
      url: url
    })
  },

  getinput(e) {
    this.setData({ [e.currentTarget.id]: e.detail.value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.name = options.name
    const data = options.name == 'player' ? indexData.player : indexData.vod
    this.setData(data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
