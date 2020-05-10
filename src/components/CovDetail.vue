<template>
<div class="echarts" :id="'detail_' + country">
  <v-chart :ref="'detailchart_' + country" :options="options" :init-options="initOptions" style="width: 100%;" />
</div>
</template>

<script>
const seriesNames = ['confirmed total', 'deceased total', 'CFR*', 'confirmed daily', 'deceased daily', 'confirmed w/w increase', 'deceased w/w increase', 'R'];
const formatStrs = ['0,0', '0,0', '0.0%', '0,0', '0,0', '0.0%', '0.0%', '0.00'];
const extraSpaceAfter = [2, 4];  // add extra spacer in the tooltip after those indices of seriesNames
const runningAverage = 11;  // running average over this many points for daily cases chart

import numeral from 'numeral'
numeral.locale('en');
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
// import 'zrender/lib/svg/svg';


// calculate running average
function movingAvg(arrayOrig, count, zeroToNan=true, weighted=false){
    let array = [...arrayOrig];  // clone array, otherwise we will alter the one input here
    let extraEnd = Math.round(count/2);
    let extraStart = count - extraEnd;
    let weightVec = [];

    if (weighted) {  // Gaussian weight function
       weightVec = Array(count).fill().map((_, i) => Math.exp(-1.0 * ((i-extraStart)/(count/4))**2));  // sigma of count/8
       let sum = weightVec.reduce((a,b) => a + b, 0);
       weightVec = weightVec.map((x) => x/sum);  // sigma of count/2
    } else {
       weightVec = Array(count).fill(1/count);
    }

    // expand by constant values
    array.unshift(...Array(extraStart).fill(array[0]))
    array.push(...Array(extraEnd).fill(array[array.length-1]))
    let arrayAvg = [];
    for (let i = extraStart; i < array.length-extraEnd; i++)
    {
        let sum = 0;
        for (let j = 0; j < extraStart + extraEnd; j++) {
            sum += array[i + j - extraStart] * weightVec[j];
        }
        if (zeroToNan && sum == 0) {
            arrayAvg.push(NaN);
        } else {
            arrayAvg.push(sum);
        }
    }
    return arrayAvg;
}

function splitData(rowdata) {
  let dates = rowdata['dates'];
  let cases = [];
  let deaths = [];
  let casesdaily = [0];
  let deathsdaily = [0];
  let casesChange = [0];
  let deathsChange = [0];
  let deceasedrelative = [];
  let casesChangeLast14 = [];
  let deathsChangeLast14 = [];
  let repronum = [];

  for (let i = 0; i < dates.length; i++) {
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
      casesdaily.push(rowdata["casesdaily"][dates[i]]);
      deathsdaily.push(rowdata["deathsdaily"][dates[i]]);
      casesChange.push(rowdata["casesChange"][dates[i]]);
      deathsChange.push(rowdata["deathsChange"][dates[i]]);
    }
    deceasedrelative.push(rowdata["deceasedrelative"][dates[i]]);
    casesChangeLast14.push(rowdata["casesChangeLast14"][dates[i]]);
    deathsChangeLast14.push(rowdata["deathsChangeLast14"][dates[i]]);
    repronum.push(rowdata["repronum"][dates[i]]);
  }

  return {
    dates: dates,
    cases: cases,
    deaths: deaths,
    casesdaily: casesdaily,
    deathsdaily: deathsdaily,
    casesdaily_avg: movingAvg(casesdaily, runningAverage),
    deathsdaily_avg:  movingAvg(deathsdaily, runningAverage),
    casesChange: casesChange,
    deathsChange: deathsChange,
    deceasedrelative: deceasedrelative,
    casesChangeLast14: casesChangeLast14,
    deathsChangeLast14: deathsChangeLast14,
    repronum: repronum,
  };
}

