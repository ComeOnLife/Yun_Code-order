const _Page = require("../../../__antmove/component/componentClass.js")("Page");
const _my = require("../../../__antmove/api/index.js")(my);
my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/pages/mendian/list/list"
    }
}); // pages/mendian/list/list.js

const api = require("../../../api/index.js");

const util = require("../../../utils/util.js");

const app = getApp();

_Page({
    data: {
        baseUrl: app.globalData.baseUrl,
        list: [],
        lock: false,
        latitude: 0,
        //纬度
        longitude: 0,
        //经度
        address: null,
        storesArray: [],
        searching: false,
        searchValue: null,
        searchResult: [],
        province: "广东省",
        page: 1,
        pageSize: 20,
        loadFinish: false
    },
    onLoad: function(options) {
        this.setData({
            latitude: options.latitude,
            longitude: options.longitude,
            address: options.address,
            province: options.province ? options.province : "广东省"
        });
        this.getStores(true);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getStores(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (!this.data.loadFinish) {
            this.getStores(false);
        }
    },

    /**
     * 获取门店列表
     */
    getStores(state) {
        let that = this;

        if (state) {
            this.data.page = 1;
        }

        let param = {
            page: this.data.page,
            size: this.data.pageSize,
            longitude: this.data.longitude,
            latitude: this.data.latitude,
            address: this.data.province,
            tenantId: api.kTenantId
        };

        if (this.data.searchValue) {
            param.storeName = this.data.searchValue;
        }

        util.request(
            "POST",
            param,
            api.apiGetStores,
            success => {
                if (that.data.searching) {
                    let result = state
                        ? success
                        : that.data.searchResult.concat(success);
                    that.setData({
                        list: result,
                        searchResult: result
                    });
                } else {
                    let result = state
                        ? success
                        : that.data.storesArray.concat(success);
                    that.setData({
                        storesArray: result,
                        list: result
                    });
                }

                that.data.page = that.data.page + 1;

                if (success.length < that.data.pageSize) {
                    that.data.loadFinish = true;
                } else {
                    that.data.loadFinish = false;
                }

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

    /**
     * 搜索门店
     */
    onSearch(event) {
        this.data.searchValue = event.detail;
        this.data.searching = true;
        this.getStores(true);
    },

    /**
     * 取消搜索
     */
    onClear() {
        this.setData({
            list: this.data.storesArray,
            searchResult: [],
            searching: false
        });
    },

    /**
     * 选择门店
     */
    selectStore(e) {
        let selectItem = e.currentTarget.dataset.item;
        console.log(selectItem);
        var pages = getCurrentPages(); // 获取页面栈

        var prevPage = pages[pages.length - 2]; // 上一个页面

        prevPage.setData({
            storeItem: selectItem
        });

        _my.navigateBack();
    }
});
