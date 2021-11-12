const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/index/index"
    }
}); //index.js
//获取应用实例

const api = require("../../api/index.js");

const unit = require("../../utils/util.js");

const app = getApp();

var QQMapWX = require("../../libs/qqmap-wx-jssdk.min.js"); // tableware_price  餐具费
// takeaway_distance  配送范围
// takeaway_moq  外卖起送费
// takeaway_price  配送费

_Page({
    data: {
        session_3rd: "",
        dishes_list: [],
        userInfo: {
            avatarUrl: "/image/user_icon.png",
            nickName: "昵称"
        },
        showRight: false,
        baseUrl: app.globalData.baseUrl,
        carousel_list: [],
        commentList: [],
        totalRow: 0,
        support: "",
        coupon_list: [],
        paidui: "",
        yuyuezhuowei: "",
        latitude: "0",
        // 纬度
        longitude: "0",
        // 经度
        address: null,
        // 本地位置
        province: "广东省",
        overOnShow: false,
        storeItem: {
            storesname: "店铺名称",
            address: "地址",
            distanceStr: "距离您"
        } // 当前选中店铺信息
    },
    onLoad: function(options) {
      
        if (options.q) {
            let res_url = decodeURIComponent(options.q);

            if (res_url.indexOf("home?storeId=") != -1) {
                // 进入商品列表
                let nRes_url = res_url
                    .replace("https://miniorder.ydongj.com/sell/home?", "")
                    .split("&");

                if (nRes_url.length >= 2) {
                    let storeIdArray = nRes_url[0].split("=");
                    let tableNoArray = nRes_url[1].split("=");
                    let storeId = storeIdArray[1];
                    let tableNo = tableNoArray[1];

                    _my.navigateTo({
                        url:
                            "/pages/takeoutTables/takeoutTables?storeId=" +
                            storeId +
                            "&tableNo=" +
                            tableNo +
                            "&buyType=2"
                    });
                }
            }
        } /// 获取定位

        this.getUserLocation();
    },

    onShow(stopFull) {
        _my.setNavigationBarTitle({
            title: this.data.storeItem.storesname
        });

        if (this.data.overOnShow) {
            if (this.data.latitude == 0 && this.data.longitude == 0) {
                this.getUserLocation();
            } else {
                this.getStores();
            }
        }

        this.data.overOnShow = true;

        if (this.data.storeItem) {
            app.globalData.storeId = this.data.storeItem.storeId;
        }
    },

    /**
     * 扫一扫
     */
    scanning: function(e) {
      console.log(e);
      
        var that = this;

         my.scan({
            scanType: ['qrCode','barCode'],
            success: res => {
                console.log(res);

                if (res.scanType == "QR") {
                    let res_url = decodeURIComponent(res.result);
                    let nRes_url = res_url
                        .replace("https://miniorder.ydongj.com/sell/home?", "")
                        .split("&");

                    if (nRes_url.length >= 2) {
                        let storeIdArray = nRes_url[0].split("=");
                        let tableNoArray = nRes_url[1].split("=");
                        let storeId = storeIdArray[1];
                        let tableNo = tableNoArray[1];

                        _my.navigateTo({
                            url:
                                "/pages/takeoutTables/takeoutTables?storeId=" +
                                storeId +
                                "&tableNo=" +
                                tableNo +
                                "&buyType=2"
                        });
                    }
                } else {
                    _my.showModal({
                        title: "内容不识别，请重新扫描",
                        showCancel: false
                    });
                }
            }
        });
    },

    /**
     * 电话呼叫
     */
    callTel: function(e) {
        var telPhone = e.currentTarget.dataset.tel;

        if (!telPhone) {
            _my.showToast({
                title: "暂时还没有填写电话",
                icon: "none"
            });

            return false;
        }

        _my.makePhoneCall({
            phoneNumber: telPhone,

            success() {},

            fail() {},

            complete() {}
        });
    },

    /**
     * 门店商品列表
     */
    shopProductList(e) {
        console.log(e);
        let buyType = e.currentTarget.dataset.buytype;
        let serviceTime = this.data.storeItem.serviceTime;

        _my.navigateTo({
            url:
                "/pages/takeoutTables/takeoutTables?storeId=" +
                this.data.storeItem.storeId +
                "&buyType=" +
                buyType +
                "&serviceTime=" +
                serviceTime
        });
    },

    /**
     *  门店列表
     */
    gotoStoreList() {
        _my.navigateTo({
            url:
                "/pages/mendian/list/list?latitude=" +
                this.data.latitude +
                "&longitude=" +
                this.data.longitude +
                "&address=" +
                this.data.address +
                "&province=" +
                this.data.province
        });
    },

    /**
     * 获取门店列表
     */
    getStores() {
        let that = this;
        let param = {
            page: "1",
            size: "2",
            longitude: this.data.longitude,
            latitude: this.data.latitude,
            address: this.data.province,//地址店铺切换
            // longitude: '121.35112',
            // latitude: '37.500275',
            // address: "山东",
            tenantId: api.kTenantId
        };
        unit.request(
            "POST",
            param,
            api.apiGetStores,
            success => {
                if (success.length > 0) {
                    var item = success[0];

                    for (const key in success) {
                        let model = success[key];

                        if (model.storeId === that.data.storeItem.storeId) {
                            item = model;
                            app.globalData.storeId = model.storeId;
                        }
                    }

                    _my.setNavigationBarTitle({
                        title: item.storesname
                    });

                    that.setData({
                        storeItem: item
                    });
                }

                _my.stopPullDownRefresh();
            },
            successError => {
                _my.stopPullDownRefresh();
            },
            fail => {
                _my.stopPullDownRefresh();
            }
        );
    },

    /**
     * 获取用户地理位置
     */
    getUserLocation() {
        let that = this;

        _my.getSetting({
            success: res => {
                // 拒绝授权后再次进入重新授权
                if (
                    res.authSetting["scope.userLocation"] != undefined &&
                    res.authSetting["scope.userLocation"] != true
                ) {
                    // console.log('authSetting:status:拒绝授权后再次进入重新授权', res.authSetting['scope.userLocation'])
                    that.getStores();

                    _my.stopPullDownRefresh();

                    _my.showModal({
                        title: "提示",
                        content:
                            "需要获取你的地理位置用于获取您的周边门店，请确认授权",
                        confirmColor: "#7FC241",

                        success(res) {
                            if (res.cancel) {
                                api.showToast("拒绝授权");
                            } else if (res.confirm) {
                                _my.openSetting({
                                    success: function(dbs) {
                                        console.log(dbs);

                                        if (
                                            dbs.authSetting[
                                                "scope.userLocation"
                                            ] == true
                                        ) {
                                            //再次授权，调用wx.getLocation的API
                                            that.getLocation(dbs);
                                        } else {
                                            _my.showToast({
                                                title: "授权失败",
                                                icon: "none"
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                } // 初始化进入，未授权
                else if (res.authSetting["scope.userLocation"] == undefined) {
                    // console.log('authSetting:status:初始化进入，未授权', res.authSetting['scope.userLocation'])
                    //调用wx.getLocation的API
                    that.getLocation(res);
                } // 已授权
                else if (res.authSetting["scope.userLocation"]) {
                    // console.log('authSetting:status:已授权', res.authSetting['scope.userLocation'])
                    //调用wx.getLocation的API
                    that.getLocation(res);
                }
            }
        });
    },

    /**
     * 获取经纬度
     */
    getLocation(userLocation) {
        let that = this;

        _my.getLocation({
            type: "gcj02",
            success: function(res) {
                that.data.latitude = res.latitude;
                that.data.longitude = res.longitude;
                that.getStores();
                that.getAddress();
            },
            fail: function(res) {
                that.getStores();

                _my.stopPullDownRefresh();

                if (res.errMsg === "getLocation:fail:auth denied") {
                    console.log("拒绝授权");
                }

                if (
                    !userLocation ||
                    !userLocation.authSetting["scope.userLocation"]
                ) {
                    // that.getUserLocation()  //防止初次进来第一授权会弹出两个框，所以注释不用。
                } else if (userLocation.authSetting["scope.userLocation"]) {
                    // wx.showModal({
                    //   title: '',
                    //   content: '请在系统设置中打开定位服务',
                    //   showCancel: false,
                    //   success: result => {}
                    // })
                } else {
                    console.log("授权失败");
                }
            }
        });
    },

    /**
     * 获取地理位置
     */
    getAddress() {
        let that = this;
        let latitude = this.data.latitude;
        let longitude = this.data.longitude;
        let key = api.kMapKey;

        _my.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`,
            success: function(res) {
                console.log(res); //根据自己项目需求获取res内容

                let address = res.data.result.address;
                let province = res.data.result.address_component.province;
                that.setData({
                    address: address,
                    province: province
                });
                that.getStores();
            },

            fail() {
                that.getStores();
            }
        });
    },

    /**
     * 导航
     */
    navigationMap: function(e) {
        var that = this;
        var latitude = parseFloat(that.data.storeItem.latitude);
        var longitude = parseFloat(that.data.storeItem.longitude);

        if (!latitude || !longitude) {
            _my.showToast({
                title: "店铺导航还没有设置",
                icon: "none"
            });
        } else {
            _my.openLocation({
                name: that.data.storeItem.storesname,
                address: that.data.storeItem.address,
                latitude: latitude,
                longitude: longitude,
                scale: 12
            });
        }
    },
    sharePeople() {
      console.log('222');
      this.onShareAppMessage()
      
    },
    onShareAppMessage: function( options ){
      console.log('123');
      return {
      // title: '云东家点餐小程序',
      // desc: '好吃又好用，快来加入吧', 
      path: 'pages/index/index'
       }
},

    /**
     * 用户点击右上角分享
     */
    onPullDownRefresh: function() {
        this.getUserLocation();
    }
});
