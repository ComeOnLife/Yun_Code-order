const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/orderList/orderList"
    }
}); // pages/orderList/orderList.js

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
        pageSize: 5,
        page: 1,
        hasMoreData: false,
        Inx: 0,
        status: "all",
        orderList: [],
        // tab: [
        //   {
        //     name: '全部',
        //     status: 0 //'all'
        //   },
        //   {
        //     name: '未付款',
        //     status: 0
        //   },
        //   {
        //     name: '已付款',
        //     status: 1
        //   },
        //   {
        //     name: '配送中',
        //     status: 2
        //   },
        //   {
        //     name: '已完成',
        //     status: 9
        //   }
        // ]
        tab: [
            {
                name: "支付成功",
                status: 1,
                page: 1,
                list: [],
                loadFinish: false
            },
            {
                name: "待支付",
                status: 0,
                page: 1,
                list: [],
                loadFinish: false
            },
            {
                name: "支付失败",
                status: 2,
                page: 1,
                list: [],
                loadFinish: false,
            }
        ],
        loadFinish: false,
        openid: '', //用户唯一标识
        storeId: '57bf211ab6fc11eb93d20c42a130ebb6', //卤肉店
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      //获取用户授权码
       my.getAuthCode({
        scopes: 'auth_base',
        success: (res) => {
          console.log(res);
         let paramDate = {
          storeId: this.data.storeId,
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
              this.getOrderListNew(this.data.Inx, true);
            }
        )
        }
      });
        console.log(options);
        setTimeout(() => {
            console.log(this.data.orderList);
        }, 2000);
        var that = this;

        if (options.status) {
            that.setData({
                status: options.status,
                Inx: parseInt(options.inx)
            });
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        /*
     app.getSession(function (session_3rd) {
        that.setData({
         session_3rd: session_3rd,
         page: 1
       })
        that.getOrderList();
      });
     */
      if(this.data.openid) {
        this.getOrderListNew(this.data.Inx, true);
        console.log('2');
        
      }
    },
    /// 获取订单列表数据
    getOrderListNew: function(index, state) {
        let that = this;
        let sList = this.data.tab;
        let item = sList[index];

        if (state) {
            item.page = 1;
        }

        let param = {
            payStatus: item.status,
            openid: this.data.openid,
            page: item.page,
            size: that.data.pageSize,
            storeId: that.data.storeId
        };
        util.request(
            "POST",
            param,
            api.apiOrderList,
            success => {
                console.log(success);

                if (state) {
                    item.list = [];
                }

                for (const key in success) {
                    let orderItem = success[key];
                    orderItem.createTimeStr = util.formatDate(
                        orderItem.createTime * 1000
                    );
                    item.list.push(orderItem);
                }

                item.page = item.page + 1;

                if (success.length < that.data.pageSize) {
                    item.loadFinish = true;
                } else {
                    item.loadFinish = false;
                }

                that.setData({
                    orderList: item.list,
                    tab: sList
                });

                _my.stopPullDownRefresh();
            },
            successError => {
                _my.stopPullDownRefresh();
            },
            fail => {
                _my.stopPullDownRefresh();
            }
        );
    },
    changeTab: function(event) {
        var that = this;
        let index = event.currentTarget.dataset.index; // // that.getOrderList();
        // let item = this.data.tab[index]
        // if(item.list.length > 0){
        //   that.setData({
        //     orderList: item.list,
        //     Inx: index,
        //     status: event.currentTarget.dataset.status
        //   })
        // }else{
        //   that.setData({
        //     Inx: index,
        //     status: event.currentTarget.dataset.status
        //   });
        //   that.getOrderListNew(index,true)
        // }

        that.setData({
            Inx: index,
            status: event.currentTarget.dataset.status
        });
        that.getOrderListNew(index, true);
    },
    getOrderList: function() {
        var that = this;

        _my.showLoading({
            title: "正在加载"
        });

        var data = {
            session_3rd: that.data.session_3rd,
            p: that.data.page,
            rows: that.data.pageSize
        };

        if (that.data.status != "all") {
            data.status = that.data.status;
        }

        api.myOrdersList(data, function(res) {
            var orderListTem = that.data.orderList;

            if (that.data.page == 1) {
                orderListTem = [];
            }

            var orderList = res.data.results.list;
            console.log(res);

            if (orderList.length < that.data.pageSize) {
                that.setData({
                    orderList: orderListTem.concat(orderList),
                    hasMoreData: false
                });
            } else {
                that.setData({
                    orderList: orderListTem.concat(orderList),
                    hasMoreData: true,
                    page: that.data.page + 1
                });
            } //隐藏加载

            _my.hideToast();
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (!item.loadFinish) {
            this.getOrderListNew(this.data.Inx, false);
        }
    },
    onPullDownRefresh: function() {
        // if(this.data.session_3rd && this.data.orderList.length>0){
        //   this.setData({
        //     page:1,
        //     hasMoreData:false
        //   })
        //   this.getOrderList();
        //   wx.stopPullDownRefresh();
        // }
        this.getOrderListNew(this.data.Inx, true);
    }
});
