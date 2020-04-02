<template>
    <section class="section">
        <b-field grouped>
            <div class="control is-flex">
            <b-field label="Show countries with a minimum number of confirmed cases">
            <b-slider :min="0" :max="5" aria-label="Fan" :tooltip="false" v-model="minCasesActive" @input='updateData(minCasesActive)'>
                <b-slider-tick
                    v-for="(item, index) in minCasesList"
                    :key="index"
                    :value="index"
                >{{ item }}</b-slider-tick>
            </b-slider>
            </b-field> 
            </div>
            <div style="width:70px;"></div>
            <div class="field">
                <b-checkbox v-model="showdetails">show details</b-checkbox>
            </div>
            <!--
            <div style='position:absolute; top:10px; left:10px;'>
                <span class="minor blue" style="opacity:0.23;">data from {{ latest }} </span>
            </div>
            -->
        </b-field>
        <b-table
            :data="dataFiltered"
            :loading="loading"
            ref="table"
            paginated
            per-page="30"
            pagination-position="both"
            :detailed="true"
            narrowed
            is-narrow
            :mobile-cards="false"
            hoverable
            detail-key="country"
            sort-icon="chevron-up"
            sort-icon-size="is-small"
            :show-detail-icon="true"
            default-sort="caseslatest"
            default-sort-direction='desc'

            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            style="min-width:600px;">

            <template slot-scope="props">
                <b-table-column field="country" label="Country" sortable searchable cell-class='countrycell'>
                    <a @click="toggle(props.row)">
                        <strong>{{ props.row.country }}</strong>
                    </a>
                </b-table-column>

                <b-table-column field="caseslatest" label="Confirmed" numeric sortable>
                    <strong>{{ props.row.cases[latest] }}</strong>
                    <br />
                    <span class="minor"> +{{ props.row.casesdifference[latest] }} </span>
                </b-table-column>

                <b-table-column field="caseschangelatest" label="Increase" numeric sortable>
                    <strong>+{{ props.row.caseschange[latest] | numeral('0.0%')}}</strong>
                    <span class="minor" v-if="showdetails">
                    <br />3d avg: +{{ props.row.caseschangelatest3 | numeral('0.0%')}}
                    <br />8d avg: +{{ props.row.caseschangelatest8 | numeral('0.0%')}}
                    </span>
                </b-table-column>
                
                <b-table-column field="caseschangelatest8" :label="'Increase over ' + daysRelChange + ' days'" numeric sortable centered>
                  <div style='width:200px;height:65px;margin:auto;' v-if='true || ["Germany", "US", "Austria", "Italy", "Spain"].includes(props.row.country)'>
                    <sparkline :chart-data='props.row.sparklinesdata' :options='sparklineoptions' :styles='sparklinestyles' />
                  </div>
                </b-table-column>

                <b-table-column field="deathslatest" label="Deceased" numeric sortable header-class='redhead' cell-class='redcell'>
                    <strong>{{ props.row.deaths[latest] }}</strong>
                    <br />
                    <span class="minor red" style="opacity:0.9;"> +{{ props.row.deathsdifference[latest] }} </span>
                </b-table-column>

                <b-table-column field="deathschangelatest" label="Increase " numeric sortable header-class='redhead' cell-class='redcell' >
                    +{{ props.row.deathschange[latest] | numeral('0.0%')}}
                    <span class="minor" v-if="showdetails">
                    <br />3d avg: +{{ props.row.deathschangelatest3 | numeral('0.0%')}}
                    <br />8d avg: +{{ props.row.deathschangelatest8 | numeral('0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativelatest" label="CFR*" numeric sortable header-class='orangehead' cell-class='orangecell' >
                    {{ props.row.deceasedrelative[latest] | numeral('0.0%')}}
                    <span class="minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.deceasedrelativelatest3 | numeral('0.0%')}}
                    <br />8d avg: {{ props.row.deceasedrelativelatest8| numeral('0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativelatest8" :label="'CFR* over ' + daysCFR + ' days'" numeric sortable centered header-class='orangehead' cell-class='orangecell' >
                  <div style='width:200px;height:65px;margin:auto;' v-if='true || ["Germany", "US", "Austria", "Italy", "Spain"].includes(props.row.country)'>
                    <sparkline :chart-data='props.row.sparklinescfrdata' :options='sparklinecfroptions' :styles='sparklinestyles' />
                  </div>

                </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
                <article class="media">
                    <div class="media-content">
                        <div class="content">
                            <cov-detail :chart-data="props.row" />
                            <br />
                            <!-- <small> {{ props.row.cases }}</small> -->
                        </div>
                    </div>
                </article>
            </template>
        </b-table>

      <div class="info">
        Some notes:
        <ul>
          <li>
            - The relative changes in the confirmed cases can be related to a doubling rate, i.e.
            a doubling every 3 days for a daily increase of 26%.
          </li>
          <li>
            - The doubling time is displayed in the tooltip in the sparklines next to the relative increase, i.e. "26% / 3d".
          </li>
          <li>
            - <strong>CFR*</strong> is very crudely calculated by dividing the number of deceased persons by the number of confirmed cases.
          </li>
          <li>
            - The averages given over n number of days are computeed as geometric averages.
          </li>
          <li>
            - Please double check al computed values and graphs. This is a weekend-project for me, thus I only do very limited testing.
          </li>
          <li>
            - The source code and further information can be found on the respective <a href="https://github.com/alexriss/SARS-CoV-2-Analysis"><i class="fab fa-github"></i> github page</a>.
          </li>
        </ul>
        
        <br />
        <p class="minor">
        Data Source: <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Johns Hopkins University</a>
        <br />
        Data included until: {{ latest }}
        </p>
        <br />
      </div>

      <div style='color:red;font-weight:bold;'>
        <div v-for="(item, index) in error" :key="index">
        <strong>{{index}}</strong><br/>
        {{item}}
        <br /><br />
        </div>
      </div>  

      <div>
        <div v-for="(item, index) in debug" :key='index'>
        <strong>{{index}}</strong><br/>
        {{item}}
        <br /><br />
        </div>
      </div>

    </section>
</template>

<script>
    var daysRelChange = 14
    var daysCFR = 30

    var minCasesList = [0,100,500,1000,2000,5000];
    var minCasesActive = 3; // index

    var csvConfirmed = "time_series_covid19_confirmed_global.csv";
    var csvDeceased = "time_series_covid19_deaths_global.csv";
    var githubJH = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";

    var urlPre = "";
    if (window.location.href.indexOf("github.io") >= 0) {
      urlPre = githubJH;
    }

    console.log("loading "+ urlPre + csvConfirmed);
    var csvC = readTextFile(urlPre + csvConfirmed);
    console.log("loading "+ urlPre + csvDeceased);
    var csvD = readTextFile(urlPre + csvDeceased);

    import numeral from 'numeral'
    import Sparkline from '@/components/Sparkline.vue'
    import CovDetail from '@/components/CovDetail.vue'

    // read csv files
    function readTextFile(file)
    {
      var rawFile = new XMLHttpRequest();
      var allText = '';
      rawFile.open("GET", file, false);
      rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
          if(rawFile.status === 200 || rawFile.status == 0)  {
              allText = rawFile.responseText;
          }
        }
      }
      rawFile.send(null);
      // replace Korea, South
      allText = allText.replace('"Korea, South"', 'South Korea');
      // replaces commas within quotes
      allText = allText.replace(/"[^"]+"/g, function (match) {
        return match.replace(/,/g, ' ');
      });
      return allText;
    }

    // get js date from string
    function stringToDate(dateStr) {
      //var mdy = dateStr.split('/');
      //var month = parseInt(mdy[0]);
      //var day = parseInt(mdy[1]);
      //var year = parseInt('20' + mdy[2]);
      //month-=1;
      //var dt = new Date(year,month,day);
      var dt = new Date(dateStr);
      var isoDate = new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString();
      return isoDate.slice(0, 10);
    }

    // calculates the geometric mean of the last n entries in arr
    function geomean(arr, num) {
      var prod = 1;
      for (var i=dates.length-1; i>=dates.length-num; i--) {
        prod *= arr[dates[i]];
      }
      return Math.pow(prod, 1/num);
    }

    // returns row
    function makerow(country, cases, deaths) {
      var caseschange = {};
      var deathschange = {};
      var casesdifference = {}
      var deathsdifference = {}
      var deceasedrelative = {}

      for(var i=0;i<dates.length-1;i++) {
        if (cases[dates[i]] > 0) {
          caseschange[dates[i+1]] = cases[dates[i+1]] / cases[dates[i]] - 1;
        } else {
          caseschange[dates[i+1]] = 0;
        }
        if (deaths[dates[i]] > 0) {
          deathschange[dates[i+1]] = deaths[dates[i+1]] / deaths[dates[i]] - 1;
        } else {
          deathschange[dates[i+1]] = 0;
        }
        casesdifference[dates[i+1]]  = cases[dates[i+1]] - cases[dates[i]];
        deathsdifference[dates[i+1]]  = deaths[dates[i+1]] - deaths[dates[i]];
      }

      dates.forEach(function (item) {
        if (cases[item] > 0) {
          deceasedrelative[item] = deaths[item]  / cases[item];
        } else {
          deceasedrelative[item] = 0;
        }
      });

      var sparklinesdataentries = [];
      for (i=dates.length-1-daysRelChange; i<dates.length; i++) {  // 7 days of sparklines
        sparklinesdataentries.push(caseschange[dates[i]])
      }
      var sparklinesdata = {
        labels: dates.slice(dates.length-1-daysRelChange),
        datasets: [
          {
            label: country,
            data: sparklinesdataentries
          }
        ]
      }

      var sparklinescfrdataentries = [];
      for (i=dates.length-1-daysCFR; i<dates.length; i++) {  // 14 days of sparklinescfr
        sparklinescfrdataentries.push(deceasedrelative[dates[i]]);
      }
      var sparklinescfrdata = {
        labels: dates.slice(dates.length-1-daysCFR),
        datasets: [
          {
            label: country,
            data: sparklinescfrdataentries
          }
        ]
      }

      return {
        'dates': dates, 'country': country, 'cases': cases, 'deaths': deaths,
        'caseslatest': cases[latest], 'deathslatest': deaths[latest],
        'caseschange': caseschange, 'deathschange': deathschange,
        'casesdifference': casesdifference, 'deathsdifference': deathsdifference,
        'caseschangelatest': caseschange[latest], 'deathschangelatest': deathschange[latest],
        'caseschangelatest3': geomean(caseschange, 3), 'deathschangelatest3': geomean(deathschange, 3),
        'caseschangelatest8': geomean(caseschange, 8), 'deathschangelatest8': geomean(deathschange, 8),
        'deceasedrelative': deceasedrelative, 'deceasedrelativelatest': deceasedrelative[latest], 
        'deceasedrelativelatest3': geomean(deceasedrelative, 3),
        'deceasedrelativelatest8': geomean(deceasedrelative, 8), 
        'sparklinesdata': sparklinesdata, 'sparklinescfrdata': sparklinescfrdata
      }
    }

    var debug = [];
    var error = [];

    var arrC = csvC.split("\n");
    var arrD = csvD.split("\n");

    var headerC = arrC.shift().split(','); 
    var headerD = arrD.shift().split(','); 

    // very quick sanity checks
    if (arrC.length != arrD.length) {
      console.log('Files do not match. ' + arrC.length + ' vs. ' + arrD.length)
      error.push('Files do not match. ' + arrC.length + ' vs. ' + arrD.length);
    }
    if (headerC.length != headerD.length) {
      console.log('Files do not match. ' +headerC + ' vs. ' + headerD)
      error.push('Files do not match. ' +headerC + ' vs. ' + headerD);
    }

    var datesStr = headerD.slice(4);
    var dates = Array.from(datesStr, x => stringToDate(x));
    var latest = dates[dates.length - 1];

    var data = [];
    var dataFiltered = [];
    var currCountry = '';
    var country = '';
    var elsC = [];
    var elsD = [];
    var cases = {};
    var deaths = {};
    var casesWorld = {};
    var deathsWorld = {};
    var currCases = 0;
    var currDeaths = 0;

    dates.forEach(function (item) {
      casesWorld[item] = 0;
      deathsWorld[item] = 0;
    });

    for (var i=0; i<arrC.length; i++) {
      elsC = arrC[i].split(',');
      elsD = arrD[i].split(',');
      if (elsC[1] != elsD[1]) {
        console.log('Country mismatch: ' + elsC[1] + ' --- ' + elsD[1]);
        error.push('Country mismatch: ' + elsC[1] + ' --- ' + elsD[1]);
      }
      if (elsC.length < dates.length + 4) {
        continue;
      }
      country = elsC[1];

      if (country != currCountry) {
        if (currCountry != '') {
          data.push(makerow(currCountry, cases, deaths))
        }
        cases = {};
        deaths = {};
        dates.forEach(function (item) {
          cases[item] = 0;
          deaths[item] = 0;
        });
        currCountry = country;
      }
      dates.forEach(function (item, index) {
        currCases = parseInt(elsC[index+4])
        currDeaths = parseInt(elsD[index+4])
        cases[item] += currCases;
        deaths[item] += currDeaths;
        casesWorld[item] += currCases;
        deathsWorld[item] += currDeaths;
      });
    }
    // add last country as well
    data.push(makerow(currCountry, cases, deaths))

    // add world
    data.push(makerow("World", casesWorld, deathsWorld))

    // make initial fitlered data, afterwards it will be updated in the fucntion "updateData"
    for (i=0; i<data.length; i++) {
      if (data[i]['cases'][latest] > 1000) {
        dataFiltered.push(data[i]);
      }
    }

    export default {
        components: {
          Sparkline,
          CovDetail
        },
        data() {
            return {
                data,
                dataFiltered,
                loading: false,
                minCasesList,
                minCasesActive,
                showDetailIcon: true,
                debug,
                error,
                latest,
                showdetails: false,
                daysRelChange,
                daysCFR,
                sparklinestyles: {
                  height: '65px',
                  width: '100%',
                  position: 'relative',
                },
                sparklineoptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false },
                    elements: {
                      point: { radius: 1 },
                      line: { 
                        tension: 0,
                        backgroundColor: '#3179bd',
                        borderColor: '#3179bd',
                        fill: true,
                      }
                    },
                    tooltips: {
                      enabled: true,
                      mode: 'x-axis',
                      displayColors: false,
                      callbacks: {
                        label: function(tooltipItem) {
                          var doubling = 1/(Math.log(1 + tooltipItem.yLabel)/Math.log(2));
                          return numeral(tooltipItem.yLabel).format('0.0%') + ' / ' + numeral(doubling).format('0.0') + 'd';
                        }
                      }
                    },
                    scales: {
                      yAxes: [{
                          display: false,
                          ticks: {
                            min: 0, max: 0.35,
                            callback: function (value) { return numeral(value).format('0,0%') }
                          }
                      }],
                      xAxes: [{
                          display: false
                      }]
                    }
                },
                sparklinecfroptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false },
                    elements: {
                      point: { radius: 1 },
                      line: { 
                        tension: 0,
                        backgroundColor: '#9d3131',
                        borderColor: '#9d3131',
                        fill: true,
                      }
                    },
                    tooltips: {
                      enabled: true,
                      mode: 'x-axis',
                      displayColors: false,
                      callbacks: {
                          label: function(tooltipItem) { return numeral(tooltipItem.yLabel).format('0.0%'); }
                      }
                    },
                    scales: {
                      yAxes: [{
                          display: false,
                          ticks: {
                            min: 0, max: 0.10,
                            callback: function (value) { return numeral(value).format('0,0%') }
                          }
                      }],
                      xAxes: [{
                          display: false
                      }]
                    }
                }
            }
        },
        methods: {
            toggle(row) {
                this.$refs.table.toggleDetails(row)
            },
            updateData: async function(minCasesVal) {
              this.loading = true;
              var minCases = this.minCasesList[minCasesVal];
              var currDate = new Date();
              this.timeDataChange = currDate;

              await new Promise(r => setTimeout(r, 200));  // wait a bit, because user might still be changing the values

              var dataNew = []
              for (i=0; i<this.data.length; i++) {
                if (this.timeDataChange != currDate) {  // some other update occured
                  return false;
                }
                if (this.data[i]['cases'][latest] > minCases) {
                  dataNew.push(this.data[i]);
                }
              }

              if (this.timeDataChange == currDate) {  // some other update occured
                this.dataFiltered = dataNew;
                this.loading = false;
              }
            }
        }
    }
</script>


<style scoped>
.redcell { background-color: rgba(200,30,60,0.3); }
.redhead { background-color: rgba(200,30,60,0.4); }
.orangecell { background-color: rgba(250,150,200,0.3); }
.orangehead { background-color: rgba(250,150,200,0.4); }

.countrycell {
  vertical-align:middle;
  font-size:115%;
}

.minor { opacity:0.65;font-size:small; }
.blue { color: blue; }
.red { color:red; }

.info { text-align:left; }
</style>

<style>
.detail-container { background-color: #e0f0ff; }
</style>

