const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/takeoutTables/takeoutTables"
    }
}); // pages/takeoutTables/takeoutTables.js

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
        tables: {},
        appointment: "",
        phoneNumber: "",
        storeId: "",
        productList: [],
        selectClassifyList: [],
        currentTab: 0,
        showShopCart: false,
        hiddenPop: true,
        shopCartList: [],
        totalPrice: 0,
        totalNumber: 0,
        tableNo: "1",
        tableNoStr: "快餐桌位",
        // 2: 扫码  1: 店内就餐  3:打包带走
        buyType: "1",
        creatOrderFinish: false,
        serviceTime: "",
        addSnacks: false,
        //是否加菜
        arry: [
            "加菜",
            "1人",
            "2人",
            "3人",
            "4人",
            "5人",
            "6人",
            "7人",
            "8人",
            "9人",
            "10人",
            "11人",
            "12人",
            "13人",
            "14人",
            "15人",
            "16人",
            "17人",
            "18人",
            "19人",
            "20人",
            "21人",
            "22人",
            "23人",
            "24人",
            "25人",
            "26人",
            "27人",
            "28人",
            "29人",
            "30人"
        ],
        indexs: 0,
        isShow: false,
        //控制选择弹框的显示和隐藏
        classInfo: "1" //选择几人就餐
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        console.log(app.globalData);
        this.setData({
          shopCartList: []
        })

        if (options.buyType == "1" || options.buyType == "2") {
            if (options.addSnacks == "加菜") {
                this.setData({
                    isShow: false,
                    addSnacks: true,
                    classInfo: 0
                });
            } else {
                this.setData({
                    isShow: true
                });
            }
        }

        var that = this;
        var appointment = 0; //外卖

        if (options.appointment) {
            appointment = 1; //预约
        } // if(options.addSnacks == '加菜') {
        //   this.setData({
        //     addSnacks: true
        //   })
        // }

        this.data.storeId = options.storeId;
        this.data.buyType = options.buyType;
        this.data.serviceTime = options.serviceTime ? options.serviceTime : "";

        if (options.tableNo) {
            this.setData({
                tableNoStr: options.tableNo,
                tableNo: options.tableNo,
                phoneNumber: app.globalData.userPhoneNumber
                    ? app.globalData.userPhoneNumber
                    : ""
            });
        } else {
            this.setData({
                phoneNumber: app.globalData.userPhoneNumber
                    ? app.globalData.userPhoneNumber
                    : ""
            });
        } // this.data.storeId = '8aaed99f62c0134601633d8d828278a6';
        if(app.globalData.tableNo) {
          this.setData({
            tableNoStr: app.globalData.tableNo,
            tableNo: app.globalData.tableNo,
            buyType: '2',
            storeId: app.globalData.storeId
          })
        }
        this.getProductList();
    },
    onShow: function() {
        if (this.data.creatOrderFinish) {
            this.emptyShopCartHandle();
        }
    },

    //添加就餐人数提示框
    addBind(e) {
        console.log(e);
        this.setData({
            classInfo: e.currentTarget.id
        });
    },

    //点击取消
    addCancel() {
        // wx.switchTab({
        //   url: '/pages/index/index',
        // })
        this.setData({
            isShow: false
        });
    },

    //点击确定
    addDetermine(e) {
        this.setData({
            isShow: false
        });
    },

    /*
     * 获取手机号
     */
    getPhoneNumber(e) {
        _my.showLoading();

        let that = this;
        let encryptedData = e.detail.encryptedData;
        let iv = e.detail.iv;

        _my.login({
            success(res) {
                if (!res.code) {
                    _my.hideLoading();

                    return;
                }

                let param = {
                    tenantId: api.kTenantId,
                    encryptedData: encryptedData,
                    iv: iv,
                    code: res.code
                };
                util.request(
                    "POST",
                    param,
                    api.apiGetWxUserPhone,
                    success => {
                        let phone = success;

                        if (phone) {
                            that.setData({
                                phoneNumber: phone
                            });

                            _my.setStorageSync("userPhoneNumber", phone);

                            app.globalData.userPhoneNumber = phone;
                        }

                        that.placeOrder();

                        _my.hideLoading();
                    },
                    successError => {
                        _my.hideLoading();

                        that.placeOrder();
                    },
                    fail => {
                        _my.hideLoading();

                        that.placeOrder();
                    }
                );
            },

            fail(res) {
                _my.hideLoading();

                that.placeOrder();
            }
        });
    },

    /**
     *
     */
    gotoHome() {
        my.switchTab({
          url: '../index/index'
        })
    },

    /**
     * 图片预览
     */
    previewImage(e) {
        console.log(e);
        let urlStr = e.currentTarget.dataset.url;

        if (urlStr.indexOf("http") != -1) {
            _my.previewImage({
                urls: [urlStr]
            });
        }
    },

    // 下单
    placeOrder() {
        if (this.data.totalNumber == 0) {
            return;
        }

        let that = this;

        if (!app.globalData.openId) {
            _my.showLoading({
                title: "加载中..."
            });

            _my.login({
                success(res) {
                    if (!res.code) {
                        _my.hideLoading();

                        return;
                    }

                    let parma = {
                        code: res.code,
                        tenantId: api.kTenantId
                    };
                    util.request(
                        "GET",
                        parma,
                        api.apiGetOpenId,
                        success => {
                            app.globalData.openId = success.openId;
                            app.globalData.sessionKey = success.sessionKey;
                            that.placeOrderHandle();

                            _my.hideLoading();
                        },
                        successError => {
                            _my.hideLoading();
                        },
                        fail => {
                            _my.hideLoading();
                        }
                    );
                }
            });
        } else {
            this.placeOrderHandle();
        }
    },

    // 下单操作
    placeOrderHandle() {
        let encode = encodeURIComponent(JSON.stringify(this.data.shopCartList));
        let totalPrice = this.data.totalPrice;
        let storeId = this.data.storeId;
        let tableNo = this.data.tableNo;
        let buyType = this.data.buyType;
        let serviceTime = this.data.serviceTime;

        _my.navigateTo({
            url:
                "../createOrderMsg/createOrderMsg?takeaway=takeaway&goodsList=" +
                encode +
                "&totalPrice=" +
                totalPrice +
                "&storeId=" +
                storeId +
                "&tableNo=" +
                tableNo +
                "&buyType=" +
                buyType +
                "&serviceTime=" +
                serviceTime +
                "&addSnacks=" +
                this.data.addSnacks +
                "&indexs=" +
                this.data.classInfo
        });
    },

    // 添加商品到购物车
    addCart(e) {
      console.log(e);
      
        let currentItem = e.currentTarget.dataset.item;
        let needAdd = true;
        let array = this.data.shopCartList;
        var totalPrice = 0.0;
        var totalNumber = 0;

        for (const key in array) {
            let item = array[key];

            if (item.id == currentItem.id) {
                item.number += 1;
                currentItem.number = item.number;
                needAdd = false;
            }

            let price = util.numMulti(item.price, item.number);
            totalPrice = util.numAdd(price, totalPrice);
            totalNumber += item.number;
        }

        if (needAdd) {
            currentItem.number = 1;
            totalNumber += currentItem.number;
            let price = util.numMulti(currentItem.price, currentItem.number);
            totalPrice = util.numAdd(price, totalPrice);
            array.splice(0, 0, currentItem);
        } // 列表数据

        let currentIndex = 0;
        let needReple = false;
        let selectArray = this.data.selectClassifyList;
        let leftTotalNumber = 0;

        for (const key in selectArray) {
            let item = selectArray[key];

            if (item.id == currentItem.id) {
                needReple = true;
                currentIndex = key;
                leftTotalNumber += currentItem.number;
            } else {
                if (item.number) {
                    leftTotalNumber += item.number;
                }
            }
        }

        if (needReple) {
            selectArray[currentIndex] = currentItem;
        } // 左边的数据

        let productList = this.data.productList;
        let leftItem = productList[this.data.currentTab];
        leftItem.totalSelectNumber = leftTotalNumber;
        this.setData({
            totalPrice: totalPrice,
            shopCartList: array,
            totalNumber: totalNumber,
            selectClassifyList: selectArray,
            productList: productList
        });
    },

    // 清空商品
    emptyShopCart() {
        let that = this;

        _my.showModal({
            title: "确定清空购物车吗?",

            success(res) {
                if (res.confirm) {
                    that.emptyShopCartHandle();
                }
            }
        });
    },

    emptyShopCartHandle() {
        /// 清空所有选中
        let productList = this.data.productList;

        for (const key in productList) {
            let leftModel = productList[key];
            leftModel.totalSelectNumber = 0;
            let foods = leftModel.foods;

            for (const foodKey in foods) {
                let item = foods[foodKey];
                item.number = 0;
            }
        }

        let selectArray = this.data.selectClassifyList;

        for (const key in selectArray) {
            let item = selectArray[key];
            item.number = 0;
        }

        this.setData({
            totalPrice: 0,
            shopCartList: [],
            totalNumber: 0,
            productList: productList,
            selectClassifyList: selectArray,
            creatOrderFinish: false
        });
        this.onClose();
    },

    // 回收车添加商品
    cartAddShop(e) {
        let currentItem = e.currentTarget.dataset.item;
        let array = this.data.shopCartList;
        var totalPrice = 0.0;

        for (const key in array) {
            let item = array[key];

            if (item.id == currentItem.id) {
                item.number += 1;
            }

            let price = util.numMulti(item.price, item.number);
            totalPrice = util.numAdd(price, totalPrice);
        }

        this.setData({
            totalPrice: totalPrice,
            shopCartList: array,
            totalNumber: array.length
        });
    },

    // 回收车减少商品
    cartReduceShop(e) {
        let currentItem = e.currentTarget.dataset.item;
        let array = this.data.shopCartList;
        var totalPrice = 0.0;
        var totalNumber = 0;
        let nArray = [];

        for (const key in array) {
            let item = array[key];

            if (item.id == currentItem.id) {
                item.number -= 1;

                if (item.number <= 0) {
                    item.number = 0;
                }

                currentItem.number = item.number;
            }

            if (item.number > 0) {
                nArray.push(item);
            }

            let price = util.numMulti(item.price, item.number);
            totalPrice = util.numAdd(price, totalPrice);
            totalNumber += item.number;
        } // 列表数据

        let currentIndex = 0;
        let needReple = false;
        let selectArray = this.data.selectClassifyList;
        let leftTotalNumber = 0;

        for (const key in selectArray) {
            let item = selectArray[key];

            if (item.id == currentItem.id) {
                needReple = true;
                currentIndex = key;
            }

            if (item.number) {
                leftTotalNumber += item.number;
            }
        } // 左边的数据

        let productList = this.data.productList;

        for (const key in productList) {
            let leftModel = productList[key];
            let totalSelectNumber = 0;
            let foods = leftModel.foods;

            for (const foodKey in foods) {
                let item = foods[foodKey];

                if (item.id == currentItem.id) {
                    item.number = currentItem.number;
                }

                if (item.number) {
                    totalSelectNumber += item.number;
                }
            }

            leftModel.totalSelectNumber = totalSelectNumber;
        }

        if (needReple) {
            selectArray[currentIndex] = currentItem;
        }

        this.setData({
            totalPrice: totalPrice,
            shopCartList: nArray,
            totalNumber: totalNumber,
            //  nArray.length,
            selectClassifyList: selectArray,
            productList: productList
        });
    },

    // 显示弹窗
    showShopList: function() {
        this.setData({
            hiddenPop: false,
            showShopCart: true
        });
    },
    // 隐藏弹窗
    onClose: function() {
      console.log('123');
      
        this.setData({
            showShopCart: false
        });
        let that = this;
        setTimeout(function() {
            that.setData({
                hiddenPop: true
            });
        }, 300);
    },
    // 点击左边的bar
    leftNavBarClick: function(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            currentTab: index,
            selectClassifyList: this.data.productList[index].foods
        });
    },

    /**
     * 获取商品列表 buyer/product/list
     */
    getProductList() {
        let that = this;
        let param = {
            storeId: that.data.storeId
        };
        util.request(
            "POST",
            param,
            api.apiProductList,
            success => {
                that.setData({
                    productList: success,
                    selectClassifyList: success[that.data.currentTab].foods
                });
            },
            successError => {},
            fail => {}
        );
    },

    /**
     * old req
     */
    oldRequest() {
        app.getSession(function(session_3rd) {
            _my.request({
                url: api.takeoutTables(),
                data: {
                    session_3rd: session_3rd,
                    appointment: appointment
                },
                success: function(res) {
                    _my.hideLoading();

                    if (
                        res.statusCode == "404" ||
                        res.statusCode == "500" ||
                        res.statusCode == 404
                    ) {
                        _my.redirectTo({
                            url: "/pages/404/404"
                        });
                    } else {
                        if (res.data.code == "10002") {
                            console.log("拦截请求登录");
                            var app = getApp();
                            app.appLogin(function(session_3rd) {
                                console.log("重新刷新页面");
                                var str = "";

                                for (var i in options) {
                                    str += i + "=" + options[i] + "&";
                                }

                                _my.reLaunch({
                                    url:
                                        "/pages/takeoutTables/takeoutTables?" +
                                        str
                                });
                            });
                        } else if (res.data.code == "10001") {
                            _my.showModal({
                                title: res.data.msg,
                                showCancel: false
                            });
                        } else {
                            that.setData({
                                tables: res.data.tables
                            });

                            if (appointment) {
                                _my.redirectTo({
                                    url:
                                        "/pages/order/order?scene=" +
                                        that.data.tables.id +
                                        "&takeaway=takeaway&appointment=1"
                                });
                            } else {
                                _my.redirectTo({
                                    url:
                                        "/pages/order/order?scene=" +
                                        that.data.tables.id +
                                        "&takeaway=takeaway"
                                });
                            }
                        }
                    }
                }
            });
        });
    }
});
