const _Page = require("../../../__antmove/component/componentClass.js")("Page");
const _my = require("../../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/yuyuezhuowei/jieguo/jieguo"
    }
}); // pages/yuyuezhuowei/jieguo/jieguo.js

const api = require("../../../api/index.js");

const util = require("../../../utils/util.js");

const app = getApp();

_Page({
    data: {
        session_3rd: "",
        baseUrl: app.globalData.baseUrl,
        yuyuezhuowei: ""
    },
    onLoad: function(options) {
        let that = this;
        app.getSession(session_3rd => {
            this.setData({
                session_3rd: session_3rd
            });
            that.getShop(function() {
                that.apiYuyuezhuoweiUser();
            });
        });
    },

    async apiYuyuezhuoweiDeleted() {
        let that = this;

        _my.showModal({
            title: "提示",
            content: "确定要取消预约吗？",
            success: async function(res) {
                if (res.confirm) {
                    let obj = {
                        session_3rd: that.data.session_3rd,
                        id: that.data.yuyuezhuowei.id
                    };
                    await api.apiYuyuezhuoweiDeleted(obj);

                    _my.showToast({
                        title: "操作成功",
                        success: function() {
                            setTimeout(function() {
                                _my.redirectTo({
                                    url: "/pages/yuyuezhuowei/faqi/faqi"
                                });
                            }, 800);
                        }
                    });
                }
            }
        });
    },

    async apiYuyuezhuoweiUser() {
        var that = this;
        let resYuyue = await api.apiYuyuezhuoweiUser({
            session_3rd: that.data.session_3rd
        });
        this.setData({
            yuyuezhuowei: resYuyue.data.yuyuezhuowei
        });
    },

    getShop: function(cb) {
        var that = this;

        _my.request({
            url: api.shop(),
            data: {
                session_3rd: that.data.session_3rd
            },
            success: function(res) {
                util.checkCode(res, function(res) {
                    that.setData({
                        shop: res.data.shop,
                        business: res.data.business
                    });
                    typeof cb == "function" && cb();
                });
            }
        });
    },
    onPullDownRefresh: function() {
        if (this.data.yuyuezhuowei) {
            this.onLoad();

            _my.stopPullDownRefresh();
        }
    }
});
