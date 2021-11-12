const _my = require("../__antmove/api/index.js")(my);
const util = require("../utils/util.js");

const config = require("./config.js");

const mendian = require("./mendian.js");

var baseUrl = "";
config.getConfig(function(res) {
    console.log(res);
    // baseUrl = res.wxUrl;
}); //普通上传方式
//baseUrl= 'https://www.wukongdiancan.com'
//登录接口

function login() {
    return baseUrl + "/api/login";
} //同步会员信息接口

function userInform() {
    return baseUrl + "/api/login/synMsg";
} //店铺首页

function shop() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/shop";
} //菜品列表

function dishesList() {
    return baseUrl + "/api/dishes/list";
} //菜品详情

function dishesItem() {
    return baseUrl + "/api/dishes/item";
} //添加购物车 /api/order/addCart

function addCart() {
    return baseUrl + "/api/order/addCart";
} //添加多个规格id

function addCartFormat() {
    return baseUrl + "/api/order/addCartFormat";
} // 购物车

function getCart() {
    return baseUrl + "/api/order/shopping";
} //修改购物车数量

function changeNumber() {
    return baseUrl + "/api/order/changeNumber";
} //购物车删除商品

function deleteCartItem() {
    return baseUrl + "/api/order/deleted";
} //清空购物车

function deleteAllCart() {
    return baseUrl + "/api/order/deletedAll";
} //用餐人数

function addRemark() {
    return baseUrl + "/api/order/addRemark";
} //创建订单

function orderCreate() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/order/create";
} //

function orderMsg() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/user/orders/msg";
} //微信付款信息

function wxPayInform() {
    return baseUrl + "/api/order/wxPay";
} // //微信付款成功后 检查付款信息

function doWxPay() {
    return baseUrl + "/api/order/doWxPay";
} //微信支付接口

function wxPay(session_3rd, oid, cb) {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    _my.request({
        url: wxPayInform(),
        data: {
            session_3rd: session_3rd,
            id: oid
        },
        success: function(res) {
            util.checkCode(res, function(res) {
                var pay_msg = res.data.pay_msg;
                console.log(pay_msg);

                _my.requestPayment({
                    timeStamp: pay_msg.timeStamp,
                    nonceStr: pay_msg.nonceStr,
                    package: pay_msg.package,
                    signType: pay_msg.signType,
                    paySign: pay_msg.paySign,
                    success: function(res) {
                        console.log(res); //用户支付成功后，检查服务器是否存在

                        _my.request({
                            url: doWxPay(),
                            data: {
                                session_3rd: session_3rd,
                                id: oid
                            },
                            success: function(res) {
                                util.checkCode(
                                    res,
                                    function(res) {
                                        typeof cb == "function" &&
                                            cb(null, res);
                                    },
                                    function(res) {
                                        typeof cb == "function" && cb(res);
                                    }
                                );
                            }
                        });
                    },
                    fail: function(res) {
                        typeof cb == "function" && cb(res);
                    }
                });
            });
        }
    });
} ///api/user/orders

function myOrdersList(obj, cb) {
    _my.request({
        url: baseUrl + "/api/user/orders/list",
        data: obj,
        header: {
            "content-type": "application/json"
        },
        success: function(res) {
            console.log(res);
            util.checkCode(res, function(res) {
                typeof cb == "function" && cb(res);
            });
        }
    });
} //删除订单

function delOrder() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/user/delete";
} //加菜

function saveDishes() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/user/orders/jiacan";
} //桌位列表

function changeTables() {
    return baseUrl + "/api/user/tables";
} // 请求换桌

function doChange() {
    return baseUrl + "/api/user/doChange";
} //检查桌位是否占用

function Checktables() {
    return baseUrl + "/api/order/tables";
} //关于我们

function about() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/about";
} //联系我们

function contact() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/contact";
} //获取快餐虚拟id

function takeoutTables() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/tables";
} //获取用户信息

function userMsg() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/user/msg";
} //创建充值订单

function chargeCreate() {
    return baseUrl + "/api/user/charge/create";
} //获取微信支付参数

function chargeWxPayForm() {
    return baseUrl + "/api/user/charge/wxPay";
} //充值成功

function chargeDoWxPay() {
    return baseUrl + "/api/user/charge/doWxPay";
} //微信支付接口

