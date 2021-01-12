/*eslint-disable */
export default {
    props: {
        options: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            title: null,
            titleText: "Tree",
            titleRectWidth: 460,
            titleRectHeight: 40
        };
    },
    watch: {
        //  更改标题
        "options.titleText": {
            handler() {
                this.titleText = this.options.titleText;
                this.title.select("text").text(this.titleText);
            }
        },
        "options.titleIsShow": {
            handler() {
                if (this.options.titleIsShow) {
                    this.title.attr("style", "display: block");
                } else {
                    this.title.attr("style", "display: none");
                }
            }
        },
        "options.titlePosition": {
            handler() {
                this.updateTitle();
            }
        },
        "options.titleBackground": {
            handler() {
                if (this.options.titleIsShow) {
                    this.title
                        .select("rect")
                        .attr("fill", `${this.options.titleBackground}`);
                }
            }
        },
        "options.titleFontColor": {
            handler() {
                if (this.options.titleIsShow) {
                    this.title
                        .select("text")
                        .attr("fill", `${this.options.titleFontColor}`);
                }
            }
        },
        "options.titleTextPosition": {
            handler() {
                if (this.options.titleIsShow) {
                    // 修改text相对标题rect的位置,来更改文本对齐方式
                    switch (this.options.titleTextPosition) {
                        case "center":
                            this.title
                                .select("text")
                                .attr("text-anchor", "middle")
                                .attr("x", 350);
                            break;
                        case "left":
                            this.title
                                .select("text")
                                .attr("text-anchor", "start")
                                .attr("x", 10);
                            break;
                        case "right":
                            this.title
                                .select("text")
                                .attr("text-anchor", "end")
                                .attr("x", 690);
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        "options.titleFontFamily": {
            handler() {
                if (this.options.titleIsShow) {
                    this.title
                        .select("text")
                        .attr("font-family", `${this.options.titleFontFamily}`);
                }
            }
        },
        "options.titleFontSize": {
            handler() {
                if (this.options.titleIsShow) {
                    this.title
                        .select("text")
                        .attr("font-size", `${this.options.titleFontSize}`);
                }
            }
        }
    },
    methods: {
        initTtile() {
            // 添加图表标题
            this.title = this.svg
                .append("g")
                .attr("style", "display: none")
                .attr("width", 700); // 默认不显示
            // 标题背景框
            this.title
                .append("rect")
                .attr("class", "title")
                .attr("width", 700)
                .attr("height", `${this.titleRectHeight}`)
                .attr("fill", "#E3E3E3");
            // 标题文本
            this.title
                .append("text")
                .text(this.titleText)
                .attr("x", 350)
                .attr("y", 25)
                .attr("text-anchor", "middle")
                .attr("fill", "#000");
        },
        // 更改title
        updateTitle() {
            if (this.options.titleIsShow) {
                // 根据设置进行对应旋转和平移
                switch (this.options.titlePosition) {
                    case "top":
                        this.title.attr(
                            "transform",
                            "rotate(0) translate(0,0)"
                        );
                        break;
                    case "bottom":
                        this.title.attr(
                            "transform",
                            "rotate(0) translate(0,660)"
                        );
                        break;
                    case "left":
                        this.title.attr(
                            "transform",
                            "translate(0,700) rotate(270)"
                        );
                        break;
                    case "right":
                        this.title.attr(
                            "transform",
                            "translate(700,0) rotate(90)"
                        );
                        break;
                    default:
                        break;
                }
            }
        }
    }
};
