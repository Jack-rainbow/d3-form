let numVal: Array<any> = [1, 2, 3, 5, 10, 20, 30, 50];

let enumVal: Array<any> = [
    "1,1",
    "5,5",
    "10,10",
    "20,20",
    "30,30",
    "50,10",
    "20,40"
];

let layout: Array<any> = ["linkHorizontal", "linkVertical"];

export default {
    nodeSize: {
        type: "enum",
        title: "圆点大小",
        values: numVal
    },
    circleBackground: {
        type: "color",
        title: "圆心颜色",
        default: "#E3E3E3"
    },
    size: {
        type: "enum",
        title: "布局尺寸",
        default: [20, 20],
        values: numVal.map(v => {
            return String([v, v * 10]);
        })
    },
    separation: {
        type: "enum",
        title: "间距大小",
        values: numVal
    },
    position: {
        type: "enum",
        title: "链接位置",
        values: layout
    },
    textSize: {
        type: "number",
        title: "文字字号",
        values: [10, 50]
    },
    textMargin: {
        type: "number",
        title: "文字间距",
        default: -6,
        values: [-6, 50]
    },
    sort: {
        type: "boolean",
        title: "是否排序",
        default: false
    }
};
