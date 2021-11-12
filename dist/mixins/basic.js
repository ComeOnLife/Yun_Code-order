const _my = require("../../__antmove/api/index.js")(my);
function Behavior(behavior) {
    behavior.$id = Number(new Date()) + String(Math.random()).substring(2, 7);
    return behavior;
}

export const basic = Behavior({
    methods: {
        $emit(...args) {
            this.triggerEvent(...args);
        },

        getRect(selector, all) {
            return new Promise(resolve => {
                _my.createSelectorQuery()
                    .in(this)
                    [all ? "selectAll" : "select"](selector)
                    .boundingClientRect(rect => {
                        if (all && Array.isArray(rect) && rect.length) {
                            resolve(rect);
                        }

                        if (!all && rect) {
                            resolve(rect);
                        }
                    })
                    .exec();
            });
        }
    }
});
