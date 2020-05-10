# SARS-CoV-2 Analysis

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Description

A quick analysis of coronavirus figures, in particular relative increases in confirmed changes, trendlines,
as well as relative CFR ratios (very crudly approximated by a simple division of confirmed cases by deceased cases).

## Why another one?

__We need relative numbers!__ All countries have different testing capacities and often also different rules as what counts as confirmed case or coronavirus-related fatality. Thus, relative ration and relative increases in numbers can be more informative.

I haven't seen calculations and simple visualizations of relative numbers. That is why I did this quick weekend project.
This is my first [vue.js](https://vuejs.org/) project, so it might not be done completely optimally.

## OK, I am convinced, let me see it!

Sure, no problem. Here you go: [Live version](https://alexriss.github.io/SARS-CoV-2-Analysis/)

## Obligatory screenshots

Table view giving numbers, relative numbers, reproduction numbers and sparklines:
![screenshot of overview](screenshot.png)

Detailed view for each country:
![screenshot of detail view](screenshot_detail.png)

## Is it beta?

Of course! Even rather alpha. It is a weekend project and I just work on this in my free time. Please double check all numbers and graphs.

## Data source

The data is automatically downloaded from [Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19) and parsed in-situ. For the calculation of the reproduction source I followed the method of [AGES Austria](https://www.ages.at/en/wissen-aktuell/publikationen/epidemiologische-parameter-des-covid19-ausbruchs-oesterreich-2020/), which is similar to the method presented in the [R-Package EpiEstim](https://cran.r-project.org/package=EpiEstim) and described in [Am J Epidemiol 178, 1505–1512 (2013)](https://doi.org/10.1093/aje/kwt133).

## Todo

* parse US states
* improve mobile experience
* probably: use ECharts for sparklines (instead of charts.js)
* improve tooltip position for sparklines, probably static position will be best
* calculate the CFR based on confirmed cases n days ago (controlled via slider)
* save settings locally (vue.js localStorage)
