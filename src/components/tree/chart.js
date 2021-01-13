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
            colorList: [
                "#BCA2A2",
                "#E0B09F",
                "#CAD9B0",
                "#B0C4D9",
                "#C6B0D9",
                "#F2DEAA"
            ],
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
                // for (let i = 0; i < this.data.length; i++) {
                //     this.data[i].color = this.options.colorList[i];
                // }
                this.originData = this.data;
                // 更新颜色列表后重新传入新数据
                // TODO 待实现
                // switch (this.options.sortType) {
                //     case "null":
                //         this.chart.data(this.data);
                //         break;
                //     case "ascending":
                //         this.chart.data(this.sortKeyAscending(this.originData));
                //         break;
                //     case "descending":
                //         this.chart.data(
                //             this.sortKeyDescending(this.originData)
                //         );
                //         break;
                //     default:
                //         break;
                // }

                // 更新bars和图例的颜色
                d3.select(".line").attr("stroke", a);
                // this.legend.select("rect").style("fill", function(d) {
                //     return d.color;
                // });
            }
        },
        "options.scrollingIsShow": {
            handler() {
                if (this.options.scrollingIsShow) {
                    d3.select("#tree-container").style("overflow", "scroll");
                } else {
                    d3.select("#tree-container").style("overflow", "hidden");
                }
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
        // "options.labelPosition": {
        //     handler() {
        //         this.options.labelIsShow && this.updateDataLabel();
        //     }
        // }
        // TODO 待去除
        // "options.sortType": {
        //     handler() {
        //         // 根据排序类型更新数据
        //         switch (this.options.sortType) {
        //             case "null":
        //                 this.nameArray = this.data.map(item => {
        //                     return item.name;
        //                 });
        //                 this.valueArray = this.data.map(item => {
        //                     return item.value;
        //                 });
        //                 this.chart.data(this.data);
        //                 break;
        //             case "ascending":
        //                 this.nameArray = this.ascendingData.map(item => {
        //                     return item.name;
        //                 });
        //                 this.valueArray = this.ascendingData.map(item => {
        //                     return item.value;
        //                 });
        //                 this.chart.data(this.ascendingData);
        //                 break;
        //             case "descending":
        //                 this.nameArray = this.descendingData.map(item => {
        //                     return item.name;
        //                 });
        //                 this.valueArray = this.descendingData.map(item => {
        //                     return item.value;
        //                 });
        //                 this.chart.data(this.descendingData);
        //                 break;
        //             default:
        //                 break;
        //         }

        //         // 更新排序后的x轴标签
        //         this.xscale = d3
        //             .scaleBand()
        //             .domain(this.nameArray)
        //             .rangeRound([0, this.width])
        //             .padding(0.1);

        //         // 更新图例颜色
        //         // this.legend.select('rect')
        //         //     .style('fill', function(d){
        //         //         return d.color;
        //         //     });

        //         this.updateYAxis();
        //         this.updateAxis();
        //         this.updateBars();
        //     }
        // }
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

            // TODO 下边暂时不生效
            // 用于取消点击图例后bar的边框效果
            this.chart.on("click", function(e) {
                console.log(e, "----");
                //     d3.selectAll(".bar")
                //         .attr("opacity", 1)
                //         .attr("style", "stroke-width:0");
            });
            // TODO 下边暂时不生效
            // bar的悬浮显示提示框
            console.log(this.chart);
            this.chart
                .on("mouseover", function(d) {
                    console.log(d, "-------------");
                    const x = d3.event.layerX - 50 - chartpadding.left;
                    const y = d3.event.layerY - chartpadding.top;
                    d3.select(".tooltip")
                        .attr("transform", `translate(${x},${y})`) // 提示框跟随鼠标移动
                        .attr("opacity", 0.7);
                    d3.select(".tooltip")
                        .select("text")
                        .text(`${d.name}:${d.value}`);
                })
                .on("mouseout", function() {
                    d3.select(".tooltip").attr("opacity", 0);
                });
        }
    }
};
