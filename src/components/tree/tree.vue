<template>
  <div id='tree-container'
    :style='{width:600,height:600}'>
  </div>
</template>
<script>
/*eslint-disable */
import * as d3 from 'd3'
import Data from './data.json'

export default {
  name: 'Tree',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tree: null,
      g: null,
      chart: null,
      title: null,
      titleText: 'Tree',
      titleRectWidth: 460,
      titleRectHeight: 40,
      width: 460,
      height: 460,
      chartPadding: { top: 80, right: 80, bottom: 80, left: 80 },
      data: Data,
      margin: {
        top: 10,
        right: 120,
        bottom: 10,
        left: 40,
      },
      dx: 10,
      dy: 159.16666666666666,

      // 。。。。。
      legend: null,
      tooltip: null,
      legendBox: null,
      brush: null,
      gBrush: null,
      legendWidth: 80,
      legendHeight: 170,
      xAxis: null,
      yAxis: null,
      xscale: null,
      yscale: null,
      nameArray: null,
      valueArray: null,
      tooltipPadding: { top: 5, right: 5, bottom: 5, left: 5 },
      originData: Data,
    }
  },

  // https://cn.vuejs.org/v2/api/#computed
  // https://cn.vuejs.org/v2/guide/computed.html#%E5%9F%BA%E7%A1%80%E4%BE%8B%E5%AD%90
  computed: {
    // 这里是一些计算属性，当其中涉及的值发生变化时，计算属性会重新计算，返回新的值
    ascendingData() {
      // 升序排序
      return this.sortKeyAscending(this.originData, 'value')
    },
    descendingData() {
      // 降序排序
      return this.sortKeyDescending(this.originData, 'value')
    },
  },
  // https://cn.vuejs.org/v2/api/#watch
  watch: {
    // watch的作用可以监控一个值的变换，并调用因为变化需要执行的方法。可以通过watch动态改变关联的状态。
    // 这里是一些可被修改的配置项，例如图表标题内容、标题是否显示等

    //  更改标题
    'options.titleText': {
      handler() {
        this.titleText = this.options.titleText
        this.title.select('text').text(this.titleText)
      },
    },
    'options.titleIsShow': {
      handler() {
        if (this.options.titleIsShow) {
          this.title.attr('style', 'display: block')
        } else {
          this.title.attr('style', 'display: none')
        }
      },
    },
    'options.titlePosition': {
      handler() {
        this.updateTitle()
      },
    },
    'options.titleBackground': {
      handler() {
        if (this.options.titleIsShow) {
          this.title
            .select('rect')
            .attr('fill', `${this.options.titleBackground}`)
        }
      },
    },
    'options.titleFontColor': {
      handler() {
        if (this.options.titleIsShow) {
          this.title
            .select('text')
            .attr('fill', `${this.options.titleFontColor}`)
        }
      },
    },
    'options.titleTextPosition': {
      handler() {
        if (this.options.titleIsShow) {
          // 修改text相对标题rect的位置,来更改文本对齐方式
          switch (this.options.titleTextPosition) {
            case 'center':
              this.title
                .select('text')
                .attr('text-anchor', 'middle')
                .attr('x', 350)
              break
            case 'left':
              this.title
                .select('text')
                .attr('text-anchor', 'start')
                .attr('x', 10)
              break
            case 'right':
              this.title
                .select('text')
                .attr('text-anchor', 'end')
                .attr('x', 690)
              break
            default:
              break
          }
        }
      },
    },
    'options.titleFontFamily': {
      handler() {
        if (this.options.titleIsShow) {
          this.title
            .select('text')
            .attr('font-family', `${this.options.titleFontFamily}`)
        }
      },
    },
    'options.titleFontSize': {
      handler() {
        if (this.options.titleIsShow) {
          this.title
            .select('text')
            .attr('font-size', `${this.options.titleFontSize}`)
        }
      },
    },
    // 请根据组件需要补充...
    'options.legendIsShow': {
      handler() {
        if (this.options.legendIsShow) {
          this.legendBox.attr('style', 'display: block')
        } else {
          this.legendBox.attr('style', 'display: none')
        }
      },
    },
    'options.legendPosition': {
      handler() {
        if (this.options.legendIsShow) {
          this.updateLegendPosition() // 更新图例位置
        }
      },
    },
    'options.legendAlign': {
      handler() {
        if (this.options.legendIsShow) {
          if (this.options.legendAlign === 'vertical') {
            // 垂直排列
            this.legendWidth = 80
            this.legendHeight = 170
            this.legend = this.legendBox
              .selectAll('.legend')
              .attr('transform', function (d, i) {
                return `translate(10, ${i * 25})`
              })
          } else {
            // 水平排列
            this.legendWidth = 430
            this.legendHeight = 40
            this.legend = this.legendBox
              .selectAll('.legend')
              .attr('transform', function (d, i) {
                return `translate(${i * 70},0)`
              })
          }
          // 更新图例位置
          this.updateLegendPosition()
        }
      },
    },
    'options.xAxisIsShow': {
      handler() {
        if (this.options.xAxisIsShow) {
          this.xAxis.attr('style', 'display: block')
        } else {
          this.xAxis.attr('style', 'display: none')
        }
      },
    },
    'options.xAxisPosition': {
      handler() {
        if (this.options.xAxisIsShow) {
          let ys = this.yscale
          if (this.options.xAxisPosition === 'top') {
            this.xAxis
              .attr('transform', 'translate(0, 0)')
              .call(d3.axisTop(this.xscale))
            this.xAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('transform', 'translate(0,-5)')
            // 更新y轴--当x轴载上方时,y轴要进行反转
            this.updateYAxis()
            // 所有bar上沿对齐
            this.chart.selectAll('.bar').attr('y', 0)
          } else {
            this.xAxis
              .attr('transform', `translate(0, ${this.height})`)
              .call(d3.axisBottom(this.xscale))
            this.xAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('transform', 'translate(0,0)')
            // 更新y轴
            this.updateYAxis()
            ys = this.yscale
            // 所有bar下沿对齐
            this.chart.selectAll('.bar').attr('y', function (item) {
              return ys(item.value)
            })
          }
          if (this.options.yAxisPosition === 'left')
            this.yAxis
              .attr('transform', 'translate(0, 0)')
              .call(d3.axisLeft(this.yscale).ticks(6))
          else
            this.yAxis
              .attr('transform', `translate(${this.width},0)`)
              .call(d3.axisRight(this.yscale).ticks(6))

          // 更新bar对应的数据标签位置
          this.updateDataLabel()
        }
      },
    },
    'options.xAxisLabelIsShow': {
      handler() {
        if (this.options.xAxisIsShow) {
          if (this.options.xAxisLabelIsShow) {
            this.xAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('style', 'display: block')
          } else {
            this.xAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('style', 'display: none')
          }
        }
      },
    },
    'options.xAxisTickIsShow': {
      handler() {
        if (this.options.xAxisIsShow) {
          if (this.options.xAxisTickIsShow) {
            this.xAxis
              .selectAll('.tick')
              .selectAll('.axis-tick')
              .attr('style', 'display: block')
          } else {
            this.xAxis
              .selectAll('.tick')
              .selectAll('.axis-tick')
              .attr('style', 'display: none')
          }
        }
      },
    },
    'options.xAxisGridIsShow': {
      handler() {
        this.updateGrid()
        if (this.options.xAxisGridIsShow) {
          this.xAxis.selectAll('.grid').attr('style', 'display: block')
        } else {
          this.xAxis.selectAll('.grid').attr('style', 'display: none')
        }
      },
    },
    'options.yAxisIsShow': {
      handler() {
        if (this.options.yAxisIsShow) {
          this.yAxis.attr('style', 'display: block')
        } else {
          this.yAxis.attr('style', 'display: none')
        }
      },
    },
    'options.yAxisTickIsShow': {
      handler() {
        if (this.options.yAxisIsShow) {
          if (this.options.yAxisTickIsShow) {
            this.yAxis
              .selectAll('.tick')
              .selectAll('.axis-tick')
              .attr('style', 'display: block')
          } else {
            this.yAxis
              .selectAll('.tick')
              .selectAll('.axis-tick')
              .attr('style', 'display: none')
          }
        }
      },
    },
    'options.yAxisLabelIsShow': {
      handler() {
        if (this.options.yAxisIsShow) {
          if (this.options.yAxisLabelIsShow) {
            this.yAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('style', 'display: block')
          } else {
            this.yAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('style', 'display: none')
          }
        }
      },
    },
    'options.yAxisPosition': {
      handler() {
        if (this.options.yAxisIsShow) {
          if (this.options.yAxisPosition === 'left') {
            this.yAxis
              .attr('transform', 'translate(0, 0)')
              .call(d3.axisLeft(this.yscale).ticks(6))
            this.yAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('text-anchor', 'end')
            this.yAxis.selectAll('.grid').attr('x2', this.width)
          } else {
            this.yAxis
              .attr('transform', `translate(${this.width},0)`)
              .call(d3.axisRight(this.yscale).ticks(6))
            this.yAxis
              .selectAll('.tick')
              .selectAll('.axis-label')
              .attr('text-anchor', 'start')
            this.yAxis.selectAll('.grid').attr('x2', -this.width)
          }
        }
      },
    },
    'options.yAxisScale': {
      handler() {
        this.updateYAxis()
      },
    },
    'options.yAxisNice': {
      handler() {
        this.updateYAxis()
      },
    },
    'options.yAxisGridIsShow': {
      handler() {
        this.updateGrid()
        if (this.options.yAxisGridIsShow) {
          this.yAxis.selectAll('.grid').attr('style', 'display: block')
        } else {
          this.yAxis.selectAll('.grid').attr('style', 'display: none')
        }
      },
    },
    'options.tooltipIsShow': {
      handler() {
        if (this.options.tooltipIsShow) {
          this.tooltip.attr('style', 'display: block')
        } else {
          this.tooltip.attr('style', 'display: none')
        }
      },
    },
    // 'options.tooltipPadding': {
    //   handler() {
    //     this.tooltipPadding = this.options.tooltipPadding
    //     let textWidth
    //     let textHeight
    //     const padding = this.tooltipPadding
    //     const chartpadding = this.chartPadding

    //     // 修改鼠标悬浮事件
    //     this.chart.on('mouseover', function (d) {
    //       const x = d3.event.layerX - 50 - chartpadding.left
    //       const y = d3.event.layerY - chartpadding.top
    //       d3.select('.tooltip')
    //         .attr('transform', `translate(${x},${y})`)
    //         .attr('opacity', 0.7)
    //       d3.select('.tooltip')
    //         .select('text')
    //         .text(`${d.name}:${d.value}`)
    //         .attr('width', function () {
    //           textWidth = this.getComputedTextLength()
    //           textHeight = this.getBBox().height
    //           return 14
    //         })
    //       // 更新tooltip矩形的尺寸
    //       d3.select('.tooltip')
    //         .select('rect')
    //         .attr('width', textWidth + padding.left + padding.right)
    //         .attr('height', textHeight + padding.top + padding.bottom)
    //     })
    //     this.tooltip
    //       .select('text')
    //       .attr(
    //         'transform',
    //         `translate(${this.tooltipPadding.left},${
    //           this.tooltipPadding.top + 12
    //         })`
    //       )
    //   },
    // },
    'options.tooltipColor': {
      handler() {
        this.tooltip.select('rect').attr('fill', this.options.tooltipColor)
      },
    },
    // 'options.tooltipBorder': {
    //   handler() {
    //     this.tooltip
    //       .select('rect')
    //       .attr('style', `stroke-width: ${this.options.tooltipBorder}`)
    //   },
    // },
    'options.tooltipBorderRadius': {
      handler() {
        this.tooltip
          .select('rect')
          .attr('rx', `${this.options.tooltipBorderRadius}`)
          .attr('ry', `${this.options.tooltipBorderRadius}`)
      },
    },
    'options.chartBackground': {
      handler() {
        this.svg.attr('style', `background: ${this.options.chartBackground}`)
      },
    },
    // 'options.chartPadding': {
    //   handler() {
    //     this.chartPadding = this.options.chartPadding

    //     // 更新图表部分尺寸
    //     this.width =
    //       700 - this.chartPadding.right - this.chartPadding.left - 180
    //     this.height =
    //       700 - this.chartPadding.bottom - this.chartPadding.top - 80

    //     // 更新比例尺
    //     this.xscale = d3
    //       .scaleBand()
    //       .domain(this.nameArray)
    //       .rangeRound([0, this.width])
    //       .padding(0.1)
    //     this.yscale = d3
    //       .scaleLinear()
    //       .domain([0, d3.max(this.valueArray) * 1.1])
    //       .rangeRound([this.height, 0])

    //     this.g.attr(
    //       'transform',
    //       `translate(${this.chartPadding.left + 40}, ${
    //         this.chartPadding.top + 40
    //       })`
    //     )

    //     // 更新鼠标悬浮事件
    //     const chartpadding = this.chartPadding
    //     this.chart.on('mouseover', function (d) {
    //       const x = d3.event.layerX - 50 - chartpadding.left
    //       const y = d3.event.layerY - chartpadding.top
    //       d3.select('.tooltip')
    //         .attr('transform', `translate(${x},${y})`)
    //         .attr('opacity', 0.7)
    //       d3.select('.tooltip').select('text').text(`${d.name}:${d.value}`)
    //     })

    //     // 更新brush可刷选范围
    //     this.brush.extent([
    //       [0, 0],
    //       [this.width, this.height],
    //     ])
    //     this.gBrush.call(this.brush)

    //     // 更新图表的绘制
    //     this.updateGrid()
    //     this.updateBars()
    //     this.updateAxis()
    //     this.updateLegendPosition()
    //     this.updateTitle()
    //   },
    // },
    'options.colorList': {
      handler() {
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].color = this.options.colorList[i]
        }
        this.originData = this.data
        // 更新颜色列表后重新传入新数据
        switch (this.options.sortType) {
          case 'null':
            this.chart.data(this.data)
            break
          case 'ascending':
            this.chart.data(this.sortKeyAscending(this.originData))
            break
          case 'descending':
            this.chart.data(this.sortKeyDescending(this.originData))
            break
          default:
            break
        }

        // 更新bars和图例的颜色
        this.chart.select('rect').attr('fill', function (item) {
          return item.color
        })
        this.legend.select('rect').style('fill', function (d) {
          return d.color
        })
      },
    },
    'options.scrollingIsShow': {
      handler() {
        if (this.options.scrollingIsShow) {
          d3.select('#bar-chart-container').style('overflow', 'scroll')
        } else {
          d3.select('#bar-chart-container').style('overflow', 'hidden')
        }
      },
    },
    'options.scrollingWidth': {
      handler() {
        if (this.options.scrollingIsShow) {
          d3.select('#bar-chart-container').style(
            'width',
            `${this.options.scrollingWidth}px`
          )
        }
      },
    },
    'options.scrollingHeight': {
      handler() {
        if (this.options.scrollingIsShow) {
          d3.select('#bar-chart-container').style(
            'height',
            `${this.options.scrollingHeight}px`
          )
        }
      },
    },
    'options.labelIsShow': {
      handler() {
        if (this.options.labelIsShow) {
          this.dataLabel.attr('style', 'display: block')
        } else {
          this.dataLabel.attr('style', 'display: none')
        }
      },
    },
    'options.labelPosition': {
      handler() {
        if (this.options.labelIsShow) {
          this.updateDataLabel()
        }
      },
    },
    'options.sortType': {
      handler() {
        // 根据排序类型更新数据
        switch (this.options.sortType) {
          case 'null':
            this.nameArray = this.data.map((item) => {
              return item.name
            })
            this.valueArray = this.data.map((item) => {
              return item.value
            })
            this.chart.data(this.data)
            break
          case 'ascending':
            this.nameArray = this.ascendingData.map((item) => {
              return item.name
            })
            this.valueArray = this.ascendingData.map((item) => {
              return item.value
            })
            this.chart.data(this.ascendingData)
            break
          case 'descending':
            this.nameArray = this.descendingData.map((item) => {
              return item.name
            })
            this.valueArray = this.descendingData.map((item) => {
              return item.value
            })
            this.chart.data(this.descendingData)
            break
          default:
            break
        }

        // 更新排序后的x轴标签
        this.xscale = d3
          .scaleBand()
          .domain(this.nameArray)
          .rangeRound([0, this.width])
          .padding(0.1)

        // 更新图例颜色
        // this.legend.select('rect')
        //     .style('fill', function(d){
        //         return d.color;
        //     });

        this.updateYAxis()
        this.updateAxis()
        this.updateBars()
      },
    },
  },
  // https://cn.vuejs.org/v2/api/#mounted
  mounted() {
    // 这里会在实例被挂载后调用
    // 初始化图表
    this.initTree()
  },
  // https://cn.vuejs.org/v2/api/#methods
  methods: {
    sortKeyAscending(array, key) {
      return array.sort(function (a, b) {
        const x = a[key]
        const y = b[key]
        return y > x ? -1 : x < y ? 1 : 0
      })
    },
    sortKeyDescending(array, key) {
      return array.sort(function (a, b) {
        const x = a[key]
        const y = b[key]
        return y < x ? -1 : x > y ? 1 : 0
      })
    },
    // 这里是一些组件其余地方会使用到的函数，调用方式为 this.xxxx()
    // 例如mounted中的图表初始化函数 initTree() 就应该被定义在这里
    // 其余与交互、更新有关的函数也都写在这里
    initTree() {
      // 在这里编写初始化图表的代码，以下代码仅供参考，均可调整
      // 可以使用d3绘制可视化图表，具体可参考 bar chart 示例和 README.md 中的链接
      console.log(this.options)

      // 指定图表的宽高
      this.width = 700 - this.chartPadding.right - this.chartPadding.left - 180
      this.height = 700 - this.chartPadding.bottom - this.chartPadding.top - 80

      d3.select('#tree-container')
        .style('width', '720px')
        .style('height', '720px')

      // 添加svg
      console.log(this.margin)
      this.svg = d3
        .select('#tree-container')
        .append('svg')
        .attr('viewBox', [
          -this.margin.left,
          -this.margin.top,
          this.width,
          this.dx,
        ])
        .style('font', '10px sans-serif')
        .style('user-select', 'none')

      //   .attr('style','background: #eee')
      //   .attr('width',700)
      //   .attr('height',700);
      // 添加g标签
      this.g = this.svg
        .append('g')
        .attr('class', 'chart') // 图表部分
        .attr(
          'transform',
          `translate(${this.chartPadding.left + 40}, ${
            this.chartPadding.top + 40
          })`
        )
      // 添加图表标题
      this.title = this.svg
        .append('g')
        .attr('transform', 'translate(0,0)')
        .attr('style', 'display: none') // 默认不显示
      // 标题背景框
      this.title
        .append('rect')
        .attr('class', 'title')
        .attr('width', 700)
        .attr('height', `${this.titleRectHeight}`)
        .attr('fill', '#E3E3E3')
        .attr('x', '0')
        .attr('y', '0')
      // 标题文本
      this.title
        .append('text')
        .text(this.titleText)
        .attr('x', 350)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
      // 图表
      const root = d3.hierarchy(this.data)

      root.x0 = this.dy / 2
      root.y0 = 0
      root.descendants().forEach((d, i) => {
        const abc = d
        abc.id = i
        abc._children = abc.children
        if (abc.depth && abc.data.name.length !== 7) abc.children = null
      })

      const gLink = this.svg
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)

      const gNode = this.svg
        .append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all')
      // update
      const tree = d3.tree().nodeSize([this.dx, this.dy])
      const diagonal = d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
      let _that = this
      function _update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250
        const nodes = root.descendants().reverse()
        const links = root.links()

        // Compute the new tree layout.
        tree(root)

        let left = root
        let right = root
        root.eachBefore((node) => {
          if (node.x < left.x) left = node
          if (node.x > right.x) right = node
        })

        const height = right.x - left.x + _that.margin.top + _that.margin.bottom

        const transition = _that.svg
          .transition()
          .duration(duration)
          .attr('viewBox', [
            -_that.margin.left,
            left.x - _that.margin.top,
            _that.width,
            _that.height,
          ])
          .tween(
            'resize',
            window.ResizeObserver ? null : () => () => svg.dispatch('toggle')
          )

        // Update the nodes…
        const node = gNode.selectAll('g').data(nodes, (d) => d.id)

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node
          .enter()
          .append('g')
          .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)
          .on('click', (event, d) => {
            d.children = d.children ? null : d._children
            update(d)
          })

        nodeEnter
          .append('circle')
          .attr('r', 2.5)
          .attr('fill', (d) => (d._children ? '#555' : '#999'))
          .attr('stroke-width', 10)

        nodeEnter
          .append('text')
          .attr('dy', '0.31em')
          .attr('x', (d) => (d._children ? -6 : 6))
          .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
          .text((d) => d.data.name)
          .clone(true)
          .lower()
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
          .attr('stroke', 'white')

        // Transition nodes to their new position.
        const nodeUpdate = node
          .merge(nodeEnter)
          .transition(transition)
          .attr('transform', (d) => `translate(${d.y},${d.x})`)
          .attr('fill-opacity', 1)
          .attr('stroke-opacity', 1)

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node
          .exit()
          .transition(transition)
          .remove()
          .attr('transform', (d) => `translate(${source.y},${source.x})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)

        // Update the links…
        const link = gLink.selectAll('path').data(links, (d) => d.target.id)

        // Enter any new links at the parent's previous position.
        const linkEnter = link
          .enter()
          .append('path')
          .attr('d', (d) => {
            const o = { x: source.x0, y: source.y0 }
            return diagonal({ source: o, target: o })
          })

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition).attr('d', diagonal)

        // Transition exiting nodes to the parent's new position.
        link
          .exit()
          .transition(transition)
          .remove()
          .attr('d', (d) => {
            const o = { x: source.x, y: source.y }
            return diagonal({ source: o, target: o })
          })

        // Stash the old positions for transition.
        root.eachBefore((d) => {
          d.x0 = d.x
          d.y0 = d.y
        })
      }

      _update(root)
    },

    // 更改title
    updateTitle() {
      if (this.options.titleIsShow) {
        // 根据设置进行对应旋转和平移
        switch (this.options.titlePosition) {
          case 'top':
            this.title.attr('transform', 'rotate(0) translate(0,0)')
            break
          case 'bottom':
            this.title.attr('transform', 'rotate(0) translate(0,660)')
            break
          case 'left':
            this.title.attr('transform', 'translate(0,700) rotate(270)')
            break
          case 'right':
            this.title.attr('transform', 'translate(700,0) rotate(90)')
            break
          default:
            break
        }
      }
    },
    brushed() {
      const select = d3.event.selection
      const xs = this.xscale
      const d = xs.bandwidth() / 2
      // 刷选中的bar透明度增加并出现边框
      d3.selectAll('.bar')
        .attr('opacity', function (item) {
          const position = xs(item.name)
          if (position + d >= select[0] && position + d <= select[1]) return 0.8
          return 1
        })
        .attr('style', function (item) {
          const position = xs(item.name)
          if (position + d >= select[0] && position + d <= select[1])
            return 'stroke-width:2'
          return 'stroke-width:0'
        })

      // 刷选中的legend透明度增加并出现边框
      d3.selectAll('.legend').attr('style', function (item) {
        const position = xs(item.name)
        if (position + d >= select[0] && position + d <= select[1])
          return 'stroke-width:1'
        return 'stroke-width:0'
      })
    },
    updateAxis() {
      let ys = this.yscale
      // 更新x轴
      if (this.options.xAxisPosition === 'top') {
        this.xAxis
          .attr('transform', 'translate(0, 0)')
          .call(d3.axisTop(this.xscale))
        this.xAxis
          .selectAll('.tick')
          .selectAll('.axis-label')
          .attr('transform', 'translate(0,-5)')
        this.updateYAxis()
        ys = this.yscale
        this.chart.selectAll('.bar').attr('y', 0)
      } else {
        this.xAxis
          .attr('transform', `translate(0, ${this.height})`)
          .call(d3.axisBottom(this.xscale))
        this.xAxis
          .selectAll('.tick')
          .selectAll('.axis-label')
          .attr('transform', 'translate(0,0)')
        this.updateYAxis()
        ys = this.yscale
        this.chart.selectAll('.bar').attr('y', function (item) {
          return ys(item.value)
        })
      }
      // 更新数据标签
      this.updateDataLabel()
    },
    updateYAxis() {
      if (this.options.yAxisIsShow) {
        if (this.options.yAxisNice) {
          // 采用了nice
          switch (this.options.yAxisScale) {
            case 'scaleLinear':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleLinear()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([this.height, 0])
                  .nice()
              else
                this.yscale = d3
                  .scaleLinear()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([0, this.height])
                  .nice()
              break
            case 'scaleBand':
              this.yscale = d3
                .scaleBand()
                .domain([0, d3.max(this.valueArray) * 1.1])
                .rangeRound([0, this.height])
                .padding(0.1)
              break
            case 'scaleOrdinal':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleOrdinal()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .nice()
              break
            case 'scaleQuantize':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleQuantize()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .range([this.height, 0])
                  .nice()
              else
                this.yscale = d3
                  .scaleQuantize()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .range([0, this.height])
                  .nice()
              break
            case 'scaleTime':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleTime()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([this.height, 0])
                  .nice()
              else
                this.yscale = d3
                  .scaleTime()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([0, this.height])
                  .nice()
              break
            default:
              break
          }
        } else {
          // 未采用nice
          switch (this.options.yAxisScale) {
            case 'scaleLinear':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleLinear()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([this.height, 0])
              else
                this.yscale = d3
                  .scaleLinear()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([0, this.height])
              break
            case 'scaleBand':
              this.yscale = d3
                .scaleBand()
                .domain([0, d3.max(this.valueArray) * 1.1])
                .rangeRound([0, this.height])
                .padding(0.1)
              break
            case 'scaleOrdinal':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleOrdinal()
                  .domain([0, d3.max(this.valueArray) * 1.1])
              break
            case 'scaleQuantize':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleQuantize()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .range([this.height, 0])
              else
                this.yscale = d3
                  .scaleQuantize()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .range([0, this.height])
              break
            case 'scaleTime':
              if (this.options.xAxisPosition === 'bottom')
                this.yscale = d3
                  .scaleTime()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([this.height, 0])
              else
                this.yscale = d3
                  .scaleTime()
                  .domain([0, d3.max(this.valueArray) * 1.1])
                  .rangeRound([0, this.height])
              break
            default:
              break
          }
        }
        if (this.options.yAxisPosition === 'left')
          this.yAxis
            .attr('transform', 'translate(0, 0)')
            .call(d3.axisLeft(this.yscale).ticks(6))
        else
          this.yAxis
            .attr('transform', `translate(${this.width},0)`)
            .call(d3.axisRight(this.yscale).ticks(6))
      }
    },
    updateBars() {
      // 重新绘制bars
      const chartheight = this.height
      const xs = this.xscale
      const ys = this.yscale

      this.chart
        .selectAll('rect')
        .attr('class', 'bar')
        .attr('x', function (item) {
          return xs(item.name)
        })
        .attr('width', this.xscale.bandwidth())
        .attr('y', function (item) {
          return ys(item.value)
        })
        .attr('height', function (item) {
          return chartheight - ys(item.value)
        })
        .attr('fill', function (item) {
          return item.color
        })
    },
    updateGrid() {
      if (this.options.yAxisPosition === 'left') {
        this.yAxis.selectAll('.grid').attr('x2', this.width)
      } else {
        this.yAxis.selectAll('.grid').attr('x2', -this.width)
      }
      if (this.options.xAxisPosition === 'bottom') {
        this.xAxis.selectAll('.grid').attr('y1', -this.height)
      } else {
        this.xAxis.selectAll('.grid').attr('y1', this.height)
      }
    },
    updateDataLabel() {
      const ys = this.yscale
      const h = this.height
      if (this.options.xAxisPosition === 'top') {
        switch (this.options.labelPosition) {
          case 'top':
            this.dataLabel.attr('y', function (item) {
              return ys(item.value) - 5
            })
            break
          case 'bottom':
            this.dataLabel.attr('y', 16)
            break
          case 'innner':
            this.dataLabel.attr('y', function (item) {
              return ys(item.value) / 2
            })
            break
          default:
            break
        }
      } else {
        switch (this.options.labelPosition) {
          case 'top':
            this.dataLabel.attr('y', function (item) {
              return ys(item.value) + 16
            })
            break
          case 'bottom':
            this.dataLabel.attr('y', this.height - 5)
            break
          case 'innner':
            this.dataLabel.attr('y', function (item) {
              return (h - ys(item.value)) / 2 + ys(item.value)
            })
            break
          default:
            break
        }
      }
      const xs = this.xscale
      this.dataLabel.attr('x', function (item) {
        return xs(item.name) + xs.bandwidth() / 2
      })
    },
    updateLegendPosition() {
      switch (this.options.legendPosition) {
        case 'top':
          this.legendBox.attr(
            'transform',
            `translate(${this.width / 2 - this.legendWidth / 2},${
              -this.legendHeight - 20
            })`
          )
          break
        case 'bottom':
          this.legendBox.attr(
            'transform',
            `translate(${this.width / 2 - this.legendWidth / 2},${
              this.height + 20
            })`
          )
          break
        case 'left':
          this.legendBox.attr(
            'transform',
            `translate(${-this.legendWidth - 40},${
              this.height / 2 - this.legendHeight / 2
            })`
          )
          break
        case 'right':
          this.legendBox.attr(
            'transform',
            `translate(${this.width + 40},${
              this.height / 2 - this.legendHeight / 2
            })`
          )
          break
        case 'left-top':
          this.legendBox.attr(
            'transform',
            `translate(${-this.legendWidth - 40},0)`
          )
          break
        case 'right-top':
          this.legendBox.attr('transform', `translate(${this.width + 40},0)`)
          break
        case 'left-bottom':
          this.legendBox.attr(
            'transform',
            `translate(${-this.legendWidth - 40},${
              this.height - this.legendHeight
            })`
          )
          break
        case 'right-bottom':
          this.legendBox.attr(
            'transform',
            `translate(${this.width + 40},${this.height - this.legendHeight})`
          )
          break
        default:
          break
      }
    },
  },
}
</script>
<style scoped>
text {
  background: '#000';
}
#tree-container {
  overflow: hidden;
}
</style>
