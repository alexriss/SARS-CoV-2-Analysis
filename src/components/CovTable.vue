<template>
    <section class="section">
        <b-field group-multiline>
            <div class="control is-flex">
            <div>
              <b-tooltip :delay="tooltipDelay" multilined label="The increases show in the table and graphs can be calculated either with respect to the total number of previous cases or with respect to the cases within the last two weeks.">
              <b-select v-model="increaseType" expanded icon="chart-area" @input='updateData()'>
                  <option value="total">relative Increase</option>
                  <option value="14day">2-week relative Increase</option>
              </b-select>
              </b-tooltip>
            </div>
            <div style="width:70px;"></div>
              <b-tooltip :delay="tooltipDelay" multilined label="Only countries with this minimum number of cases will be shown.">
              <b-field label="Minimum number of confirmed cases">
              <b-slider :min="0" :max="5" aria-label="Fan" :tooltip="false" v-model="minCasesActive" @input='updateData()'>
                  <b-slider-tick
                      v-for="(item, index) in minCasesList"
                      :key="index"
                      :value="index"
                  >{{ item }}</b-slider-tick>
              </b-slider>
              </b-field> 
              </b-tooltip>
            </div>
            <div style="width:70px;"></div>
            <div class="field">
              <b-tooltip :delay="tooltipDelay" multilined label="Additionally show states and provinces in the list.">
              <b-checkbox v-model="showprovinces" @input='updateData()'>Show states/provinces</b-checkbox>
              </b-tooltip>
            </div>
            <div style="width:70px;"></div>
            <div class="field">
              <b-tooltip :delay="tooltipDelay" multilined label="Show extra in the list.">
              <b-checkbox v-model="showdetails">Extra details</b-checkbox>
              </b-tooltip>
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
            default-sort="casesLatest"
            default-sort-direction="desc"
            @sort="closeAllDetails()"

            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            style="min-width:600px;">

            <template slot-scope="props">
                <b-table-column field="country" label="Country" sortable searchable cell-class='countrycell'>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='You can filter specific countries. Try to type "Germ|Spa" into the text field.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                    <a @click="toggle(props.row)">
                        <strong>{{ props.row.country }}</strong>
                    </a>
                </b-table-column>

                <b-table-column field="casesLatest" label="Confirmed" numeric sortable>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='Total number and last-day increase of confirmed cases.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                    <strong class='tablenumber'>{{ props.row.cases[latest] | numeral('0,0') }}</strong>
                    <br />
                    <span class="minorcolor">{{ props.row.casesdaily[latest] | numeral('+0,0') }} </span>
                </b-table-column>

                <b-table-column field="casesChangeLatest" label="Increase" numeric sortable>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='The relative increase of the number of confirmed cases. This is either with respect to all confirmed cases or with respect to the number of cases observed within the last two weeks.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                    <strong class="tablenumber">{{ props.row.casesChange[latest] | numeral('+0.0%')}}</strong>
                    <span class="minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.casesChangeLatest3 | numeral('+0.0%')}}
                    <br />8d avg: {{ props.row.casesChangeLatest8 | numeral('+0.0%')}}
                    </span>
                </b-table-column>
                
                <b-table-column field="casesChangeLatest8" :label="'Increase over ' + daysRelChange + ' days'" numeric sortable centered>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='The relative increase of the number of confirmed cases within the last 14 days. Again, this is either with respect to all confirmed cases or with respect to the number of cases observed within the last two weeks.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                  <div style='width:200px;height:65px;margin:auto;' v-if='true || ["Germany", "US", "Austria", "Italy", "Spain"].includes(props.row.country)'>
                    <sparkline :chart-data='props.row.sparklinesdata' :options='sparklineoptions' :styles='sparklinestyles' />
                  </div>
                </b-table-column>

                <b-table-column field="deathsLatest" label="Deceased" numeric sortable header-class='redhead' cell-class='redcell'>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='Total number and last-day increase of deceased people.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                    <strong class='tablenumber'>{{ props.row.deaths[latest] | numeral('0,0') }}</strong>
                    <br />
                    <span class="minorcolor red" style="opacity:0.9;"> {{ props.row.deathsdaily[latest] | numeral('+0,0') }} </span>
                </b-table-column>

                <b-table-column field="deathsChangeLatest" label="Increase " numeric sortable header-class='redhead' cell-class='redcell' >
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='The relative increase of the number of deceased people. This is either with respect to all deceased cases or with respect to the number of deceased cases within the last two weeks.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                    {{ props.row.deathsChange[latest] | numeral('+0.0%')}}
                    <span class="minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.deathsChangeLatest3 | numeral('+0.0%')}}
                    <br />8d avg: {{ props.row.deathsChangeLatest8 | numeral('+0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativeLatest" label="CFR*" numeric sortable header-class='orangehead' cell-class='orangecell' >
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='CFR* is calculated by the ratio of the current total number of deceased cases divided by current total number of confirmed cases.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                    {{ props.row.deceasedrelative[latest] | numeral('0.0%')}}
                    <span class="minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.deceasedrelativeLatest3 | numeral('0.0%')}}
                    <br />8d avg: {{ props.row.deceasedrelativeLatest8| numeral('0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativeLatest8" :label="'CFR* over ' + daysCFR + ' days'" numeric sortable centered header-class='orangehead' cell-class='orangecell' >
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='The ratio of the current total number of deceased cases divided by current total number of confirmed cases. Shown over the last 30 days.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
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
                            <!-- <br />
                            <small> {{ props.row.cases }}</small> -->
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

    var minCasesList = [0,500,1000,2000,5000, 10000];
    var minCasesActive = 3; // index

    var csvConfirmed = "time_series_covid19_confirmed_global.csv";
    var csvDeceased = "time_series_covid19_deaths_global.csv";
    var githubJH = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";

    var provincesAlwaysShow = ["Hong Kong", "Macau"]

    var urlPre = "";
    if (window.location.href.indexOf("github.io") >= 0) {
      urlPre = githubJH;
    }

    // var sparklineGradient = ctx.createLinearGradient(0, 0, 0, 400);
    // sparklineGradient.addColorStop(0, 'rgba(250,174,50,1)');   
    // sparklineGradient.addColorStop(1, 'rgba(250,174,50,0)')

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
      var dt = new Date(dateStr);
      var isoDate = new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString();
      return isoDate.slice(0, 10);
    }

    // calculates the geometric mean of the last n entries in arr
    function arrMean(arr, num, geom=false) {
      if (geom) {
        let prod = 1;
        for (let i=dates.length-1; i>=dates.length-num; i--) {
          prod *= arr[dates[i]];
        }
        return Math.pow(prod, 1/num);
      } else {
        let sum = 0;
        for (let i=dates.length-1; i>=dates.length-num; i--) {
          sum += arr[dates[i]];
        }
        return sum/num;
      }
    }

    // returns row
    function makerow(country, cases, deaths, isprovince=false) {
      var casesChange = {};
      var deathsChange = {};
      var casesdaily = {};
      var deathsdaily = {};
      var deceasedrelative = {};
      var casesChangeLast14 = {}; // cases for last 14 days
      var deathsChangeLast14 = {}; // deaths for last 14 days
      var casesLast14 = 0;
      var deathsLast14 = 0;

      for(var i=0;i<dates.length-1;i++) {
        // daily cases
        casesdaily[dates[i+1]]  = cases[dates[i+1]] - cases[dates[i]];
        deathsdaily[dates[i+1]]  = deaths[dates[i+1]] - deaths[dates[i]];

        // relative change with respect to sum of all cases
        if (cases[dates[i]] > 0) {
          casesChange[dates[i+1]] = cases[dates[i+1]] / cases[dates[i]] - 1;
        } else {
          casesChange[dates[i+1]] = 0;
        }
        if (deaths[dates[i]] > 0) {
          deathsChange[dates[i+1]] = deaths[dates[i+1]] / deaths[dates[i]] - 1;
        } else {
          deathsChange[dates[i+1]] = 0;
        }

        // daily change with respect to sum of cases within last 14 days
        if (i >= 14) {
          casesLast14 = cases[dates[i]] - cases[dates[i-14]];
          deathsLast14 = deaths[dates[i]] - deaths[dates[i-14]];
        } else {
          casesLast14 = cases[dates[i]];
          deathsLast14 = deaths[dates[i]];
        }
        if (casesLast14 > 0) {
          casesChangeLast14[dates[i+1]] = casesdaily[dates[i+1]] / casesLast14;
          deathsChangeLast14[dates[i+1]] = deathsdaily[dates[i+1]] / deathsLast14;
        } else {
          casesChangeLast14[dates[i+1]] = 0;
          casesChangeLast14[dates[i+1]] = 0;
        }  
      }

      dates.forEach(function (item) {
        if (cases[item] > 0) {
          deceasedrelative[item] = deaths[item]  / cases[item];
        } else {
          deceasedrelative[item] = 0;
        }
      });

      var sparklinesdataentries = [];
      var sparklinesdataentriesLast14 = [];
      for (i=dates.length-1-daysRelChange; i<dates.length; i++) {  // 7 days of sparklines
        sparklinesdataentries.push(casesChange[dates[i]])
        sparklinesdataentriesLast14.push(casesChangeLast14[dates[i]])
      }
      var sparklinesdataTotal = {
        labels: dates.slice(dates.length-1-daysRelChange),
        datasets: [
          {
            label: country,
            data: sparklinesdataentries
          }
        ]
      }
      var sparklinesdataLast14 = {
        labels: dates.slice(dates.length-1-daysRelChange),
        datasets: [
          {
            label: country,
            data: sparklinesdataentriesLast14
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
        'dates': dates, 'country': country, 'isprovince': isprovince,
        'cases': cases, 'deaths': deaths, 'casesLatest': cases[latest], 'deathsLatest': deaths[latest],

        'casesChange': casesChangeLast14, 'deathsChange': deathsChange,
        'casesdaily': casesdaily, 'deathsdaily': deathsdaily,
        
        'casesChangeLatest': casesChangeLast14[latest], 'casesChangeLatest3': arrMean(casesChangeLast14, 3), 'casesChangeLatest8': arrMean(casesChangeLast14, 8), 
        'deathsChangeLatest': deathsChange[latest], 'deathsChangeLatest3': arrMean(deathsChange, 3), 'deathsChangeLatest8': arrMean(deathsChange, 8),

        'deceasedrelative': deceasedrelative, 'deceasedrelativeLatest': deceasedrelative[latest],
        'deceasedrelativeLatest3': arrMean(deceasedrelative, 3),
        'deceasedrelativeLatest8': arrMean(deceasedrelative, 8), 

        'sparklinesdata': sparklinesdataLast14, 'sparklinescfrdata': sparklinescfrdata,

        'options': {
          'casesChange': {'total': casesChange, '14day': casesChangeLast14},
          'casesChangeLatest': {'total': casesChange[latest], '14day': casesChangeLast14[latest]}, 
          'casesChangeLatest3': {'total': arrMean(casesChange, 3), '14day': arrMean(casesChangeLast14, 3)}, 
          'casesChangeLatest8': {'total': arrMean(casesChange, 8), '14day': arrMean(casesChangeLast14, 8)}, 
          'deathsChange': {'total': deathsChange, '14day': deathsChangeLast14},
          'deathsChangeLatest': {'total': deathsChange[latest], '14day': deathsChangeLast14[latest]}, 
          'deathsChangeLatest3': {'total': arrMean(deathsChange, 3), '14day': arrMean(deathsChangeLast14, 3)}, 
          'deathsChangeLatest8': {'total': arrMean(deathsChange, 8), '14day': arrMean(deathsChangeLast14, 8)}, 
          'sparklinesdata': {'total': sparklinesdataTotal, '14day': sparklinesdataLast14},
        }
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
    var currProvince = '';
    var country = '';
    var elsC = [];
    var elsD = [];
    var cases = {};
    var deaths = {};
    var currCases = {};
    var currDeaths = {};
    var casesWorld = {};
    var deathsWorld = {};
    var currCasesEntry = 0;
    var currDeathsEntry = 0;
    var isprovince = false;

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
      currCountry = elsC[1];
      currProvince = elsC[0];

      if (country != currCountry) {
        if (country != '') {
          data.push(makerow(country, cases, deaths))
        }
        cases = {};
        deaths = {};
        dates.forEach(function (item) {
          cases[item] = 0;
          deaths[item] = 0;
        });
        country = currCountry;
      }

      currCases = {};
      currDeaths = {};
      dates.forEach(function (item, index) {
        currCasesEntry = parseInt(elsC[index+4])
        currDeathsEntry = parseInt(elsD[index+4])
        cases[item] += currCasesEntry;
        deaths[item] += currDeathsEntry;
        currCases[item] = currCasesEntry;
        currDeaths[item] = currDeathsEntry;
        casesWorld[item] += currCasesEntry;
        deathsWorld[item] += currDeathsEntry;
      });
      if (currProvince.length > 0) {
        if (provincesAlwaysShow.includes(currProvince)) {
          isprovince = false;
        }
        else {
          isprovince = true;
        }
        data.push(makerow(currCountry + ' - ' + currProvince, currCases, currDeaths, isprovince))
      }
    }
    // add last country as well
    data.push(makerow(country, cases, deaths))

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
                increaseType: '14day',
                showdetails: false,
                showprovinces: false,
                tooltipDelay: 650,
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
                          let doublingStr = '';
                          if (tooltipItem.yLabel <= 0) {
                            doublingStr = '∞ d';
                          }
                          else {
                            let doubling = 1/(Math.log(1 + tooltipItem.yLabel)/Math.log(2));
                            if (doubling > 366) {
                              doublingStr = '>1y';
                            }
                            else {
                              doublingStr = numeral(doubling).format('0.0') + 'd';
                            }
                          }
                          return numeral(tooltipItem.yLabel).format('0.0%') + ' / ' + doublingStr;
                        }
                      }
                    },
                    scales: {
                      yAxes: [{
                          display: false,
                          ticks: {
                            min: 0, max: 0.25,
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
                            min: 0, max: 0.135,
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
            updateData: async function() {
              this.loading = true;
              this.$refs.table.visibleDetailRows  = [];
              var minCases = this.minCasesList[this.minCasesActive];
              var currDate = new Date();
              this.timeDataChange = currDate;

              await new Promise(r => setTimeout(r, 200));  // wait a bit, because user might still be changing the values

              let dataNew = [];
              let increaseType = this.increaseType;
              for (i=0; i<this.data.length; i++) {
                if (this.timeDataChange != currDate) {  // some other update occured
                  return false;
                }
                if (!this.data[i]['isprovince'] || this.showprovinces) {  // provinces 
                  if (this.data[i]['cases'][latest] > minCases) {  // mincases
                    let d = this.data[i];
                    Object.keys(d['options']).forEach(function(key) {  // 14day or total increase type
                      d[key] = d['options'][key][increaseType];
                    });
                    dataNew.push(d);
                  }
                }
              }

              if (this.timeDataChange == currDate) {  // some other update occured
                this.dataFiltered = dataNew;
                this.loading = false;
              }
            },
            closeAllDetails: function() {
              this.$refs.table.visibleDetailRows  = [];
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
.minorcolor { opacity:0.65; }
.blue { color: blue; }
.red { color:red; }

.info { text-align:left; }

strong.tablenumber { font-size:110%; }

</style>

<style>
.detail-container { background-color: #e0f0ff; }
</style>

