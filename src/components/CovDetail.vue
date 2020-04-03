<template>
<div class="echarts">
  <v-chart :options="option" style="width: 100%;" />
</div>
</template>

<script>

// scale the display for deceased cases
// var ratioCD = 10;
// var ratioDiffCD = 10;

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
  var casesdifference = [0];
  var deathsdifference = [0];
  var caseschange = [NaN];
  var deathschange = [NaN];
  var deceasedrelative = []

  for (var i = 0; i < dates.length; i++) {
    if (rowdata["cases"][dates[i]] > 0) {  // we dont want zeros for log plots
      cases.push(rowdata["cases"][dates[i]]);
    } else {
      cases.push(NaN);
    }
    if (rowdata["deaths"][dates[i]] > 0) {  // we dont want zeros for log plots
      deaths.push(rowdata["deaths"][dates[i]]);
    } else {
      deaths.push(NaN);
    }
    if (i > 0) {
      casesdifference.push(rowdata["casesdifference"][dates[i]]);
      deathsdifference.push(rowdata["deathsdifference"][dates[i]]);
      caseschange.push(rowdata["caseschange"][dates[i]]);
      deathschange.push(rowdata["deathschange"][dates[i]]);
    }
    deceasedrelative.push(rowdata["deceasedrelative"][dates[i]]);
  }

  return {
    dates: dates,
    cases: cases,
    deaths: deaths,
    casesdifference: casesdifference,
    deathsdifference: deathsdifference,
    caseschange: caseschange,
    deathschange: deathschange,
    deceasedrelative: deceasedrelative,
    // casesMax: Math.max(...cases),
    // deathsMax: Math.max(...deaths),
    // casesdifferenceMax: Math.max(...casesdifference),
    // deathsdifferenceMax: Math.max(...deathsdifference),
  };
}

export default {
  components: {
    'v-chart': ECharts
  },
  props: ['chartData'],
  data() {
    var splitChartData = splitData(this.chartData);
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
            data: ['confirmed: total', 'deceased: total', 'confirmed: daily', 'deceased: daily', 'confirmed: increase', 'deceased: increase'],
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
                    data: splitChartData['dates'],
                    show: false
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: true},
                    data: splitChartData['dates'],
                    position: 'bottom',
                    show: false
                },
                {
                    gridIndex: 2,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {onZero: true},
                    data: splitChartData['dates'],
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
                    // max: splitChartData['casesMax'],
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');   // or '0,0e+0'
                        }
                    },
                    axisLine: { lineStyle: { color: '#0159ad' } },
                },
                {
                    name: 'cumulative deceased',
                    show: true,
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'log',
                    minorTick: { show: true },
                    minorSplitLine: { show: true },
                    // max: splitChartData['casesMax'] / ratioCD,
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');   // or '0,0e+0'
                        }
                    },
                    axisLine: { lineStyle: { color: '#8d0101' } },
                },
                {
                    gridIndex: 1,
                    name: 'daily',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    // max: splitChartData['casesdifferenceMax'],
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');
                        }
                    },
                    axisLine: { lineStyle: { color: '#0159ad' } },
                },
                {
                    gridIndex: 1,
                    name: 'daily deceased',
                    show: true,
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    // max: splitChartData['casesdifferenceMax'] / ratioDiffCD,
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');
                        }
                    },
                    axisLine: { lineStyle: { color: '#8d0101' } },
                },
                {
                    gridIndex: 2,
                    name: 'increase',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    max: function (value) { return Math.min(value.max, 0.5); },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0%');
                        }
                    }
                },
                {
                    gridIndex: 0,
                    name: 'CFR',
                    show: false,
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    max: function (value) { return Math.max(value.max, 0.1); },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0.0%');
                        }
                    }
                }            ],
            series: [
                {
                    name: 'confirmed: total',
                    type: 'line',
                    color: '#3179bd',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['cases'], 
                },
                {
                    name: 'deceased: total',
                    type: 'line',
                    color: '#9d3131',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 0,
                    yAxisIndex: 1,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['deaths'],
                },
                {
                    name: 'confirmed: daily',
                    type: 'bar',
                    barGap: '-100%',
                    barCategoryGap: '10%',
                    color: '#3179bd',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['casesdifference'],
                },
                {
                    name: 'deceased: daily',
                    type: 'bar',
                    color: 'rgba(157,49,49,0.65)', //'#9d3131',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 1,
                    yAxisIndex: 3,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['deathsdifference'],
                },
                {
                    name: 'confirmed: increase',
                    type: 'line',
                    color: '#3179bd',
                    smooth: true,
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    areaStyle: {},
                    xAxisIndex: 2,
                    yAxisIndex: 4,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['caseschange'],
                },
                {
                    name: 'deceased: increase',
                    type: 'line',
                    color: '#9d3131',
                    smooth: true,
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    areaStyle: { opacity: 0.2 },
                    xAxisIndex: 2,
                    yAxisIndex: 4,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['deathschange'],
                },
                {
                    name: 'CFR*',
                    type: 'line',
                    lineStyle: {
                        opacity: 0.2,
                        type: 'solid'
                    },
                    color: '#9d3161',
                    smooth: true,
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    areaStyle: { opacity: 0.2 },
                    xAxisIndex: 0,
                    yAxisIndex: 5,
                    symbolSize: 0,
                    hoverAnimation: true,
                    data: splitChartData['deceasedrelative'],
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
