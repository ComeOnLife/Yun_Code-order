const _Page = require("../../../__antmove/component/componentClass.js")("Page");
const _my = require("../../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/paidui/faqi/faqi"
    }
}); // pages/paidui/faqi/faqi.js

const api = require("../../../api/index.js");

const util = require("../../../utils/util.js");

const app = getApp();

_Page({
    data: {
        session_3rd: "",
        baseUrl: app.globalData.baseUrl,
        list: [],
        lock: false,
        curId: "",
        //选中的ID,
        show: false,
        //控制下拉列表的显示隐藏，false隐藏、true显示
        selectData: ["", "1", "2", "3", "4", "5", "6"],
        //下拉列表的数据
        index: 0 //选择的下拉列表下标
    },

    // 点击下拉显示框
    selectTap() {
        this.setData({
            show: !this.data.show
        });
    },

    // 点击下拉列表
    optionTap(e) {
        let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标

        this.setData({
            index: Index,
            curId: Index,
            show: !this.data.show
        });
    },

    onLoad: function(options) {
        let that = this;
        app.getSession(session_3rd => {
            this.setData({
                session_3rd: session_3rd
            });
            that.getShop(function() {
                that.apiPaidui();
            });
        });
    },

    async apiPaiduiSave() {
        let that = this;
        let obj = {
            session_3rd: that.data.session_3rd,
            id: that.data.curId
        };
        console.log(that.data);

        if (!that.data.curId) {
            _my.showToast({
                title: "请先选择就餐人数",
                icon: "none"
            });

            return;
        }

        setTimeout(function() {
            _my.redirectTo({
                url: "/pages/paidui/jieguo/jieguo"
            });
        }, 800);

        if (that.data.lock) {
            return;
        }

        that.setData({
            lock: true
        });

        try {
            let res = await api.apiPaiduiSave(obj);
            that.requestSubscribeMessage(function() {
                _my.showToast({
                    title: "操作成功",
                    success: function() {
                        setTimeout(function() {
                            _my.redirectTo({
                                url: "/pages/paidui/jieguo/jieguo"
                            });
                        }, 800);
                    }
                });
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

    requestSubscribeMessage(cb) {
        //申请订阅消息
        let that = this;
        let template_id_paidui = that.data.business.template_id_paidui || "";

        if (!template_id_paidui) {
            typeof cb == "function" && cb();
            return;
        }

        _my.requestSubscribeMessage({
            tmplIds: [template_id_paidui],

            success(res) {
                console.log(res);
                typeof cb == "function" && cb();
            },

            fail: function(res) {
                console.log(res);
                typeof cb == "function" && cb();
            }
        });
    },

    chooseItemFunc(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id;
        this.setData({
            curId: id
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

    async apiPaidui() {
        let obj = {
            session_3rd: this.data.session_3rd
        };
        let res = await api.apiPaidui(obj);
        this.setData({
            list: res.data.list
        });
    }
});
