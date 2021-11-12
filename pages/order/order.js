const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/order/order"
    }
}); // pages/order/order.js

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
        userInfo: {
            avatarUrl: "/image/user_icon.png",
            nickName: "昵称"
        },
        productList: [],
        hasMoreData: true,
        //是否可以继续加载
        page: 1,
        pageSize: 5,
        type_list: [],
        showRight: true,
        typeIndex: "all",
        typeCur: "",
        showMoreIcon: false,
        //显示正在加载  正在加载数据 防止多次触发
        popupOnShow: false,
        popupCartShow: false,
        popupOrderShow: false,
        scrollFlage: false,
        //禁止页面滚动
        format_list: [],
        formatIndex: 0,
        //选中的规格位置
        dishes: {},
        dishesNum: 1,
        dishesPrice: 0,
        //菜品价格
        subtotal: 0,
        //菜品总价格
        showGrand_total: 0,
        user_subtotal: 0,
        tables: {
            title: "",
            id: ""
        },
        shopping_cart: [],
        animationData: {},
        scene: "",
        //桌位号
        peopleNumber: "",
        sceneName: "",
        remark: "",
        user_number: "",
        oid: "",
        tableware_price: 0,
        //餐具费
        takeaway: "",
        //是否为外卖订单
        appointment: "",
        //是否为预约订单
        onLoadFlage: 2,
        //是否走了onload 接口 1 没有  2 有
        orderMsg: "",
        //来源页面 来自订单详情页， 就不需要走checkTables接口了
        formatIndex1: 0,
        formatIndex2: 0,
        formatIndex3: 0,
        lock: false,
        cartNumLock: false //购物车加减防止多次点击
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        app.getSession(function(session_3rd) {
            app.getUserMsg(session_3rd, function(res) {
                that.setData({
                    userInfo: res.data.user
                });

                if (options.oid) {
                    that.setData({
                        session_3rd: session_3rd,
                        scene: options.scene,
                        oid: options.oid,
                        options: options,
                        orderMsg: options.orderMsg || ""
                    });
                } else {
                    if (options.takeaway) {
                        var appointment = "";

                        if (options.appointment) {
                            appointment = options.appointment;
                        }

                        that.setData({
                            session_3rd: session_3rd,
                            scene: options.scene,
                            takeaway: "takeaway",
                            appointment: appointment,
                            options: options
                        });
                    } else {
                        that.setData({
                            session_3rd: session_3rd,
                            scene: options.scene,
                            options: options
                        });
                    }
                }

                if (that.data.orderMsg) {
                    that.getAllDishesList();
                } else {
                    that.checkTables(
                        options,
                        session_3rd,
                        options.scene,
                        function() {
                            that.getAllDishesList();
                        }
                    );
                }
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        that.animation = util.animation;

        if (that.data.onLoadFlage == 1) {
            var options = that.data.options;
            var session_3rd = that.data.session_3rd; //是否是订单详情来的

            if (that.data.orderMsg) {
                that.getAllDishesList();
            } else {
                that.checkTables(
                    options,
                    session_3rd,
                    options.scene,
                    function() {
                        that.getAllDishesList();
                    }
                );
            }
        }
    },
    checkTables: function(options, session_3rd, tid, cb) {
        //检查桌位是否占用
        var that = this;

        _my.request({
            url: api.Checktables(),
            data: {
                session_3rd: session_3rd,
                tid: tid
            },
            success: function(res) {
                util.checkCode(
                    res,
                    function(res) {
                        typeof cb == "function" && cb(res);
                    },
                    function(err) {
                        //10001
                        _my.showModal({
                            title: "操作失败",
                            content: err.data.msg,
                            showCancel: false,
                            success: function() {
                                _my.reLaunch({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    function(res) {
                        //10003 跳转订单详情
                        that.setData({
                            oid: res.data.oid
                        });

                        _my.redirectTo({
                            url: "/pages/orderMsg/orderMsg?oid=" + res.data.oid
                        });
                    },
                    function() {
                        //10002 重新登录
                        var str = "";

                        for (var i in options) {
                            str += i + "=" + options[i] + "&";
                        }

                        console.log(str);
                        app.appLogin(function(session_3rd) {
                            _my.reLaunch({
                                url: "/pages/order/order?" + str
                            });
                        });
                    }
                );
            }
        });
    },
    bindKeyInput: function(e) {
        var key = e.currentTarget.dataset.key;
        var val = e.detail.value;
        var keyData = new Object();
        val = parseInt(val);
        keyData[key] = val;
        this.setData(keyData);
    },
    createOrderMsg: function() {
        var that = this;
        that.setData({
            onLoadFlage: 1
        });

        _my.navigateTo({
            url:
                "/pages/createOrderMsg/createOrderMsg?scene=" +
                that.data.scene +
                "&takeaway=" +
                that.data.takeaway +
                "&appointment=" +
                that.data.appointment
        });
    },
    seeOrderMsg: function() {
        var that = this;
        that.setData({
            onLoadFlage: 1
        });

        _my.navigateTo({
            url: "/pages/orderMsg/orderMsg?oid=" + that.data.oid + "&see=1"
        });
    },
    getAllDishesList: function() {
        //获得全部产品
        var that = this;

        _my.showLoading({
            title: "正在加载",
            mask: true
        });

        that.getDishesList(function(res) {
            that.setData({
                productList: res.data.results,
                type_list: res.data.dishes_type_list,
                page: that.data.page + 1
            }); //获取购物车列表

            that.getCart();
        });
    },
    getDishesList: function(cb) {
        var that = this;
        var obj = {};
        obj.session_3rd = that.data.session_3rd;
        obj.p = that.data.page;
        obj.rows = that.data.pageSize;

        if (that.data.typeCur && that.data.typeIndex != "all") {
            console.log(that.data.typeCur);
            obj.dtid = that.data.typeCur.id;
        }

        _my,
            _my.request({
                url: api.dishesList(),
                data: obj,
                method: "GET",
                success: function(res) {
                    that.setData({
                        showMoreIcon: false
                    });
                    util.checkCode(res, function(res) {
                        if (cb && typeof cb == "function") {
                            cb(res);
                        } else {
                            var productListTem = that.data.productList;

                            if (that.data.page == 1) {
                                productListTem = [];
                            }

                            var productList = res.data.results;

                            if (productList.length < that.data.pageSize) {
                                that.setData({
                                    productList: productListTem.concat(
                                        productList
                                    ),
                                    hasMoreData: false,
                                    loadFlage: false
                                });
                            } else {
                                that.setData({
                                    productList: productListTem.concat(
                                        productList
                                    ),
                                    hasMoreData: true,
                                    page: that.data.page + 1,
                                    loadFlage: false
                                });
                            }
                        }
                    });
                }
            });
    },
    changeBrand: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;

        if (index == "all") {
            that.setData({
                typeIndex: index,
                hasMoreData: true,
                page: 1,
                showMoreIcon: false,
                loadFlage: false
            });
        } else {
            that.setData({
                typeIndex: index,
                typeCur: that.data.type_list[index],
                hasMoreData: true,
                page: 1,
                showMoreIcon: false,
                loadFlage: false
            });
        }

        this.getDishesList();
    },
    addDishes: function(e) {
        //点击加号按钮
        var that = this;
        var id = e.currentTarget.dataset.id;
        var listIndex = e.currentTarget.dataset.index;

        _my.showLoading({
            title: "正在加载",
            mask: true
        });

        _my.request({
            url: api.dishesItem(),
            data: {
                id: id,
                session_3rd: that.data.session_3rd,
                oid: that.data.oid
            },
            success: function(res) {
                //console.log(res);
                util.checkCode(res, function(res) {
                    // if (res.data.dishes_format_list.length > 0 && res.data.dishes_format_list[0].title =='默认'){
                    //   that.addCart(e,res.data.dishes.id);
                    // }else{
                    //   that.setData({
                    //     popupOnShow: true,
                    //     scrollFlage: true,
                    //     format_list: res.data.format_list,
                    //     dishes: res.data.dishes,
                    //     dishesNum: 1,
                    //     formatIndex: 0,
                    //     dishesPrice: res.data.format_list[0].price,
                    //     listIndex: listIndex
                    //   });
                    // }
                    let format_list = res.data.dishes_format_list;
                    that.setData({
                        popupOnShow: true,
                        scrollFlage: true,
                        format_list: format_list,
                        dishes: res.data.dishes,
                        dishesNum: 1,
                        listIndex: listIndex,
                        formatIndex1: 0,
                        formatIndex2: 0,
                        formatIndex3: 0,
                        dishesPrice:
                            format_list[0].dishes_format_list[0]
                                .dishes_format_list[0].price
                    });
                });
            }
        });
    },
    hidePopup: function(e) {
        this.setData({
            popupOnShow: false,
            scrollFlage: false
        });
    },
    changeFormat: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var key = e.currentTarget.dataset.key;
        var dishesNum = that.data.dishesNum;
        let obj = {};
        obj[key] = index;
        that.setData(obj);
        let formatIndex1 = that.data.formatIndex1;
        let formatIndex2 = that.data.formatIndex2;
        let formatIndex3 = that.data.formatIndex3;
        var price =
            that.data.format_list[formatIndex1].dishes_format_list[formatIndex2]
                .dishes_format_list[formatIndex3].price;
        price = util.numMulti(price, dishesNum);
        that.setData({
            dishesPrice: price
        });
    },
    changeDishesNum: function(e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var dishesNum = that.data.dishesNum;
        let formatIndex1 = that.data.formatIndex1;
        let formatIndex2 = that.data.formatIndex2;
        let formatIndex3 = that.data.formatIndex3;
        var price =
            that.data.format_list[formatIndex1].dishes_format_list[formatIndex2]
                .dishes_format_list[formatIndex3].price;

        if (key == "add") {
            dishesNum = dishesNum + 1;
        } else {
            dishesNum = dishesNum <= 1 ? 1 : dishesNum - 1;
        }

        price = util.numMulti(price, dishesNum);
        that.setData({
            dishesNum: dishesNum,
            dishesPrice: price
        });
    },

    async addCartFormat(e) {
        //添加购物车
        var id = e.currentTarget.dataset.id;
        var that = this;
        var tid = that.data.scene;
        let formatIndex1 = that.data.formatIndex1;
        let formatIndex2 = that.data.formatIndex2;
        let formatIndex3 = that.data.formatIndex3;
        let format_list = that.data.format_list;
        var obj = {
            id: id,
            dishes_format_id:
                format_list[formatIndex1].dishes_format_list[formatIndex2]
                    .dishes_format_list[formatIndex3].id,
            session_3rd: that.data.session_3rd,
            number: that.data.dishesNum
        };

        if (that.data.oid) {
            obj.oid = that.data.oid;
        }

        await api.apiOrderAddShopping(obj);
        that.hidePopup();
        that.getCart();
    },

    getCart: function(cb) {
        var that = this;

        _my: _my.request({
            url: api.getCart(),
            data: {
                tid: that.data.scene,
                session_3rd: that.data.session_3rd,
                oid: that.data.oid
            },
            success: function(res) {
                util.checkCode(
                    res,
                    function(res) {
                        that.setData({
                            subtotal: res.data.subtotal,
                            tables: res.data.tables,
                            shopping_cart: res.data.shopping_cart,
                            tableware_price: res.data.tableware_price,
                            showGrand_total: res.data.subtotal,
                            user_subtotal: res.data.user_subtotal || 0
                        });

                        if (typeof cb == "function") {
                            cb(res);
                        }
                    },
                    function(err) {
                        _my.showModal({
                            title: err.data.msg,
                            showCancel: false
                        });

                        if (typeof cb == "function") {
                            cb(res);
                        }
                    }
                );
            }
        });
    },
    changeCartPopup: function() {
        var that = this;

        if (that.data.popupCartShow) {
            that.animation.bottom(-450).step();
            that.setData({
                animationData: that.animation.export(),
                popupCartShow: false,
                scrollFlage: false
            });
        } else {
            that.animation.bottom(0).step();
            that.setData({
                animationData: that.animation.export(),
                popupCartShow: true,
                scrollFlage: true
            });
        }
    },
    closeCartPopup: function() {
        var that = this;
        that.animation.bottom(-450).step();
        that.setData({
            animationData: that.animation.export(),
            popupCartShow: false,
            scrollFlage: false
        });
    },
    changeCartNum: function(e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var index = e.currentTarget.dataset.index;
        var shopping_cart = that.data.shopping_cart;
        var id = shopping_cart[index].id;
        var curNum = 0;

        if (that.data.cartNumLock) {
            return;
        }

        that.setData({
            cartNumLock: true
        });

        if (key == "add") {
            curNum = shopping_cart[index].number + 1;
        } else {
            if (shopping_cart[index].number <= 1) {
                that.deleteCartItem(id);
                that.setData({
                    cartNumLock: false
                });
                return false;
            } else {
                curNum = shopping_cart[index].number - 1;
            }
        }

        that.changeCarNumber(id, curNum);
    },
    changeCarNumber: function(id, number) {
        var that = this;

        _my.request({
            url: api.changeNumber(),
            data: {
                session_3rd: that.data.session_3rd,
                id: id,
                number: number
            },
            success: function(res) {
                util.checkCode(
                    res,
                    function(res) {
                        that.getCart(function() {
                            that.setData({
                                cartNumLock: false
                            });
                        });
                    },
                    function(res) {
                        _my.showModal({
                            title: "提示",
                            content: res.data.msg,
                            showCancel: false
                        });

                        that.setData({
                            cartNumLock: false
                        });
                    }
                );
            }
        });
    },
    deleteCartItem: function(id) {
        //删除购物车item
        var that = this;

        _my.request({
            url: api.deleteCartItem(),
            data: {
                id: id,
                tid: that.data.tables.id,
                session_3rd: that.data.session_3rd,
                oid: that.data.oid
            },
            success: function(res) {
                util.checkCode(res, function(res) {
                    that.getCart();
                });
            }
        });
    },
    deleteAllCart: function() {
        var that = this;

        _my.showModal({
            title: "确认清空购物车吗？",
            mask: true,
            success: function(res) {
                if (res.confirm) {
                    _my.showLoading({
                        title: "正在提交",
                        mask: true
                    });

                    _my.request({
                        url: api.deleteAllCart(),
                        data: {
                            session_3rd: that.data.session_3rd,
                            tid: that.data.tables.id,
                            oid: that.data.oid
                        },
                        success: function(res) {
                            util.checkCode(res, function(res) {
                                that.getCart();
                                that.changeCartPopup();
                            });
                        }
                    });
                }
            }
        });
    },
    bindPickerPeople: function(e) {
        this.setData({
            peopleNumberArrIndex: e.detail.value
        });
    },
    showOrderCreate: function() {
        var that = this;
        that.setData({
            popupOrderShow: true,
            scrollFlage: true
        });
    },
    hideOrderCreate: function() {
        this.setData({
            popupOrderShow: false,
            scrollFlage: false
        });
    },
    saveDishes: function() {
        //加菜
        var that = this;

        if (that.data.lock) {
            return;
        }

        that.setData({
            lock: true
        });

        _my.request({
            url: api.saveDishes(),
            data: {
                session_3rd: that.data.session_3rd,
                oid: that.data.oid
            },
            success: function(res) {
                util.checkCode(
                    res,
                    function(res) {
                        console.log(res);

                        _my.showToast({
                            title: res.data.msg,
                            mask: true,
                            success: function() {
                                setTimeout(function() {
                                    _my.switchTab({
                                        url: "/pages/orderList/orderList"
                                    });
                                }, 1200);
                            }
                        });
                    },
                    function(res) {
                        that.setData({
                            lock: false
                        });

                        _my.showModal({
                            title: "提示",
                            content: res.data.msg,
                            showCancel: false
                        });
                    }
                );
            }
        });
    },
    previewImg: function(e) {
        console.log(e);
        var imgUrl = e.currentTarget.dataset.url;
        var imgArr = [];
        imgArr.push(imgUrl);

        _my.previewImage({
            urls: imgArr // 需要预览的图片http链接列表
        });
    }
});
