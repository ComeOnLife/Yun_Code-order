const _my = require("../../__antmove/api/index.js")(my);
function Behavior(behavior) {
    behavior.$id = Number(new Date()) + String(Math.random()).substring(2, 7);
    return behavior;
}

let cache = null;

function getSafeArea() {
    return new Promise((resolve, reject) => {
        if (cache != null) {
            resolve(cache);
        } else {
            _my.getSystemInfo({
                success: ({ model, statusBarHeight }) => {
                    const deviceType = model.replace(/\s/g, "-");
                    const iphoneNew = /iphone-x|iPhone11|iPhone12|iPhone13/i.test(
                        deviceType
                    );
                    cache = {
                        isIPhoneX: iphoneNew,
                        statusBarHeight
                    };
                    resolve(cache);
                },
                fail: reject
            });
        }
    });
}

export const safeArea = ({
    safeAreaInsetBottom = true,
    safeAreaInsetTop = false
} = {}) =>
    Behavior({
        properties: {
            safeAreaInsetTop: {
                type: Boolean,
                value: safeAreaInsetTop
            },
            safeAreaInsetBottom: {
                type: Boolean,
                value: safeAreaInsetBottom
            }
        },

        created() {
            getSafeArea().then(({ isIPhoneX, statusBarHeight }) => {
                this.set({
                    isIPhoneX,
                    statusBarHeight
                });
            });
        }
    });