export default {
  components: {
    'v-chart': ECharts
  },
  props: ['chartData'],
  data() {
    let splitChartData = splitData(this.chartData);
    return {
        country: this.chartData.country,
        initOptions: {
            renderer: 'canvas',  // at some point we can switch to svg (not seems a bit premature for now)
        },
        options: {
            title: {
                text: this.chartData.country,
                left: 55,
                top: '7.2%',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                },
                formatter: function(params) {
                    let output = '<table class="tooltiptable"><th colspan="2">' + params[0].name + '</th>';
                    let index = 0;
                    let doubling = 0;
                    let doublingNumStr = '';
                    let doublingStr = '';
                    for (let i = 0; i < formatStrs.length; i++) {
                        index = params.findIndex(p => p.seriesName == seriesNames[i]);  // echarts seems to reorder the tooltip entries, could not find a way to prevent this, so we do a manual ordering
                        if (index < 0) {
                            continue;
                        }
                        if (seriesNames[i] == 'confirmed increase') {
                            if (params[index].value <= 0) {
                                doublingNumStr = '∞ days';
                            }
                            else {
                                doubling = 1/(Math.log(1 + params[index].value)/Math.log(2));
                                if (doubling > 366) {
                                    doublingNumStr = '>1 year';
                                }
                                else {
                                    doublingNumStr = numeral(doubling).format('0.0') + ' days';
                                }
                            }
                            doublingStr = '<span class="tooltipdoubling"> ' + doublingNumStr + ' </span>';
                        }
                        else {
                            doublingStr = '';
                        }
                        output += '<tr><td>' + params[index].marker + params[index].seriesName + ': </td><td class="tooltipnumber">'
                            + doublingStr + numeral(params[index].value).format(formatStrs[i]) + '</td></tr>';
                        if (extraSpaceAfter.includes(i)) {
                            output += '<tr><td colspan="2" class="tooltipspacer"></td><tr>';
                        }
                    }
                    output += '</table>';
                    return output
                }
            },
            legend: {
                data: seriesNames,
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
                    // saveAsImage: {
                    //     show: false,
                    //     title: 'save as image',
                    //     type: 'png'  // should be svg for svg renderer (doesnt seem to work for my image yet)
                    // }
                }
            },
            axisPointer: {
                link: { xAxisIndex: 'all' }
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
                    name: 'confirmed total',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'log',
                    minorTick: { show: true },
                    minorSplitLine: { show: true },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');   // or '0,0e+0'
                        }
                    },
                    axisLine: { lineStyle: { color: '#0159ad' } },
                },
                {
                    name: 'deceased total',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'log',
                    minorTick: { show: true },
                    minorSplitLine: { show: true },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');   // or '0,0e+0'
                        }
                    },
                    axisLine: { lineStyle: { color: '#8d0101' } },
                    splitLine: { show: false },
                },
                {
                    gridIndex: 1,
                    name: 'confirmed daily',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    min: 0,
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');
                        }
                    },
                    axisLine: { lineStyle: { color: '#0159ad' } },
                },
                {
                    gridIndex: 1,
                    name: 'deceased daily',
                    show: true,
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    min: 0,
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0a');
                        }
                    },
                    axisLine: { lineStyle: { color: '#8d0101' } },
                    splitLine: { show: false },
                },
                {
                    gridIndex: 2,
                    name: 'R',
                    show: true,
                    nameLocation: 'center',
                    nameGap: 37,
                    type: 'value',
                    min: 0,
                    max: function (value) { return Math.min(value.max, 3); },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0.0');
                        }
                    },
                    axisLine: { lineStyle: { color: '#01597d' } },
                },
                {
                    gridIndex: 2,
                    name: 'w/w increase',
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    min: function (value) { return Math.max(value.min, -1); },
                    max: function (value) { return Math.min(value.max, 1.5); },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0%');
                        }
                    },
                    splitLine: { show: false },
                },
                {
                    gridIndex: 0,
                    name: 'CFR',
                    show: false,
                    nameLocation: 'center',
                    nameGap: 40,
                    type: 'value',
                    min: 0,
                    max: function (value) { return Math.max(value.max, 0.1); },
                    axisLabel: {
                        formatter: function (val) {
                            return numeral(val).format('0%');
                        }
                    }
                },
            ],
            series: [
                {
                    name: 'confirmed total',
                    type: 'line',
                    lineStyle: {
                        opacity: 1,
                        type: 'solid',
                        width: 3
                    },
                    color: '#3179bd',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['cases'], 
                },
                {
                    name: 'deceased total',
                    type: 'line',
                    lineStyle: {
                        opacity: 1,
                        type: 'solid',
                        width: 3
                    },
                    color: '#9d3131',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 0,
                    yAxisIndex: 1,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['deaths'],
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
                    yAxisIndex: 6,
                    symbolSize: 0,
                    hoverAnimation: true,
                    data: splitChartData['deceasedrelative'],
                },
                {
                    name: 'confirmed daily',
                    type: 'bar',
                    barGap: '-100%',
                    barCategoryGap: '10%',
                    itemStyle: {
                        color: '#3179bd',
                        opacity: 0.6
                    },
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['casesdaily'],
                },
                {
                    name: 'deceased daily',
                    type: 'bar',
                    itemStyle: {
                        color: '#9d3131',
                        opacity: 0.4
                    },
                    // color: 'rgba(157,49,49,0.65)', //'#9d3131',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 1,
                    yAxisIndex: 3,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['deathsdaily'],
                },
                {
                    name: 'confirmed daily running average',
                    type: 'line',
                    lineStyle: {
                        opacity: 1,
                        type: 'solid',
                        width: 3
                    },
                    color: '#11599d',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    symbolSize: 1,
                    hoverAnimation: false,
                    data: splitChartData['casesdaily_avg'],
                },
                {
                    name: 'deceased daily running average',
                    type: 'line',
                    lineStyle: {
                        opacity: 1,
                        type: 'solid',
                        width: 3
                    },
                    color: '#7d1111',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 1,
                    yAxisIndex: 3,
                    symbolSize: 1,
                    hoverAnimation: false,
                    data: splitChartData['deathsdaily_avg'],
                },
                {
                    name: 'deceased w/w increase',
                    type: 'line',
                    lineStyle: {
                        opacity: 0.2,
                        type: 'solid'
                    },
                    color: '#9d3131',
                    smooth: true,
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    areaStyle: { opacity: 0.08 },
                    xAxisIndex: 2,
                    yAxisIndex: 5,
                    symbolSize: 0,
                    hoverAnimation: true,
                    data: splitChartData['deathsChangeLast14'],
                },
                {
                    name: 'confirmed w/w increase',
                    type: 'line',
                    lineStyle: {
                        opacity: 0.2,
                        type: 'solid'
                    },
                    color: '#3179bd',
                    smooth: true,
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    areaStyle: { opacity:0.25 },
                    xAxisIndex: 2,
                    yAxisIndex: 5,
                    symbolSize: 0,
                    hoverAnimation: true,
                    data: splitChartData['casesChangeLast14'],
                },
                {
                    name: 'R',
                    type: 'line',
                    lineStyle: {
                        opacity: 1,
                        type: 'solid',
                        width: 3
                    },
                    color: '#11598d',
                    sampling: 'average',  // average if points are smaller than display size, for better performance
                    xAxisIndex: 2,
                    yAxisIndex: 4,
                    symbolSize: 1,
                    hoverAnimation: true,
                    data: splitChartData['repronum'],
                },
            ]
        }
    };
  },
  mounted() {
      // todo: update chart
      //let chartRef = 'detailchart_' + this.chartData.country;
      //console.log(this.chartData.country);
      //let c = this.chartData.country;
      //console.log(this.$refs[chartRef].chart);
      //let options = this.$refs[chartRef].chart.getOption();
      //console.log(options['title'][0]['text'], this.chartData.country);
      //this.$refs[chartRef].destroy();
      //this.$refs[chartRef].init();
      //this.$refs[chartRef].chart.setOption({
      ///    title: [{text: c +  Math.random()}]
      //});
      //this.$refs[chartRef].chart.resize();

  }
};
</script>

<style>
.echarts {
  width: 100%;
  height: 520px;
}

/* I dont know why I need all these "!important"s, but bulma seems to override everything here otherwise */
table.tooltiptable { border:0; }
table.tooltiptable td, table.tooltiptable th {
     border:0 !important;
     margin: 0 !important;
     padding-top: 0 !important;
     padding-bottom: 0 !important;
}
table.tooltiptable th { color: white !important; }
td.tooltipnumber {
    text-align: right !important; 
    padding-left:6px !important;
}
td.tooltipspacer { height: 10px; }
.tooltipdoubling {
    opacity: 0.69;
    margin-left:2px;
    font-style: italic;
}
</style>
