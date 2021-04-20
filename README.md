## 微吼云播放器小程序 SDK

对微信 live-player 和 video 所有方法的封装集合，不包括属性

如果需求中有播放过程中音视频互相切换的需求时，鼓励使用 video 播放音频，但是需要自定义控制条 <br />
鼓励使用 SDK 封装的方法，即使设置了 autoplay，在播放时也需要调用 SDK 的 play 方法，出页面的时候应当调用暂停或者停止或者销毁实例。
使用 live-player 组件应当按照 demo 所示绑定 bindstatechange 和 bindnetstatus 并传入对应 sdk 事件
使用 video 也应按照 demo 所示绑定对应的监听事件 bindplay、bindpause、bindEnd、bindError、bindwaiting 等并传入 sdk

### 扫码体验

- ![](https://static.vhallyun.com/doc-images/5e1d31491d604_5e1d3149.jpg)

### 目录结构

- index 为入口文件夹
- player 为 直播观看端(live-player)
- vod 为点播观看端(video)
- minSDK 为 SDK 文件
- 其余为微信小程序必要文件

### 使用方法如下

```javascript
import Player from '../../dist/vhall-mpsdk-player-2.0.0'
// 先实例化对象
this.player = new Player()
/**
 * 再调用实例化SDK方法，之后所有的方法均应该在createInstance的成功函数后执行
 * @param {String} type- 取值live、vod 对应直播、点播
 * @param {String} token - token
 * @param {String} accountId - accountId
 * @param {String} aid - live对应roomId，vod对应recordId
 * @param {String} appId - appId
 * @param {String} playerId - live-player或者video的id
 * @param {Object} THIS - 小程序this实例，仅用于选取组件
 * @param {Object} otherOption - 自定义的教育版其它参数，选填
 * @param {String} defaultQuality - 自定义清晰度，选填，取值 'same', '1080p', '720p', '480p', '360p', 'a'，传入无效值时该参数不生效
 * @returns {String} url - 默认播放地址 该地址清晰度默认顺序：'same', '1080p', '720p', '480p', '360p', 'a'
 */
const {url} = await this.player.createInstance({
    token: options.token,
    accountId: options.accountId,
    aid: options.roomId,
    appId: options.appId,
    type: 'live',
    playerId: 'live-player',
    THIS: this
  })
/**
 * 获取清晰度列表
 * @return {Array} quality - ['same','1080p','720p','480p','360p','a']
 * @property {String} 'same' - 原画
 * @property {String} 'a' - 纯音频
 */
getQualityList(){
    const quality = this.player.getQualityList()
}
/**
 * 切换清晰度
 * @param {String} quality - 清晰度列表里获得到的某个清晰度值
 * @return {String} url - 返回该清晰度对应的播放地址
 */
 switchQualityLevel(quality) {
   const videoUrl = this.player.switchQualityLevel(quality)
 }
/**
 * 实例销毁
 */
  destory() {
    this.player.destory()
    this.player = null
  }
```

#### live-player 封装方法列表：名称、参数遵循[小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)

```javascript
// 播放
this.player.play(param)
// 暂停
this.player.pause(param)
// 恢复
this.player.resume(param)
// 停止
this.player.stop(param)
// 全屏
this.player.requestFullScreen(param)
// 退出全屏
this.player.exitFullScreen(param)
// 进入、退出静音
this.player.mute(param)
// 截图
this.player.snapshot(param)
//退出小窗
this.player.exitPictureInPicture()
// bindstatechange 回调传入函数
this.player.onStateChange(param)
// bindnetstatus 回调传入函数
this.player.onNetstatus(param)
```

#### video 封装方法列表：名称、参数遵循[小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)

```javascript
// 播放
this.player.play(param)
// 暂停
this.player.pause(param)
// 停止
this.player.stop(param)
// 全屏
this.player.requestFullScreen(param)
// 退出全屏
this.player.exitFullScreen(param)
// 快进快退
this.player.seek(time)
// 发送弹幕
this.player.sendDanmu(param)
//退出小窗
this.player.exitPictureInPicture()
// 倍速
this.player.playbackRate(rate)
// ios全屏显示状态栏
this.player.showStatusBar()
// ios全屏隐藏状态栏
this.player.hideStatusBar()
// bindplay 回调传入方法
this.player.onVideoPlay(e)
// bindpause 回调传入方法
this.player.onVideoPause(e)
// bindEnd 回调传入方法
this.player.onVideoEnd(e)
// bindError 回调传入方法
this.player.onVideoError(e)
// bindwaiting 回调传入方法
this.player.onVideoWaiting(e)
```

#### 已知问题

当前 SDK 仅对方法层进行了封装，并未处理小程序 SDK 现有的问题，已知的如下：

- live-player 上覆盖 cover-view 不断的横屏竖屏时，有几率出现滚动方向混乱的问题，具体表现为：正常竖屏向下滚动，切换为横屏后发现成了横向滚动，解决这个问题推荐使用 view，但是要求小程序必须支持同层渲染
