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
            chart: null
        };
    },
    watch: {
        "options.chartBackground": {
            handler() {
                this.svg.attr(
                    "style",
                    `background: ${this.options.chartBackground}`
                );
            }
        },
        "options.colorList": {
            handler(a) {
                // 更新bars和图例的颜色
                d3.select(".line").attr("stroke", a);
            }
        },
        "options.scrollingIsShow": {
            handler() {
                d3.select("#tree-container").style(
                    "overflow",
                    `${this.options.scrollingIsShow ? "scroll" : "hidden"}`
                );
            }
        },
        "options.scrollingWidth": {
            handler() {
                if (this.options.scrollingIsShow) {
                    d3.select("#tree-container").style(
                        "width",
                        `${this.options.scrollingWidth}px`
                    );
                }
            }
        },
        "options.scrollingHeight": {
            handler() {
                this.options.scrollingIsShow &&
                    d3
                        .select("#tree-container")
                        .style("height", `${this.options.scrollingHeight}px`);
            }
        },
        "options.labelIsShow": {
            handler() {
                d3.selectAll(".nodeVal").attr(
                    "style",
                    `display: ${this.options.labelIsShow ? "block" : "none"}`
                );
            }
        }
    },
    methods: {
        initChart() {
            // 添加chart,实际上就是bars
            this.chart = this.g
                .selectAll("#tree-container")
                .data(this.data)
                .enter()
                .append("g");
            this.chart
                .append("rect")
                .attr("class", "bar")
                .attr("stroke", "black")
                .attr("style", "stroke-width:0")
                .attr("z-index", "100")
                .attr("x", function(item) {
                    return xscale(item.name);
                })
                .attr("width", this.xscale.bandwidth())
                .attr("y", function(item) {
                    return yscale(item.value);
                })
                .attr("height", function(item) {
                    return chartheight - yscale(item.value);
                })
                .attr("fill", function(item) {
                    return item.color;
                });
        }
    }
};
