<template>
    <div id='tree-container' :style='{width:600,height:600}' >
    </div>
</template>
<script>
/*eslint-disable */
import * as d3 from 'd3';
import Data from  './data.json';

export default {
    name: 'Tree',
    props:{
        options : {
            type: Object,
            default: ()=>({})
        }
    },
    data(){
        return {
            tree: null,
            g: null,
            chart: null,
            title: null,
            titleText: 'Tree',
            titleRectWidth: 460,
            titleRectHeight: 40,
            width:460,
            height:460,
            chartPadding: {top: 80, right: 80, bottom: 80, left: 80},
            data:Data,
            margin: {
                top: 10,
                right: 120,
                bottom: 10,
                left: 40
            },
            dx: 10,
            dy: 159.16666666666666,
        };
    },
  
    // https://cn.vuejs.org/v2/api/#computed
    // https://cn.vuejs.org/v2/guide/computed.html#%E5%9F%BA%E7%A1%80%E4%BE%8B%E5%AD%90
    computed: {
        // 这里是一些计算属性，当其中涉及的值发生变化时，计算属性会重新计算，返回新的值
        ascendingData(){ 
            // 升序排序
            return this.sortKeyAscending(this.originData,'value');
        },
        descendingData(){
            // 降序排序
            return this.sortKeyDescending(this.originData,'value');
        }
    },
    // https://cn.vuejs.org/v2/api/#watch
    watch: {
        // watch的作用可以监控一个值的变换，并调用因为变化需要执行的方法。可以通过watch动态改变关联的状态。
        // 这里是一些可被修改的配置项，例如图表标题内容、标题是否显示等
        'options.titleText': {
            handler(){
                this.titleText = this.options.titleText;
                this.title.select('text').text(this.titleText);
            }
        },
        'options.titleIsShow': {
            handler() {
                if(this.options.titleIsShow){
                    this.title.attr('style','display: block');
                }else{
                    this.title.attr('style','display: none');
                }
            }
        },
        // 请根据组件需要补充...
    },
      // https://cn.vuejs.org/v2/api/#mounted
    mounted() {
        // 这里会在实例被挂载后调用
        // 初始化图表
        this.initTree();
    },
    // https://cn.vuejs.org/v2/api/#methods
    methods: {
        // 这里是一些组件其余地方会使用到的函数，调用方式为 this.xxxx()
        // 例如mounted中的图表初始化函数 initTree() 就应该被定义在这里
        // 其余与交互、更新有关的函数也都写在这里
        initTree() {
          // 在这里编写初始化图表的代码，以下代码仅供参考，均可调整
          // 可以使用d3绘制可视化图表，具体可参考 bar chart 示例和 README.md 中的链接
          console.log(this.options);

          // 指定图表的宽高
          this.width = 700 - this.chartPadding.right - this.chartPadding.left-180;
          this.height = 700 -this.chartPadding.bottom - this.chartPadding.top-80;
          
          d3.select('#tree-container')
                .style('width','720px')
                .style('height','720px');
          
          // 添加svg
          console.log(this.margin);
          this.svg = d3.select('#tree-container').append('svg')
                .attr('viewBox', [-this.margin.left, -this.margin.top, this.width, this.dx])
                .style('font', '10px sans-serif')
                .style('user-select', 'none');
          
                        //   .attr('style','background: #eee')
                        //   .attr('width',700)
                        //   .attr('height',700);
          // 添加g标签 
          this.g = this.svg.append('g')
                      .attr('class','chart')  // 图表部分
                      .attr('transform',`translate(${this.chartPadding.left+40}, ${this.chartPadding.top+40})`);
          // 添加图表标题
          this.title = this.svg.append('g')
                          .attr('transform','translate(0,0)')
                          .attr('style','display: none');     // 默认不显示
          // 标题背景框
            this.title.append('rect')
                    .attr('class','title')
                    .attr('width', 700)
                    .attr('height',`${this.titleRectHeight}`)
                    .attr('fill','#E3E3E3')
                    .attr('x','0')
                    .attr('y','0');
          // 标题文本       
          this.title.append('text')
                  .text(this.titleText)
                  .attr('x',350)
                  .attr('y',25)
                  .attr('text-anchor','middle')
                  .attr('fill','#000');
            // 图表
            const root = d3.hierarchy(this.data);

            root.x0 = this.dy / 2;
            root.y0 = 0;
            root.descendants().forEach((d, i) => {
                const abc = d;
                abc.id = i;
                abc._children = abc.children;
                if (abc.depth && abc.data.name.length !== 7) abc.children = null;
            });

           

            const gLink = this.svg.append('g')
                .attr('fill', 'none')
                .attr('stroke', '#555')
                .attr('stroke-opacity', 0.4)
                .attr('stroke-width', 1.5);

            
            const gNode = this.svg.append('g')
                .attr('cursor', 'pointer')
                .attr('pointer-events', 'all');
            // update
            const tree = d3.tree().nodeSize([this.dx, this.dy]);
            const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
            let _that = this;
            function _update(source) {
                const duration = d3.event && d3.event.altKey ? 2500 : 250;
                const nodes = root.descendants().reverse();
                const links = root.links();

                // Compute the new tree layout.
                tree(root);

                let left = root;
                let right = root;
                root.eachBefore(node => {
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node;
                });

                const height = right.x - left.x + _that.margin.top + _that.margin.bottom;

                const transition = _that.svg.transition()
                    .duration(duration)
                    .attr('viewBox', [-_that.margin.left, left.x - _that.margin.top, _that.width, _that.height])
                    .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

                // Update the nodes…
                const node = gNode.selectAll('g')
                .data(nodes, d => d.id);

                // Enter any new nodes at the parent's previous position.
                const nodeEnter = node.enter().append('g')
                    .attr('transform', d => `translate(${source.y0},${source.x0})`)
                    .attr('fill-opacity', 0)
                    .attr('stroke-opacity', 0)
                    .on('click', (event, d) => {
                    d.children = d.children ? null : d._children;
                    update(d);
                    });

                nodeEnter.append('circle')
                    .attr('r', 2.5)
                    .attr('fill', d => d._children ? '#555' : '#999')
                    .attr('stroke-width', 10);

                nodeEnter.append('text')
                    .attr('dy', '0.31em')
                    .attr('x', d => d._children ? -6 : 6)
                    .attr('text-anchor', d => d._children ? 'end' : 'start')
                    .text(d => d.data.name)
                .clone(true).lower()
                    .attr('stroke-linejoin', 'round')
                    .attr('stroke-width', 3)
                    .attr('stroke', 'white');

                // Transition nodes to their new position.
                const nodeUpdate = node.merge(nodeEnter).transition(transition)
                    .attr('transform', d => `translate(${d.y},${d.x})`)
                    .attr('fill-opacity', 1)
                    .attr('stroke-opacity', 1);

                // Transition exiting nodes to the parent's new position.
                const nodeExit = node.exit().transition(transition).remove()
                    .attr('transform', d => `translate(${source.y},${source.x})`)
                    .attr('fill-opacity', 0)
                    .attr('stroke-opacity', 0);

                // Update the links…
                const link = gLink.selectAll('path')
                .data(links, d => d.target.id);

                // Enter any new links at the parent's previous position.
                const linkEnter = link.enter().append('path')
                    .attr('d', d => {
                    const o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                    });

                // Transition links to their new position.
                link.merge(linkEnter).transition(transition)
                    .attr('d', diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition(transition).remove()
                    .attr('d', d => {
                    const o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                    });

                // Stash the old positions for transition.
                root.eachBefore(d => {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            _update(root);
        },
    }

};
</script>
<style scoped>
text {
    background: '#000';
}
#tree-container {
    overflow: hidden;
}
</style>