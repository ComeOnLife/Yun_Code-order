const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/article/article"
    }
}); // about.js

var api = require("../../api/index.js");

var util = require("../../utils/util.js");

var WxParse = require("../wxParse/wxParse.js");

var app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: app.globalData.baseUrl,
        session_3rd: "",
        article: "",
        title: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            title: options.title || ""
        });
        app.getSession(function(session_3rd) {
            // about
            _my.request({
                url: api.article(),
                data: {
                    session_3rd: session_3rd,
                    id: options.id
                },
                success: function(res) {
                    util.checkCode(res, function(res) {
                        console.log(res);
                        that.setData({
                            article: res.data.article,
                            session_3rd: session_3rd,
                            title: options.title || res.data.article.title
                        });
                        WxParse.wxParse(
                            "article",
                            "html",
                            res.data.article.content,
                            that,
                            5,
                            that.data.baseUrl
                        );
                    });
                }
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;

        _my.setNavigationBarTitle({
            title: that.data.title
        });
    }
});
