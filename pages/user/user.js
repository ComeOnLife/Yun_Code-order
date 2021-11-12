const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/user/user"
    }
}); // pages/user/user.js

const api = require("../../api/index.js");

const util = require("../../utils/util.js");

const app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        session_3rd: "",
        userInfo: "",
        baseUrl: app.globalData.baseUrl,
        showRight: false,
        phoneNumber: "",
        memberInfo: null,
        getPhoneNumFrequency: 0,
        // 获取手机号的次数 1
        phoneType: 0, // 0 会员 1 钱包
        nickName: '',//用户昵称
        avatar: '',//用户头像
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      console.log('123');
      
      // my.getAuthCode({
      //   scopes: 'auth_base',
      //   success: (res) => {
      //     console.log(res);
      //   // res.authCode
      //   //发送授权码到服务后台进行解析
      //     // 根据authcode，调用后台接口，获取用户ID
      //   }
      // });
      my.getAuthUserInfo({
          success: (res) => {
            // console.log("用户信息：" + JSON.stringify(res))
            console.log(res);
            
            this.setData({
              nickName: res.nickName,
              avatar: res.avatar
            })
            console.log(this.data.nickName);
            console.log(this.data.avatar);
            
            
          },
          fail: err => console.log(err)
        });
      
        this.setData({
            phoneNumber: app.globalData.userPhoneNumber
                ? app.globalData.userPhoneNumber
                : "",
            memberInfo: app.globalData.memberInfo
        });

    
    },
    onShow: function() {
        if (!app.globalData.userPhoneNumber) {
            return;
        }

        this.setData({
            phoneNumber: app.globalData.userPhoneNumber
                ? app.globalData.userPhoneNumber
                : ""
        }); // 获取会员信息

        let param = {
            storeId: app.globalData.storeId,
            phone: this.data.phoneNumber
        };
        let that = this;
        util.request(
            "POST",
            param,
            api.apiGetMember,
            success => {
                that.data.memberInfo = success;
                app.globalData.memberInfo = success;
            },
            successError => {},
            fail => {}
        );
    },

    /**
     * 获取手机号
     */
    getPhoneNumber(e) {
        // _my.showLoading();

        let that = this;
        let encryptedData = e.detail.encryptedData;
        let iv = e.detail.iv;
        that.data.phoneType = 0;

        if (!encryptedData || !iv) {
            _my.hideLoading(); // console.log('未获取到手机号')

            return;
        }

        this.data.getPhoneNumFrequency = 0;
        let param = {
            tenantId: api.kTenantId,
            encryptedData: encryptedData,
            iv: iv
        };
        that.loginGetCodeWithPhone(param);
    },

    getPhoneNumber2(e) {
      my.getPhoneNumber({
    success: (res) => {
      console.log(res);
      
        let encryptedData = res.response;
        console.log(encryptedData);
        
        my.request({
            url: '你的后端服务端',
            data: encryptedData,
        });
    },
    fail: (res) => {
        console.log(res);
        console.log('getPhoneNumber_fail');
    },
});


    //     my.getPhoneNumber({
    //     success: (res) => {
          
    //     let encryptedData = res.response;
    //     console.log(encryptedData);
    //     console.log(JSON.parse(encryptedData).response);
    //     let data = JSON.parse(encryptedData).response
    //     console.log(JSON.stringify(data));
    //     let resd = {
    //       phoneEncryptedText: data
    //     }
    //     util.request(
    //         "POST",
    //         resd,
    //         api.apiGetPhone,
    //     )
    // },
    // fail: (res) => {
    //     console.log(res);
    //     console.log('1');
        
    //     console.log('getPhoneNumber_fail');
    // },
    //     });

        // _my.showLoading();

        // let that = this;
        // let encryptedData = e.detail.encryptedData;
        // let iv = e.detail.iv;
        // that.data.phoneType = 1;

        // if (!encryptedData || !iv) {
        //     _my.hideLoading(); // console.log('未获取到手机号')

        //     return;
        // }

        // this.data.getPhoneNumFrequency = 0;
        // let param = {
        //     tenantId: api.kTenantId,
        //     encryptedData: encryptedData,
        //     iv: iv
        // };
        // that.loginGetCodeWithPhone(param);
    },

    // 登录换取手机号
    loginGetCodeWithPhone(param) {
        let that = this;

        _my.login({
            success(res) {
                if (!res.code) {
                    _my.hideLoading();

                    return;
                }

                app.globalData.code = res.code;
                param.code = app.globalData.code;
                that.getWxUserPhone(param);
            },

            fail(res) {
                _my.hideLoading();
            }
        });
    },

    // 获取手机号的请求
    // getWxUserPhone(param) {
    //     let that = this;
    //     util.request(
    //         "POST",
    //         param,
    //         api.apiGetWxUserPhone,
    //         success => {
    //           console.log(success);
              
    //             let phone = success;

    //             if (phone) {
    //                 that.setData({
    //                     phoneNumber: phone
    //                 });

    //                 _my.setStorageSync("userPhoneNumber", phone);

    //                 app.globalData.userPhoneNumber = phone; // that.getMember(true)

    //                 if (that.data.phoneType == 0) {
    //                     that.memberInfo();
    //                 } else if (that.data.phoneType == 1) {
    //                     that.gotowallet();
    //                 }

    //                 _my.hideLoading();
    //             } else {
    //                 if (that.data.getPhoneNumFrequency < 1) {
    //                     that.loginGetCodeWithPhone(param);
    //                 } else {
    //                     _my.hideLoading();
    //                 }

    //                 that.data.getPhoneNumFrequency += 1;
    //             }
    //         },
    //         successError => {
    //             _my.hideLoading();
    //         },
    //         fail => {
    //             _my.hideLoading();
    //         }
    //     );
    // },

    /**
     * 钱包
     */
    gotowallet() {
        _my.navigateTo({
            url: "../wallet/wallet?phoneNumber=" + this.data.phoneNumber
        });
    },

    /**
     * 会员详情
     */
    memberInfo() {
        _my.navigateTo({
            url: "../member/member?phone=" + this.data.phoneNumber
        });
    },

    /*
     * 注册会员
     */
    registerMember(phone) {
        let param = {
            storeId: app.globalData.storeId,
            phone: phone
        };
        util.request("POST", param, api.apiRegisterMember, success => {});
    },

    /**
     * 我的钱包
     */
    gotoMyWall() {
        _my.navigateTo({
            url: "/pages/wallet/wallet"
        });
    },

    bindGetUserInfo: function(e) {
        // var that = this;
        // var session_3rd = that.data.session_3rd;
        // app.checkSettingStatu(e,function (user) {
        //   console.log(user);
        //   that.setData({
        //     userInfo: user
        //   })
        // });
    },
    canLogin: function(res) {
        // if (!wx.canIUse || !wx.canIUse('button.open-type.getUserInfo')) {
        //   wx.showModal({
        //     title: '微信版本太旧',
        //     content: '使用旧版本微信、将完美使用此小程序，请下载最新版本微信',
        //     showCancel: false
        //   })
        // }
    }
});
