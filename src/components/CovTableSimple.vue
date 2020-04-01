<template>
    <section>
    </section>
</template>

<script>
    //var numeral = require('numeral');

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
      var mdy = dateStr.split('/');
      var month = parseInt(mdy[0]);
      var day = parseInt(mdy[1]);
      var year = parseInt('20' + mdy[2]);
      month-=1;
      var dt = new Date(year,month,day);
      return dt.toISOString().slice(0, 10);
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
          {'label': dates[i], 'value': caseschange[dates[i]],
          'value3day': Math.pow(2,1/3)-1,
          'value6day': Math.pow(2,1/6)-1,
          'value12day': Math.pow(2,1/12)-1,
          'value24day': Math.pow(2,1/24)-1,
        });
      }

      var sparklinescfr = [];
      for (i=dates.length-1-daysCFR; i<dates.length; i++) {  // 14 days of sparklinescfr
        sparklinescfr.push(
          {'name': 'dfs ' + dates[i], 'value': deceasedrelative[dates[i]]});
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
    // debug.push(dates);

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

