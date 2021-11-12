const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/commentAdd/commentAdd"
    }
}); // addComment.js

var api = require("../../api/index.js");

var util = require("../../utils/util.js");

var app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        goods_code: "",
        oCode: "",
        files: [],
        cursor: 0,
        textAreaVal: "",
        baseUrl: app.globalData.baseUrl,
        session_3rd: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        console.log(options);
        app.getSession(function(session_3rd) {
            that.setData({
                goods_code: options.goods_code,
                oCode: options.oCode,
                session_3rd: session_3rd
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},
    chooseImage: function(e) {
        var that = this;
        var session_3rd = that.data.session_3rd;
        api.uploadImg(session_3rd, function(res) {
            //console.log(res);
            that.setData({
                files: that.data.files.concat(res.data.img_url)
            });
        });
    },
    previewImage: function(event) {
        var that = this;
        var files = [];
        that.data.files.forEach(function(item) {
            files.push(that.data.baseUrl + item);
        });

        _my.previewImage({
            current: event.currentTarget.dataset.src,
            // 当前显示图片的http链接
            urls: files // 需要预览的图片http链接列表
        });
    },
    textVal: function(e) {
        console.log(e);
        var that = this;
        that.setData({
            cursor: e.detail.cursor,
            textAreaVal: e.detail.value
        });
    },
    submitComment: function(e) {
        var that = this;

        if (!that.data.textAreaVal && that.data.files.length <= 0) {
            _my.showToast({
                title: "内容或图片至少输入一种",
                icon: "none"
            });

            return false;
        }

        _my.showLoading({
            title: "正在加载"
        });

        _my.request({
            url: api.saveComment(),
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                session_3rd: that.data.session_3rd,
                code: that.data.goods_code,
                oCode: that.data.oCode,
                content: that.data.textAreaVal || "",
                img_urls:
                    that.data.files.length > 0 ? that.data.files.join(",") : ""
            },
            success: function(res) {
                util.checkCode(res, function(res) {
                    _my.showModal({
                        title: res.data.msg,
                        showCancel: false,
                        success: function(res) {
                            _my.navigateBack({
                                delta: 1
                            });
                        }
                    });
                });
            }
        });
    }
});
