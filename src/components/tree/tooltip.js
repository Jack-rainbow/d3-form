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
        return {
            tooltip: null,
            chart: null,
            tooltip: null,
            chartpadding: { top: 80, right: 80, bottom: 80, left: 80 }
        };
    },
    watch: {
        "options.tooltipIsShow": {
            handler() {
                console.log(
                    this.options.tooltipIsShow,
                    this.tooltip,
                    "this.options.tooltipIsShow"
                );
                if (this.options.tooltipIsShow) {
                    this.tooltip.attr("style", "display: block");
                } else {
                    this.tooltip.attr("style", "display: none");
                }
            }
        },
        "options.tooltipPadding": {
            handler() {
                this.tooltipPadding = this.options.tooltipPadding;
                let textWidth;
                let textHeight;
                const padding = this.tooltipPadding;
                const chartpadding = this.chartPadding;

                // 修改鼠标悬浮事件
                this.chart.on("mouseover", function(d) {
                    const x = d3.event.layerX - 10 - chartpadding.left;
                    const y = d3.event.layerY - 230;
                    d3.select(".tooltip")
                        .attr("transform", `translate(${x},${y})`)
                        .attr("opacity", 0.7);
                    d3.select(".tooltip")
                        .select("text")
                        .text(`${d.name}:${d.value}`)
                        .attr("width", function() {
                            textWidth = this.getComputedTextLength();
                            textHeight = this.getBBox().height;
                            return 14;
                        });
                    // 更新tooltip矩形的尺寸
                    d3.select(".tooltip")
                        .select("rect")
                        .attr("width", textWidth + padding.left + padding.right)
                        .attr(
                            "height",
                            textHeight + padding.top + padding.bottom
                        );
                });
                this.tooltip
                    .select("text")
                    .attr(
                        "transform",
                        `translate(${this.tooltipPadding.left},${this
                            .tooltipPadding.top + 12})`
                    );
            }
        },
        "options.tooltipColor": {
            handler() {
                this.tooltip
                    .select("rect")
                    .attr("fill", this.options.tooltipColor);
            }
        },
        "options.tooltipBorder": {
            handler() {
                this.tooltip
                    .select("rect")
                    .attr(
                        "style",
                        `stroke-width: ${this.options.tooltipBorder}`
                    );
            }
        },
        "options.tooltipBorderRadius": {
            handler() {
                this.tooltip
                    .select("rect")
                    .attr("rx", `${this.options.tooltipBorderRadius}`)
                    .attr("ry", `${this.options.tooltipBorderRadius}`);
            }
        }
    },
    methods: {
        initTooltip() {
            let _that = this;
            // 添加提示框
            this.tooltip = this.g
                .append("g")
                .attr("class", "tooltip")
                .attr("opacity", 0); // 默认不显示

            this.tooltip
                .append("rect")
                .attr("fill", "#eeeeee")
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("stroke", "black")
                .attr("style", "stroke-width:1");

            this.tooltip
                .append("text")
                .attr("font-size", 12)
                .text(function() {
                    return 2222;
                })
                .attr(
                    "transform",
                    `translate(${this.tooltipPadding.left},${this.tooltipPadding
                        .top + 12})`
                );

            d3.select(".tooltip")
                .select("rect")
                .attr("width", 75)
                .attr("height", 23); // 为提示框设置默认尺寸

            // 提示框跟随鼠标移动
            d3.select("g")
                .on("mouseover", function() {
                    const _text = d3.event.target.textContent;
                    if (d3.event.target.nodeName === "text") {
                        const x =
                            d3.event.layerX - 10 - _that.chartpadding.left;
                        const y = d3.event.layerY - 230;
                        d3.select(".tooltip")
                            .attr("opacity", "0.7")
                            .attr("transform", `translate(${x},${y})`)
                            .select("text")
                            .text(() => _text);
                    }
                })
                .on("mouseout", () => {
                    d3.select(".tooltip").attr("opacity", 0);
                });
        }
    }
};
