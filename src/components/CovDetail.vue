<template>
<div class="echarts">
  <v-chart :options="option" style="width: 100%;" />
</div>
</template>

<script>
import numeral from 'numeral'
import ECharts from "vue-echarts";
import 'echarts/lib/langEN';
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/component/grid"
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/axisPointer";

function splitData(rowdata) {
  var dates = rowdata['dates'];
  var cases = [];
  var deaths = [];
  var deathstimes = [];
  var casesdifference = [0];
  var deathsdifference = [0];
  var deathsdifferencetimes = [0];
  var caseschange = [NaN];
  var deathschange = [NaN];

  for (var i = 0; i < dates.length; i++) {
    if (rowdata["cases"][dates[i]] > 0) {  // we dont want zeros for log plots
      cases.push(rowdata["cases"][dates[i]]);
    } else {
      cases.push(NaN);
    }
    if (rowdata["deaths"][dates[i]] > 0) {  // we dont want zeros for log plots
      deaths.push(rowdata["deaths"][dates[i]]);
      deathstimes.push(rowdata["deaths"][dates[i]] * 5);
    } else {
      deaths.push(NaN);
      deathstimes.push(NaN);
    }
    if (i > 0) {
      casesdifference.push(rowdata["casesdifference"][dates[i]]);
      deathsdifference.push(rowdata["deathsdifference"][dates[i]]);
      deathsdifferencetimes.push(rowdata["deathsdifference"][dates[i]] * 5);
      caseschange.push(rowdata["caseschange"][dates[i]]);
      deathschange.push(rowdata["deathschange"][dates[i]]);
    }
  }
  
  return {
    dates: dates,
    cases: cases,
    deaths: deaths,
    deathstimes: deathstimes,
    casesdifference: casesdifference,
    deathsdifference: deathsdifference,
    deathsdifferencetimes: deathsdifferencetimes,
    caseschange: caseschange,
    deathschange: deathschange
  };
}

export default {
  components: {
    'v-chart': ECharts
  },
  props: ['chartData'],
  data() {
    //console.log(this.chartData);
    return {
        option: {
            title: {
            text: this.chartData.country,
            left: 55,
            top: '7.2%',
            },
            tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
            },
            legend: {
            data: ['confirmed: total', 'deceased: total x 5', 'confirmed: daily', 'deceased: daily x 5', 'confirmed: increase', 'deceased: increase'],
            left: 55
            },
            toolbox: {
                language: 'en',
                feature: {
                    dataZoom: {
                        title: { zoom: 'zoom', back: 'previous zoom' },
                        yAxisIndex: 'none'
                    },
                    restore: { title: 'reset' },
                    saveAsImage: { title: 'save as image' }
                }
            },
            axisPointer: {
                link: {xAxisIndex: 'all'}
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    type: 'inside',
                    realtime: true,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    type: 'inside',
                    realtime: true,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    type: 'inside',
                    realtime: true,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    type: 'inside',
                    realtime: true,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    type: 'inside',
                    realtime: true,
                    xAxisIndex: [0, 1, 2]
                },
                {
                    xAxisIndex: [0, 1, 2],
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }
            ],
            grid: [{
                left: 50,
                right: 50,
                top: '8%',
                height: '25%'
            }, {
                left: 50,
                right: 50,
                top: '36.5%',
                height: '25%'
            },  {
                left: 50,
                right: 50,
                top: '65%',
                height: '20%'
            }],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: true},
                    data: splitData(this.chartData)['dates'],
                    show: false
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: true},
                    data: splitData(this.chartData)['dates'],
                    position: 'bottom',
                    show: false
                },
                {
                    gridIndex: 2,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: true},
                    data: splitData(this.chartData)['dates'],
                    position: 'bottom'
                }
            ],
            yAxis: [
                {
                    name: 'cumulative',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'log',
                    minorTick: { show: true },
                    minorSplitLine: { show: true },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');   // or '0,0e+0'
                        }
                    }
                },
                {
                    gridIndex: 1,
                    name: 'daily',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');
                        }
                    }
                },
                {
                    gridIndex: 2,
                    name: 'increase',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    max: 0.4,
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0%');
                        }
                    }
                }
            ],
            series: [
                {
                    name: 'confirmed: total',
                    type: 'line',
                    color: '#3179bd',
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitData(this.chartData)['cases'], 
                },
                {
                    name: 'deceased: total x 5',
                    type: 'line',
                    color: '#9d3131',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitData(this.chartData)['deathstimes'],
                },
                {
                    name: 'confirmed: daily',
                    type: 'bar',
                    barGap: '-90%',
                    barCategoryGap: '10%',
                    color: '#3179bd',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitData(this.chartData)['casesdifference'],
                },
                {
                    name: 'deceased: daily x 5',
                    type: 'bar',
                    color: 'rgba(157,49,49,0.65)', //'#9d3131',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitData(this.chartData)['deathsdifferencetimes'],
                },
                {
                    name: 'confirmed: increase',
                    type: 'line',
                    color: '#3179bd',
                    areaStyle: {},
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitData(this.chartData)['caseschange'],
                },
                {
                    name: 'deceased: increase',
                    type: 'line',
                    color: '#9d3131',
                    areaStyle: { opacity: 0.2 },
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitData(this.chartData)['deathschange'],
                }
            ]
        }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.echarts {
  width: 100%;
  height: 500px;
}
</style>
