# power shell script
# downloads the csvs from JH's public repository for offline use
# such that for development they are locally available
# for linux simply use wget

$url1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
$output1 = "$PSScriptRoot\public\time_series_covid19_confirmed_global.csv"
$url2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
$output2 = "$PSScriptRoot\public\time_series_covid19_deaths_global.csv"

$url3 = "https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/global_data/time_series_covid19_vaccine_global.csv"
$output3 = "$PSScriptRoot\public\time_series_covid19_vaccine_global.csv"
$url4 = "https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/global_data/time_series_covid19_vaccine_doses_admin_global.csv"
$output4 = "$PSScriptRoot\public\time_series_covid19_vaccine_doses_admin_global.csv"


echo $output1

Invoke-WebRequest -Uri $url1 -OutFile $output1
Invoke-WebRequest -Uri $url2 -OutFile $output2
Invoke-WebRequest -Uri $url3 -OutFile $output3
Invoke-WebRequest -Uri $url4 -OutFile $output4
