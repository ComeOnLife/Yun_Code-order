const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/createOrderMsg/createOrderMsg"
    }
}); // pages/createOrderMsg/createOrderMsg.js

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
        remark: "",
        remarkFlage: "",
        user_number: "1人",
        userList: [
            "加菜",
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30
        ],
        user_number_index: 0,
        user_add: "1人",
        scene: "",
        subtotal_coupon: 0,
        oneTable: "",
        //单人餐位费
        tables: 0,
        //餐位费总计
        shopping_cart: [],
        tableware_price: "",
        subtotal: "",
        // 商品总计金额
        default_total_price: "",
        // 默认总金额
        showGrand_total: "",
        // 待支付
        takeaway_price: "0",
        // 配送费
        coupon_saving: "0",
        // 满减优惠
        popupShow: false,
        take_name: "",
        take_mobile: "",
        take_address: "",
        take_date: "",
        //配送时间
        showRight: "showRight",
        peisongCur: "cur",
        //配送
        zitiCur: "",
        //自提
        take_own: 1,
        //配送
        takeaway: "",
        //是否为外卖订单
        takeaway_distribution_status: "1",
        //外卖配送
        takeaway_own_status: "1",
        //外卖自提
        appointment: "appointment",
        lock: false,
        // 2: 扫码  1: 店内就餐  3:打包带走
        buyType: null,
        diningList: ["店内就餐", "打包带走"],
        diningType: "店内就餐",
        diningIndex: 0,
        // 出餐时间
        takeOutTime: "",
        tableNo: "1",
        // 桌号
        storeId: "",
        //门店id
        orderId: null,
        payInfo: null,
        serviceTime: "",
        // 营业时间
        minTime: "",
        memberOrders: false,
        // 会员下单
        didChangeMemberOrder: false,
        // 是否改变了会员付款的方式
        maxTime: "",
        discount: 0,
        // 会员折扣
        discountedPrice: 0,
        // 优惠金额
        submitGoods: [],
        // 需要提交的商品
        phoneNumber: "",
        getPhoneNumFrequency: 0,
        // 获取手机号的次数 1
        newIshwo: false,
        //商家是否需要新增餐位费和用餐人数
        iid: "1",
        //商品id
        shopSun: 0,
        //商品和餐位费总额
        addSnacks: false, //是否加菜
        codes: '', //用于获取用户唯一标识
        openid: '', //用户唯一标识
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        console.log(app.globalData);
        my.getAuthCode({
        scopes: 'auth_base', 
      success:(res) =>{
        console.log(res);
        let paramDate = {
          storeId:options.storeId,
          code: res.authCode
        }
        util.request(
            "POST",
            paramDate,
            api.user_openid,
            res => {
              console.log(res);
              this.setData({
                openid: res
              })
            }
        )
      }
})
        
        this.setData({
            addSnacks: options.addSnacks //是否加菜
        }); // if(options.addSnacks == 'true') {
        //   this.setData({
        //     user_number: '加菜',
        //     user_add: '0人',
        //     // userList: ['加菜',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
        //   })
        // }

        if (options.buyType == "1" || options.buyType == "2") {
            // this.setData({
            //   newIshwo: true,
            //   // user_add: options.indexs +'人',
            //   // user_number: options.indexs +'人'
            // })
            if (options.indexs == "0" || options.addSnacks == "true") {
                this.setData({
                    user_number: "加菜",
                    user_add: "0人",
                    newIshwo: true
                });
            } else {
                this.setData({
                    user_number: options.indexs + "人",
                    newIshwo: true
                });
            } // if(options.buyType == '2'){
            //   this.setData({
            //     user_add: options.indexs - 0 + 1 +'人',
            //     user_number: options.indexs - 0 + 1 +'人'
            //   })
            // }

            console.log(this.data.user_add);
        } //请求餐位费数据

        let parma = {
            storeId: options.storeId
        };
        util.request("GET", parma, api.apiGettables, success => {
            console.log(success);

            if (!success) {
                success = {
                    fee: 0
                };
            }

            this.setData({
                oneTable: success.fee,
                tables: success.fee * options.indexs,
                shopSun: parseFloat(
                    success.fee * options.indexs + (options.totalPrice - 0)
                )
            }),
                successError => {
                    _my.hideLoading();
                },
                fail => {
                    _my.hideLoading();
                };
        });
        var that = this;
        let goodsList = JSON.parse(decodeURIComponent(options.goodsList));

        if (options.serviceTime) {
            let serviceTime = options.serviceTime;
            this.data.serviceTime = serviceTime;
            let times = serviceTime.split("-");

            if (times.length > 1) {
                let min = times[0];
                let max = times[1];
                this.data.minTime = min.replace(":", "");
                this.data.maxTime = max.replace(":", "");
            }
        } // 获取会员信息

        let phone = app.globalData.userPhoneNumber;
        let memberInfo = app.globalData.memberInfo;

        if (options.takeaway) {
            let diningType = "店内就餐";
            let diningIndex = 0;

            if (options.buyType == "1" || options.buyType == "1") {
                diningType = "店内就餐";
                diningIndex = 0;
            } else if (options.buyType == "3") {
                diningType = "打包带走";
                diningIndex = 1;
            } // 出餐时间 takeOutTime

            var date = new Date();
            var h = date.getHours();
            var minute = date.getMinutes() + 10;

            if (minute > 60) {
                minute = minute - 60;
                h += 1;

                if (h > 24) {
                    h = 0;
                }
            }

            h = h < 10 ? "0" + h : h;
            minute = minute < 10 ? "0" + minute : minute;
            let takeOutTime = h + ":" + minute;
            that.setData({
                takeaway: "takeaway",
                shopping_cart: goodsList,
                iid: goodsList.id,
                showGrand_total: options.totalPrice,
                subtotal: options.totalPrice,
                default_total_price: options.totalPrice,
                storeId: options.storeId,
                tableNo: options.tableNo,
                buyType: options.buyType,
                diningType: diningType,
                diningIndex: diningIndex,
                takeOutTime: takeOutTime,
                phoneNumber: phone ? phone : ""
            });

            var take_name = _my.getStorageSync("take_name");

            var take_mobile = _my.getStorageSync("take_mobile");

            var take_address = _my.getStorageSync("take_address");

            if (take_name) {
                that.setData({
                    take_name: take_name,
                    take_mobile: take_mobile
                });
            }

            if (take_address) {
                that.setData({
                    take_address: take_address
                });
            }

            if (options.appointment) {
                that.setData({
                    appointment: options.appointment
                });
            }
        }

        console.log("phoneNumber ==" + phone);

        if (phone && memberInfo == null) {
            // 获取会员信息
            this.getMember();
        } else if (memberInfo) {
            this.getDiscountByLevel();
        } // 获取门店会员折扣
        // this.getDiscountByStore()
    },

    // 获取会员信息
    getMember(hub) {
        _my.showLoading({
            title: "加载中..."
        });

        let param = {
            storeId: app.globalData.selectStoreId,
            phone: this.data.phoneNumber
        };
        util.request(
            "POST",
            param,
            api.apiGetMember,
            success => {
                app.globalData.memberInfo = success;
                this.getDiscountByLevel();
            },
            successError => {
                _my.hideLoading();

                if (hub) {
                    _my.showModal({
                        title: "亲~会员注册需前往收银台注册",
                        showCancel: "false"
                    });
                }
            },
            fail => {
                _my.hideLoading();

                if (hub) {
                    _my.showModal({
                        title: "亲~会员注册需前往收银台注册",
                        showCancel: "false"
                    });
                }
            }
        );
    },

    // 选中会员下单
    memberOrderOnChange() {
        let memberOrders = !this.data.memberOrders;

        if (memberOrders) {
            this.configDisCount(this.data.discount);
        } else {
            this.configDisCount("0");
        }
    },

    /*
     * 获取手机号
     */
    getPhoneNumber(e) {
        //  console.log('获取手机号')
        //  console.log(e)
        _my.showLoading();

        let that = this;
        let encryptedData = e.detail.encryptedData;
        let iv = e.detail.iv;

        if (!encryptedData || !iv) {
            _my.hideLoading(); // console.log('未获取到手机号')

            return;
        }

        this.data.getPhoneNumFrequency = 0;
        let param = {
            tenantId: api.kTenantId,
            encryptedData: encryptedData,
            iv: iv
        };
        that.loginGetCodeWithPhone(param); // wx.checkSession({
        //   success: (res) => {
        //     console.log('checkSession success')
        //     console.log(res)
        //     if(app.globalData.code){
        //       param.code = app.globalData.code
        //       that.getWxUserPhone(param)
        //     }else{
        //       that.loginGetCodeWithPhone(param)
        //     }
        //   },fail: (res) => {
        //     console.log('checkSession fail')
        //     console.log(res)
        //     that.loginGetCodeWithPhone(param)
        //   }
        // })
    },

    // 登录换取手机号
    loginGetCodeWithPhone(param) {
        let that = this;

        _my.login({
            success(res) {
                if (!res.code) {
                    _my.hideLoading();

                    return;
                }

                app.globalData.code = res.code;
                param.code = app.globalData.code;
                that.getWxUserPhone(param);
            },

            fail(res) {
                _my.hideLoading();
            }
        });
    },

    // 获取手机号的请求
    getWxUserPhone(param) {
        let that = this;
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
                    that.getMember(true);

                    _my.hideLoading();
                } else {
                    if (that.data.getPhoneNumFrequency < 1) {
                        that.loginGetCodeWithPhone(param);
                    } else {
                        _my.hideLoading();
                    }

                    that.data.getPhoneNumFrequency += 1;
                }
            },
            successError => {
                _my.hideLoading();
            },
            fail => {
                _my.hideLoading();
            }
        );
    },

    // 获取等级会员折扣 apiGetDiscountByLevel  storeId
    getDiscountByLevel() {
        let that = this;
        let param = {
            storeId: app.globalData.selectStoreId,
            level: app.globalData.memberInfo.levelId
        };
        util.request(
            "POST",
            param,
            api.apiGetDiscountByLevel,
            success => {
                let discount = success.discount;

                if (discount) {
                    that.setData({
                        memberOrders: true,
                        discount: discount
                    });
                    that.configDisCount(discount);
                }

                _my.hideLoading();
            },
            successError => {
                _my.hideLoading();
            },
            fail => {
                _my.hideLoading();
            }
        );
    },

    // 有会员折扣 重新计算价格
    configDisCount(discount) {
        let items = [];
        let goodsArray = this.data.shopping_cart;
        let discountedPrice = 0;
        let discountRate = util.numDiv(util.numMulti(discount, 10), 100);

        for (const key in goodsArray) {
            let item = goodsArray[key]; // Number('0.00') //.toFixed(2)

            let tItemPrice = util.numMulti(item.price, item.number);
            let disPrice = util.numMulti(tItemPrice, discountRate);
            let rebateMoney =
                discountRate > 0 ? Number(disPrice).toFixed(2) : 0;
            discountedPrice =
                discountRate > 0
                    ? util.numAdd(
                          discountedPrice,
                          util.numSub(tItemPrice, rebateMoney)
                      )
                    : 0; // console.log('tItemPrice'+tItemPrice)
            // console.log('disPrice'+disPrice)
            // console.log('rebateMoney'+rebateMoney)
            // console.log('discountedPrice'+discountedPrice)

            let nitem = {
                productId: item.id,
                productName: item.name,
                productPrice: item.price,
                productQuantity: item.number // rebateMoney: rebateMoney
            };

            if (discountRate > 0) {
                nitem.rebateMoney = rebateMoney;
            }

            items.push(nitem);
        }

        let subtotal = util.numSub(
            this.data.default_total_price,
            discountedPrice
        );
        this.setData({
            submitGoods: items,
            discountedPrice: discountedPrice,
            subtotal: subtotal,
            memberOrders: discountRate > 0 ? true : false,
            didChangeMemberOrder: true
        });
    },

    // 获取门店会员折扣  storeId  apiGetDiscountByStore
    getDiscountByStore() {
        let param = {
            storeId: this.data.storeId
        };
        util.request("POST", param, api.apiGetDiscountByStore, success => {});
    },

    // 就餐方式
    changeDidingType(e) {
        console.log(e);
        let value = parseInt(e.currentTarget.dataset.value);
        let valueStr = "店内就餐";
        let buytype = this.data.buyType;

        if (value == 0) {
            this.setData({
                buyType: "1",
                newIshwo: true
            });
            valueStr = "店内就餐";

            if (buytype == "3") {
                buytype = "1";
            }
        } else if (value == 1) {
            valueStr = "打包带走";
            this.setData({
                newIshwo: false
            });

            if (buytype == "1" || buytype == "2") {
                buytype = "3";
            }
        } // this.data.orderId && this.data.payInfo

        this.setData({
            diningIndex: value,
            buyType: buytype,
            diningType: valueStr,
            orderId: null,
            payInfo: null
        });
    },

    // 出餐时间
    bindTakeOutTimeChange: function(e) {
        // util.formatTime(new Date()) + ' ' +
        let time = e.detail.value;
        this.setData({
            takeOutTime: time
        });
    },
    changeUserNumber: function(e) {
        console.log(e);
        var that = this; //判断是否加菜
        // if(that.data.addSnacks == 'true') {

        if (e.detail.value == "0") {
            that.setData({
                user_number: "加菜"
            });
        } else {
            that.setData({
                user_number: parseInt(e.detail.value) + "人"
            });
        }

        that.setData({
            // user_number: parseInt(e.detail.value) + '人',
            user_number_index: parseInt(e.detail.value),
            tables:
                (this.data.oneTable * 100 * (parseInt(e.detail.value) * 100)) /
                10000,
            shopSun: parseFloat(
                (
                    this.data.oneTable * parseInt(e.detail.value) +
                    (that.data.subtotal - 0)
                ).toFixed(6)
            )
        }); // }else {
        //   that.setData({
        //     user_number: parseInt(e.detail.value) + 1 + '人',
        //     user_number_index: parseInt(e.detail.value),
        //     tables: ((this.data.oneTable * 100) * ((parseInt(e.detail.value) + 1) * 100)) / 10000,
        //     shopSun: parseFloat((this.data.oneTable * ((parseInt(e.detail.value) + 1)) + (that.data.subtotal - 0)).toFixed(
        //       6)),
        //   });
        // }

        console.log(this.data.tables);
        console.log(this.data.shopSun);

        if (that.data.user_number) {
            var tableware_price = util.numMulti(
                that.data.user_number_index + 1,
                that.data.tableware_price
            );

            if (that.data.takeaway && that.data.appointment == 0) {
                //外卖
                if (that.data.take_own == 0) {
                    //配送
                } else if (that.data.take_own == 1) {
                    //自提
                }
            } else {
                //非外卖 +预约
                var tablePrice = that.data.tables.price;
                var showGrand_total = util.numAdd(
                    that.data.subtotal_coupon,
                    tableware_price
                );
                showGrand_total = util.numAdd(showGrand_total, tablePrice);
                that.setData({
                    showGrand_total: showGrand_total
                });
            }
        }
    },
    bindKeyInput: function(e) {
        var key = e.currentTarget.dataset.key;
        var val = e.detail.value;
        var keyData = new Object();
        keyData[key] = val;
        this.setData(keyData);
    },
    hidePopup: function() {
        this.setData({
            popupShow: false
        });
    },
    showPopup: function() {
        this.setData({
            popupShow: true
        });
    },
    add_remark: function() {
        var that = this;
        that.setData({
            remark: that.data.remarkFlage,
            popupShow: false
        });
    },
    updateAddress: function() {
        var that = this;

        if (that.data.appointment) {
            _my.navigateTo({
                url:
                    "/pages/address/address?url=address&take_name=" +
                    that.data.take_name +
                    "&take_mobile=" +
                    that.data.take_mobile +
                    "&take_date=" +
                    that.data.take_date +
                    "&appointment=" +
                    that.data.appointment
            });
        } else {
            if (that.data.take_own == 0) {
                //配送
                _my.navigateTo({
                    url:
                        "/pages/address/address?url=address&take_name=" +
                        that.data.take_name +
                        "&take_mobile=" +
                        that.data.take_mobile +
                        "&take_address=" +
                        that.data.take_address +
                        "&take_own=" +
                        that.data.take_own
                });
            } else {
                //自提
                _my.navigateTo({
                    url:
                        "/pages/address/address?url=date&take_name=" +
                        that.data.take_name +
                        "&take_mobile=" +
                        that.data.take_mobile +
                        "&take_date=" +
                        that.data.take_date +
                        "&take_own=" +
                        that.data.take_own
                });
            }
        }
    },
    toggleTakeOwn: function(e) {
        var take_own = parseInt(e.currentTarget.dataset.method);
        var that = this;
        var session_3rd = that.data.session_3rd;

        if (take_own == 0) {
            //配送
            var tp = util.numAdd(
                that.data.subtotal_coupon,
                that.data.takeaway_price
            );
            tp = util.numAdd(that.data.subtotal, tp);
            that.setData({
                take_own: take_own,
                zitiCur: "",
                peisongCur: "cur",
                appointmentCur: "",
                showGrand_total: tp
            });
        } else if (take_own == 1) {
            //自提
            var tp = util.numAdd(that.data.subtotal_coupon, that.data.subtotal);
            that.setData({
                take_own: take_own,
                zitiCur: "cur",
                peisongCur: "",
                appointmentCur: "",
                showGrand_total: tp
            });
        }
    },
     createTakeaWayOrder: function() {
        //创建外卖订单
        // 判断是否在营业时间
        if (this.data.serviceTime.length > 0) {
            var date = new Date();
            var h = date.getHours();
            h = h < 10 ? "0" + h : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? "0" + minute : minute;
            let timeStr = String(h) + String(minute);
            let time = parseInt(timeStr);
            let min = parseInt(this.data.minTime);
            let max = parseInt(this.data.maxTime);

            if (time < min || time > max) {
                _my.showModal({
                    title: "当前店铺不在营业时间",
                    showCancel: false,

                    success(res) {
                        _my.navigateBack({
                            delta: 0
                        });
                    }
                });

                return;
            }
        } // 二次支付直接提交上一次支付数据
        // if(this.data.orderId && this.data.payInfo && !this.data.didChangeMemberOrder){
        //   console.log('再次支付')
        //   this.payOrder(this.data.payInfo)
        //   return
        // }

        this.data.didChangeMemberOrder = false;
        var that = this;
        var dataObj = {};
        dataObj.remark = that.data.remark;
        dataObj.user_number = that.data.user_number; //预约订单

        if (that.data.appointment && this.data.buyType == 3) {
            dataObj.name = that.data.take_name;
            dataObj.phone = that.data.take_mobile; //外卖订单
        } else {
            // 默认桌位
            // dataObj.tableNo = that.data.tableNo //1
            dataObj.take_own = that.data.take_own;

            if (dataObj.take_own == null) {
                // wx.showToast({
                //   title: '请先选择配送方式',
                //   icon: 'none'
                // });
                // return false;
            }

            if (dataObj.take_own == 0) {
                //配送
                dataObj.name = that.data.take_name;
                dataObj.phone = that.data.take_mobile;
                dataObj.address = that.data.take_address; // if (!dataObj.address) {
                //   wx.showToast({
                //     title: '请填写地址',
                //     icon: 'none'
                //   });
                //   return false;
                // }
            } else if (dataObj.take_own == 1) {
                //自提
                dataObj.name = that.data.take_name;
                dataObj.phone = that.data.take_mobile;
                dataObj.take_date = that.data.take_date; // if (!dataObj.take_date) {
                //   wx.showToast({
                //     title: '请填写自提时间',
                //     icon: 'none'
                //   });
                //   return false;
                // }
            }
        }

        dataObj.tableNo = that.data.tableNo; // 桌位号

        dataObj.user_number = that.data.user_number_index + 1;

        if (that.data.lock) {
            return;
        }

        that.setData({
            lock: true
        });

        _my.showLoading({
            title: "订单创建中..."
        });

        let items = [];

        if (this.data.submitGoods.length > 0) {
            items = this.data.submitGoods;
            dataObj.memberRebateMoney = this.data.discountedPrice;
        } else {
            let goodsArray = this.data.shopping_cart;

            for (const key in goodsArray) {
                let item = goodsArray[key];
                let nitem = {
                    productId: item.id,
                    productName: item.name,
                    productPrice: item.price,
                    productQuantity: item.number
                };
                items.push(nitem);
            }
        }
        let numberMOne = 0
        items.forEach( item => {

        })

        dataObj.storeId = this.data.storeId;
        dataObj.items = JSON.stringify(items);

        if (this.data.buyType == "1" || this.data.buyType == "2") {
            dataObj.orderAmount = Number(this.data.default_total_price); //订单总金额
        } else {
            dataObj.orderAmount = Number(this.data.default_total_price); //订单总金额
        } // dataObj.orderAmount = Number(this.data.default_total_price)//订单总金额
        if(this.data.buyType == '1') {
          dataObj.alipayFoodOrderType = 'direct_payment'
        }else if(this.data.buyType == '2') {
          dataObj.alipayFoodOrderType = 'qr_order'
        }else if(this.data.buyType == '3') {
          dataObj.alipayFoodOrderType = 'pre_order'
        }
        dataObj.id = this.data.shopping_cart;
        /*
    isMember
    aliXcxMoney
    memberMoney
    tenantId
    是否打包：takeOut = 0 堂食，1 外带
    自提时间：takeOutTime：
      */

        var isMember = false;
        console.log(app);

        if (app.globalData.memberInfo) {
            isMember = app.globalData.memberInfo.memberId ? true : false;
        }

        if (!isMember) {
            if (this.data.buyType == "1" || this.data.buyType == "2") {
                dataObj.isMember = "0";
                dataObj.aliXcxMoney = Number(this.data.shopSun); //.toFixed(2)

                dataObj.memberMoney = Number("0.00"); //.toFixed(2) //'0.00'.valueOf()
            } else {
                dataObj.isMember = "0";
                dataObj.aliXcxMoney = Number(this.data.subtotal); //Number('0.00') //.toFixed(2)

                dataObj.memberMoney = Number("0.00"); //Number(this.data.subtotal) //.toFixed(2)
            } // dataObj.isMember = '0'
            // dataObj.aliXcxMoney = Number(this.data.shopSun) //.toFixed(2)
            // dataObj.memberMoney = Number('0.00') //.toFixed(2) //'0.00'.valueOf()
        } else {
            if (this.data.buyType == "1" || this.data.buyType == "2") {
                dataObj.isMember = "1";
                dataObj.aliXcxMoney = Number(this.data.shopSun); //.toFixed(2)

                dataObj.memberMoney = Number("0.00"); //.toFixed(2) //'0.00'.valueOf()
            } else {
                dataObj.isMember = "1";
                dataObj.aliXcxMoney = Number(this.data.subtotal); //Number('0.00') //.toFixed(2)

                dataObj.memberMoney = Number("0.00"); //Number(this.data.subtotal) //.toFixed(2)

                dataObj.memberId = app.globalData.memberInfo.memberId;
            }
        }

        console.log(this.data.shopSun);
        console.log(dataObj.aliXcxMoney); // 结算金额

        if (
            (this.data.buyType == "1" || this.data.buyType == "2") &&
            this.data.newIshwo
        ) {
            dataObj.closeMoney = parseFloat(
                (this.data.subtotal - 0 + this.data.tables).toFixed(6)
            );
        } else {
            dataObj.closeMoney = Number(this.data.subtotal);
        } // dataObj.closeMoney = Number(this.data.subtotal - 0 + this.data.tables)

        let buytype = this.data.buyType;

        if (buytype == "1" || buytype == "2") {
            dataObj.takeOut = "0";
            dataObj.mealFee = this.data.tables.toFixed(2);
        } else if (buytype == "3") {
            dataObj.takeOut = "1";
            dataObj.mealFee = 0
        }

        dataObj.takeOutTime = this.data.takeOutTime;
        

        if (this.data.user_number == "加菜") {
            dataObj.mealNumber = 0;
        } else {
            dataObj.mealNumber = this.data.user_number.replace("人", "");
        }

        dataObj.tenantId = api.kTenantId;
        dataObj.openid = this.data.openid

        util.request(
            "POST",
            dataObj,
            api.apiCreateOrder,
            res => {
                console.log(dataObj);
                let orderId = res.orderId;
                let payInfo = res.payInfo; // let iid = res.iid
                // wx.redirectTo({
                //   url: '/pages/wxpay/wxpay?oid='+orderId,
                // });

                that.setData({
                    lock: false,
                    orderId: orderId,
                    payInfo: payInfo
                });

                _my.hideLoading();

                that.payOrder(payInfo);
            },
            successError => {
                that.setData({
                    lock: false
                });

                _my.hideLoading();

                _my.showModal({
                    title: "提示",
                    content: successError.msg
                        ? successError.msg
                        : "操作失败,请重试",
                    showCancel: false
                });
            },
            fail => {
                that.setData({
                    lock: false
                });

                _my.hideLoading();

                _my.showModal({
                    title: "提示",
                    content: "操作失败,请重试",
                    showCancel: false
                });
            }
        );
    },
    createOrder: function() {
        //创建点餐订单
        var that = this;
        var dataObj = {};
        dataObj.session_3rd = that.data.session_3rd;
        dataObj.tid = that.data.scene;
        dataObj.remark = that.data.remark;
        dataObj.user_number = that.data.user_number;

        if (!dataObj.user_number) {
            _my.showToast({
                title: "请填写用餐人数",
                image: "../../image/tip.png"
            });

            return false;
        }

        dataObj.user_number = that.data.user_number_index + 1;

        if (that.data.lock) {
            return;
        }

        that.setData({
            lock: true
        });

        _my.request({
            url: api.orderCreate(),
            data: dataObj,
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
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
                                    _my.redirectTo({
                                        url:
                                            "/pages/wxpay/wxpay?oid=" +
                                            res.data.oid
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
    // 支付
    payOrder: function(param) {
        console.log(param);
        let that = this;
        console.log(that.data.orderId);
        
        my.tradePay({
          // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          tradeNO: param,
          success: (res) => {
            console.log(res);
            
            if(res.extendInfo.isDisplayResult) {
                 var pages = getCurrentPages(); // 获取页面栈

                var prevPage = pages[pages.length - 2]; // 上一个页面

                prevPage.setData({
                    creatOrderFinish: true
                });

                _my.redirectTo({
                    url: "/pages/orderMsg/orderMsg?oid=" + that.data.orderId + '&openid=' + that.data.openid // url: '/pages/orderMsg/orderMsg?oid='+that.data.orderId + '&iid=' + that.data.iid,
                });
            }
          },
          fail: (res) => {
            console.log(res);
            
            my.alert({
              content: JSON.stringify(res),
            });
          }
        });
        // _my.requestPayment({
        //     timeStamp: param.timeStamp,
        //     nonceStr: param.nonceStr,
        //     package: param.package,
        //     signType: param.signType,
        //     paySign: param.paySign,

        //     success(res) {
        //         console.log(res);
        //         var pages = getCurrentPages(); // 获取页面栈

        //         var prevPage = pages[pages.length - 2]; // 上一个页面

        //         prevPage.setData({
        //             creatOrderFinish: true
        //         });

        //         _my.redirectTo({
        //             url: "/pages/orderMsg/orderMsg?oid=" + that.data.orderId // url: '/pages/orderMsg/orderMsg?oid='+that.data.orderId + '&iid=' + that.data.iid,
        //         });
        //     },

        //     fail(res) {
        //         console.log(res);
        //     }
        // });
    }
});