function chargeWxPay(session_3rd, code, cb) {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    _my.request({
        url: chargeWxPayForm(),
        data: {
            session_3rd: session_3rd,
            code: code
        },
        success: function(res) {
            util.checkCode(res, function(res) {
                var pay_msg = res.data.pay_msg;
                console.log(res);

                _my.requestPayment({
                    timeStamp: pay_msg.timeStamp,
                    nonceStr: pay_msg.nonceStr,
                    package: pay_msg.package,
                    signType: pay_msg.signType,
                    paySign: pay_msg.paySign,
                    success: function(res) {
                        console.log(res); //用户支付成功后，检查服务器是否存在

                        _my.request({
                            url: chargeDoWxPay(),
                            data: {
                                session_3rd: session_3rd,
                                code: code
                            },
                            success: function(res) {
                                util.checkCode(res, function(res) {
                                    typeof cb == "function" && cb(null, res);
                                });
                            }
                        });
                    },
                    fail: function(res) {
                        typeof cb == "function" && cb(res);
                    }
                });
            });
        }
    });
} //充值列表

function chargeList() {
    return baseUrl + "/api/user/charge/list";
} //消费明细

function chargeLog() {
    return baseUrl + "/api/user/charge/log";
} //创建外卖订单

function createTakeaway() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/order/createTakeaway";
} //余额支付
// /api/order/accountPay

function accountPay() {
    _my.showLoading({
        title: "正在提交",
        mask: true
    });

    return baseUrl + "/api/order/accountPay";
} //获取配送费

function takeawayPrice() {
    _my.showLoading({
        title: "正在加载",
        mask: true
    });

    return baseUrl + "/api/orders/takeawayPrice";
} //充值规则

function chargeRule() {
    return baseUrl + "/api/user/charge/rule";
} //绑定手机号

function updateMobile() {
    return baseUrl + "/api/user/updateMobile";
} //文章

function article() {
    return baseUrl + "/api/article";
} //店铺评论
// function shopComment(){
//   return baseUrl + '/api/shopComment';
// }

function shopCommentList(obj, cb) {
    _my.request({
        url: baseUrl + "/api/comment/list",
        data: obj,
        header: {
            "content-type": "application/json"
        },
        success: function(res) {
            console.log(res);
            util.checkCode(res, function(res) {
                typeof cb == "function" && cb(res);
            });
        }
    });
} //保存评论

function saveComment() {
    return baseUrl + "/api/comment/save";
}

function uploadImg(session_3rd, cb) {
    _my.chooseImage({
        count: 1,
        // 默认9
        sizeType: ["original", "compressed"],
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"],
        // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths; //console.log(res);

            _my.showLoading({
                title: "正在提交"
            });

            console.log(session_3rd);

            _my.uploadFile({
                url: baseUrl + "/api/uploadImg",
                filePath: tempFilePaths[0],
                name: "image",
                formData: {
                    session_3rd: session_3rd
                },
                success: function(res) {
                    _my.hideToast();

                    console.log(res);
                    res.data = JSON.parse(res.data);
                    console.log(res);
                    util.checkCode(res, function(res) {
                        typeof cb == "function" && cb(res);
                    });
                },
                fail: function(res) {
                    _my.hideToast();

                    _my.showModal({
                        title: "上传失败",
                        content: res.errMsg,
                        showCancel: false
                    });
                }
            });
        },
        fail: function(res) {
            console.log(res);
        }
    });
} //优惠券

function coupon() {
    return baseUrl + "/api/coupon";
} // 地图定位

const kMapKey = "552BZ-6UPEX-PXL4K-7SEDK-Y5KWE-IPB3B"; // 新的接口 https://minitest.ydongj.com --> 云东家测试
// var nBaseUrk = 'https://minitest.ydongj.com/sell/'

var nBaseUrk = "https://miniorder.ydongj.com/sell/"; // 获取门店列表
const user_openid = nBaseUrk + "ali/miniLogin"; //获取userId

const apiGetStores = nBaseUrk + "store/getStores"; // 小程序展示的商品

const apiProductList = nBaseUrk + "buyer/product/list"; // 创建订单
//const apiCreateOrder = nBaseUrk + 'buyer/order/create'

const apiCreateOrder = nBaseUrk + "buyer/order/aliMiniPay"; // 获取openId

const apiGetOpenId = nBaseUrk + "wechat/miniLogin"; // 订单列表

const apiGetPhone = nBaseUrk + 'ali/getPhone'; //获取手机号

const apiOrderList = nBaseUrk + "buyer/order/list"; // 订单详情

