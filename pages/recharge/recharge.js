const _Page = require("../../__antmove/component/componentClass.js")("Page");
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/recharge/recharge"
    }
}); // pages/recharge/recharge.js

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
        account: "",
        user_charge: "",
        url: "",
        //来源页面
        rule_list: [],
        lock: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    chargeNum: function(e) {
        this.setData({
            account: e.detail.value
        });
    },
    recharge: function(e) {
        // var that = this;
        // var rid = e.currentTarget.dataset.id;
        // console.log(e);
        // if (!rid) {
        //   wx.showToast({
        //     title: '操作失败，请重试',
        //     image: '/image/tip.png'
        //   });
        //   return false;
        // }
        // if(that.data.lock){
        //   return;
        // }
        // that.setData({
        //   lock:true
        // })
        // apiMemberRecharge
        let param = {
            id: app.globalData.memberInfo.memberId,
            tenantId: api.kTenantId,
            storesId: app.globalData.selectStoreId,
            rechargeWay: "2",
            rechargeMoney: this.data.account
        };
    }
});
