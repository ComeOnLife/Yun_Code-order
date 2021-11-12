const _my = require("../__antmove/api/index.js")(my);
//腾讯地图key
const keyMap = "552BZ-6UPEX-PXL4K-7SEDK-Y5KWE-IPB3B"; // "extAppid": "wx4732a31b2b29b82a",
// "wxUrl": "https://www.wukongdiancan.com",
// "sCode": "18031314593308978"

function getConfig(cb) {
    if (_my.getExtConfigSync) {
        let extConfig = _my.getExtConfigSync(); // let extConfig ={
        //   wxUrl:'http://yunpostest.ydongj.com',
        //   bcode:"20070416045702731"
        // }

        typeof cb == "function" && cb(extConfig);
    } else {
        _my.showModal({
            title: "提示",
            content: "基础配置获取失败"
        });

        return false;
    }
} //17110311594354681

module.exports = {
    keyMap: keyMap,
    getConfig: getConfig
};
