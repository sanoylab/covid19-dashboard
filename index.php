<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Covid - 19 Tracker</title>
    <link rel="icon" 
      type="image/png" 
      href="img/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Barlow&family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>
    <!-- Esri Leaflet Geocoder -->
    <link rel="stylesheet" href="https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css">
    <script src="https://unpkg.com/esri-leaflet-geocoder"></script>

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/c3.css">
</head>

<body>  
<?php header('Location: /index.html'); exit; ?>
    <div  class="container"><nav class="header">
        <img class="d-block mx-auto mb-4" src="img/favicon.png" alt="" width="42" height="42"><h1>COVID-19 Tracker</h1>
         </nav>
        <div class="country-list">        
            <div class="country-list-content">
                <ul class="view">                    
                    <li><a id="tabular-btn" href="tabular.php" >Tabular view</a></li>
                </ul>
                <div class="infoTile" style="width: 272px;">
                <h2 class="title" title="Total Confirmed Cases">Total Confirmed Cases</h2>             
                <div id="cases" class="confirmed"></div>
                <div class="infoTileData">
                    <h2 class="legend">
                        <div class="color" style="background: rgb(244, 195, 99);"></div>
                        <div class="description">Active cases</div>
                        <div id="active" class="total">799,419</div>
                    </h2>
                    <h2 class="legend">
                        <div class="color" style="background: rgb(96, 187, 105);"></div>
                        <div class="description">Recovered cases</div>
                        <div id="recovered" class="total">225,422</div>
                    </h2>
                        <h2 class="legend">
                            <div class="color" style="background: #DE3700;"></div>
                            <div class="description">Fatal cases</div>
                            <div id="deaths" class="total">58,243</div>
                    </h2>
                </div>
            </div>     
            <div id="country">
            </div>
      </div>
    </div>
    <div class="map">
         <div id="covid19-map" style="width: 100%; "></div>
    </div>
  </div>
</div>
 
