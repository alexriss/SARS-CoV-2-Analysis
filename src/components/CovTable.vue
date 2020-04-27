<template>
    <section>
        <b-collapse
            aria-id="extraDetailsOptions"
            class="panel"
            animation="slide"
            :open.sync="detailsOpen">
            <div slot="trigger" class="panel-heading" role="button" aria-controls="extraDetailsOptions" style="margin-bottom:10px;">
                <strong>Options</strong>
            </div>
        <b-field grouped group-multiline>
            <div class="field" style="margin-left:35px;">
              <b-tooltip :delay="tooltipDelay" multilined label="Only countries with this minimum number of cases will be shown.">
              <b-field label="Minimum number of confirmed cases">
              <b-slider :min="0" :max="5" aria-label="Fan" :tooltip="false" v-model="minCasesActive" @input='updateData()'>
                  <b-slider-tick v-for="(item, index) in minCasesList" :key="index" :value="index">{{ item }}</b-slider-tick>
              </b-slider>
              </b-field> 
              </b-tooltip>
            </div>
            <div class="field" style="margin-left:35px;">
              <b-tooltip :delay="tooltipDelay" multilined label="Additionally show states and provinces in the list.">
              <b-checkbox v-model="showprovinces" @input='updateData()'>Show states/provinces</b-checkbox>
              </b-tooltip>
            </div>
            <div class="field" style="margin-left:35px;">
              <b-tooltip :delay="tooltipDelay" multilined label="Show extra in the list.">
              <b-checkbox v-model="showdetails">Extra details</b-checkbox>
              </b-tooltip>
            </div>
        </b-field>
        <div style="height:28px;"></div>
        <b-field grouped group-multiline>
            <b-tooltip :delay="tooltipDelay" multilined label="Choose which columns to show">
            <div class="field" style="margin-left:35px; width:70px;"><b>Columns:</b></div>
            </b-tooltip>
            <div class="field" style="margin-left:20px;" v-for="(column, index) in columnsTemplate" :key="index">
                <b-tooltip :delay="tooltipDelay" multilined :label="column.tooltip">
                <b-checkbox v-model="column.visible">
                    {{ column.title }}
                </b-checkbox>
                </b-tooltip>
            </div>
        </b-field>
        <b-field grouped group-multiline>
            <b-tooltip :delay="tooltipDelay" multilined label="Choose which graphs to show in the columns">
            <div class="field" style="margin-left:35px; width:70px;"><b>Graphs:</b></div>
            </b-tooltip>
            <div class="field" style="margin-left:20px;" v-for="(column, index) in columnsGraphsTemplate" :key="index">
                <b-tooltip :delay="tooltipDelay" multilined :label="column.tooltip">
                <b-checkbox v-model="column.visible" v-if="column.show">
                    {{ column.title }}
                </b-checkbox>
                </b-tooltip>
            </div>
        </b-field>
        </b-collapse>

        <b-table
            :data="dataFiltered"
            :loading="loading"
            ref="table"
            paginated
            per-page="30"
            pagination-position="both"
            :detailed="true"
            narrowed
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
            style="min-width:600px;width:94vw;">

            <template slot-scope="props">
                <b-table-column field="country" label="Country" sortable searchable cell-class='countrycell' :sticky='true'>
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='You can filter specific countries. Try to type "Germ|Spa" into the text field.'>
                            Country
                        </b-tooltip>
                    </template> 
                    <a @click="toggle(props.row)">
                        <strong>{{ props.row.country }}</strong>
                    </a>
                </b-table-column>

                <b-table-column field="casesLatest" label="Confirmed" numeric sortable>
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='Total number and last-day increase of confirmed cases.'>
                            Confirmed
                        </b-tooltip>
                    </template> 
                    <strong class='tablenumber'>{{ props.row.cases[latest] | numeral('0,0') }}</strong>
                    <br />
                    <span class="minorcolor">{{ props.row.casesdaily[latest] | numeral('+0,0') }} </span>
                </b-table-column>

                <b-table-column field="casesChangeLatest" label="Increase" :visible="columnsTemplate.casesChangeLatest.visible" numeric sortable>
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='The relative increase of the number of confirmed cases with respect to all confirmed cases.'>
                            Increase
                        </b-tooltip>
                    </template> 
                    <strong class="tablenumber">{{ props.row.casesChangeLatest | numeral('+0.0%')}}</strong>
                    <span class="nowrap minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.casesChangeLatest3 | numeral('+0.0%')}}
                    <br />8d avg: {{ props.row.casesChangeLatest8 | numeral('+0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="casesChangeLatest8" :label="'Increase over ' + daysRelChange + ' days'" :visible="columnsGraphsTemplate.casesChangeLatest.visible" numeric sortable centered>
                    <template slot="header"> <!--  slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" :label="'' + daysRelChange + '-day plot of the relative increase of the number of confirmed cases with respect to all confirmed cases.'">
                            Increase<br /> over {{ daysRelChange }} days
                        </b-tooltip>
                    </template> 
                  <div style='width:200px;height:65px;margin:auto;'>
                    <sparkline :chart-data='props.row.sparklinesData' :options='sparklineOptions' :styles='sparklineStyles' />
                  </div>
                </b-table-column>
                
                <b-table-column field="casesChangeLast14Latest" label="w/w increase" :visible="columnsTemplate.casesChangeLast14Latest.visible" numeric sortable>
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='Increase over last 7 days relative to the 7 days before.'>
                            w/w<br />increase
                        </b-tooltip>
                    </template> 
                    <strong class="tablenumber">{{ props.row.casesChangeLast14Latest | numeral('+0.0%')}}</strong>
                    <span class="nowrap minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.casesChangeLast14Latest3 | numeral('+0.0%')}}
                    <br />8d avg: {{ props.row.casesChangeLast14Latest8 | numeral('+0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="casesChangeLast14Latest8" :label="'w/w increase over ' + daysRelChange + ' days'" :visible="columnsGraphsTemplate.casesChangeLast14Latest.visible" numeric sortable centered>
                    <template slot="header"> <!--  slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" :label="'' + daysRelChange + '-day plot of the increase over 7 days relative to the 7 days before.'">
                             w/w increase<br /> over {{ daysRelChange }} days
                        </b-tooltip>
                    </template> 
                  <div style='width:200px;height:65px;margin:auto;'>
                    <sparkline :chart-data='props.row.sparklinesLast14Data' :options='sparklineLast14Options' :plugins='sparklineLast14Plugins' :styles='sparklineStyles' />
                  </div>
                </b-table-column>
                
                <b-table-column field="repronumLatest" label="R" :visible="columnsTemplate.repronumLatest.visible" numeric sortable>
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='Effective reproduction number.'>
                           R
                        </b-tooltip>
                    </template> 
                    <strong class="tablenumber">{{ props.row.repronumLatest | numeral('0.00')}}</strong>
                    <span class="nowrap minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.repronumLatest3 | numeral('0.00')}}
                    <br />8d avg: {{ props.row.repronumLatest8 | numeral('0.00')}}
                    </span>
                </b-table-column>

                <b-table-column field="repronumLatest8" :label="'R over ' + daysRelChange + ' days'" :visible="columnsGraphsTemplate.repronumLatest.visible" numeric sortable centered>
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" :label="'' + daysRelChange + '-day plot of the effective reproduction number.'">
                            R<br />over {{ daysRelChange }} days
                        </b-tooltip>
                    </template> 
                  <div style='width:200px;height:65px;margin:auto;'>
                    <sparkline :chart-data='props.row.sparklinesRepronumData' :options='sparklineRepronumOptions' :plugins='sparklineRepronumPlugins' :styles='sparklineStyles' />
                  </div>
                </b-table-column>

                <b-table-column field="deathsLatest" label="Deceased" :visible="columnsTemplate.deathsLatest.visible" numeric sortable header-class='redhead' cell-class='redcell'>
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='Total number and last-day increase of deceased people.'>
                            Deceased
                        </b-tooltip>
                    </template> 
                    <strong class='tablenumber'>{{ props.row.deaths[latest] | numeral('0,0') }}</strong>
                    <br />
                    <span class="minorcolor red" style="opacity:0.9;"> {{ props.row.deathsdaily[latest] | numeral('+0,0') }} </span>
                </b-table-column>

                <b-table-column field="deathsChangeLatest" label="Increase " :visible="columnsTemplate.deathsChangeLatest.visible" numeric sortable header-class='redhead' cell-class='redcell' >
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='The relative increase of the number of deceased people.'>
                            Deceased<br />increase
                        </b-tooltip>
                    </template> 
                    {{ props.row.deathsChange[latest] | numeral('+0.0%')}}
                    <span class="nowrap minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.deathsChangeLatest3 | numeral('+0.0%')}}
                    <br />8d avg: {{ props.row.deathsChangeLatest8 | numeral('+0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativeLatest" label="CFR*" :visible="columnsTemplate.deceasedrelativeLatest.visible" numeric sortable header-class='orangehead' cell-class='orangecell' >
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" label='CFR* is calculated by the ratio of the current total number of deceased cases divided by current total number of confirmed cases.'>
                            CFR*
                        </b-tooltip>
                    </template> 
                    {{ props.row.deceasedrelative[latest] | numeral('0.0%')}}
                    <span class="nowrap minor" v-if="showdetails">
                    <br />3d avg: {{ props.row.deceasedrelativeLatest3 | numeral('0.0%')}}
                    <br />8d avg: {{ props.row.deceasedrelativeLatest8| numeral('0.0%')}}
                    </span>
                </b-table-column>

                <b-table-column field="deceasedrelativeLatest8" :label="'CFR* over ' + daysCFR + ' days'" :visible="columnsGraphsTemplate.deceasedrelativeLatest.visible" numeric sortable centered header-class='orangehead' cell-class='orangecell' >
                    <template slot="header"> <!-- slot-scope="{ column }"> -->
                        <b-tooltip :delay="tooltipDelay" multilined position="is-bottom" :label="'' + daysCFRChange + '-day plot of the ratio of the total number of deceased cases divided by total number of confirmed cases.'">
                            CFR*<br />over {{ daysRelChange }} days
                        </b-tooltip>
                    </template> 
                  <div style='width:200px;height:65px;margin:auto;'>
                    <sparkline :chart-data='props.row.sparklinesCfrData' :options='sparklineCfrOptions' :styles='sparklineStyles' />
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
    let daysRelChange = 30
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
      }

      // CFR* and 7/7 relative change
      dates.forEach(function (item, i) {
        // CFR*
        if (cases[item] > 0) {
          deceasedrelative[item] = deaths[item]  / cases[item];
        } else {
          deceasedrelative[item] = 0;
        }

        // 7/7 relative change
        if (i >= 14) {
          casesLast14 = cases[dates[i-7]] - cases[dates[i-14]];
          deathsLast14 = deaths[dates[i-7]] - deaths[dates[i+1-14]];
        } else {
          casesLast14 = NaN;
          deathsLast14 = NaN;
        }
        if (casesLast14 > 0) {
          casesChangeLast14[item] = (cases[item] - cases[dates[i-7]]) / casesLast14 - 1;
        } else {
          casesChangeLast14[dates[i+1]] = NaN;
        }
        if (deathsLast14 > 0) {
          deathsChangeLast14[item] = (deaths[item] - deaths[dates[i-7]]) / deathsLast14 - 1;
        } else {
          deathsChangeLast14[dates[i+1]] = NaN;
        }
      });

      // reproduction number
      let casesdailyArr = Object.values(casesdaily);
      let casesdailyKeys = Object.keys(casesdaily);
      let sumtauwI = convolve(casesdailyArr, infectivity);
      sumtauwI = sumtauwI.slice(infectivity.length-1, casesdailyArr.length);
      sumtauwI = Array(casesdailyArr.length-sumtauwI.length).fill(NaN).concat(sumtauwI);  // prepend with NaNs to give equal length to cases
      for (let i=0; i<casesdailyKeys.length; i++) {
        if (sumtauwI[i] < 0.1 || casesdailyArr[i] < 0) {  // dont calculate reproduction number if there are too few cases
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
            data: Object.values(casesChange).slice(Object.values(casesChange).length-daysRelChange)
          }
        ]
      }
      let sparklinesdataLast14 = {
        labels: dates.slice(dates.length-daysRelChange),
        datasets: [
          {
            label: country,
            data: Object.values(casesChangeLast14).slice(Object.values(casesChangeLast14).length-daysRelChange)
          }
        ]
      }
      let sparklinesdataRepronum = {
        labels: dates.slice(dates.length-daysRelChange),
        datasets: [
          {
            label: country,
            data: Object.values(repronum).slice(Object.values(repronum).length-daysRelChange)
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
        'casesChangeLast14Latest': casesChangeLast14[latest], 'casesChangeLast14Latest3': arrMean(casesChangeLast14, 3), 'casesChangeLast14Latest8': arrMean(casesChangeLast14, 8),
        'repronumLatest': repronum[latest], 'repronumLatest3': arrMean(repronum, 3), 'repronumLatest8': arrMean(repronum, 8),

        'deathsChangeLatest': deathsChange[latest], 'deathsChangeLatest3': arrMean(deathsChange, 3), 'deathsChangeLatest8': arrMean(deathsChange, 8),

        'deceasedrelative': deceasedrelative, 'deceasedrelativeLatest': deceasedrelative[latest],
        'deceasedrelativeLatest3': arrMean(deceasedrelative, 3),
        'deceasedrelativeLatest8': arrMean(deceasedrelative, 8), 

        'sparklinesData': sparklinesdataTotal, 'sparklinesLast14Data': sparklinesdataLast14, 'sparklinesRepronumData': sparklinesdataRepronum, 'sparklinesCfrData': sparklinescfrdata, 
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
                showdetails: false,
                showprovinces: false,
                tooltipDelay: 650,
                detailsOpen: false,
                daysRelChange,
                daysCFR,
                infectivity,
                columnsTemplate: {
                    casesChangeLatest: { title: 'Confirmed Increase', visible: false, tooltip: 'Increase relative to all confirmed cases' },
                    casesChangeLast14Latest: { title: 'Week/week increase', visible: true, tooltip: 'Increase over last 7 days relative to the 7 days before'},
                    repronumLatest: { title: 'R', visible: false, tooltip: 'Effective reproduction number'},
                    deathsLatest: { title: 'Deceased', visible: true, tooltip: 'Total number of confirmed deceased cases'},
                    deathsChangeLatest: { title: 'Deceased Increase', visible: true, tooltip: 'Increased of confirmed deceased cases'},
                    deceasedrelativeLatest: { title: 'CFR*', visible: true, tooltip: 'Ratio between all confirmed deceased cases to all confirmed cases'},
                },
                columnsGraphsTemplate: {
                    casesChangeLatest: { title: 'Confirmed Increase', visible: false, show: true, tooltip: 'Plot of daily increase relative to confirmed cases over time' },
                    casesChangeLast14Latest: { title: 'Week/week increase', visible: true, show: true, tooltip: 'Plot of increase over last 7 days relative to the 7 days before' },
                    repronumLatest: { title: 'R', visible: false, show: true, tooltip: 'Plot of the effective reproduction number over time'},
                    deceasedrelativeLatest: { title: 'CFR*', visible: true, show: true, tooltip: 'Plot of the ratio between all confirmed deceased cases to all confirmed cases over time'},
                },
                sparklineStyles: {
                  height: '65px',
                  width: '100%',
                  position: 'relative',
                },
                sparklineOptions: {
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
                      callbacks: { label: function(tooltipItem) {
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
                      }}
                    },
                    scales: {
                      yAxes: [{
                          display: false,
                          ticks: {
                            min: 0, max: 0.25,
                            // callback: function (value) { return numeral(value).format('0.0%') }
                          }
                      }],
                      xAxes: [{
                          display: false
                      }]
                    }
                },
                sparklineLast14Options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false },
                    elements: {
                      point: { radius: 0 },
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
                      callbacks: { label: function(tooltipItem) {
                        return numeral(tooltipItem.yLabel).format('+0.0%');
                      }}
                    },
                    scales: {
                      yAxes: [{
                          display: false,
                          ticks: {
                            min: -1, max: 2,
                            // callback: function (value) { return numeral(value).format('0.0%') }
                          }
                      }],
                      xAxes: [{
                          display: false,
                          ticks: { display: false },
                          gridLines: { display: false	}
                      }]
                    },
                },
                sparklineLast14Plugins: [{
                        id: 'colorAboveBelow0',
                        beforeDraw: function (x) {
                          let c = x.chart;
                          let dataset = x.data.datasets[0];
                          let yScale = x.scales['y-axis-0'];
                          let yPos = yScale.getPixelForValue(0);
                          let gradientFill = c.ctx.createLinearGradient(0, 0, 0, c.height);
                          gradientFill.addColorStop(0, '#3179bd');
                          gradientFill.addColorStop(yPos / c.height - 0.01, '#3179bd');
                          gradientFill.addColorStop(yPos / c.height + 0.01, '#51a9cd');
                          gradientFill.addColorStop(1, '#51a9cd');
                          let model = x.data.datasets[0]._meta[Object.keys(dataset._meta)[0]].dataset._model;
                          model.backgroundColor = gradientFill;
                          model.borderColor = gradientFill;
                        }
                }],
                sparklineRepronumOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false },
                    elements: {
                      point: { radius: 0 },
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
                      callbacks: { label: function(tooltipItem) {
                        return numeral(tooltipItem.yLabel).format('0.00');
                      }}
                    },
                    scales: {
                      yAxes: [{
                          display: false,
                          ticks: {
                            min: 0, max: 4,
                            // callback: function (value) { return numeral(value).format('0.0%') }
                          }
                      }],
                      xAxes: [{
                          display: false
                      }]
                    }
                },
                sparklineRepronumPlugins: [{
                        id: 'colorAboveBelow0',
                        beforeDraw: function (x) {
                          let c = x.chart;
                          let dataset = x.data.datasets[0];
                          let yScale = x.scales['y-axis-0'];
                          let yPos = yScale.getPixelForValue(1);
                          let gradientFill = c.ctx.createLinearGradient(0, 0, 0, c.height);
                          gradientFill.addColorStop(0, '#3179bd');
                          gradientFill.addColorStop(yPos / c.height - 0.01, '#3179bd');
                          gradientFill.addColorStop(yPos / c.height + 0.01, '#51a9cd');
                          gradientFill.addColorStop(1, '#51a9cd');
                          let model = x.data.datasets[0]._meta[Object.keys(dataset._meta)[0]].dataset._model;
                          model.backgroundColor = gradientFill;
                          model.borderColor = gradientFill;
                        }
                }],
                sparklineCfrOptions: {
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
              for (let i=0; i<this.data.length; i++) {
                if (this.timeDataChange != currDate) {  // some other update occured
                  return false;
                }
                if (!this.data[i]['isprovince'] || this.showprovinces) {  // provinces 
                  if (this.data[i]['cases'][latest] > minCases) {  // mincases
                    dataNew.push(this.data[i]);
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

.info { text-align:left; padding:20px;}

.nowrap { white-space: nowrap; }

strong.tablenumber { font-size:110%; }

</style>

<style>
.detail-container { background-color: #e0f0ff; }
</style>

