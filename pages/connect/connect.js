// pages/connect/connect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ssid: '-',
    bssid: '-',
    password: '-'
    // ssid: 'SMALLPAY-7A5G',
    // bssid: '设备MAC',
    // password: 'smallpay3-7wifi'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = options && options.scene ? decodeURIComponent(options.scene) : ''
    const [qsssid, qsbssid, qspassword] = scene.split('|')
    let ssid = options.ssid || qsssid;
    let bssid = options.bssid || qsbssid;
    let password = options.password || qspassword;
    this.setData({
      ssid: ssid,
      bssid: bssid,
      password: password
    })
  },

  /**
   * 点击连接按钮触发
   */
  connectWifi: function() {
    wx.showToast({
      title: 'WiFi连接中，请稍等...',
    })
    this.startWiFi();
  },
  
  /**
   * 加载WiFi模块
   */
  startWiFi: function() {
    const that = this;
    wx.startWifi({
      success: () => {that.connected();},
      fail: (res) => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      },
    })
  },

  /**
   * 连接WiFi
   */
  connected: function() {
    const that = this; 
    wx.connectWifi({
      SSID: that.data.ssid,
      BSSID: that.data.bssid,
      password: that.data.password,
      success: () => {
        wx.showToast({
          title: 'WiFi连接成功',
        })
        // 跳转至成功页面
        wx.redirectTo({
          url: '/pages/success/success',
        })
      },
      fail: (res) => {
        // console.log(res);
        that.errorDialog(res);
      }
    })
  },

  /**
   * 连接失败弹窗
   * @param {错误返回} res 
   */
  errorDialog: function(res) {
    const that = this;
    wx.showModal({
      title: '连接失败',
      content: res.errMsg,
      confirmText: '复制密码',
      success (res) {
        if (res.confirm) {
          that.copyPassword();
        } else if (res.cancel) {
          console.log('cancel')
        }
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  /**
   * 复制密码到剪贴板
   */
  copyPassword: function() {
    const that = this;
    wx.setClipboardData({
      // data: `wifi名称：${that.data.ssid}，wifi密码：${that.data.password}`,
      data: that.data.password,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data);
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.wifiList != []) {
      this.data.wifiList = [];
      this.setData({
        wifiList: this.data.wifiList
      });
      //console.log(this.data.wifiList);
    }
    wx.startWifi({
      success: (res) => {
        console.log(res);
        wx.getWifiList({
          success: (res) => {
            console.log(res);
            wx.onGetWifiList((res) => {
              //console.log(res.wifiList);
              for (var i = 0; i < res.wifiList.length; i++) {
                if (res.wifiList[i].SSID != '') {
                  this.data.wifiList.push(res.wifiList[i]);
                  this.setData({
                    wifiList: this.data.wifiList
                  });
                }
              }
            })
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})