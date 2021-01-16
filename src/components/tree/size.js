/*eslint-disable */
import * as d3 from "d3";
import horizontal from "./layout/horizontal";
import vertical from "./layout/vertical";
import circular from "./layout/circular";

const layouts = {
    horizontal,
    circular,
    vertical
};

export default {
    props: {
        options: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {};
    },
    computed: {
        layoutType() {
            return layouts["vertical"];
        }
    },
    watch: {
        //  指定每个节点的固定大小
        "options.nodeSize": {
            handler(a) {
                d3.selectAll("circle").attr("r", a);
            }
        },
        // 指定在 x 和 y 的布局尺寸
        "options.size": {
            handler(a) {
                let [x, y] = a.split(",");
                this.tree = d3.tree().nodeSize([x, y]);
                this.initTreeNode();
            }
        },
        //获取或设置相邻节点之间的间距的函数
        "options.separation": {
            handler() {
                this.initTreeNode();
            }
        },
        "options.position": {
            handler(a) {
                this.diagonal = d3[a]()
                    .x(d => d.y)
                    .y(d => d.x);
                this.initTreeNode();
            }
        },
        "options.circleBackground": {
            handler(a) {
                d3.selectAll("circle").attr("fill", `${a}`);
            }
        },
        "options.textSize": {
            handler(a) {
                d3.selectAll(".textVal").attr("font-size", `${a}px`);
            }
        },
        "options.textMargin": {
            handler(a) {
                d3.selectAll(".textVal").attr("x", a);
            }
        },
        "options.sort": {
            handler() {
                this.initTreeNode();
            }
        }
    },
    methods: {
        initSize() {}
    }
};
