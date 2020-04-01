# power shell script
# downloads the csvs from JH's public repository for offline use
# such that for development they are locally available
# for linux simply use wget

$url1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
$output1 = "$PSScriptRoot\public\time_series_covid19_confirmed_global.csv"
$url2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
$output2 = "$PSScriptRoot\public\time_series_covid19_deaths_global.csv"

echo $output1

Invoke-WebRequest -Uri $url1 -OutFile $output1
Invoke-WebRequest -Uri $url2 -OutFile $output2
