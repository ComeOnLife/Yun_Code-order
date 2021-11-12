/**! __CODEPLACEHOLDER_START__ */ /*[PositionForHostEntryCodeBegin]*/ /**! __CODEPLACEHOLDER_END__ */
if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

      function getUserAgentInPlatformWeb() {
        return typeof navigator !== 'undefined' ? navigator.swuserAgent || navigator.userAgent || '' : '';
      }
      if(getUserAgentInPlatformWeb() && (getUserAgentInPlatformWeb().indexOf('LyraVM') > 0 || getUserAgentInPlatformWeb().indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../dist/info/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../dist/icon/index?hash=eb341fc7fd6d338fd6ae43bea030b985075b7b76');
require('../../dist/tag/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../dist/checkbox/index?hash=c9d2f2a4c7ab9986a8e97076615a0f9de48982f9');
require('../../dist/transition/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../dist/overlay/index?hash=8b1b14c624b57d86ee597179ba6aa8b941082808');
require('../../dist/popup/index?hash=8a01e8ac5e585dad89f29b34c7e170f247404d8a');
require('../../dist/stepper/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../dist/loading/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../dist/button/index?hash=cf6d746210b79fcd75ead1daca4adbc120be6ecb');
require('../../dist/cell/index?hash=c9d2f2a4c7ab9986a8e97076615a0f9de48982f9');
require('../../dist/field/index?hash=7528b160dc56e81621d32a240a5542917d47b06b');
require('../../dist/search/index?hash=279274961a3ae4a22125fc8b31cb191b00f494a8');
require('../../pages/index/index?hash=116aa6a1e728fff6d0e4e890aff5e38428d337c8');
require('../../pages/order/order?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/404/404?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/orderList/orderList?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/user/user?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/orderMsg/orderMsg?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/aboutUs/aboutUs?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/contactUs/contactUs?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/takeOut/tabkeOut?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/wallet/wallet?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/recharge/recharge?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/walletList/walletList?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/createOrderMsg/createOrderMsg?hash=854d3ab8bfb3f876cac62e653c1186af9a954c54');
require('../../pages/address/address?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/wxpay/wxpay?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/takeoutTables/takeoutTables?hash=afe558ad62cffb81ebaac429acf4505910f48915');
require('../../pages/mobile/mobile?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/article/article?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/commentList/commentList?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/commentAdd/commentAdd?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/mendian/list/list?hash=1d01684f6d6e44b9477be6ac346fa68a784b2664');
require('../../pages/paidui/faqi/faqi?hash=eedca93ae107818ec7d2cd6c6c91b3ea6ac78297');
require('../../pages/paidui/jieguo/jieguo?hash=eedca93ae107818ec7d2cd6c6c91b3ea6ac78297');
require('../../pages/yuyuezhuowei/faqi/faqi?hash=eedca93ae107818ec7d2cd6c6c91b3ea6ac78297');
require('../../pages/yuyuezhuowei/jieguo/jieguo?hash=d9f3994978d5b6346d59ebd3e4464983bd4e0f64');
require('../../pages/member/member?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/ant-move-runtime-logs/index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/ant-move-runtime-logs/specific/index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}