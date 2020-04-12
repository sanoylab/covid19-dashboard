
 let apiGlobalData = async () => {
    let response = await fetch(
        'https://corona.lmao.ninja/all'); //api end point
    return response.json();
}
apiGlobalData().then((res) => {
    let global_data = res;
    document.getElementById('cases').innerHTML = global_data.cases.toString().replace(
        /\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('deaths').innerHTML = global_data.deaths.toString().replace(
        /\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('recovered').innerHTML = global_data.recovered.toString()
        .replace(
            /\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('active').innerHTML = global_data.active.toString().replace(
        /\B(?=(\d{3})+(?!\d))/g, ",");
}).catch()



let checkColor = (num, type) => {
    if (num > 0 && type === 'd') {
        return `style="background: red; color:white;"`;
    } else if (num > 0 && type === 'c') {
        return `style="background: #FFEEAA; color:black;"`;
    }

}
let apiCountryData = async () => {
    let response = await fetch(
        'https://corona.lmao.ninja/countries?sort=cases'); //api end point
    return response.json();
}
let apiCountryMapData = async () => {
    let response = await fetch(
        'https://corona.lmao.ninja/v2/jhucsse/'); //api end point
        return response.json();
}
apiCountryData().then(
    (res) => {
        let countries_data = res;
        let totalConfirmed = 0;
        let totalDeath = 0;
        let totalRecovered = 0;
        let totalActive = 0;
        countries_data.forEach(function (name) {

        $('#country_list-table').append(`
        <tr style="cursor:pointer">
        <td style="text-align:left; color:#337ab7"><div style="display: flex;align-item: center;">
        <img class="img-responsive flag" style="width: 30px; height: 30px; margin-left: 10px; border-radius: 50%" src="${name.countryInfo.flag}"> 
        
        <b style="padding-top: 5px; padding-left: 10px;"> <a onClick="return CountryDetail('${name.countryInfo.flag}','${name.country}','${name.cases}','${name.active}','${name.recovered}','${name.deaths}','${name.todayCases}','${name.todayDeaths}','${name.tests}')">${name.country}</a></b></div></td>
        <td><b>${name.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
        <td ${checkColor(name.todayCases,"c")}><b>${Number(name.todayCases)>0?"+"+name.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):""}</b></td>
        <td><b>${name.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
        <td ${checkColor(name.todayDeaths,"d")}><b>${Number(name.todayDeaths)>0?"+"+name.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):""}</b></td>
        <td><b>${name.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
        <td><b>${name.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
        <td><b>${name.critical.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
        <td><b>${name.casesPerOneMillion ==null?"": name.casesPerOneMillion}</b></td>
        <td><b>${name.deathsPerOneMillion== null? "": name.deathsPerOneMillion}</b></td>
        <td><b>${name.tests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
        <td><b>${name.testsPerOneMillion ==null?"": name.casesPerOneMillion}</b></td>
        
        </tr>`);

        $('#country').append(`
         <div class="areas">
            <div id="${name.countryInfo._id}" class="area" onClick="return countryDetail('${name.country}', '${name.deaths}', '${name.recovered}', '${name.active}', '${name.countryInfo.lat}', '${name.countryInfo.long}','${name.cases}','${name.countryInfo.flag}')">
               <div class="areaName" title="${name.country}">
                  <img src="${name.countryInfo.flag}" style="width:30px; height: 30px; border-radius: 50%;"><span>${name.country}</span></div>
                  <div class="areaTotal">
                    <div class="secondaryInfo">${name.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                  </div>
                </div>
            </div>`);
            let parameter = `${name.country}, ${name.deaths}, ${name.recovered}, ${name.active}, ${name.countryInfo.lat}, ${name.countryInfo.long},${name.cases},${name.countryInfo.flag}`;
            $('#countryMobile').append(`
            <option style="background-image: url('${name.countryInfo.flag}');" value="${parameter.toString()}">${name.country}</option>
				
            `);

         totalConfirmed += parseInt(name.cases);
         totalDeath += parseInt(name.deaths);
         totalActive += parseInt(name.active)
         totalRecovered += parseInt(name.recovered);
        });


        donutChart(totalActive, totalDeath, totalRecovered, 'Global Summary')

      
        apiCountryMapData().then((res) => {
            
            let countries_data = res;
            covidMap(countries_data,6.6111, 20.9394, 1);
        });

    

        
    }).catch()

    let countryDetail = (countryName, death, recover, active_cases, lat, long,cases,flag) => {
console.log(flag)
        apiCountryMapData().then((res) => {
            let countries_data = res;
            let countryTitle = document.getElementById('countryName');
            let countryDeaths = document.getElementById('death');
            let countryRecovered = document.getElementById('recovered');
            document.getElementById('active-menu').innerHTML = `<em class="fa fa-home"></em> <a href="index.html">Global</a>`;
            //document.getElementById('page-header').innerHTML = `<img src="${flag}" style="width: 70px; height: 70px; border-radius: 50%;"> ${countryName}`;
            document.getElementById('cases').innerHTML = cases.toString().replace(
              /\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('deaths').innerHTML = death.toString().replace(
                /\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('recovered').innerHTML = recover.toString()
                .replace(
                    /\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('active').innerHTML = active_cases.toString().replace(
                /\B(?=(\d{3})+(?!\d))/g, ",");

            document.getElementById('countryNameTitle').innerHTML = `<img src="${flag}" style="width: 25px; height: 25px; border-radius: 50%"> ${countryName}`;

            covidMap(countries_data, lat, long, 3);
            donutChart(active_cases, death, recover, `${countryName} Summary`)
            getCountryChartData(countryName);

        }).catch();
    }
    //let countryDetailMobile = (countryName, death, recover, active_cases, lat, long,cases,flag) => {
    let countryDetailMobile = (countryNameInfo) => {
        
        console.log(countryNameInfo);
        
        apiCountryMapData().then((res) => {
            let countries_data = res;
            if(countryNameInfo === ""){
                window.location.href = "index.html";

            }
            else{
                let parameter= countryNameInfo.split(',');
                let countryTitle = document.getElementById('countryName');
                let countryDeaths = document.getElementById('death');
                let countryRecovered = document.getElementById('recovered');
                document.getElementById('active-menu').innerHTML = `<em class="fa fa-home"></em> <a href="index.html">Global</a>`;
                //document.getElementById('page-header').innerHTML = `<img src="${flag}" style="width: 70px; height: 70px; border-radius: 50%;"> ${countryName}`;
                document.getElementById('cases').innerHTML = parameter[6].toString().replace(
                  /\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('deaths').innerHTML = parameter[1].toString().replace(
                    /\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('recovered').innerHTML = parameter[2].toString()
                    .replace(
                        /\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('active').innerHTML = parameter[3].toString().replace(
                    /\B(?=(\d{3})+(?!\d))/g, ",");
    
                    document.getElementById('countryNameTitle').innerHTML = `<img src="${parameter[7].toString()}" style="width: 25px; height: 25px; border-radius: 50%"> ${parameter[0].toString()}`;

    
                covidMap(countries_data, parameter[4], parameter[5], 3);
                donutChart(parameter[3], parameter[1], parameter[2], `${parameter[0]} Summary`)
                getCountryChartData(parameter[0]);
            }
            
           

        }).catch();
    }



    function onEachFeature(feature, layer) {
        layer.on('mouseover', function () {});
        if (feature.properties && feature.properties.popupContent) {
            layer.on('mouseover', function () {
                layer.openPopup();
            });
            layer.on('mouseout', function () {
                layer.closePopup();
            });
            layer.bindPopup(feature.properties.popupContent);
        }
    }
    let covidMap = (data, lat, long, zoom) => {
        document.getElementById('covid19-map').innerHTML =
            "<div id='mapid' style='width: 100%; height: 100%;'></div>";
        var geojson = {
            type: "FeatureCollection",
            features: [],
        };
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#dc3545",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        data.forEach((row) => {
            geojson.features.push({
                "radius": row.stats.confirmed,
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [row.coordinates.longitude, row.coordinates.latitude]
                },
                "properties": {
                    "stationName": row.country,//.iso2,
                    "popupContent": `
           <div class="titleInfoBox">
          
             <span>${row.country !=null ? row.country.toUpperCase(): ""} ${row.province !=null ?" - "+row.province: ""} </span> 
           </div>
       
           <div class="statLine">
                  <div class="legendColor ongoing"></div>
                  <div class="stat total">Confirmed</div>
                  <div class="statCount total">${row.stats.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>
          
           <div class="statLine">
              <div class="legendColor recovered"></div>
              <div class="stat total">Recovered</div>
              <div class="statCount total">${row.stats.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
           </div>
           <div class="statLine">
              <div class="legendColor fatal"></div>
              <div class="stat total">Death</div>
              <div class="statCount total">${row.stats.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
           </div>
           `
                }
            })
        })
        var mapboxAccessToken =
            "pk.eyJ1IjoiZXhwZXJ0c2Fub3kiLCJhIjoiY2s4OWNwZXkzMDVuZDNldnU3Y3N0N3IxcyJ9.B28AhJkQznwv8poyiLqz3A";
        var map = new L.Map('mapid');
        map.setView(new L.LatLng(lat, long), zoom);
        map.flyTo(new L.LatLng(lat, long), zoom + 1, {
            animate: true,
            duration: 0.5,
            easeLinearity: 1,
            noMoveStart: true
        });
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
            mapboxAccessToken, {
                id: 'mapbox/light-v9',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(map);
        map.on('mouseover', function (ev) {

        })
        L.geoJson(geojson, {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {

                return L.circleMarker(latlng, {
                    radius: calculateRadius(feature.radius),
                    fillColor: "#dc3545",
                    color: "#dc3545",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);

    }

    let calculateRadius = (radius) => {
        if ((radius) / 1000 > 20) {
            return 25;
        } else if ((radius) / 1000 > 10 && (radius) / 1000 < 20) {
            return 15;
        } else if ((radius) / 1000 > 5 && (radius) / 1000 < 10) {
            return 10;
        } else if ((radius) / 1000 < 5) {
            return 5;
        } else {
            return (radius) / 1000;
        }
    }

    let apiNewsData = async () => {
        let response = await fetch(
            'https://newsapi.org/v2/top-headlines?language=en&q=covid-19&sortBy=publishedAt&apiKey=af00c7eef7c74c9c9300434acb5e9159'); //api end point
        return response.json();
    }
    apiNewsData().then((res) => {
        let news_data = res;
       news_data.articles.length =10;  
        news_data.articles.forEach(function (name) {
  $("#news").append(`
 
  <div class="article border-bottom">
							<div class="col-xs-12">
								<div class="row">
									<div class="col-xs-12 col-md-2 date">
                                    <img src="${name.urlToImage}" alt="User Avatar" class="img-responsive" >
									</div>
									<div class="col-xs-12 col-md-10">
										<h4><a href="${name.url}" target="_blank">${name.title}</a></h4>
										<p>${name.description}</p>
      <a href="https://${name.source.name}" target="_blank" style="text-transform:uppercase;">${name.source.name}</a>
									</div>
								</div>
							</div>
							<div class="clear"></div>
                        </div>
                        





        
 
                            


        `);

        });
      


       
    }).catch()

    let apiHistoricalData = async () => {
        let response = await fetch(
            'https://corona.lmao.ninja/v2/historical/all?lastdays=10'); //api end point
        return response.json();
    }

    apiHistoricalData().then((res) => {
        
        let caseCategory = Object.keys(res.cases)
        let caseValue = Object.values(res.cases)
        barCharts(caseCategory, caseValue, 'case-chart', '#F4C363', 'Cases');

        let recoveredCategory = Object.keys(res.recovered)
        let recoveredValue = Object.values(res.recovered)
        barCharts(recoveredCategory, recoveredValue, 'case-recovered','#60BB69', 'Recovered');

        let deathsCategory = Object.keys(res.deaths)
        let deathsValue = Object.values(res.deaths)
        barCharts(deathsCategory, deathsValue, 'case-death','#DE3700','Death');

        var countsData = [
            [],
            [],
            []
        ];

        caseValue.forEach((item)=>{
            countsData[0].push(item)
        });
        recoveredValue.forEach((item)=>{
            countsData[1].push(item)
        });
        deathsValue.forEach((item)=>{
            countsData[2].push(item)
        });
      //  caseCategory.shift();
       lineCharts (caseCategory,countsData ,'chart-summary');
       

    }).catch();


   let getCountryChartData=(country)=>{

    document.getElementById('summary-title').innerHTML = `${country} - Summary`;
    document.getElementById('cases-title').innerHTML = `${country} - Cases`;
    document.getElementById('deaths-title').innerHTML = `${country} - Deaths`;
    document.getElementById('recovered-title').innerHTML = `${country} - Recovered`;
    document.getElementById('summary-title2').innerHTML = `${country} - Summary`;

    let apiHistoricalCountryData = async () => {
        let response = await fetch(
            'https://corona.lmao.ninja/v2/historical/'+country+'?lastdays=60'); //api end point
        return response.json();
    }

    apiHistoricalCountryData().then((res) => {

        let caseCountryCategory = Object.keys(res.timeline.cases)
        let caseCountryValue = Object.values(res.timeline.cases)
        barCharts(caseCountryCategory, caseCountryValue, 'case-chart', '#F4C363', 'Cases');

        let recoveredCountryCategory = Object.keys(res.timeline.recovered)
        let recoveredCountryValue = Object.values(res.timeline.recovered)
        barCharts(recoveredCountryCategory, recoveredCountryValue, 'case-recovered','#60BB69', 'Recovered');

        let deathsCountryCategory = Object.keys(res.timeline.deaths)
        let deathsCountryValue = Object.values(res.timeline.deaths)
        barCharts(deathsCountryCategory, deathsCountryValue, 'case-death','#DE3700','Death');
       

        var countsData = [
            [],
            [],
            []
        ];

        caseCountryValue.forEach((item)=>{
            countsData[0].push(item)
        });
        recoveredCountryValue.forEach((item)=>{
            countsData[1].push(item)
        });
        deathsCountryValue.forEach((item)=>{
            countsData[2].push(item)
        });
      //  caseCategory.shift();
       lineCharts (caseCountryCategory,countsData ,'chart-summary');

    }).catch();
   }



    let barCharts = (chartCategory, chartValues, dom,backColor,title) => {

        var mediaWidth = window.matchMedia("(max-width: 600px)");
        if (mediaWidth.matches) { // If media query matches
            chartCategory = chartCategory.slice(Math.max(chartCategory.length - 5, 1))
            chartValues = chartValues.slice(Math.max(chartValues.length - 5, 1))
          } else {
            chartCategory = chartCategory.slice(Math.max(chartCategory.length - 15, 1))
            chartValues = chartValues.slice(Math.max(chartValues.length - 15, 1))
          }


       
       
        chartCategory.unshift('Case')
        chartValues.unshift(title)
        var chart_bar = c3.generate({
            bindto: '#'+dom,
            data: {
                x: 'Case',
                columns: [chartCategory,chartValues],
                type: 'bar',
                labels: {
                    format: function (value, ratio, id) {
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                },
                
            },
            
            types: {
                data: 'bar'
            },
            groups: [
                chartCategory, chartValues
            ],
            color: {
                pattern: [backColor]
            },
           
            axis: {
                rotated: false,
                x: {
                    type: 'category',
                    tick: {
                        rotate: 7,
                        multiline: true
                    }
                },
                
            },
            tooltip: {
                format: function (value, ratio, id) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            },
            size: {
                height: 300
            },
            padding: {
                left: 10,
                right: 10
            },
            
           
        });

    }

    let lineCharts = (chartCategory, chartValues, dom) => {
        let value = []
        var mediaWidth = window.matchMedia("(max-width: 600px)");
        if (mediaWidth.matches) { 
            chartCategory = chartCategory.slice(Math.max(chartCategory.length - 5, 1))       
        
            
            chartValues.forEach((item, key)=>{
                value.push(item.slice(Math.max(item.length - 5, 1)))
            })
            value[0].unshift('Confirmed');
            value[1].unshift('Recovered');
            value[2].unshift('Deaths');
        }
        else {
            chartCategory = chartCategory.slice(Math.max(chartCategory.length - 15, 1))       
        
           
            chartValues.forEach((item, key)=>{
                value.push(item.slice(Math.max(item.length - 15, 1)))
            })
            value[0].unshift('Confirmed');
            value[1].unshift('Recovered');
            value[2].unshift('Deaths');

        }

        var chart_bar = c3.generate({
            bindto: '#'+dom,
            data: {
               
                columns: value,
                type: 'area',
                labels:false,/* {
                    format: function (value, ratio, id) {
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                },*/
                                type: 'area',
                padding: {
                    left: 60,
                    top: 40
                },
            },
            
                       
            color: {
                pattern: ["#F4C363", "#60BB69", "#DE3700"]
            },
           
            axis: {
                rotated: false,
                x: {
                    type: 'category',
                    categories: chartCategory
                },
                y: {
                    show: false
                }
            },
            size: {
                height: 300
            },
            padding: {
                left: 10,
                right: 10
            },

           
        });
        d3.select(".c3-legend-item .c3-legend-item-2017 .c3-legend-item-2018 .c3-legend-item-2019"). style("float", "right").attr("transform", "translate(0,7)");


    }

    let donutChart = (active, death, recovered, title) => {
        var chart = c3.generate({
            bindto: '#donut',
            data: {
                columns: [
                    ['Active cases', active],
                    ['Total Death', death],
                    ['Total Recovered', recovered]
                ],
                type: 'donut'

            },
            color: {
                pattern: ['#F7A600', '#dc3545', '#51AF32']
            },
            size: {
                height: 300
            },
            donut: {
                label: {
                    format: function (value, ratio, id) {
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                },
                title: title
            }
        });

    }
    
        let switcher = document.getElementById("slider");
        window.addEventListener("load", ()=>{
            console.log('hi')
             if(localStorage.getItem('darkMode')=='true'){
                     switcher.checked=true;
                     localStorage.setItem('darkMode', 'true');
                     darkMode();
             } else{
                localStorage.removeItem('darkMode');
               darkMode(); 
             }
        });

        
       
        switcher.addEventListener('change', ()=>{
            if(switcher.checked){
                localStorage.setItem('darkMode', 'true');
                darkMode();
            }
            else {
               localStorage.removeItem('darkMode');
               darkMode();
            }
        }) 

        let darkMode = () =>{
            if(localStorage.getItem('darkMode')=='true'){
                $("<link/>", {
                    rel: "stylesheet",
                    type: "text/css",
                    href: "./css/darkmode.css",
                    title: "underline"
                  }).appendTo("head");
            } else {
                removeDarkMode();
            }

        }

        let removeDarkMode = () =>{
            $('link[href="./css/darkmode.css"]').remove();
        }
 

    
