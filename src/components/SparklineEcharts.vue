<template>
  <vchart ref="vchart" :options="options" :init-options="initOptions" style="width: 100%;" />
</template>

<script>
import numeral from 'numeral'
numeral.locale('en');
import ECharts from "vue-echarts";
import 'echarts/lib/langEN';
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/grid"
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/axisPointer";
// import 'zrender/lib/svg/svg';

export default {
  components: {
    'vchart': ECharts
  },
  props: ['chartData'],
  data() {
    return {
        country: this.chartData.country,
        initOptions: {
            renderer: 'canvas',  // at some point we can switch to svg (not seems a bit premature for now)
        },
        options: {
            title: {
                text: this.chartData.country,
                show: true
            },
            xAxis: {
                    show: false,
                    type: 'category',
                    axisLine: {onZero: true},
                    data: this.chartData.sparklinesdata.labels
                    //data: ['a', 'b', 'c']
            },
            yAxis: {
                    show: false,
                    type: 'value',
                    min: 0,
                    max: 0.3,
            },
            series: [
                {
                    name: 'confirmed increase',
                    type: 'line',
                    lineStyle: {
                        opacity: 0.2,
                        type: 'solid'
                    },
                    color: '#3179bd',
                    smooth: true,
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    areaStyle: { opacity:0.69 },
                    symbolSize: 0,
                    hoverAnimation: true,
                    data: this.chartData.sparklinesdata.data
                    //data: [0.1, 0.15, 0.20]
                },
            ]
        }
    };
  },
  mounted() {
  },
  watch: {
    chartData: function() {
        // todo: find a way to update the chart when the table is sorted. the title seems to update, but not the data
        
        this.$refs['vchart'].chart.setOption({
            //title: [{text: ''}]  // we need tu update some parameter, such that the chart is re-rednered
            title: [{text: this.chartData.country}],
            series: this.$refs['vchart'].chart.getOption()['series'].slice()
        });
        // this.$refs['vchart'].init();
        this.$refs['vchart'].resize();
    }
  }
};
</script>

<style>
</style>
