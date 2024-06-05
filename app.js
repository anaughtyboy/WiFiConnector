//app.js
App({
  globalData: {
    wifiList: [],
  },
  onLaunch: function() {
    // wx.getUserInfo({
    //   withCredentials: true,
    //   success: (res) => {
    //     console.log(res);
    //   },
    //   fail: (res) => {
    //     console.log(res);
    //     wx.showModal({
    //       title: '警告',
    //       content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
    //       showCancel: false,
    //       success: function(res) {
    //         if (res.confirm) {
    //           console.log('用户点击确定')
    //           wx.navigateTo({
    //             url: '../tologin/tologin',
    //           })
    //         }
    //       }
    //     })
    //   }
    // })
  },
  onShow: function() {
    if (!(wx.getStorageSync('openid'))) {
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: 'http://127.0.0.1:5000/weixin/login',
              data: {
                code: res.code
              },
              method: 'POST',
              success: (res) => {
                // console.log(res);
                // var data = JSON.parse(res.data.data);
                // console.log(data);
                // console.log(data.openid);
                // console.log(typeof(data.openid));
                wx.setStorageSync('openid', res.data.data.openid);
                console.log('用户openid', wx.getStorageSync('openid'));
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        }
      })
    }
  }
})