const apiOrderDetail = nBaseUrk + "buyer/order/detail"; // 获取支付信息

const apiGetAliPayInfo = nBaseUrk + "buyer/order/getAliPayInfo"; // 获取会员信息

const apiGetMember = nBaseUrk + "buyer/member/getMember"; // 注册会员信息

const apiRegisterMember = nBaseUrk + "buyer/member/register"; // 解析手机号

const apiGetWxUserPhone = nBaseUrk + "wechat//getWxUserPhone"; // 获取门店会员折扣

const apiGetDiscountByStore = nBaseUrk + "buyer/member/getDiscountByStore"; // 获取等级会员折扣

const apiGetDiscountByLevel = nBaseUrk + "buyer/member/getDiscountByLevel"; // 会员充值

const apiMemberRecharge = nBaseUrk + "buyer/member/recharge"; //获取餐位费

const apiGettables = nBaseUrk + "store/getMealFee"; //获取菜品的口味和做法

const apiGetRecipe = nBaseUrk + "buyer/product/getExtra"; // kTenantId

const kTenantId = "57bcaed7b6fc11eb93d20c42a130ebb6"; // '8aaed99f62c0134601633d8d827f78a4' //4ab37335dc9d11eb93d20c42a130ebb6//57bcaed7b6fc11eb93d20c42a130ebb6 // 'b76a9fd9ef7211eb93d20c42a130ebb6'

/*
https://apis.map.qq.com
https://miniorder.ydongj.com

https://miniorder.ydongj.com/sell/home?storeId=8aaed99f62c0134601633d8d828278a6&tableNo=100
miniorder.ydongj.com/sell/home?storeId=57bf211ab6fc11eb93d20c42a130ebb6&tableNo=2


wxd6882cc1fd538969  kTenantId = '8aaed99f62c0134601633d8d827f78a4' 云东家
wx51266992c144bfbb  kTenantId = '57bcaed7b6fc11eb93d20c42a130ebb6' 卤肉店
wx59913d6298c09840  kTenantId = '4ab37335dc9d11eb93d20c42a130ebb6' 胖掌柜
wxb579f4157c8ba70c  kTenantId = 'b76a9fd9ef7211eb93d20c42a130ebb6' 烤鱼捞饭

*/

module.exports = {
    ...mendian,
    kMapKey: kMapKey,
    kTenantId: kTenantId,
    apiGetStores: apiGetStores,
    apiProductList: apiProductList,
    apiCreateOrder: apiCreateOrder,
    user_openid: user_openid,
    apiGetOpenId: apiGetOpenId,
    apiOrderList: apiOrderList,
    apiOrderDetail: apiOrderDetail,
    apiGetPhone: apiGetPhone,
    apiGetAliPayInfo: apiGetAliPayInfo,
    apiGetMember: apiGetMember,
    apiRegisterMember: apiRegisterMember,
    apiGetWxUserPhone: apiGetWxUserPhone,
    apiGetDiscountByStore: apiGetDiscountByStore,
    apiGetDiscountByLevel: apiGetDiscountByLevel,
    apiMemberRecharge: apiMemberRecharge,
    apiGettables: apiGettables,
    apiGetRecipe: apiGetRecipe,
    login: login,
    userInform: userInform,
    shop: shop,
    dishesList: dishesList,
    dishesItem: dishesItem,
    addCart: addCart,
    addCartFormat: addCartFormat,
    getCart: getCart,
    changeNumber: changeNumber,
    deleteCartItem: deleteCartItem,
    deleteAllCart: deleteAllCart,
    addRemark: addRemark,
    orderCreate: orderCreate,
    orderMsg: orderMsg,
    wxPay: wxPay,
    myOrdersList: myOrdersList,
    delOrder: delOrder,
    saveDishes: saveDishes,
    changeTables: changeTables,
    doChange: doChange,
    Checktables: Checktables,
    about: about,
    contact: contact,
    userMsg: userMsg,
    chargeCreate: chargeCreate,
    chargeWxPay: chargeWxPay,
    chargeList: chargeList,
    chargeLog: chargeLog,
    takeoutTables: takeoutTables,
    createTakeaway: createTakeaway,
    accountPay: accountPay,
    takeawayPrice: takeawayPrice,
    chargeRule: chargeRule,
    updateMobile: updateMobile,
    article: article,
    shopCommentList: shopCommentList,
    saveComment: saveComment,
    uploadImg: uploadImg,
    coupon: coupon
};
