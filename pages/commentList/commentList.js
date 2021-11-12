const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/commentList/commentList"
    }
}); // pages/commentList/commentList.js

const api = require("../../api/index.js");

const util = require("../../utils/util.js");

const app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        session_3rd: "",
        commentList: [],
        baseUrl: app.globalData.baseUrl,
        pageSize: 2,
        page: 1,
        hasMoreData: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    onShow() {
        var that = this;
        app.getSession(function(session_3rd, userInfo) {
            that.setData({
                session_3rd: session_3rd,
                userInfo: userInfo
            });
            that.shopComment();
        });
    },

    shopComment: function(shopPull) {
        var that = this;

        if (shopPull) {
            that.setData({
                page: 1
            });
        }

        var data = {
            session_3rd: that.data.session_3rd,
            p: that.data.page,
            rows: that.data.pageSize
        };
        api.shopCommentList(data, function(res) {
            if (shopPull) {
                _my.stopPullDownRefresh();
            }

            var commentListItem = that.data.commentList;

            if (that.data.page == 1) {
                commentListItem = [];
            }

            var commentList = res.data.results.list;

            if (commentList.length < that.data.pageSize) {
                that.setData({
                    commentList: commentListItem.concat(commentList),
                    hasMoreData: false
                });
            } else {
                that.setData({
                    commentList: commentListItem.concat(commentList),
                    hasMoreData: true,
                    page: that.data.page + 1
                });
            } //隐藏加载

            _my.hideToast();
        });
    },
    showCommentImg: function(event) {
        var that = this;
        var commentImgList = event.currentTarget.dataset.list;
        var commentImgListNew = [];
        commentImgList.forEach(function(item) {
            item = util.imageFilter(item, that.data.baseUrl);
            commentImgListNew.push(item);
        });

        _my.previewImage({
            current: event.currentTarget.dataset.src,
            // 当前显示图片的http链接
            urls: commentImgListNew // 需要预览的图片http链接列表
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.shopComment(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.hasMoreData) {
            this.shopComment();
        }
    }
});
