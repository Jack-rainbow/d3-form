<template>
  <div class="page-tree">
    <TestGrid>
      <div slot="l-box">
        <!-- 这里将bindConfig赋值给组件的options属性，然后在src/components/tree/tree.vue中绘制 -->
        <Tree :options="bindConfig" />
      </div>
      <div slot="r-box">
        <!-- 每一个el-tabs就是一个配置项组，这里只保留了title这一组 -->
        <el-tabs size="small"
          v-model="activeName"
          type="card">
          <el-tab-pane label="title"
            name="first">
            <el-scrollbar style="height: 100%">
              <div class="form-box">
                <HForm v-if="isInited"
                  :formData="formConfigTitle.formData"
                  :items="formConfigTitle.items"
                  @eventdone="eventDone"></HForm>
              </div>
            </el-scrollbar>
          </el-tab-pane>

          <!-- chart -->
          <el-tab-pane label="chart"
            name="sixth">
            <el-scrollbar style="height: 100%">
              <div class="form-box">
                <HForm v-if="isInited"
                  :formData="formConfigChart.formData"
                  :items="formConfigChart.items"
                  @eventdone="eventDoneChart"></HForm>
                <el-collapse>
                  <el-collapse-item>
                    <template slot="title">
                      <span>颜色列表</span>
                      <!-- <el-button size="small" @click="deleteColor(index)">删除</el-button> -->
                    </template>
                    <el-color-picker v-for="(color,index) in colorList"
                      :key="index"
                      :name="index"
                      :title="`Color${index}`"
                      v-model="colorList[index]"
                      :predefine="colorList"
                      @change="eventDoneColorList"></el-color-picker>
                  </el-collapse-item>
                </el-collapse>
              </div>

            </el-scrollbar>

          </el-tab-pane>

          <!-- tooltip -->
          <el-tab-pane label="tooltip"
            name="fifth">
            <el-scrollbar style="height: 100%">
              <div class="form-box">
                <HForm v-if="isInited"
                  :formData="formConfigTooltip.formData"
                  :items="formConfigTooltip.items"
                  @eventdone="eventDoneTooltip"></HForm>
              </div>
            </el-scrollbar>
          </el-tab-pane>
          <!-- size -->
          <el-tab-pane label="size"
            name="second">
            <el-scrollbar style="height: 100%">
              <div class="form-box">
                <HForm v-if="isInited"
                  :formData="formConfigSize.formData"
                  :items="formConfigSize.items"
                  @eventdone="eventDone"></HForm>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <!-- 根据需要还可以添加 tooltip, 颜色列表....等 -->
      </div>
    </TestGrid>
  </div>
</template>
<script>
import { Tree } from '@/index'
import TestGrid from '~/tests/components/test-grid'
import HForm from '~/tests/components/h-form'
// 下面这里请根据你自己的开发情况import相应组件的配置项
import settingTitle from '~/tests/setting-rules/property-setting-barchart-title'
import settingTooltip from '~/tests/setting-rules/property-setting-barchart-tooltip'
import settingChart from '~/tests/setting-rules/property-setting-barchart-chart'
import settingSize from '~/tests/setting-rules/property-setting-tree.setting'
import { cloneDeep } from 'lodash'

