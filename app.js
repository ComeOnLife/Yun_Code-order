const _App = require("./__antmove/component/componentClass.js")("App");
const _my = require("./__antmove/api/index.js")(my);
//app.js
var api = require("/api/index.js");

var util = require("/utils/util.js");

var config = require("/api/config.js"); //获取基础参数

var baseUrl = "";
var bcode = "";
config.getConfig(function(res) {
    // baseUrl = res.wxUrl;
    // bcode = res.bcode;
}); // //普通上传方式
// baseUrl= 'https://demo2.xiaodaofuli.com'
// bcode = "20070416045702731"

_App({
    onLaunch: function(options) {
      console.log(options);
      // my.alert({content: '启动参数：'+ options.query.qrCode})
        var that = this;
        if(options.query) {
          let nRes_url = ''
          if(options.query.qrCode.indexOf('https://miniorder.ydongj.com/sell/home?') == -1) {
              nRes_url = options.query.qrCode.replace("http://verify.ydongj.com/home?", "").split("&");
          }else {
              nRes_url = options.query.qrCode.replace("https://miniorder.ydongj.com/sell/home?", "").split("&");
          }
          
          let storeIdArray = nRes_url[0].split("=");
          let tableNoArray = nRes_url[1].split("=");
          that.globalData.storeId = storeIdArray[1]
          that.globalData.tableNo = tableNoArray[1]
        }
        let userInfo = _my.getStorageSync("userInfo");

        let userPhoneNumber = _my.getStorageSync("userPhoneNumber"); // let userPhoneNumber = '15818550703'

        if (userInfo) {
            that.globalData.userInfo = userInfo;
        }

        if (userPhoneNumber) {
            that.globalData.userPhoneNumber = userPhoneNumber; // 获取会员信息

            let param = {
                storeId: that.globalData.selectStoreId,
                phone: userPhoneNumber
            };
            console.log(param.storeId);
            util.request("POST", param, api.apiGetMember, success => {
                that.globalData.memberInfo = success;
            });
        } // 检查sessionKey
        // 获取openId

        _my.login({
            success(res) {
                if (!res.code) {
                    return;
                }

                that.globalData.code = res.code;
                let parma = {
                    code: res.code,
                    tenantId: api.kTenantId
                };
                util.request(
                    "GET",
                    parma,
                    api.apiGetOpenId,
                    success => {
                        console.log(success);
                        that.globalData.openId = success.openId;
                        that.globalData.sessionKey = success.sessionKey;
                    },
                    successError => {},
                    fail => {}
                );
            }
        });
    },
    appLogin: function(cb) {
        var that = this; // wx.login({
        //   success: function (res) {
        //     console.log(res)
        //     if (res.code) {
        //       //传递code 发送网络请求
        //       let obj = {
        //         code: res.code,
        //         bcode: that.globalData.bcode
        //       }
        //       wx.request({
        //         url: api.login(),
        //         data: obj,
        //         success: function (res) {
        //           console.log(res);
        //           if (res.data['session_3rd']) {
        //             wx.setStorageSync('session_3rd', res.data['session_3rd']);
        //             typeof cb == "function" && cb(res.data['session_3rd']);
        //           } else {
        //             wx.showModal({
        //               title: res.data.msg,
        //               showCancel: false
        //             });
        //           }
        //         }
        //       })
        //     } else {
        //       console.log('获取用户登录态失败！' + res.errMsg)
        //     }
        //   },
        //   fail: function (res) {
        //     console.log(res)
        //   }
        // });
    },
    checkSettingStatu: function(e, cb) {
        //获取用户信息
        var that = this;

        if (!e) {
            return false;
        }

        that.getSession(function(session_3rd) {
            if (e.detail.errMsg == "getUserInfo:fail auth deny") {
                _my.showModal({
                    title: "提示",
                    content:
                        "小程序需要获取你的用户头像和昵称用于登录，请重新授权",
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                        }
                    }
                });
            } else {
                //同步会员信息
                that.userInform(session_3rd, e.detail, function(res) {
                    console.log("存入缓存");
                    console.log(res);

                    _my.showToast({
                        title: "授权成功"
                    });

                    _my.setStorageSync("userInfo", res.data.user);

                    that.globalData.userInfo = res.data.user;
                    typeof cb == "function" && cb(res.data.user);
                });
            }
        });
    },
    userInform: function(session_3rd, user, cb) {
        var that = this;
        var session_3rd = session_3rd;

        _my.request({
            url: api.userInform(),
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                session_3rd: session_3rd,
                name: user.userInfo.nickName,
                img_url: user.userInfo.avatarUrl
            },
            success: function(res) {
                // console.log('同步完毕');
                util.checkCode(res, function() {
                    that.getUserMsg(session_3rd, cb);
                });
            }
        });
    },
    getUserMsg: function(session_3rd, cb) {
        _my.request({
            url: api.userMsg(),
            data: {
                session_3rd: session_3rd
            },
            success: function(res) {
                util.checkCode(res, function() {
                    typeof cb == "function" && cb(res);
                });
            }
        });
    },
    getSession: function(cb) {
        var that = this;

        var session_3rd = _my.getStorageSync("session_3rd");

        if (session_3rd) {
            typeof cb == "function" && cb(session_3rd);
        } else {
            console.log("getSession 登录"); //调用登录接口

            that.appLogin(cb);
        }
    },
    globalData: {
        // 卤肉店  57bf211ab6fc11eb93d20c42a130ebb6
        // 云东家  8aaed99f62c0134601633d8d828278a6
        //胖掌柜   4ab62db0dc9d11eb93d20c42a130ebb6
        //烤鱼捞饭 b76d16d9ef7211eb93d20c42a130ebb6
        selectStoreId: "57bf211ab6fc11eb93d20c42a130ebb6",
        // 默认
        userPhoneNumber: null,
        memberInfo: null,
        userInfo: null,
        openId: null,
        code: null,
        sessionKey: null,
        baseUrl: baseUrl,
        bcode: bcode,
        keyMap: config.keyMap,
        v: "1.0.8",
        storeId: '',
        tableNo: '',
        buyType: '',
    },
});
