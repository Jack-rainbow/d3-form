<template>
  <div id='tree-container'
    :style='{width:600,height:600}'>
  </div>
</template>
<script>
/*eslint-disable */
import * as d3 from 'd3'
import Data from './data.json'
import Title from './title.js'
import Chart from './chart.js'
import Tooltip from './tooltip.js'
import Size from './size'
export default {
  name: 'Tree',
  mixins: [Title, Chart, Tooltip, Size],
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
      legend: null,
      tooltip: null,
      legendBox: null,
      brush: null,
      gBrush: null,
      tooltipPadding: { top: 5, right: 5, bottom: 5, left: 5 },
      originData: Data,
      diagonal: null,
      aa: false,
      gNode: null,
      abc: null,
      tree: null,
      gLink: null,
      root: null,
    }
  },
  computed: {
    ascendingData() {
      // 升序排序
      return this.sortKeyAscending(this.originData, 'value')
    },
    descendingData() {
      // 降序排序
      return this.sortKeyDescending(this.originData, 'value')
    },
  },

  mounted() {
    // 初始化图表
    this.initTree()
  },
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

      // 指定图表的宽高
      this.width = 700 - this.chartPadding.right - this.chartPadding.left - 180
      this.height = 700 - this.chartPadding.bottom - this.chartPadding.top - 80
      //   // 比例尺
      const xscale = d3.scaleBand().rangeRound([0, this.width]).padding(0.1)
      const yscale = d3.scaleLinear().rangeRound([this.height, 0]).nice()
      this.xscale = xscale
      this.yscale = yscale
      //   -------------------------------
      // 初始化配置
      this.initSvg()
      this.initTtile()
      this.initChart()
      this.initTooltip()
      //   -------------------------------
      // 图表
      this.root = d3.hierarchy(this.data)

      this.root.x0 = this.dy / 2
      this.root.y0 = 0
      this.root.descendants().forEach((d, i) => {
        const abc = d
        abc.id = i
        abc._children = abc.children
        if (abc.depth && abc.data.name.length !== 7) abc.children = null
      })

      this.gLink = d3
        .select('.chart')
        .append('g')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)

      this.gNode = d3
        .select('.chart')
        .append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all')

      // update
      this.tree = d3
        .tree()
        // https://github.com/d3/d3/wiki/API--%E4%B8%AD%E6%96%87%E6%89%8B%E5%86%8C
        .nodeSize([this.dx, this.dy])
        .separation((a, b) => {
          return a.parent == b.parent
            ? this.options.separation
              ? this.options.separation
              : 1
            : 2
        })

      this.diagonal = d3
        .linkVertical()
        .x((d) => d.y)
        .y((d) => d.x)

      this.initTreeNode(this.root)
    },
    // 初始化tree 图表
    initSvg() {
      let x0 = Infinity
      let x1 = x0

      //  初始化图表宽度
      const tree = d3.select('#tree-container')

      // 添加svg
      this.svg = tree
        .append('svg')
        .attr('width', 700)
        .attr('height', 700)
        // viewBox属性等比例缩放SVG图像
        .attr('viewBox', [0, 0, 700, 700])
        .style('user-select', 'none')
        .attr('style', 'background: #eee')

      this.g = this.svg
        .append('g')
        .attr('class', 'chart')
        .attr('transform', 'translate(100,500)')
        .style('font', '20px sans-serif')
    },

    // 初始化tree -node 节点
    initTreeNode(source) {
      let _that = this

      this.options.sort &&
        this.root
          .sum((d) => d.value)
          .sort((a, b) => {
            return b.value - a.value
          })
      const duration = d3.event && d3.event.altKey ? 2500 : 250
      const nodes = this.root.descendants().reverse()
      const links = this.root.links()

      // Compute the new tree layout.
      this.tree(this.root)

      let left = this.root
      let right = this.root

      const height = right.x - left.x + this.margin.top + this.margin.bottom

      const transition = this.svg
        .transition()
        .duration(duration)
        .tween(
          'resize',
          window.ResizeObserver ? null : () => () => svg.dispatch('toggle')
        )
      // Update the nodes…
      const node = this.gNode.selectAll('g').data(nodes, (d) => d.id)

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', this.click)

      nodeEnter
        .append('circle')
        .attr('r', 2.5)
        .attr('fill', (d) => (d._children ? '#555' : '#999'))
        .attr('stroke-width', 10)

      nodeEnter
        .append('text')
        .attr('class', 'textVal')
        .attr('dy', '0.31em')
        .attr('x', (d) => (d._children ? -6 : 6))
        .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
        .text((d) => d.data.name)
        .clone(true)
        .lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white')
      //   value值
      nodeEnter
        .append('text')
        .attr('class', 'nodeVal')
        .attr('dy', '0.31em')
        .attr('x', (d) => (d._children ? -6 : 100))
        .attr('style', 'display: none')
        .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
        .text((d) => d.data.value)
        .clone(true)
        .lower()

      // Transition nodes to their new position.
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('class', 'link')
        .attr('stroke-opacity', 1)
        .attr('font-size', 10)

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr('transform', (d) => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)

      // Update the links…
      const link = this.gLink.selectAll('path').data(links, (d) => d.target.id)

      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append('path')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 }
          return this.diagonal({ source: o, target: o })
        })

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition).attr('d', this.diagonal)

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition(transition)
        .remove()
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y }
          return this.diagonal({ source: o, target: o })
        })

      // Stash the old positions for transition.
      this.root.eachBefore((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })
    },
    click(d) {
      if (d.children) {
        d._children = d.children
        d.children = null
      } else {
        d.children = d._children
        d._children = null
      }
      this.initTreeNode(d)
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