export default {
  components: {
    TestGrid,
    HForm,
    Tree,
  },
  data() {
    return {
      configJson: '',
      propertyKeys: ['label', 'value'],
      activeName: 'first',
      isInited: false,
      bindConfig: {
        titleText: 'Tree',
        titleIsShow: false,
        titleBackground: '#E3E3E3',
        titlePosition: 'top',
        titleTextPosition: 'center',
        titleFontSize: 16,
        titleFontFamily: 'Arial',
        titleFontColor: '#000',
        // ... 根据需要添加更多
        tooltipIsShow: true,
        tooltipPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        tooltipColor: '#eee',
        tooltipBorder: '1px',
        tooltipBorderRadius: 0,
        chartBackground: '#eee',
        chartPadding: { top: 80, right: 80, bottom: 80, left: 80 },
        scrollingWidth: 720,
        scrollingHeight: 720,
        colorIndex: 0,
        scrollingIsShow: 'false',
        sortType: null,
        size: '',
      },

      //   右侧配置
      formConfigTitle: {
        formData: {},
        items: [],
      },
      formConfigTooltip: {
        formData: {},
        items: [],
      },
      formConfigChart: {
        formData: {},
        items: [],
      },
      formConfigSize: {
        formData: {},
        items: [],
      },
      colorList: [
        '#BCA2A2',
        '#E0B09F',
        '#CAD9B0',
        '#B0C4D9',
        '#C6B0D9',
        '#F2DEAA',
      ],
      // ...
    }
  },
  // https://cn.vuejs.org/v2/api/#created
  created() {
    // 这里会在实例创建完成后被立即调用。
    // 感兴趣的可以了解下它与 mounted 的不同：https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA
    this.initFormSetting()
  },
  methods: {
    logConfig() {
      const jsonObj = {}
      Object.keys(this.bindConfig).forEach((key) => {
        if (key !== '$el') {
          jsonObj[key] = cloneDeep(this.bindConfig[key])
        }
      })
      this.configJson = JSON.stringify(jsonObj)
    },

    initFormSetting() {
      // 初始化表单设置
      this.buildPropertyGroup(settingTitle)
      this.buildPropertyGroup(settingSize, 'formConfigSize')
      this.buildPropertyGroup(settingTooltip, 'formConfigTooltip')
      let chartSetting = settingChart
      delete chartSetting.sortType
      delete chartSetting.labelPosition
      chartSetting.labelIsShow.default = false
      this.buildPropertyGroup(chartSetting, 'formConfigChart')
      this.$nextTick(() => {
        this.isInited = true
      })
    },
    buildPropertyGroup(group, formObject = 'formConfigTitle') {
      Object.keys(group).forEach((property) => {
        const item = this.getFormItemFromRule(group[property], property)
        if (item) {
          this[formObject].items.push(item)
          this.$set(
            this[formObject].formData,
            property,
            group[property].default
          )
        }
      })
    },
    getFormItemFromRule(rule, property) {
      const propertyKeys = this.propertyKeys.reduce((rec, item) => {
        rec.push({
          label: item,
          value: item,
        })
        return rec
      }, [])
      try {
        const typeRule = `${rule.type}`.toLowerCase()
        switch (typeRule) {
          case 'boolean':
            {
              return {
                formItem: {
                  label: rule.title + '：',
                  prop: property,
                },
                formComp: {
                  is: 'el-switch',
                  'active-color': '#13ce66',
                  'inactive-color': '#ff4949',
                },
                events: {
                  change: `${property}changed${typeRule}`,
                },
              }
            }
            break
          case 'number':
            {
              return {
                formItem: {
                  label: rule.title + '：',
                  prop: property,
                },
                formComp: {
                  is: 'el-slider',
                  debounce: 30,
                  min: rule.values[0],
                  max: rule.values[1],
                  'show-input': true,
                },
                events: {
                  input: `${property}changed${typeRule}`,
                },
              }
            }
            break
          case 'enum':
            {
              return {
                formItem: {
                  label: rule.title + '：',
                  prop: property,
                },
                formComp: {
                  is: 'el-select',
                },
                items: rule.values.reduce((rec, item) => {
                  rec.push({
                    label: item,
                    value: item,
                  })
                  return rec
                }, []),
                events: {
                  change: `${property}changed${typeRule}`,
                },
              }
            }
            break
          case 'color':
            {
              return {
                formItem: {
                  label: rule.title + '：',
                  prop: property,
                },
                formComp: {
                  is: 'el-color-picker',
                },
                events: {
                  change: `${property}changed${typeRule}`,
                },
              }
            }
            break

          case 'string':
            {
              return {
                formItem: {
                  label: rule.title + '：',
                  prop: property,
                },
                formComp: {
                  is: 'el-input',
                },
                events: {
                  change: `${property}changed${typeRule}`,
                },
              }
            }
            break
          case 'propertykeys':
            {
              return {
                formItem: {
                  label: rule.title + '：',
                  prop: property,
                },
                formComp: {
                  is: 'el-select',
                },
                items: propertyKeys,
                events: {
                  change: `${property}changed${typeRule}`,
                },
              }
            }
            break
          default:
            console.log('type rule not mathed:', typeRule)
        }
      } catch (error) {
        console.log(rule)
      }
    },
    // tooltip - form 配置
    eventDoneTooltip(data) {
      // 合并padding对象
      if (data.property.indexOf('Padding') !== -1) {
        const tooltipPadding = {
          left: this.formConfigTooltip.formData.tooltipPaddingLeft,
          right: this.formConfigTooltip.formData.tooltipPaddingRight,
          top: this.formConfigTooltip.formData.tooltipPaddingTop,
          bottom: this.formConfigTooltip.formData.tooltipPaddingBottom,
        }
        this.$set(this.bindConfig, 'tooltipPadding', tooltipPadding)
      } else this.$set(this.bindConfig, data.property, data.args)
    },
    // chart - form配置
    eventDoneChart(data) {
      // 合并padding对象
      if (data.property.indexOf('Padding') !== -1) {
        const chartPadding = {
          left: this.formConfigChart.formData.chartPaddingLeft,
          right: this.formConfigChart.formData.chartPaddingRight,
          top: this.formConfigChart.formData.chartPaddingTop,
          bottom: this.formConfigChart.formData.chartPaddingBottom,
        }
        this.$set(this.bindConfig, 'chartPadding', chartPadding)
      } else this.$set(this.bindConfig, data.property, data.args)
    },

    // chart-改变颜色事件
    eventDoneColorList(data) {
      this.$set(this.bindConfig, 'colorList', data)
    },
    eventDone(data) {
      this.$set(this.bindConfig, data.property, data.args)
    },
  },
}
</script>
<style lang="less" scoped>
.page-tree {
  width: 100%;
  height: 100%;
  /deep/ .r-box {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-tab-pane {
      height: calc(~'100vh - 180px');
      overflow-y: hidden;
    }
    .form-box {
      padding-right: 10px;
    }
  }
}
</style>
