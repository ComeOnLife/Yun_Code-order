const _my = require("../__antmove/api/index.js")(my);
const util = require("../utils/util.js");

const config = require("./config.js");

var baseUrl = "";
config.getConfig(function(res) {
    console.log(res);
    // baseUrl = res.wxUrl;
}); //门店列表

function apiList(obj, cb) {
    _my.request({
        url: baseUrl + "/api/list",
        data: obj,
        method: "post",
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
            console.log(res);
            util.checkCode(res, function(res) {
                typeof cb == "function" && cb(res);
            });
        }
    });
} //绑定门店

function apiBind(obj, cb, err) {
    _my.request({
        url: baseUrl + "/api/bind",
        data: obj,
        method: "post",
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
            console.log(res);
            util.checkCode(
                res,
                function(res) {
                    typeof cb == "function" && cb(res);
                },
                function(res) {
                    typeof err == "function" && err(res);
                }
            );
        }
    });
} //商家轮播

function apiCarousel(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/carousel",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} //门店订单满减

function apiCoupon(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/coupon",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} //排队选项，shop.paidui==1可排队

function apiPaidui(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/paidui",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} // 保存排队 id*上面返回记录id

function apiPaiduiSave(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/paidui/save",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(
                    res,
                    function(res) {
                        resolve(res);
                        typeof cb == "function" && cb(res);
                    },
                    function(res) {
                        reject(res);
                    }
                );
            }
        });
    });
} //排队记录  number 前面还有多少人

function apiPaiduiUser(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/paidui/user",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} //待叫号消号  id*

function apiPaiduiDeleted(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/paidui/deleted",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} //添加购物车
// id*
// dishes_format_id*
// number*

function apiOrderAddShopping(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/order/addShopping",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} //预约桌位

function apiYuyuezhuowei(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/yuyuezhuowei",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} //保存预约桌位
// ttid*上面返回tables_type.id
// yrid*上面返回yuyuezhuowei_rule.id
// name*姓名
// mobile*手机号

function apiYuyuezhuoweiSave(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/yuyuezhuowei/save",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(
                    res,
                    function(res) {
                        resolve(res);
                        typeof cb == "function" && cb(res);
                    },
                    function(res) {
                        reject(res);
                    }
                );
            }
        });
    });
} //预约记录

function apiYuyuezhuoweiUser(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/yuyuezhuowei/user",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
} //取消预约，待处理可取消

function apiYuyuezhuoweiDeleted(obj, cb) {
    return new Promise((resolve, reject) => {
        _my.request({
            url: baseUrl + "/api/yuyuezhuowei/deleted",
            data: obj,
            method: "post",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                console.log(res);
                util.checkCode(res, function(res) {
                    resolve(res);
                    typeof cb == "function" && cb(res);
                });
            }
        });
    });
}

module.exports = {
    apiList,
    apiBind,
    apiCarousel,
    apiCoupon,
    apiPaidui,
    apiPaiduiSave,
    apiPaiduiUser,
    apiPaiduiDeleted,
    apiOrderAddShopping,
    apiYuyuezhuowei,
    apiYuyuezhuoweiSave,
    apiYuyuezhuoweiUser,
    apiYuyuezhuoweiDeleted,
};