<?php   
    function all_country_list(){
      $curl = curl_init();
      curl_setopt_array($curl, array(
        CURLOPT_URL => "https://corona.lmao.ninja/countries?sort=cases",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET"        
      ));      
      $response = curl_exec($curl);
      $err = curl_error($curl);      
      curl_close($curl);
      //$response =json_decode($response);
      echo $response;
     }
    
     function Get_Global(){
        $curl = curl_init();  
        curl_setopt_array($curl, array(
          CURLOPT_URL => "https://corona.lmao.ninja/all",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "GET"          
        ));        
        $response = curl_exec($curl);
        $err = curl_error($curl);        
        curl_close($curl);  
        //$response =json_decode($response);  
        echo $response;
       }
    
    ?>
    
 <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
 <script src="js/d3.min.js"></script>
 <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
  integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
  crossorigin=""></script>
 <script src="js/c3.min.js"></script>
 <script>
   window.addEventListener('load', function () {
     let countries_data = <?php echo all_country_list(); ?> ;
     let global_data = <?php echo Get_Global(); ?> ;
     document.getElementById('cases').innerHTML = global_data.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     document.getElementById('deaths').innerHTML = global_data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     document.getElementById('recovered').innerHTML = global_data.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     document.getElementById('active').innerHTML = global_data.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     let totalConfirmed = 0;
     let totalDeath = 0;
     let totalRecovered = 0;
     let totalActive = 0;
     let checkColor = (num)=>{
        if(num > 0){
           return `style="background: red; color:white;"`;
        } 
     }
     countries_data.forEach(function (name) {
       $('#country').append(`
          <div class="areas">
            <div id="${name.countryInfo._id}" class="area" onClick="return countryDetail('${name.country}', '${name.deaths}', '${name.recovered}', '${name.active}', '${name.countryInfo.lat}', '${name.countryInfo.long}')">
              <div class="areaName" title="${name.country}">
                 <img src="${name.countryInfo.flag}" style="width:30px; height: 30px; border-radius: 50%;"><span>${name.country}</span></div>
                 <div class="areaTotal">
                    <div class="secondaryInfo">${name.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                 </div>
            </div>
          </div>`);
          $('#country_list-table').append(`
            <tr style="cursor:pointer">
             <td>${name.country}</td>
             <td>${name.cases}</td>
             <td>${name.todayCases}</td>
             <td>${name.deaths}</td>
             <td ${checkColor(name.todayDeaths)}>${name.todayDeaths}</td>
             <td>${name.recovered}</td>
             <td>${name.active}</td>
             <td>${name.critical}</td>
             <td>${name.casesPerOneMillion}</td>
             <td>${name.deathsPerOneMillion}</td>
            </tr>`);
          totalConfirmed += parseInt(name.cases);
          totalDeath += parseInt(name.deaths);
          totalActive += parseInt(name.active)
          totalRecovered += parseInt(name.recovered);
         });
         covidMap(countries_data, 38, -97,4);
      });
      let countryDetail = (countryName, death, recover, active_cases, lat, long) => {
        let countries_data = <?php echo all_country_list(); ?> ;
        let countryTitle = document.getElementById('countryName');
        let countryDeaths = document.getElementById('death') ;
        let countryRecovered = document.getElementById('recovered') ;
        covidMap(countries_data, lat, long,5);
        countryTitle.textContent = countryName;
        countryDeaths.textContent = death;
        countryRecovered.textContent = recover ;
        //summaryChart(active_cases.replace(/\,/g,''), death.replace(/\,/g,''), recover.toString().replace(/\,/g,''), countryName );
        summaryTable(active_cases, death, recover, countryName, 6 );
           

      }
      function onEachFeature(feature, layer) {         
        layer.on('mouseover', function(){
        });
        if (feature.properties && feature.properties.popupContent) {
          layer.on('mouseover', function() { layer.openPopup(); });
          layer.on('mouseout', function() { layer.closePopup(); });
          layer.bindPopup(feature.properties.popupContent);
        }
      }
      let covidMap=(data, lat, long,zoom) => {
        document.getElementById('covid19-map').innerHTML = "<div id='mapid' style='width: 100%; height: 100%;'></div>";
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
        data.forEach((row)=>{
          geojson.features.push({
            "radius": row.cases,
            "type": "Feature",
            "geometry": {
            "type": "Point",
            "coordinates": [row.countryInfo.long,row.countryInfo.lat]
           },
            "properties": {
            "stationName": row.countryInfo.iso2,
            "popupContent":`
               <div class="titleInfoBox">
                 <img style="width: 50px; height: 50px; border-radius: 50%" src="${row.countryInfo.flag}">
                 <span>${row.country.toUpperCase()}</span>
               </div>
               <div class="statLine">
                 <div class="stat total">Total cases</div>
                 <div class="statCount total">${row.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>
               <div class="statLine divider"></div>
               <div class="statLine">
                  <div class="legendColor ongoing"></div>
                  <div class="stat total">Active</div>
                  <div class="statCount total">${row.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>
               <div class="statLine">
                  <div class="legendColor recovered"></div>
                  <div class="stat total">Recovered</div>
                  <div class="statCount total">${row.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>
               <div class="statLine">
                  <div class="legendColor fatal"></div>
                  <div class="stat total">Death</div>
                  <div class="statCount total">${row.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>
               <div class="statLine divider"></div>
                  <div class="statLine">
                  <div class="legendColor ongoing"></div>
                  <div class="stat total">New cases</div>
                  <div class="statCount total">+${row.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>
               <div class="statLine">
                  <div class="legendColor fatal"></div>
                  <div class="stat total">New death</div>
                  <div class="statCount total">+${row.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>
               <div class="statLine divider"></div>
                  <div class="statLine">
                  <div class="legendColor recovered"></div>
                  <div class="stat total">Total tests</div>
                  <div class="statCount total">${row.tests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
               </div>`
                    }
                })
            })
            var mapboxAccessToken = "pk.eyJ1IjoiZXhwZXJ0c2Fub3kiLCJhIjoiY2s4OWNwZXkzMDVuZDNldnU3Y3N0N3IxcyJ9.B28AhJkQznwv8poyiLqz3A";
            var map = new L.Map('mapid');
            map.setView(new L.LatLng(lat,long), zoom);
            map.flyTo(new L.LatLng(lat,long), zoom+1, {
              animate: true,
              duration: 0.5,
              easeLinearity: 1 ,
              noMoveStart	: true
            });
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
                id: 'mapbox/light-v9',                
                tileSize: 512,
                zoomOffset: -1
            }).addTo(map);
            map.on('mouseover',function(ev) {
     
            })
            L.geoJson(geojson, { onEachFeature: onEachFeature, pointToLayer: function (feature, latlng) {
                
                return L.circleMarker(latlng, {
                    radius: calculateRadius(feature.radius),
                    fillColor: "#dc3545",
                    color: "#dc3545",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            } }).addTo(map); 
          
      }
    
      let calculateRadius = (radius)=>{
        if((radius)/1000>20){
           return 25;
        }
        else if((radius)/1000 >10 && (radius)/1000 <20){
           return 15;
        }
        else if((radius)/1000 >5 && (radius)/1000 <10){
           return 10;
        }
        else if((radius)/1000 < 5){
           return 5;
        }
        else {
           return (radius)/1000;
        }
     }            
    </script>
    <script>
      let  searhTable() => {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("txtSearch");
        filter = input.value.toUpperCase();
        table = document.getElementById("country_list");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[1];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
            tr[i].style.display = "none";
          }
        }
      }   
    }
   </script>

</body>

</html>