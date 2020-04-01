# SARS-CoV-2 Analysis

## Description

A quick analysis of coronavirus figures, in particular relative increases in confirmed changes, trendlines,
as well as relative CFR ratios (very crudly approximated by a simple division of confirmed cases by deceased cases).

## Why another one?

I haven't seen calculations and simple visualizations of the relative numbers. That is why I did this quick weekend project.
This is my first [vue.js](https://vuejs.org/) project, so it might not be done completely optimally.

## Data source

The data is automatically downloaded from [Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19) and parsed in-situ.

## Todo

* charts for each country
* add horizontal gridlines at certain positions for doublings
* improve tooltip position for sparklines, probably static position will be best
* calculate the CFR based on confirmed cases n days ago (controlled via slider)
