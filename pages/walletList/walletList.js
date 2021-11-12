const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/walletList/walletList"
    }
}); // pages/walletList/walletList.js

const api = require("../../api/index.js");

const util = require("../../utils/util.js");

const app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        session_3rd: "",
        baseUrl: app.globalData.baseUrl,
        url: "",
        urlFlage: "",
        pageSize: 10,
        page: 1,
        hasMoreData: true,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        app.getSession(function(session_3rd) {
            that.setData({
                session_3rd: session_3rd
            });

            if (options.url == "log") {
                that.setData({
                    session_3rd: session_3rd,
                    url: api.chargeLog(),
                    urlFlage: options.url
                });

                _my.setNavigationBarTitle({
                    title: "钱包明细"
                });
            } else {
                that.setData({
                    session_3rd: session_3rd,
                    url: api.chargeList(),
                    urlFlage: options.url
                });

                _my.setNavigationBarTitle({
                    title: "充值记录"
                });
            }

            that.chargeList();
        });
    },
    chargeList: function() {
        var that = this;
        var that = this;

        _my.showLoading({
            title: "正在加载"
        });

        var data = {
            session_3rd: that.data.session_3rd,
            url: that.data.url,
            p: that.data.page,
            rows: that.data.pageSize
        };

        _my.request({
            url: that.data.url,
            data: data,
            success: function(res) {
                util.checkCode(res, function(res) {
                    var listTem = that.data.list;

                    if (that.data.page == 1) {
                        listTem = [];
                    }

                    var list = res.data.results.list;

                    if (list.length < that.data.pageSize) {
                        that.setData({
                            list: listTem.concat(list),
                            hasMoreData: false
                        });
                    } else {
                        that.setData({
                            list: listTem.concat(list),
                            hasMoreData: true,
                            page: that.data.page + 1
                        });
                    } //隐藏加载

                    _my.hideToast();
                });
            }
        });
    },
    onReachBottom: function() {
        if (this.data.hasMoreData) {
            this.chargeList();
        }
    }
});
