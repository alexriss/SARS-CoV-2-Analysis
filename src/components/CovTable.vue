<template>
    <section class="section">
        <b-field group-multiline>
            <div class="control is-flex">
            <div>
              <b-tooltip :delay="tooltipDelay" multilined label="The increases show in the table and graphs can be calculated either with respect to the total number of previous cases or with respect to the cases within the last two weeks.">
              <b-select v-model="increaseType" expanded icon="chart-area" @input='updateData()'>
                  <option value="total">relative Increase</option>
                  <option value="14day">2-week relative Increase</option>
                  <option value="repronum">reproduction number</option>
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

                <b-table-column style="min-width:65px" field="casesChangeLatest" :label="(increaseType=='repronum') ? 'R' : 'Increase'" numeric sortable>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='The relative increase of the number of confirmed cases. This is either with respect to all confirmed cases or with respect to the number of cases observed within the last two weeks.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                    <strong class="tablenumber" v-if="increaseType=='repronum'">{{ props.row.casesChangeLatest | numeral('0.00')}}</strong>
                    <strong class="tablenumber" v-if="increaseType!='repronum'">{{ props.row.casesChangeLatest | numeral('+0.0%')}}</strong>
                    <span class="minor" v-if="showdetails && increaseType=='repronum'">
                    <br />3d avg: {{ props.row.casesChangeLatest3 | numeral('0.00')}}
                    <br />8d avg: {{ props.row.casesChangeLatest8 | numeral('0.00')}}
                    </span>
                    <span class="minor" v-if="showdetails && increaseType!='repronum'">
                    <br />3d avg: {{ props.row.casesChangeLatest3 | numeral('+0.0%')}}
                    <br />8d avg: {{ props.row.casesChangeLatest8 | numeral('+0.0%')}}
                    </span>
                </b-table-column>
                
                <b-table-column field="casesChangeLatest8" :label="(increaseType=='repronum') ? 'R over ' + daysRelChange + ' days' : 'Increase over ' + daysRelChange + ' days'" numeric sortable centered>
                    <template slot="header" slot-scope="{ column }">
                        <b-tooltip :delay="tooltipDelay" multilined label='The relative increase of the number of confirmed cases within the last 14 days. Again, this is either with respect to all confirmed cases or with respect to the number of cases observed within the last two weeks.'>
                            {{ column.label }}
                        </b-tooltip>
                    </template> 
                  <div style='width:200px;height:65px;margin:auto;'>
                    <sparkline :chart-data='props.row.sparklinesdata' :options='sparklineoptions' :styles='sparklinestyles' :update='sparklineUpdate' :increase-type='increaseType' />
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
                  <div style='width:200px;height:65px;margin:auto;'>
                    <sparkline :chart-data='props.row.sparklinescfrdata' :options='sparklinecfroptions' :styles='sparklinestyles' :update='0' increase-Type='total' />
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
        Notes:
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
            - For the determination of the reproductive number R, the method of the
             <a href="https://stochastik-tu-ilmenau.github.io/COVID-19/">AG Stochastik, Technische Universität Ilmenau</a> is used.
          </li>
          <li>
             - For the estimation of R, a daily infectivity profile of
             <span v-for="item in infectivity" :key='item.index'> {{ item | numeral('0.0%') }} </span>
              is assumed.
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
    let daysRelChange = 20
    let daysCFR = 30

    let minCasesList = [0,500,1000,2000,5000, 10000];
    let minCasesActive = 3; // index

    let csvConfirmed = "time_series_covid19_confirmed_global.csv";
    let csvDeceased = "time_series_covid19_deaths_global.csv";
    let githubJH = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";

    let provincesAlwaysShow = ["Hong Kong", "Macau"]

    // infectivity profile, according to: https://stochastik-tu-ilmenau.github.io/COVID-19/
    let infectivity = [0., 0., 0.05555556, 0.11111111, 0.16666667, 0.16666667, 0.16666667, 0.13333333, 0.1, 0.06666667, 0.03333333, 0.]

    let urlPre = "";
    if (window.location.href.indexOf("github.io") >= 0) {
      urlPre = githubJH;
    }

    // let sparklineGradient = ctx.createLinearGradient(0, 0, 0, 400);
    // sparklineGradient.addColorStop(0, 'rgba(250,174,50,1)');   
    // sparklineGradient.addColorStop(1, 'rgba(250,174,50,0)')

    console.log("loading "+ urlPre + csvConfirmed);
    let csvC = readTextFile(urlPre + csvConfirmed);
    console.log("loading "+ urlPre + csvDeceased);
    let csvD = readTextFile(urlPre + csvDeceased);

    let sparklineUpdate = 0;

    import numeral from 'numeral'
    import Sparkline from '@/components/Sparkline.vue'
    import CovDetail from '@/components/CovDetail.vue'

    // read csv files
    function readTextFile(file)
    {
      let rawFile = new XMLHttpRequest();
      let allText = '';
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
      let dt = new Date(dateStr);
      let isoDate = new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString();
      return isoDate.slice(0, 10);
    }

    // calculates the geometric mean of the last n entries in arr
    function arrMean(arr, num, geom=false) {
      if (geom) {
        let prod = 1;
        let count = 0;
        for (let i=dates.length-1; i>=dates.length-num; i--) {
          if (!isNaN(arr[dates[i]]) && arr[dates[i]] != 0) {
            prod *= arr[dates[i]];
            count++;
          }
        }
        return Math.pow(prod, 1/count);
      } else {
        let sum = 0;
        let count = 0;
        for (let i=dates.length-1; i>=dates.length-num; i--) {
          if (!isNaN(arr[dates[i]])) {
            sum += arr[dates[i]];
            count++;
          }
        }
        return sum/count;
      }
    }

    // 1d convolution, see https://gist.github.com/jdpigeon/1de0b43eed7ae7e4080818cad53be200
    function convolve(vec1, vec2) {
      if (vec1.length === 0 || vec2.length === 0) {
        throw new Error("Vectors can not be empty!");
      }
      const volume = vec1;
      const kernel = vec2;
      let displacement = 0;
      const convVec = [];

      for (let i = 0; i < volume.length; i++) {
        for (let j = 0; j < kernel.length; j++) {
          if (displacement + j !== convVec.length) {
            convVec[displacement + j] =
              convVec[displacement + j] + volume[i] * kernel[j];
          } else {
            convVec.push(volume[i] * kernel[j]);
          }
        }
        displacement++;
      }
      return convVec;
    }

    // returns row
    function makerow(country, cases, deaths, isprovince=false) {
      let casesChange = {};
      let deathsChange = {};
      let casesdaily = {};
      let deathsdaily = {};
      let deceasedrelative = {};
      let casesChangeLast14 = {}; // cases for last 14 days
      let deathsChangeLast14 = {}; // deaths for last 14 days
      let casesLast14 = 0;
      let deathsLast14 = 0;
      let repronum = {};

      for(let i=0;i<dates.length-1;i++) {
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

      // CFR
      dates.forEach(function (item) {
        if (cases[item] > 0) {
          deceasedrelative[item] = deaths[item]  / cases[item];
        } else {
          deceasedrelative[item] = 0;
        }
      });

      // reproduction number
      let casesdailyArr = Object.values(casesdaily);
      let casesdailyKeys = Object.keys(casesdaily);
      let sumtauwI = convolve(casesdailyArr, infectivity);
      sumtauwI = sumtauwI.slice(infectivity.length-1, casesdailyArr.length);
      sumtauwI = Array(casesdailyArr.length-sumtauwI.length).fill(NaN).concat(sumtauwI);  // prepend with NaNs to give equal length to cases
      for (let i=0; i<casesdailyKeys.length; i++) {
        if (sumtauwI[i] < 1 || casesdailyArr[i] < 1) {  // dont calculate reproduction number if there are too few cases
          repronum[dates[i]] = NaN;
        }
        else {
          repronum[casesdailyKeys[i]] = casesdailyArr[i] / sumtauwI[i];
        }
      }

      let sparklinesdataTotal = {
        labels: dates.slice(dates.length-daysRelChange),
        datasets: [
          {
            label: country,
            data: Object.values(casesChange).slice(dates.length-daysRelChange)
          }
        ]
      }
      let sparklinesdataLast14 = {
        labels: dates.slice(dates.length-daysRelChange),
        datasets: [
          {
            label: country,
            data: Object.values(casesChangeLast14).slice(dates.length-daysRelChange)
          }
        ]
      }
      let sparklinesdataRepronum = {
        labels: dates.slice(dates.length-daysRelChange),
        datasets: [
          {
            label: country,
            data: Object.values(repronum).slice(dates.length-daysRelChange)
          }
        ]
      }      

      let sparklinescfrdataentries = [];
      for (let i=dates.length-daysCFR; i<dates.length; i++) {  // 14 days of sparklinescfr
        sparklinescfrdataentries.push(deceasedrelative[dates[i]]);
      }
      let sparklinescfrdata = {
        labels: dates.slice(dates.length-daysCFR),
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

        'casesChange': casesChange, 'deathsChange': deathsChange,
        'casesdaily': casesdaily, 'deathsdaily': deathsdaily,
        
        'casesChangeLatest': casesChange[latest], 'casesChangeLatest3': arrMean(casesChange, 3), 'casesChangeLatest8': arrMean(casesChange, 8), 
        'deathsChangeLatest': deathsChange[latest], 'deathsChangeLatest3': arrMean(deathsChange, 3), 'deathsChangeLatest8': arrMean(deathsChange, 8),

        'deceasedrelative': deceasedrelative, 'deceasedrelativeLatest': deceasedrelative[latest],
        'deceasedrelativeLatest3': arrMean(deceasedrelative, 3),
        'deceasedrelativeLatest8': arrMean(deceasedrelative, 8), 

        'sparklinesdata': JSON.parse(JSON.stringify(sparklinesdataTotal)), 'sparklinescfrdata': sparklinescfrdata,  // we need a deepc copy here to prevent pass-by-reference

        'options': {
          'casesChange': {'total': casesChange, '14day': casesChangeLast14, 'repronum': casesChange},
          'casesChangeLatest': {'total': casesChange[latest], '14day': casesChangeLast14[latest], 'repronum': repronum[latest]},
          'casesChangeLatest3': {'total': arrMean(casesChange, 3), '14day': arrMean(casesChangeLast14, 3), 'repronum': arrMean(repronum, 3)},
          'casesChangeLatest8': {'total': arrMean(casesChange, 8), '14day': arrMean(casesChangeLast14, 8), 'repronum': arrMean(repronum, 8)},
          'deathsChange': {'total': deathsChange, '14day': deathsChangeLast14, 'repronum': deathsChange},
          'deathsChangeLatest': {'total': deathsChange[latest], '14day': deathsChangeLast14[latest], 'repronum': deathsChange[latest]}, 
          'deathsChangeLatest3': {'total': arrMean(deathsChange, 3), '14day': arrMean(deathsChangeLast14, 3), 'repronum': arrMean(deathsChange, 3)}, 
          'deathsChangeLatest8': {'total': arrMean(deathsChange, 8), '14day': arrMean(deathsChangeLast14, 8), 'repronum': arrMean(deathsChange, 8)},
          'sparklinesdata': {'total': sparklinesdataTotal, '14day': sparklinesdataLast14, 'repronum': sparklinesdataRepronum},
        },
        'optionsObjects': {  // only copy subitems for these, otherwise the objects are references
          'sparklinesdata': ['datasets', 0, 'data'],
        }
      }
    }

    let debug = [];
    let error = [];

    let arrC = csvC.split("\n");
    let arrD = csvD.split("\n");

    let headerC = arrC.shift().split(','); 
    let headerD = arrD.shift().split(','); 

    // very quick sanity checks
    if (arrC.length != arrD.length) {
      console.log('Files do not match. ' + arrC.length + ' vs. ' + arrD.length)
      error.push('Files do not match. ' + arrC.length + ' vs. ' + arrD.length);
    }
    if (headerC.length != headerD.length) {
      console.log('Files do not match. ' +headerC + ' vs. ' + headerD)
      error.push('Files do not match. ' +headerC + ' vs. ' + headerD);
    }

    let datesStr = headerD.slice(4);
    let dates = Array.from(datesStr, x => stringToDate(x));
    let latest = dates[dates.length - 1];

    let data = [];
    let dataFiltered = [];
    let currCountry = '';
    let currProvince = '';
    let country = '';
    let elsC = [];
    let elsD = [];
    let cases = {};
    let deaths = {};
    let currCases = {};
    let currDeaths = {};
    let casesWorld = {};
    let deathsWorld = {};
    let currCasesEntry = 0;
    let currDeathsEntry = 0;
    let isprovince = false;

    dates.forEach(function (item) {
      casesWorld[item] = 0;
      deathsWorld[item] = 0;
    });

    for (let i=0; i<arrC.length; i++) {
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
    for (let i=0; i<data.length; i++) {
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
                increaseType: 'total',
                showdetails: false,
                showprovinces: false,
                tooltipDelay: 650,
                daysRelChange,
                daysCFR,
                infectivity,
                sparklineUpdate,
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
                      callbacks: {}  // set in Sparkline.vue
                    },
                    scales: {
                      yAxes: [{
                          display: false,
                          ticks: {
                            min: 0, max: 0.25,  // will be set in Sparkline.vue again
                            // callback: function (value) { return numeral(value).format('0.0%') }
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
                            // callback: function (value) { return numeral(value).format('0.0%') }
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
              let minCases = this.minCasesList[this.minCasesActive];
              let currDate = new Date();
              this.timeDataChange = currDate;

              await new Promise(r => setTimeout(r, 200));  // wait a bit, because user might still be changing the values

              let dataNew = [];
              let increaseType = this.increaseType;
              for (let i=0; i<this.data.length; i++) {
                if (this.timeDataChange != currDate) {  // some other update occured
                  return false;
                }
                if (!this.data[i]['isprovince'] || this.showprovinces) {  // provinces 
                  if (this.data[i]['cases'][latest] > minCases) {  // mincases
                    let d = this.data[i];
                    Object.keys(d['options']).forEach(function(key) {  // 14day or total increase type
                      if (key in d['optionsObjects']) {  // we only set a specific sub-object, otherweise we get problems with pass-by-reference
                        let objGet = d['options'][key][increaseType];
                        let objSet = d[key];
                        let pList = d['optionsObjects'][key];  // array that contains the sub-keys
                        for (let j=0; j < pList.length-1; j++) {
                          objGet = objGet[pList[j]];
                          objSet = objSet[pList[j]];
                        }
                        objSet[pList[pList.length-1]] = objGet[pList[pList.length-1]].slice();
                      } else {
                        d[key] = d['options'][key][increaseType];
                      }
                    });
                    dataNew.push(d);
                  }
                }
              }

              if (this.timeDataChange == currDate) {  // some other update occured
                this.dataFiltered = dataNew;
                this.sparklineUpdate = new Date().getTime();
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

