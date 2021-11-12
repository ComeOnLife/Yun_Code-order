const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/address/address"
    }
}); // pages/address/address.js

const api = require("../../api/index.js");

const util = require("../../utils/util.js");

const app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: app.globalData.baseUrl,
        session_3rd: "",
        take_name: "",
        take_mobile: "",
        take_address: "",
        take_date: "",
        date: util.formatTime(new Date()),
        url: "",
        take_own: null,
        appointment: "",
        //预约订单
        chooseLocation: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.setData({
            take_own: options.take_own
        });

        if (options.take_name) {
            this.setData({
                take_name: options.take_name,
                take_mobile: options.take_mobile
            });
        }

        if (options.take_address) {
            this.setData({
                take_address: options.take_address
            });
        }

        if (options.take_date) {
            this.setData({
                take_date: options.take_date
            });
        }

        if (options.appointment) {
            this.setData({
                appointment: options.appointment
            });
        }
    },
    bindTimeChange: function(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        this.setData({
            take_date: this.data.date + " " + e.detail.value
        });
    },
    bindKeyInput: function(e) {
        var key = e.currentTarget.dataset.key;
        var val = e.detail.value;
        var keyData = new Object();
        keyData[key] = val;
        this.setData(keyData);
    },
    getArea: function(res) {
        var that = this;
        console.log(res);

        if (!res.detail.authSetting["scope.userLocation"]) {
            return false;
        }

        that.setData({
            chooseLocation: true
        });
    },
    chooseArea: function(e) {
        console.log(e);
        var that = this;

        _my.getSetting({
            success(res) {
                console.log(res);

                if (!res.authSetting["scope.userLocation"]) {
                    _my.getLocation({
                        type: "wgs84",

                        success(res) {
                            chooseLocation();
                        },

                        fail() {
                            that.setData({
                                chooseLocation: false
                            });
                        }
                    });
                } else {
                    chooseLocation();
                }
            }
        });

        function chooseLocation() {
            _my.chooseLocation({
                success: function(res) {
                    console.log(res);
                    that.setData({
                        take_address: res.address + " " + res.name,
                        checkFlage: 1
                    });
                },
                fail: function(res) {
                    console.log(res);

                    if (res.errMsg == "chooseLocation:fail auth deny") {
                        that.setData({
                            chooseLocation: false
                        });
                    }
                }
            });
        }
    },
    saveAddress: function() {
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //下一页

        if (!that.data.take_name) {
            _my.showToast({
                title: "请输入名字",
                image: "/image/tip.png"
            });

            return false;
        }

        if (!that.data.take_mobile) {
            _my.showToast({
                title: "请输入电话",
                image: "/image/tip.png"
            });

            return false;
        }

        _my.setStorageSync("take_name", that.data.take_name);

        _my.setStorageSync("take_mobile", that.data.take_mobile);

        prevPage.setData({
            take_name: that.data.take_name,
            take_mobile: that.data.take_mobile
        });

        _my.navigateBack({
            delta: 1
        });

        return; //预约

        if (that.data.appointment) {
            if (!that.data.take_date) {
                _my.showToast({
                    title: "请选择时间段",
                    image: "/image/tip.png"
                });

                return false;
            }

            that.data.take_date = that.data.take_date;

            _my.setStorageSync("take_name", that.data.take_name);

            _my.setStorageSync("take_mobile", that.data.take_mobile); // wx.setStorageSync('take_date', that.data.take_date);

            prevPage.setData({
                take_name: that.data.take_name,
                take_mobile: that.data.take_mobile,
                take_date: that.data.take_date
            });

            _my.navigateBack({
                delta: 1
            });
        } else {
            //外卖
            if (that.data.take_own == 0) {
                //配送
                if (!that.data.take_address) {
                    _my.showToast({
                        title: "请输入详细地址",
                        image: "/image/tip.png"
                    });

                    return false;
                } // app.getSession(function (session_3rd) {

                _my.setStorageSync("take_name", that.data.take_name);

                _my.setStorageSync("take_mobile", that.data.take_mobile);

                _my.setStorageSync("take_address", that.data.take_address);

                prevPage.setData({
                    take_name: that.data.take_name,
                    take_mobile: that.data.take_mobile,
                    take_address: that.data.take_address
                });

                _my.navigateBack({
                    delta: 1
                }); // });
            } else if (that.data.take_own == 1) {
                //自提
                if (!that.data.take_date) {
                    _my.showToast({
                        title: "请选择时间段",
                        image: "/image/tip.png"
                    });

                    return false;
                }

                that.data.take_date = that.data.take_date;

                _my.setStorageSync("take_name", that.data.take_name);

                _my.setStorageSync("take_mobile", that.data.take_mobile); // wx.setStorageSync('take_date', that.data.take_date);

                prevPage.setData({
                    take_name: that.data.take_name,
                    take_mobile: that.data.take_mobile,
                    take_date: that.data.take_date
                });

                _my.navigateBack({
                    delta: 1
                });
            }
        }
    }
});
