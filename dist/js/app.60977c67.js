(function(e){function a(a){for(var s,i,o=a[0],l=a[1],c=a[2],u=0,f=[];u<o.length;u++)i=o[u],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&f.push(n[i][0]),n[i]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(e[s]=l[s]);d&&d(a);while(f.length)f.shift()();return r.push.apply(r,c||[]),t()}function t(){for(var e,a=0;a<r.length;a++){for(var t=r[a],s=!0,o=1;o<t.length;o++){var l=t[o];0!==n[l]&&(s=!1)}s&&(r.splice(a--,1),e=i(i.s=t[0]))}return e}var s={},n={app:0},r=[];function i(a){if(s[a])return s[a].exports;var t=s[a]={i:a,l:!1,exports:{}};return e[a].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=s,i.d=function(e,a,t){i.o(e,a)||Object.defineProperty(e,a,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,a){if(1&a&&(e=i(e)),8&a)return e;if(4&a&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&a&&"string"!=typeof e)for(var s in e)i.d(t,s,function(a){return e[a]}.bind(null,s));return t},i.n=function(e){var a=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(a,"a",a),a},i.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},i.p="/SARS-CoV-2-Analysis/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=a,o=o.slice();for(var c=0;c<o.length;c++)a(o[c]);var d=l;r.push([0,"chunk-vendors"]),t()})({0:function(e,a,t){e.exports=t("56d7")},"034f":function(e,a,t){"use strict";var s=t("85ec"),n=t.n(s);n.a},"0c76":function(e,a,t){},1564:function(e,a,t){"use strict";var s=t("b475"),n=t.n(s);n.a},"34af":function(e,a,t){"use strict";var s=t("c20a"),n=t.n(s);n.a},4678:function(e,a,t){var s={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-SG":"cdab","./en-SG.js":"cdab","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-nz":"6f50","./en-nz.js":"6f50","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-tw":"90ea","./zh-tw.js":"90ea"};function n(e){var a=r(e);return t(a)}function r(e){if(!t.o(s,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return s[e]}n.keys=function(){return Object.keys(s)},n.resolve=r,e.exports=n,n.id="4678"},"551b":function(e,a,t){},"56d7":function(e,a,t){"use strict";t.r(a);t("e260"),t("e6cf"),t("cca6"),t("a79d");var s,n,r=t("2b0e"),i=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticStyle:{"max-width":"1400px"},attrs:{id:"app"}},[t("h1",{staticClass:"title"},[e._v("SARS-CoV-2 Analysis")]),e._m(0),t("CovTable"),t("a",{staticClass:"github-corner",attrs:{href:"https://github.com/CSSEGISandData/COVID-19","aria-label":"View source on GitHub"}},[t("svg",{staticStyle:{fill:"#21499d",color:"#fff",position:"absolute",top:"0",border:"0",right:"0"},attrs:{width:"80",height:"80",viewBox:"0 0 250 250","aria-hidden":"true"}},[t("path",{attrs:{d:"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"}}),t("path",{staticClass:"octo-arm",staticStyle:{"transform-origin":"130px 106px"},attrs:{d:"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",fill:"currentColor"}}),t("path",{staticClass:"octo-body",attrs:{d:"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",fill:"currentColor"}})])])],1)},o=[function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("h2",{staticClass:"subtitle"},[e._v("Relative coronavirus numbers "),t("span",{staticClass:"tag is-info"},[e._v("beta")])])}],l=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("section",{staticClass:"section"},[t("b-field",{attrs:{grouped:""}},[t("div",{staticClass:"control is-flex"},[t("b-field",{attrs:{label:"Show countries with a minimum number of confirmed cases"}},[t("b-slider",{attrs:{min:0,max:5,"aria-label":"Fan",tooltip:!1},on:{input:function(a){return e.updateData()}},model:{value:e.minCasesActive,callback:function(a){e.minCasesActive=a},expression:"minCasesActive"}},e._l(e.minCasesList,(function(a,s){return t("b-slider-tick",{key:s,attrs:{value:s}},[e._v(e._s(a))])})),1)],1)],1),t("div",{staticStyle:{width:"70px"}}),t("div",{staticClass:"field"},[t("b-checkbox",{on:{input:function(a){return e.updateData()}},model:{value:e.showprovinces,callback:function(a){e.showprovinces=a},expression:"showprovinces"}},[e._v("show states/provinces")])],1),t("div",{staticStyle:{width:"70px"}}),t("div",{staticClass:"field"},[t("b-checkbox",{model:{value:e.showdetails,callback:function(a){e.showdetails=a},expression:"showdetails"}},[e._v("show details")])],1)]),t("b-table",{ref:"table",staticStyle:{"min-width":"600px"},attrs:{data:e.dataFiltered,loading:e.loading,paginated:"","per-page":"30","pagination-position":"both",detailed:!0,narrowed:"","is-narrow":"","mobile-cards":!1,hoverable:"","detail-key":"country","sort-icon":"chevron-up","sort-icon-size":"is-small","show-detail-icon":!0,"default-sort":"caseslatest","default-sort-direction":"desc","aria-next-label":"Next page","aria-previous-label":"Previous page","aria-page-label":"Page","aria-current-label":"Current page"},scopedSlots:e._u([{key:"default",fn:function(a){return[t("b-table-column",{attrs:{field:"country",label:"Country",sortable:"",searchable:"","cell-class":"countrycell"}},[t("a",{on:{click:function(t){return e.toggle(a.row)}}},[t("strong",[e._v(e._s(a.row.country))])])]),t("b-table-column",{attrs:{field:"caseslatest",label:"Confirmed",numeric:"",sortable:""}},[t("strong",[e._v(e._s(a.row.cases[e.latest]))]),t("br"),t("span",{staticClass:"minor"},[e._v(" +"+e._s(a.row.casesdifference[e.latest])+" ")])]),t("b-table-column",{attrs:{field:"caseschangelatest",label:"Increase",numeric:"",sortable:""}},[t("strong",[e._v("+"+e._s(e._f("numeral")(a.row.caseschange[e.latest],"0.0%")))]),e.showdetails?t("span",{staticClass:"minor"},[t("br"),e._v("3d avg: +"+e._s(e._f("numeral")(a.row.caseschangelatest3,"0.0%"))+" "),t("br"),e._v("8d avg: +"+e._s(e._f("numeral")(a.row.caseschangelatest8,"0.0%"))+" ")]):e._e()]),t("b-table-column",{attrs:{field:"caseschangelatest8",label:"Increase over "+e.daysRelChange+" days",numeric:"",sortable:"",centered:""}},[t("div",{staticStyle:{width:"200px",height:"65px",margin:"auto"}},[t("sparkline",{attrs:{"chart-data":a.row.sparklinesdata,options:e.sparklineoptions,styles:e.sparklinestyles}})],1)]),t("b-table-column",{attrs:{field:"deathslatest",label:"Deceased",numeric:"",sortable:"","header-class":"redhead","cell-class":"redcell"}},[t("strong",[e._v(e._s(a.row.deaths[e.latest]))]),t("br"),t("span",{staticClass:"minor red",staticStyle:{opacity:"0.9"}},[e._v(" +"+e._s(a.row.deathsdifference[e.latest])+" ")])]),t("b-table-column",{attrs:{field:"deathschangelatest",label:"Increase ",numeric:"",sortable:"","header-class":"redhead","cell-class":"redcell"}},[e._v(" +"+e._s(e._f("numeral")(a.row.deathschange[e.latest],"0.0%"))+" "),e.showdetails?t("span",{staticClass:"minor"},[t("br"),e._v("3d avg: +"+e._s(e._f("numeral")(a.row.deathschangelatest3,"0.0%"))+" "),t("br"),e._v("8d avg: +"+e._s(e._f("numeral")(a.row.deathschangelatest8,"0.0%"))+" ")]):e._e()]),t("b-table-column",{attrs:{field:"deceasedrelativelatest",label:"CFR*",numeric:"",sortable:"","header-class":"orangehead","cell-class":"orangecell"}},[e._v(" "+e._s(e._f("numeral")(a.row.deceasedrelative[e.latest],"0.0%"))+" "),e.showdetails?t("span",{staticClass:"minor"},[t("br"),e._v("3d avg: "+e._s(e._f("numeral")(a.row.deceasedrelativelatest3,"0.0%"))+" "),t("br"),e._v("8d avg: "+e._s(e._f("numeral")(a.row.deceasedrelativelatest8,"0.0%"))+" ")]):e._e()]),t("b-table-column",{attrs:{field:"deceasedrelativelatest8",label:"CFR* over "+e.daysCFR+" days",numeric:"",sortable:"",centered:"","header-class":"orangehead","cell-class":"orangecell"}},[t("div",{staticStyle:{width:"200px",height:"65px",margin:"auto"}},[t("sparkline",{attrs:{"chart-data":a.row.sparklinescfrdata,options:e.sparklinecfroptions,styles:e.sparklinestyles}})],1)])]}},{key:"detail",fn:function(e){return[t("article",{staticClass:"media"},[t("div",{staticClass:"media-content"},[t("div",{staticClass:"content"},[t("cov-detail",{attrs:{"chart-data":e.row}}),t("br")],1)])])]}}])}),t("div",{staticClass:"info"},[e._v(" Some notes: "),e._m(0),t("br"),t("p",{staticClass:"minor"},[e._v(" Data Source: "),t("a",{attrs:{href:"https://github.com/CSSEGISandData/COVID-19",target:"_blank"}},[e._v("Johns Hopkins University")]),t("br"),e._v(" Data included until: "+e._s(e.latest)+" ")]),t("br")]),t("div",{staticStyle:{color:"red","font-weight":"bold"}},e._l(e.error,(function(a,s){return t("div",{key:s},[t("strong",[e._v(e._s(s))]),t("br"),e._v(" "+e._s(a)+" "),t("br"),t("br")])})),0),t("div",e._l(e.debug,(function(a,s){return t("div",{key:s},[t("strong",[e._v(e._s(s))]),t("br"),e._v(" "+e._s(a)+" "),t("br"),t("br")])})),0)],1)},c=[function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ul",[t("li",[e._v(" - The relative changes in the confirmed cases can be related to a doubling rate, i.e. a doubling every 3 days for a daily increase of 26%. ")]),t("li",[e._v(' - The doubling time is displayed in the tooltip in the sparklines next to the relative increase, i.e. "26% / 3d". ')]),t("li",[e._v(" - "),t("strong",[e._v("CFR*")]),e._v(" is very crudely calculated by dividing the number of deceased persons by the number of confirmed cases. ")]),t("li",[e._v(" - The averages given over n number of days are computeed as geometric averages. ")]),t("li",[e._v(" - Please double check al computed values and graphs. This is a weekend-project for me, thus I only do very limited testing. ")]),t("li",[e._v(" - The source code and further information can be found on the respective "),t("a",{attrs:{href:"https://github.com/alexriss/SARS-CoV-2-Analysis"}},[t("i",{staticClass:"fab fa-github"}),e._v(" github page")]),e._v(". ")])])}],d=(t("4160"),t("a630"),t("caad"),t("c975"),t("fb6a"),t("d3b7"),t("ac1f"),t("3ca3"),t("5319"),t("1276"),t("159b"),t("96cf"),t("1da1")),u=t("6612"),f=t.n(u),h=t("1fca"),b=h["b"].reactiveProp,p={extends:h["a"],mixins:[b],props:["chartData","options"],mounted:function(){this.renderChart(this.chartData,this.options)}},m=p,v=t("2877"),g=Object(v["a"])(m,s,n,!1,null,null,null),y=g.exports,j=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"echarts"},[t("v-chart",{staticStyle:{width:"100%"},attrs:{options:e.option}})],1)},x=[],_=t("9ca8");t("be47"),t("ef97"),t("94b1"),t("627c"),t("cd12"),t("0a6d"),t("007d"),t("d28f"),t("b11c"),t("cb8f");function w(e){for(var a=e["dates"],t=[],s=[],n=[0],r=[0],i=[NaN],o=[NaN],l=[],c=0;c<a.length;c++)e["cases"][a[c]]>0?t.push(e["cases"][a[c]]):t.push(NaN),e["deaths"][a[c]]>0?s.push(e["deaths"][a[c]]):s.push(NaN),c>0&&(n.push(e["casesdifference"][a[c]]),r.push(e["deathsdifference"][a[c]]),i.push(e["caseschange"][a[c]]),o.push(e["deathschange"][a[c]])),l.push(e["deceasedrelative"][a[c]]);return{dates:a,cases:t,deaths:s,casesdifference:n,deathsdifference:r,caseschange:i,deathschange:o,deceasedrelative:l}}var C={components:{"v-chart":_["a"]},props:["chartData"],data:function(){var e=w(this.chartData);return{option:{title:{text:this.chartData.country,left:55,top:"7.2%"},tooltip:{trigger:"axis",axisPointer:{animation:!1}},legend:{data:["confirmed: total","deceased: total","confirmed: daily","deceased: daily","confirmed: increase","deceased: increase"],left:55},toolbox:{language:"en",feature:{dataZoom:{title:{zoom:"zoom",back:"previous zoom"},yAxisIndex:"none"},restore:{title:"reset"},saveAsImage:{title:"save as image"}}},axisPointer:{link:{xAxisIndex:"all"}},dataZoom:[{show:!0,realtime:!0,xAxisIndex:[0,1,2]},{type:"inside",realtime:!0,xAxisIndex:[0,1,2]},{type:"inside",realtime:!0,xAxisIndex:[0,1,2]},{type:"inside",realtime:!0,xAxisIndex:[0,1,2]},{type:"inside",realtime:!0,xAxisIndex:[0,1,2]},{type:"inside",realtime:!0,xAxisIndex:[0,1,2]},{xAxisIndex:[0,1,2],handleIcon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",handleSize:"80%",handleStyle:{color:"#fff",shadowBlur:3,shadowColor:"rgba(0, 0, 0, 0.6)",shadowOffsetX:2,shadowOffsetY:2}}],grid:[{left:50,right:50,top:"8%",height:"25%"},{left:50,right:50,top:"36.5%",height:"25%"},{left:50,right:50,top:"65%",height:"20%"}],xAxis:[{type:"category",boundaryGap:!1,axisLine:{onZero:!0},data:e["dates"],show:!1},{gridIndex:1,type:"category",boundaryGap:!1,axisLine:{onZero:!0},data:e["dates"],position:"bottom",show:!1},{gridIndex:2,type:"category",boundaryGap:!1,axisLine:{onZero:!0},data:e["dates"],position:"bottom"}],yAxis:[{name:"cumulative",nameLocation:"center",nameGap:40,type:"log",minorTick:{show:!0},minorSplitLine:{show:!0},axisLabel:{formatter:function(e){return f()(e).format("0a")}},axisLine:{lineStyle:{color:"#0159ad"}}},{name:"cumulative deceased",show:!0,nameLocation:"center",nameGap:40,type:"log",minorTick:{show:!0},minorSplitLine:{show:!0},axisLabel:{formatter:function(e){return f()(e).format("0a")}},axisLine:{lineStyle:{color:"#8d0101"}}},{gridIndex:1,name:"daily",nameLocation:"center",nameGap:40,type:"value",axisLabel:{formatter:function(e){return f()(e).format("0a")}},axisLine:{lineStyle:{color:"#0159ad"}}},{gridIndex:1,name:"daily deceased",show:!0,nameLocation:"center",nameGap:40,type:"value",axisLabel:{formatter:function(e){return f()(e).format("0a")}},axisLine:{lineStyle:{color:"#8d0101"}}},{gridIndex:2,name:"increase",nameLocation:"center",nameGap:40,type:"value",max:function(e){return Math.min(e.max,.5)},axisLabel:{formatter:function(e){return f()(e).format("0%")}}},{gridIndex:0,name:"CFR",show:!1,nameLocation:"center",nameGap:40,type:"value",max:function(e){return Math.max(e.max,.1)},axisLabel:{formatter:function(e){return f()(e).format("0.0%")}}}],series:[{name:"confirmed: total",type:"line",color:"#3179bd",sampling:"average",symbolSize:1,hoverAnimation:!0,data:e["cases"]},{name:"deceased: total",type:"line",color:"#9d3131",sampling:"average",xAxisIndex:0,yAxisIndex:1,symbolSize:1,hoverAnimation:!0,data:e["deaths"]},{name:"confirmed: daily",type:"bar",barGap:"-100%",barCategoryGap:"10%",color:"#3179bd",sampling:"average",xAxisIndex:1,yAxisIndex:2,symbolSize:1,hoverAnimation:!0,data:e["casesdifference"]},{name:"deceased: daily",type:"bar",color:"rgba(157,49,49,0.65)",sampling:"average",xAxisIndex:1,yAxisIndex:3,symbolSize:1,hoverAnimation:!0,data:e["deathsdifference"]},{name:"confirmed: increase",type:"line",color:"#3179bd",smooth:!0,sampling:"average",areaStyle:{},xAxisIndex:2,yAxisIndex:4,symbolSize:1,hoverAnimation:!0,data:e["caseschange"]},{name:"deceased: increase",type:"line",color:"#9d3131",smooth:!0,sampling:"average",areaStyle:{opacity:.2},xAxisIndex:2,yAxisIndex:4,symbolSize:1,hoverAnimation:!0,data:e["deathschange"]},{name:"CFR*",type:"line",lineStyle:{opacity:.2,type:"solid"},color:"#9d3161",smooth:!0,sampling:"average",areaStyle:{opacity:.2},xAxisIndex:0,yAxisIndex:5,symbolSize:0,hoverAnimation:!0,data:e["deceasedrelative"]}]}}}},k=C,S=(t("34af"),Object(v["a"])(k,j,x,!1,null,"2eb544b5",null)),A=S.exports,I=14,z=30,L=[0,100,500,1e3,2e3,5e3],D=3,O="time_series_covid19_confirmed_global.csv",G="time_series_covid19_deaths_global.csv",M="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/",R=["Hong Kong","Macau"],T="";window.location.href.indexOf("github.io")>=0&&(T=M),console.log("loading "+T+O);var F=P(T+O);console.log("loading "+T+G);var E=P(T+G);function P(e){var a=new XMLHttpRequest,t="";return a.open("GET",e,!1),a.onreadystatechange=function(){4===a.readyState&&(200!==a.status&&0!=a.status||(t=a.responseText))},a.send(null),t=t.replace('"Korea, South"',"South Korea"),t=t.replace(/"[^"]+"/g,(function(e){return e.replace(/,/g," ")})),t}function N(e){var a=new Date(e),t=new Date(a.getTime()-6e4*a.getTimezoneOffset()).toISOString();return t.slice(0,10)}function V(e,a){for(var t=1,s=X.length-1;s>=X.length-a;s--)t*=e[X[s]];return Math.pow(t,1/a)}function H(e,a,t){for(var s=arguments.length>3&&void 0!==arguments[3]&&arguments[3],n={},r={},i={},o={},l={},c=0;c<X.length-1;c++)a[X[c]]>0?n[X[c+1]]=a[X[c+1]]/a[X[c]]-1:n[X[c+1]]=0,t[X[c]]>0?r[X[c+1]]=t[X[c+1]]/t[X[c]]-1:r[X[c+1]]=0,i[X[c+1]]=a[X[c+1]]-a[X[c]],o[X[c+1]]=t[X[c+1]]-t[X[c]];X.forEach((function(e){a[e]>0?l[e]=t[e]/a[e]:l[e]=0}));var d=[];for(c=X.length-1-I;c<X.length;c++)d.push(n[X[c]]);var u={labels:X.slice(X.length-1-I),datasets:[{label:e,data:d}]},f=[];for(c=X.length-1-z;c<X.length;c++)f.push(l[X[c]]);var h={labels:X.slice(X.length-1-z),datasets:[{label:e,data:f}]};return{dates:X,country:e,isprovince:s,cases:a,deaths:t,caseslatest:a[W],deathslatest:t[W],caseschange:n,deathschange:r,casesdifference:i,deathsdifference:o,caseschangelatest:n[W],deathschangelatest:r[W],caseschangelatest3:V(n,3),deathschangelatest3:V(r,3),caseschangelatest8:V(n,8),deathschangelatest8:V(r,8),deceasedrelative:l,deceasedrelativelatest:l[W],deceasedrelativelatest3:V(l,3),deceasedrelativelatest8:V(l,8),sparklinesdata:u,sparklinescfrdata:h}}var Z=[],$=[],q=F.split("\n"),J=E.split("\n"),K=q.shift().split(","),U=J.shift().split(",");q.length!=J.length&&(console.log("Files do not match. "+q.length+" vs. "+J.length),$.push("Files do not match. "+q.length+" vs. "+J.length)),K.length!=U.length&&(console.log("Files do not match. "+K+" vs. "+U),$.push("Files do not match. "+K+" vs. "+U));var B=U.slice(4),X=Array.from(B,(function(e){return N(e)})),W=X[X.length-1],Y=[],Q=[],ee="",ae="",te="",se=[],ne=[],re={},ie={},oe={},le={},ce={},de={},ue=0,fe=0,he=!1;X.forEach((function(e){ce[e]=0,de[e]=0}));for(var be=0;be<q.length;be++)se=q[be].split(","),ne=J[be].split(","),se[1]!=ne[1]&&(console.log("Country mismatch: "+se[1]+" --- "+ne[1]),$.push("Country mismatch: "+se[1]+" --- "+ne[1])),se.length<X.length+4||(ee=se[1],ae=se[0],te!=ee&&(""!=te&&Y.push(H(te,re,ie)),re={},ie={},X.forEach((function(e){re[e]=0,ie[e]=0})),te=ee),oe={},le={},X.forEach((function(e,a){ue=parseInt(se[a+4]),fe=parseInt(ne[a+4]),re[e]+=ue,ie[e]+=fe,oe[e]=ue,le[e]=fe,ce[e]+=ue,de[e]+=fe})),ae.length>0&&(he=!R.includes(ae),Y.push(H(ee+" - "+ae,oe,le,he))));for(Y.push(H(te,re,ie)),Y.push(H("World",ce,de)),be=0;be<Y.length;be++)Y[be]["cases"][W]>1e3&&Q.push(Y[be]);var pe={components:{Sparkline:y,CovDetail:A},data:function(){return{data:Y,dataFiltered:Q,loading:!1,minCasesList:L,minCasesActive:D,showDetailIcon:!0,debug:Z,error:$,latest:W,showdetails:!1,showprovinces:!0,daysRelChange:I,daysCFR:z,sparklinestyles:{height:"65px",width:"100%",position:"relative"},sparklineoptions:{responsive:!0,maintainAspectRatio:!1,legend:{display:!1},elements:{point:{radius:1},line:{tension:0,backgroundColor:"#3179bd",borderColor:"#3179bd",fill:!0}},tooltips:{enabled:!0,mode:"x-axis",displayColors:!1,callbacks:{label:function(e){var a=1/(Math.log(1+e.yLabel)/Math.log(2));return f()(e.yLabel).format("0.0%")+" / "+f()(a).format("0.0")+"d"}}},scales:{yAxes:[{display:!1,ticks:{min:0,max:.35,callback:function(e){return f()(e).format("0,0%")}}}],xAxes:[{display:!1}]}},sparklinecfroptions:{responsive:!0,maintainAspectRatio:!1,legend:{display:!1},elements:{point:{radius:1},line:{tension:0,backgroundColor:"#9d3131",borderColor:"#9d3131",fill:!0}},tooltips:{enabled:!0,mode:"x-axis",displayColors:!1,callbacks:{label:function(e){return f()(e.yLabel).format("0.0%")}}},scales:{yAxes:[{display:!1,ticks:{min:0,max:.1,callback:function(e){return f()(e).format("0,0%")}}}],xAxes:[{display:!1}]}}}},methods:{toggle:function(e){this.$refs.table.toggleDetails(e)},updateData:function(){var e=Object(d["a"])(regeneratorRuntime.mark((function e(){var a,t,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.loading=!0,a=this.minCasesList[this.minCasesActive],t=new Date,this.timeDataChange=t,e.next=6,new Promise((function(e){return setTimeout(e,200)}));case 6:s=[],be=0;case 8:if(!(be<this.data.length)){e.next=15;break}if(this.timeDataChange==t){e.next=11;break}return e.abrupt("return",!1);case 11:this.data[be]["isprovince"]&&!this.showprovinces||this.data[be]["cases"][W]>a&&s.push(this.data[be]);case 12:be++,e.next=8;break;case 15:this.timeDataChange==t&&(this.dataFiltered=s,this.loading=!1);case 16:case"end":return e.stop()}}),e,this)})));function a(){return e.apply(this,arguments)}return a}()}},me=pe,ve=(t("f227"),t("9da3"),Object(v["a"])(me,l,c,!1,null,"1a286c83",null)),ge=ve.exports,ye={name:"App",components:{CovTable:ge}},je=ye,xe=(t("034f"),t("74f2"),t("1564"),Object(v["a"])(je,i,o,!1,null,"26d290b0",null)),_e=xe.exports,we=t("289d"),Ce=t("cd1a");r["a"].use(we["a"],{defaultIconPack:"fas"}),r["a"].use(Ce["a"],{locale:"de"}),r["a"].config.productionTip=!0,new r["a"]({render:function(e){return e(_e)}}).$mount("#app")},"74f2":function(e,a,t){"use strict";var s=t("0c76"),n=t.n(s);n.a},"85ec":function(e,a,t){},"9da3":function(e,a,t){"use strict";var s=t("551b"),n=t.n(s);n.a},a1d7:function(e,a,t){},b475:function(e,a,t){},c20a:function(e,a,t){},f227:function(e,a,t){"use strict";var s=t("a1d7"),n=t.n(s);n.a}});
//# sourceMappingURL=app.60977c67.js.map