const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/orderMsg/orderMsg"
    }
});

const { apiGetRecipe } = require("../../api/index.js"); // pages/orderMsg/orderMsg.js

const api = require("../../api/index.js");

const util = require("../../utils/util.js");

const app = getApp();

_Page({
    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: app.globalData.baseUrl,
        session_3rd: "",
        oid: "",
        orders: "",
        dishes_list: [],
        userInfo: {
            avatarUrl: "/image/user_icon.png",
            nickName: "昵称"
        },
        showRight: true,
        tables: {
            type: "",
            title: "",
            code: ""
        },
        tables_list: [],
        tableIndex: 0,
        url: "",
        //判断是否来源个人中心 true 是
        see: "",
        //判断是否来源 加菜页面  true
        shop: "",
        goodID: [],
        //菜品id
        recipe: [],
        //做法,
        ingredients: [],
        //口味
        orderDetaiModel: null,
        isSnacks: false,
        //是否显示加菜
        storeId: "",
        tableNo: "",
        feeSum: 0,
        //餐位总额
        fee: 0 ,//餐位费
        openid: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.data.oid = options.oid; //'1620227691070499464' //'1620225116807989527'
        this.setData({
          openid: options.openid
        })
        this.getOrderDetaiReq();
    },

    // 加菜
    snackstop() {
        console.log("123");

        _my.navigateTo({
            url:
                "/pages/takeoutTables/takeoutTables?storeId=" +
                this.data.storeId +
                "&tableNo=" +
                this.data.tableNo +
                "&buyType=1" +
                "&addSnacks=加菜"
        });
    },

    // 立即支付
    payNow() {
        _my.showLoading();

        let that = this;
        let param = {
            orderId: that.data.oid
        };
        util.request(
            "GET",
            param,
            api.apiGetAliPayInfo,
            success => {
              console.log(success);
              
                _my.hideLoading();

                that.payOrder(success);
            },
            successError => {
                _my.hideLoading();

                _my.showModal({
                    title: "提示",
                    content: successError.msg,
                    showCancel: false
                });
            },
            fail => {
                _my.hideLoading();

                _my.showModal({
                    title: "提示",
                    content: "操作失败,请重试",
                    showCancel: false
                });
            }
        );
    },

    // 支付
    payOrder: function(param) {
        console.log(param);
        let that = this;

        my.tradePay({
          // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          tradeNO: param,
          success: (res) => {
            console.log(res);
            that.getOrderDetaiReq();
          },
          fail: res => {
            my.alert({
              content: JSON.stringify(res),
            })
          }
        })
    },

    // 获取订单详情
    getOrderDetaiReq() {
        let that = this;
        let param = {
            orderId: this.data.oid,
            openid: this.data.openid
        };
        util.request(
            "GET",
            param,
            api.apiOrderDetail,
            success => {
                console.log(success);
                success.createTimeStr = util.formatDate(
                    success.createTime * 1000
                );
                success.status =
                    success.payStatus == ("待支付" || "支付失败") ? 0 : 1;
                that.setData({
                    orderDetaiModel: success,
                    goodID: success.orderDetailList,
                    storeId: success.storeId,
                    tableNo: success.tableNo
                });
                var data = Date.now()
                    .toString()
                    .slice(0, 10); //当前时间段的时间戳

                if (
                    success.payStatus == "支付成功" &&
                    success.createTime + 10800 >= data
                ) {
                    // if(success.createTime + 10800 >= data){
                    this.setData({
                        isSnacks: true
                    });
                } //计算餐位总额

                var addsum = 0;
                success.orderDetailList.forEach(item => {
                    addsum = addsum + item.productPrice * item.productQuantity;
                });
                this.setData({
                    feeSum: success.mealFee
                });
            },
            successError => {},
            fail => {}
        );
    },

    //获取做法和口味的数据
    // apiGetRecipe() {
    //     let iid = this.data.goodID
    //     var arr =[]
    //     console.log(iid);
    //     iid.forEach((item) => {
    //       arr.push(item.productId)
    //       this.setData({
    //         goodID: arr
    //       })
    //       console.log(arr)
    //     })
    //      util.request('GET', param, api.apiGetRecipe, (success) => {
    //    console.log(success);
    //    this.setData({
    //      // recipe: success.recipe[0].recipeName,
    //      ingredients: success.ingredients
    //    }),(successError) => {
    //      wx.hideLoading()
    //      wx.showModal({
    //        title:'提示',
    //      })
    //    }, (fail) => {
    //      wx.hideLoading()
    //    }
    //  })
    //   },
    getOrderMsg: function(cb, stopPull) {
        var that = this;

        _my.request({
            url: api.orderMsg(),
            data: {
                id: that.data.oid,
                session_3rd: that.data.session_3rd
            },
            success: function(res) {
                util.checkCode(res, function(res) {
                    that.setData({
                        orders: res.data.orders,
                        dishes_list: res.data.item_list,
                        tables: res.data.tables
                    });
                    typeof cb == "function" && cb(res);

                    if (stopPull) {
                        _my.stopPullDownRefresh();
                    }
                });
            }
        });
    },
    getShop: function() {
        var that = this;

        _my.request({
            url: api.shop(),
            data: {
                session_3rd: that.data.session_3rd
            },
            success: function(res) {
                util.checkCode(res, function(res) {
                    that.setData({
                        shop: res.data.shop
                    });
                });
            }
        });
    },
    delOrder: function() {
        var that = this;

        _my.showModal({
            title: "确定删除订单吗？",
            success: function(res) {
                if (res.confirm) {
                    _my.request({
                        url: api.delOrder(),
                        data: {
                            id: that.data.oid,
                            session_3rd: that.data.session_3rd
                        },
                        success: function(res) {
                            util.checkCode(res, function(res) {
                                _my.showToast({
                                    title: "删除成功",
                                    mask: true,
                                    success: function(res) {
                                        setTimeout(function() {
                                            if (that.data.url) {
                                                _my.reLaunch({
                                                    url: "/pages/user/user"
                                                });
                                            } else {
                                                _my.navigateBack({
                                                    delta: 1
                                                });
                                            }
                                        }, 1800);
                                    }
                                });
                            });
                        }
                    });
                }
            }
        });
    },
    checkJiacan: function() {
        var that = this;

        if (that.data.see) {
            _my.navigateBack({
                delta: 1
            });
        } else {
            var scene = that.data.orders.tables_id;
            var oid = that.data.orders.id;

            _my.navigateTo({
                url:
                    "/pages/order/order?scene=" +
                    scene +
                    "&oid=" +
                    oid +
                    "&orderMsg=orderMsg"
            });
        }
    },
    callTel: function(e) {
        var telPhone = e.currentTarget.dataset.tel;

        if (!telPhone) {
            _my.showToast({
                title: "暂时还没有填写电话",
                icon: "none"
            });

            return false;
        }

        _my.showModal({
            title: "请拨打电话",
            content: "取消订单，需联系客服，点击确定将拨打电话" + telPhone,
            success: function(res) {
                if (res.confirm) {
                    _my.makePhoneCall({
                        phoneNumber: telPhone
                    });
                }
            }
        });
    },
    onPullDownRefresh: function() {
        // this.getOrderMsg(null,true);
        setTimeout(() => {
            _my.stopPullDownRefresh();
        });
    }
});
