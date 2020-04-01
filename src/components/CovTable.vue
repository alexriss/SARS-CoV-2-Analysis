<template>
    <section class="section">
        <b-field grouped group-multiline>
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
            <div style='position:absolute; top:20px; right:20px;'>
                <span style="minor blue">data from {{ latest }} </span>
            </div>
        </b-field>
        <b-table
            :data="dataFiltered"
            :loading="loading"
            ref="table"
            paginated
            per-page="30"
            pagination-position="both"
            detailed
            narrowed
            hoverable
            detail-key="country"
            sort-icon="chevron-up"
            sort-icon-size="is-small"
            :show-detail-icon="false"
            default-sort="caseslatest"
            default-sort-direction='desc'

            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page">

            <template slot-scope="props">
                <b-table-column field="country" label="Country" sortable searchable>
                    <a @click="toggle(props.row)">
                        <strong>{{ props.row.country }}</strong>
                    </a>
                </b-table-column>

                <b-table-column field="caseslatest" label="Confirmed" numeric sortable>
                    {{ props.row.cases[latest] }}
                    <br />
                    <span class="minor"> +{{ props.row.casesdifference[latest] }} </span>
                </b-table-column>

                <b-table-column field="caseschangelatest" label="Change" numeric sortable>
                    +{{ props.row.caseschange[latest] | numeral('0.0%')}}
                    <span class="minor">
                    <br />3d avg: +{{ props.row.caseschangelatest3 | numeral('0.0%')}}
                    <br />8d avg: +{{ props.row.caseschangelatest8 | numeral('0.0%')}}
                    </span>
                </b-table-column>
                
                <b-table-column field="caseschangelatest8" :label="'Relative change over ' + daysRelChange + ' days'" numeric sortable centered>
                  <la-cartesian :width="200" :height="60" autoresize :data="props.row.sparklines"  :bound="[0,0.3]" style="margin:auto;">
                    <la-area prop="cc" label='change'></la-area>
                    <la-line prop="value3day" label='3 day doubling' dashed color='#f0a0a0' :tooltip="false"></la-line>
                    <la-line prop="value6day" label='6 day doubling' dashed color='#f0b0b0'></la-line>
                    <la-line prop="value12day" label='12 day doubling' dashed color='#f0c0c0'></la-line>
                    <la-tooltip>
                            <div class="tooltip" slot-scope="propstooltip">
                            <div 
                               v-for="item in propstooltip.actived"
                               :key="item.label">
                            <ul class="list" v-if='item.label=="change"'>
                              <li :style="{ borderTop: '3px solid ' + item.color }">
                                <div class="value">{{ item.value | numeral('0.0%') }}</div>
                              </li>
                            </ul>
                            </div>
                          </div>
                    </la-tooltip>
                  </la-cartesian>
                </b-table-column>

                <b-table-column field="deathslatest" label="Deceased" numeric sortable header-class='redhead' cell-class='redcell'>
                    {{ props.row.deaths[latest] }}
                    <br />
                    <span class="minor red"> +{{ props.row.deathsdifference[latest] }} </span>
                </b-table-column>

                <b-table-column field="deathschangelatest" label="Change " numeric sortable header-class='redhead' cell-class='redcell' >
                    +{{ props.row.deathschange[latest] | numeral('0.0%')}}
                    <span class="minor">
                    <br />3d avg: +{{ props.row.deathschangelatest3 | numeral('0.0%')}}
                    <br />8d avg: +{{ props.row.deathschangelatest8 | numeral('0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativelatest" label="CFR" numeric sortable header-class='redhead' cell-class='redcell' >
                    {{ props.row.deceasedrelative[latest] | numeral('0.0%')}}
                    <span class="minor">
                    <br />3d avg: +{{ props.row.deceasedrelativelatest3 | numeral('0.0%')}}
                    <br />8d avg: +{{ props.row.deceasedrelativelatest8| numeral('0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativelatest8" :label="'CFR over ' + daysCFR + ' days'" numeric sortable centered header-class='redhead' cell-class='redcell' >
                  <la-cartesian :width="200" :height="60" autoresize :data="props.row.sparklinescfr"  :bound="[0,0.10]" style="margin:auto;">
                    <la-area prop="cfr" label="CFR" color='#a01010'></la-area>
                    <la-x-axis prop="name"></la-x-axis>
                    <la-tooltip>
                          <div class="tooltip" slot-scope="propstooltip">
                                                          {{ props.label }}
                            <ul class="list">
                              <li
                                :key="item.label"
                                v-for="item in propstooltip.actived"
                                :style="{ borderTop: '2px solid ' + item.color }">
                                <div class="value">  s {{ item.value | numeral('0.0%') }}</div>
                              </li>
                            </ul>
                          </div>
                    </la-tooltip>
                  </la-cartesian>
                </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
                <article class="media">
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <strong>{{ props.row.country }}</strong>
                                <br />
                                <br />
                                More to come.
                                <br />
                                <br />
                                <small> {{ props.row.cases }}</small>
                                <br />
                            </p>
                        </div>
                    </div>
                </article>
            </template>
        </b-table>

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

    var csvC = readTextFile("time_series_covid19_confirmed_global.csv");
    var csvD = readTextFile("time_series_covid19_deaths_global.csv");

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
        if (country == "Germany..") {
          debug.push(deaths[dates[i]]);
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

      var sparklines = [];
      for (i=dates.length-1-daysRelChange; i<dates.length; i++) {  // 7 days of sparklines
        sparklines.push(
          {name: dates[i], cc: caseschange[dates[i]],
          'value3day': Math.pow(2,1/3)-1,
          'value6day': Math.pow(2,1/6)-1,
          'value12day': Math.pow(2,1/12)-1,
          'value24day': Math.pow(2,1/24)-1,
        });
      }

      var sparklinescfr = [];
      for (i=dates.length-1-daysCFR; i<dates.length; i++) {  // 14 days of sparklinescfr
        sparklinescfr.push(
          {name: dates[i], cfr: deceasedrelative[dates[i]]});
      }
      if (country=="Germany") {
      debug.push(sparklinescfr);
      }

      return {
        'country': country, 'cases': cases, 'deaths': deaths,
        'caseslatest': cases[latest], 'deathslatest': deaths[latest],
        'caseschange': caseschange, 'deathschange': deathschange,
        'casesdifference': casesdifference, 'deathsdifference': deathsdifference,
        'caseschangelatest': caseschange[latest], 'deathschangelatest': deathschange[latest],
        'caseschangelatest3': geomean(caseschange, 3), 'deathschangelatest3': geomean(deathschange, 3),
        'caseschangelatest8': geomean(caseschange, 8), 'deathschangelatest8': geomean(deathschange, 8),
        'deceasedrelative': deceasedrelative, 'deceasedrelativelatest': deceasedrelative[latest], 
        'deceasedrelativelatest3': geomean(deceasedrelative, 3),
        'deceasedrelativelatest8': geomean(deceasedrelative, 8), 
        'sparklines': sparklines, 'sparklinescfr': sparklinescfr
      }
    }

    var debug = [];
    var error = [];

    //debug.push(csvC);
    //debug.push(csvD);

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

    debug.push(datesStr);
    debug.push(datesStr.length);
    debug.push(dates);
    debug.push(dates.length);

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

      if (country == 'Germany..')  {
        debug.push(makerow(country, cases, deaths));
        var r = makerow(country, cases, deaths);
        var caseschange = r['caseschange'];
        debug.push(caseschange[latest]);
        debug.push(caseschange['2020-03-25']);
      }

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
                daysRelChange,
                daysCFR,
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
.redcell { background-color: rgba(200,0,0,0.3); }
.redhead { background-color: rgba(200,0,0,0.4); }
.minor { opacity:65%;font-size:small; }
.blue { color: blue; }
.red { color:red; }
  
.tooltip {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
}

.title {
  padding: 10px;
  color: #959da5;
}

.list {
  list-style: none;
  display: flex;
  background: rgba(0, 0, 0, 0.8);
}

.list li {
  padding: 1px 3px;
  flex: 1;
  color: #fff;
  margin: 0;
  min-width: 30px;
}

.list li::before {
  content: none;
}

.label {
  color: #dfe2e5;
  font-weight: 600;
}

.value {
  color: #959da5;
}
</style>
