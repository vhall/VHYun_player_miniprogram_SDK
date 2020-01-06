// pages/index.js
Page({
  gotoPlay: function() {
    wx.navigateTo({
      url: '../sure/sure?name=player'
    })
  },

  gotoVod: function() {
    wx.navigateTo({
      url: '../sure/sure?name=vod'
    })
  }
})
