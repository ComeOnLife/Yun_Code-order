const _Page = require("../../../__antmove/component/componentClass.js")("Page");
const _my = require("../../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/yuyuezhuowei/faqi/faqi"
    }
}); // pages/yuyuezhuowei/faqi/faqi.js

const api = require("../../../api/index.js");

const util = require("../../../utils/util.js");

const app = getApp();

_Page({
    data: {
        session_3rd: "",
        baseUrl: app.globalData.baseUrl,
        tables_type_list: [],
        yuyuezhuowei_rule_list: [],
        lock: false,
        ttid: "",
        yrid: "",
        user: ""
    },
    onLoad: function(options) {},

    onShow() {
        let that = this;
        app.getSession(session_3rd => {
            app.getUserMsg(session_3rd, function(res) {
                that.setData({
                    session_3rd: session_3rd,
                    user: res.data.user
                });
                that.getShop(function() {
                    that.apiYuyuezhuowei();
                });
            });
        });
    },

    async apiYuyuezhuoweiSave() {
        let that = this;

        if (!that.data.user.user_mobile) {
            _my.showModal({
                title: "提示",
                content: "预约桌位需要您的姓名及电话，请先填写",
                showCancel: false,
                success: function() {
                    _my.navigateTo({
                        url: "/pages/mobile/mobile?goback=1"
                    });
                }
            });

            return;
        }

        let obj = {
            session_3rd: that.data.session_3rd
        };
        obj.ttid = that.data.ttid;
        obj.yrid = that.data.yrid;
        obj.name = that.data.user.name;
        obj.mobile = that.data.user.user_mobile;

        if (!obj.ttid) {
            _my.showToast({
                title: "请选择就餐人数",
                icon: "none"
            });

            return;
        }

        if (!obj.yrid) {
            _my.showToast({
                title: "请选择就餐时间",
                icon: "none"
            });

            return;
        }

        if (that.data.lock) {
            return;
        }

        that.setData({
            lock: true
        });

        try {
            await api.apiYuyuezhuoweiSave(obj);

            _my.showToast({
                title: "操作成功",
                success: function() {
                    setTimeout(function() {
                        _my.redirectTo({
                            url: "/pages/yuyuezhuowei/jieguo/jieguo"
                        });
                    }, 800);
                }
            });
        } catch (res) {
            that.setData({
                lock: false
            });

            _my.showModal({
                title: "提示",
                content: res.data.msg,
                showCancel: false
            });
        }
    },

    chooseTimeFunc(e) {
        //选择时间
        let id = e.currentTarget.dataset.id;
        this.setData({
            yrid: id
        });
    },

    chooseItemFunc(e) {
        //选择桌位
        let id = e.currentTarget.dataset.id;
        this.setData({
            ttid: id
        });
    },

    async apiYuyuezhuowei() {
        let that = this;
        let res = await api.apiYuyuezhuowei({
            session_3rd: that.data.session_3rd
        });
        that.setData({
            tables_type_list: res.data.tables_type_list,
            yuyuezhuowei_rule_list: res.data.yuyuezhuowei_rule_list
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
    }
});
