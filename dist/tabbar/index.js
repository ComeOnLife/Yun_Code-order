my.setStorageSync({
    key: "activeComponent",
    data: {
        is: "/dist/tabbar/index"
    }
});
import { VantComponent } from "../common/component";
import { safeArea } from "../mixins/safe-area";
VantComponent({
    mixins: [safeArea()],
    relation: {
        name: "tabbar-item",
        type: "descendant",

        linked(target) {
            this.children.push(target);
            target.parent = this;
            target.updateFromParent();
        },

        unlinked(target) {
            this.children = this.children.filter(item => item !== target);
            this.updateChildren();
        }
    },
    props: {
        active: {
            type: [Number, String],
            observer: "updateChildren"
        },
        activeColor: {
            type: String,
            observer: "updateChildren"
        },
        inactiveColor: {
            type: String,
            observer: "updateChildren"
        },
        fixed: {
            type: Boolean,
            value: true
        },
        border: {
            type: Boolean,
            value: true
        },
        zIndex: {
            type: Number,
            value: 1
        }
    },

    beforeCreate() {
        this.children = [];
    },

    methods: {
        updateChildren() {
            const { children } = this;

            if (!Array.isArray(children) || !children.length) {
                return Promise.resolve();
            }

            return Promise.all(children.map(child => child.updateFromParent()));
        },

        onChange(child) {
            const index = this.children.indexOf(child);
            const active = child.data.name || index;

            if (active !== this.data.active) {
                this.$emit("change", active);
            }
        }
    }
});
