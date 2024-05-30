Page({

  /**
   * 页面的初始数据
   */
  data: {
    wifiList: [],
    ssid: '',
    wifi: '',
    wifiQrCode: '',
    showModal: true,
    isdisabled: false,
    inputPassword: '',
    wiFiPassword: '',
    buttons: [
      {
        type: 'primary',
        className: '',
        text: '生成二维码',
        value: 0
      }
    ],
    formData: { ssid: '', password: '' },
    rules: [{
      name: 'ssid',
      rules: {required: true, message: '名称必填'
      }},{
      name: 'password',
      rules: {
        validator: function(rule, value, param, modeels) {
          if (!value || value.length < 8) {
              return '请输入Wifi密码，且长度至少8位'
          }
      }}
    }]
  },
  unlockMore: function() {
    // this.setData({
    //   showModal: true
    // })
    // return
    //console.log(this.data.wifiList);
    if (this.data.wifiList != []) {
      this.data.wifiList = [];
      this.setData({
        wifiList: this.data.wifiList
      });
      //console.log(this.data.wifiList);
    }
    wx.startWifi({
      success: (res) => {
        //console.log(res);
        wx.getWifiList({
          success: (res) => {
            //console.log(res);
            wx.onGetWifiList((res) => {
              console.log(res.wifiList);
              for (var i = 0; i < res.wifiList.length; i++) {
                if (res.wifiList[i].SSID != '') {
                  this.data.wifiList.push(res.wifiList[i]);
                  this.setData({
                    wifiList: this.data.wifiList
                  });
                }
              }
              console.log(this.data.wifiList);
            })
          },
          fail: (res) => {
            console.log(res);
            if (res.errCode === 12005) {
              wx.showToast({
                title: '请先打开WiFi开关',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  connectWiFi: function(e) {
    //console.log(e);
    this.data.ssid = e.currentTarget.dataset.item.SSID;
    this.data.wifi = e.currentTarget.dataset.item;
    this.data.formData.ssid = this.data.ssid;
    this.setData({
      ssid: this.data.ssid,
      wifi: this.data.wifi,
      formData: { ...this.data.formData }
    });
    //console.log(this.data.wifi);
    this.data.showModal = true;
    this.setData({
      showModal: this.data.showModal
    });

  },
  cancel: function() {
    this.data.showModal = false;
    this.setData({
      showModal: this.data.showModal
    });
  },
  inputChange: function(e) {
    // console.log(typeof(e.detail.value));
    // console.log(e.detail.value.length);
    if (e.detail.value.length > 0 && e.detail.value.length < 8) {
      this.data.isdisabled = true;
      this.setData({
        isdisabled: this.data.isdisabled
      });
    } else {
      this.data.isdisabled = false;
      this.setData({
        isdisabled: this.data.isdisabled
      });
    }
    this.data.inputPassword = e.detail.value;
    this.setData({
      inputPassword: this.data.inputPassword
    })
    //console.log(this.data.inputPassword);

  },
  confirm: function(e) {
    //console.log(e.currentTarget.dataset.wifi.SSID);
    //console.log(e);
    this.data.showModal = false;
    this.setData({
      showModal: this.data.showModal
    })
    this.data.wiFiPassword = this.data.inputPassword;
    this.data.inputPassword = '';
    this.setData({
      wiFiPassword: this.data.wiFiPassword,
      inputPassword: this.data.inputPassword
    })
    //console.log(this.data.wiFiPassword);
    //console.log(typeof(this.data.wiFiPassword));
    wx.startWifi({
      success: (res) => {
        wx.showLoading({
          title: '连接中'
        })
        //console.log(res.errMsg);
        // console.log(e.currentTarget.dataset.wifi.SSID);
        // console.log(this.data.wiFiPassword);
        wx.connectWifi({
          SSID: e.currentTarget.dataset.wifi.SSID,
          password: this.data.wiFiPassword,
          success: (res) => {
            //console.log(res);
            wx.getConnectedWifi({
              success: () => {
                wx.showToast({
                  title: 'WiFi连接成功',
                  icon: 'success',
                  duration: 2000
                })
                var ssid = e.currentTarget.dataset.wifi.SSID;
                var bssid = e.currentTarget.dataset.wifi.BSSID;
                var password = this.data.wiFiPassword;
                // console.log(ssid);
                // console.log(bssid);
                // console.log(password);
                // console.log(typeof ssid);
                // console.log(typeof bssid);
                // console.log(typeof password);
                wx.request({
                  url: 'https://wifi.cou8123.cn/api/wxapp/public/connectwifi',
                  data: {
                    ssid: ssid,
                    bssid: bssid,
                    password: password
                  },
                  method: 'POST',
                  success: (res) => {
                    //console.log(res);
                  }
                })
                this.data.wiFiPassword = '';
                this.setData({
                  wiFiPassword: this.data.wiFiPassword
                });
                wx.navigateBack({
                  delta: 1
                })
              },
              fail: (res) => {
                //console.log(res);
              }
            })
          },
          fail: (res) => {
            //wx.hideLoading();
            //console.log(res);
            if (res.errCode === 12005) {
              wx.showToast({
                title: '请先打开WiFi开关',
                icon: 'none',
                duration: 2000
              })
            }
            if (res.errCode === 12002) {
              wx.showToast({
                title: 'WiFi密码错误',
                icon: 'none',
                duration: 2000
              })
            }
            if (res.errCode === 12003) {
              wx.showToast({
                title: '连接超时，请重新连接',
                icon: 'none',
                duration: 2000
              })
            }
          }

        })
      }
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  submitForm: function() {
    this.selectComponent('#form').validate((valid, errors) => {
      // console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          wx.showToast({
            icon: 'none',
            duration: 2000,
            title: errors[firstError[0]].message
          })
        }
      } else {
        // wx.showToast({
        //   title: '校验通过'
        // })
        this.generateQrcode()
      }
    })
  },
  generateQrcode: function() {
    //请求服务器生成二维码
    // this.data.showModal = false
    // this.setData({ showModal: this.data.showModal })
    wx.request({
      // url: 'https://wifi.cou8123.cn/api/wxapp/public/getWXACode',
      url: 'http://192.168.10.126:5000/weixin/create_wxaqrcode',
      data: {
        ssid: this.data.formData.ssid,
        password: this.data.formData.password,
        bssid: this.data.wifi.BSSID, //可选的
        user_id: wx.getStorageSync('openid'), //openid
      },
      method: 'POST',
      success: (res) => {
      this.data.wifiQrCode = res.data.src;
      this.setData({
        wifiQrCode: this.data.wifiQrCode
      });
        // console.log(res.data);
        // var WiFidata = res.data;
        // wx.navigateTo({
        //   // url: '../WiFiCode/WiFiCode?WiFidata=' + JSON.stringify(WiFidata) + '&' + 'wifiName=' + this.data.wifiName + '&wifiPw=' + this.data.wifiPw
        //   url: '../WiFiCode/WiFiCode?wifiName=' + this.data.wifiName + '&wifiPw=' + this.data.wifiPw,
        //   success: () => {
        //     this.data.wifiName = '';
        //     this.setData({
        //       wifiName: this.data.wifiName
        //     });
        //     this.data.wifiPw = '';
        //     this.setData({
        //       wifiPw: this.data.wifiPw
        //     });
        //   }
        // })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // if (this.data.wifiList != []) {
    //   this.data.wifiList = [];
    //   this.setData({
    //     wifiList: this.data.wifiList
    //   });
    // }
    // this.data.wifiList = [{SSID: '11'}, {SSID: '22'}];
    // this.setData({
    //   wifiList: this.data.wifiList
    // });
    // return
    wx.startWifi({
      success: (res) => {
        console.log(res);
        wx.getWifiList({
          success: (res) => {
            console.log(res);
            wx.onGetWifiList((res) => {
              console.log(res.wifiList);
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})