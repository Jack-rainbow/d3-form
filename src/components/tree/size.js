/*eslint-disable */
import * as d3 from "d3";
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
    watch: {
        //  指定每个节点的固定大小
        "options.nodeSize": {
            handler(a) {
                d3.selectAll("circle").attr("r", a);
                // let _that = this;
                // const root = d3.hierarchy(_that.data);
                // root.x0 = _that.dy / 2;
                // root.y0 = 0;
                // root.descendants().forEach((d, i) => {
                //     const abc = d;
                //     abc.id = i;
                //     abc._children = abc.children;
                //     if (abc.depth && abc.data.name.length !== 7)
                //         abc.children = null;
                // });
                // this.updateTree(root, a);
            }
        },
        // 指定在 x 和 y 的布局尺寸
        "options.size": {
            handler(a) {
                console.log(a, "--------------");
                d3.tree().size(a.split(",").map(v => +v));
            }
        },
        //获取或设置相邻节点之间的间距的函数
        "options.separation": {
            handler(a) {
                // console.log(d3.tree());
                // d3.tree().separation(function separation(a, b) {
                //     console.log(a, b);
                //     return (a.parent == b.parent ? 5 : 8) / a.depth;
                // });
            }
        },
        "options.position": {
            handler(a) {}
        }
    },
    methods: {
        initSize() {}
    }
};
