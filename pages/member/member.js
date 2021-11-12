const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/member/member"
    }
}); // pages/member/member.js

const api = require("../../api/index.js");

const util = require("../../utils/util.js");

const app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: "",
        phone: "",
        birthday: "",
        gender: "",
        genderNumber: 1,
        genderList: ["男", "女"],
        loadFinsh: false,
        memberUser: false
    },

    /*
     * 注册会员
     */
    registerMember() {
        _my.showModal({
            title: "亲~会员注册需前往收银台注册",
            showCancel: "false"
        });

        return;

        if (this.data.name.length == 0) {
            _my.showToast({
                title: "请输入姓名",
                icon: "none"
            });

            return;
        }

        if (this.data.phone.length == 0) {
            _my.showToast({
                title: "请输入手机号",
                icon: "none"
            });

            return;
        }

        if (this.data.birthday.length == 0) {
            _my.showToast({
                title: "请选择您的生日",
                icon: "none"
            });

            return;
        }

        if (this.data.gender.length == 0) {
            _my.showToast({
                title: "请选择您的性别",
                icon: "none"
            });

            return;
        }

        _my.showLoading({
            title: "注册中"
        });

        let param = {
            storeId: app.globalData.storeId,
            phone: this.data.phone,
            birthday: this.data.birthday,
            sex: this.data.genderNumber,
            name: this.data.name
        };
        let that = this;
        util.request(
            "POST",
            param,
            api.apiRegisterMember,
            success => {
                _my.setStorageSync("userPhoneNumber", that.data.phone);

                app.globalData.phoneNumber = that.data.phone;

                _my.hideLoading();

                _my.navigateBack({
                    delta: 0
                });
            },
            successError => {
                _my.hideLoading();

                _my.showToast({
                    title: "注册失败,请重试",
                    icon: "error"
                });
            },
            fail => {
                _my.hideLoading();

                _my.showToast({
                    title: "注册失败,请重试",
                    icon: "error"
                });
            }
        );
    },

    /*
     * 性别 bindBirthdayChange
     */
    bindGenderChange: function(e) {
        let value = e.detail.value;
        this.setData({
            gender: this.data.genderList[value],
            genderNumber: value + 1
        });
    },

    /*
     * 生日
     */
    bindBirthdayChange: function(e) {
        let value = e.detail.value;
        this.setData({
            birthday: value
        });
    },
    bindKeyInput: function(e) {
        console.log(e);
        var key = e.currentTarget.dataset.key;
        var val = e.detail.value;
        var keyData = new Object();
        keyData[key] = val;
        this.setData(keyData);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        let phone = options.phone; //  this.data.phone = phone

        this.setData({
            phone: phone
        }); // 获取会员信息

        let param = {
            storeId: app.globalData.storeId,
            phone: phone
        };
        let that = this;
        util.request(
            "POST",
            param,
            api.apiGetMember,
            success => {
                //  that.data.memberInfo = success
                that.setData({
                    name: success.name,
                    phone: success.phone,
                    birthday: success.birthDay,
                    gender: success.sex,
                    loadFinsh: true,
                    memberUser: true
                });
                app.globalData.memberInfo = success;
            },
            successError => {
                that.setData({
                    loadFinsh: true,
                    memberUser: false
                });
            },
            fail => {
                that.setData({
                    loadFinsh: true,
                    memberUser: false
                });
            }
        );
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
});
