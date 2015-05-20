/*
    __________________   __  ___                
   / ____/ ____/ ____/  /  |/  /___ _____  _____
  / /_  / /   / /      / /|_/ / __ `/ __ \/ ___/
 / __/ / /___/ /___   / /  / / /_/ / /_/ (__  ) 
/_/    \____/\____/  /_/  /_/\__,_/ .___/____/  
                                 /_/            
*/

/*
var geo_host = '//www.broadbandmap.gov';
var geo_space = 'fcc';
var geo_output = 'json'
*/

//var geo_host = 'http://ldevtm-geo02:8080';
var geo_host = 'http://ltsttm-geo02a:8080';
var geo_space = 'geo_swat';
var geo_output = 'application/json'

var nn = 0;
var map;
var shownPolyCounty;

 var countyStyleHidden = {
          weight: 0,
          opacity: 0.0,
          color: 'black',
          fillOpacity: 0.0
      };
	  
 var countyStyleShown = {
	color: '#FFFF00',
    weight: 5,
    opacity: 1.0,
    fillOpacity: 0.0
      };
	  
 var countyStyleSearched = {
	color: '#FFFF00',
	fillColor: '#FFFFFF',
    weight: 5,
    opacity: 1.0,
    fillOpacity: 0.0
      };

 function createMap() {
 
     L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
     map = L.mapbox.map('map', 'fcc.k74ed5ge', {
             attributionControl: true,
             maxZoom: 19
         })
         .setView([40, -97], 3);

     map.attributionControl.addAttribution('<a href="http://fcc.gov/maps">FCC Maps</a>');

     baseStreet = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
     baseSatellite = L.mapbox.tileLayer('fcc.k74d7n0g');
     baseTerrain = L.mapbox.tileLayer('fcc.k74cm3ol');

    var wms_nonfrozen_class_1 = L.tileLayer.wms(geo_host +'/geoserver/gwc/service/wms?tiled=true', {
         format: 'image/png',
         transparent: true,
         layers: geo_space +':caftwo_nonfrozen_class_1'
     });

    var wms_nonfrozen_class_2 = L.tileLayer.wms(geo_host +'/geoserver/gwc/service/wms?tiled=true', {
         format: 'image/png',
         transparent: true,
         layers: geo_space +':caftwo_nonfrozen_class_2'
     });
	 
	var wms_nonfrozen_class_3 = L.tileLayer.wms(geo_host +'/geoserver/gwc/service/wms?tiled=true', {
         format: 'image/png',
         transparent: true,
         layers: geo_space +':caftwo_nonfrozen_class_3'
     });
	 
	var wms_nonfrozen_class_4 = L.tileLayer.wms(geo_host +'/geoserver/gwc/service/wms?tiled=true', {
         format: 'image/png',
         transparent: true,
         layers: geo_space +':caftwo_nonfrozen_class_4'
     });
	 
	var wms_frozen = L.tileLayer.wms(geo_host +'/geoserver/gwc/service/wms?tiled=true', {
         format: 'image/png',
         transparent: true,
         layers: geo_space +':caftwo_frozen'
    });
	var wms_counties_merge = L.tileLayer.wms(geo_host +'/geoserver/gwc/service/wms?tiled=true', {
         format: 'image/png',
         transparent: true,
         layers: geo_space +':caftwo_caf_counties_merge'
    });

     L.control.scale({
         position: 'bottomright'
     }).addTo(map);

     geocoder = L.mapbox.geocoder('mapbox.places-v1');

     L.control.layers({
         'Street': baseStreet.addTo(map),
         'Satellite': baseSatellite,
         'Terrain': baseTerrain
     }, {
		'Eligible': wms_nonfrozen_class_4.addTo(map),
		'Ineligible - Exceeds Benchmark': wms_nonfrozen_class_1.addTo(map),
		'Ineligible - Below Benchmark': wms_nonfrozen_class_2.addTo(map),
		'Other Ineligible': wms_nonfrozen_class_3.addTo(map),
		'Elected Frozen': wms_frozen.addTo(map),
		'Counties': wms_counties_merge
     }, {
         position: 'topleft'
     }).addTo(map);
 }
 
function parseResponse(data) {

}

function applyCountyLayer() {

countyLayer = L.geoJson(all_counties,  {
      style: countyStyleHidden,
      onEachFeature: onEachFeature
  }).addTo(map);
}

function onEachFeature(feature, layer) {
      layer.on({
		mouseover: mouseover,
        mouseout: mouseout
      });
  }

function mouseover(e) {

var layer = e.target;
var p = layer.feature.properties;
var tooltipTxt = makeTooltipTxt(p);
				
$("#tooltip_box_div").html(tooltipTxt);
$("#tooltip_box_div").show();

//set county border style
layer.setStyle(countyStyleShown);

}

function mouseout(e) {
var layer = e.target;
layer.setStyle(countyStyleHidden);
$("#tooltip_box_div").hide();
}

function makeTooltipTxt(p) {
var tooltipTxt = "<table width=100%>";
tooltipTxt += "<tr><td cellspan=2 align=center><b>" + p.county + ", " + p.state + "</b></td></tr>";

tooltipTxt += "<tr><td>Total Price Cap County Locations:</td><td align=right>" +  p.total_pc + "</td></tr>";
tooltipTxt +=  "<tr><td>Price Cap County Supported Locations:</td><td align=right>" + p.supported + "</td></tr>";
tooltipTxt += "<tr><td>Price Cap County Support:</td><td align=right>" +  "$" + p.pc_support + "</td></tr></table>";

return tooltipTxt;
}

 function setListener() {

     $("#input-loc-search").on("click", function(e) {
         e.preventDefault();
         locChange();
     });

     $('#btn-geoLocation').click(function(event) {
         if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(function(position) {
                 var geo_lat = position.coords.latitude;
                 var geo_lon = position.coords.longitude;
                 var geo_acc = position.coords.accuracy;

                 map.setView([geo_lat, geo_lon], 12);

             }, function(error) {
                 //alert('Error occurred. Error code: ' + error.code);    
                 alert('Sorry, your current location could not be found. \nPlease use the search box to enter your location.');
             }, {
                 timeout: 4000
             });
         } else {
             alert('Sorry, your current location could not be found. \nPlease use the search box to enter your location.');
         }

         return false;
     });

     $("#btn-nationLocation").on("click", function() {
         //map.fitBounds(bounds_us);
		 map.setView([40, -97], 3);
     });

	$('#input-location').keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
	    $('#input-loc-search').click();
	    return false;  
	  }
	});   
    
 }
 

 function locChange() {

     var loc = $("#input-location").val();
     geocoder.query(loc, codeMap);
 }

 function codeMap(err, data) {
 
	if (data.latlng) {
		var lat = data.latlng[0];
		var lon = data.latlng[1];
    }
	else if (data.lbounds) {
		var lat = (data.lbounds.getSouth() + data.lbounds.getNorth()) / 2;
		var lon = (data.lbounds.getWest() + data.lbounds.getWest()) / 2;
    }
	else {
	return;
	}
	
	var url = geo_host + "/geoserver/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo_swat:caftwo_caf_counties_merge&maxFeatures=1&outputFormat=text/javascript&cql_filter=contains(geom,POINT(" + lon + " " + lat + "))" + "&format_options=callback:showSearchedCounty";

	$.ajax({
			type: "GET",
			url: url,
			//dataType: "json",
			dataType: "jsonp",
			jsonpCallback: "parseResponse",
			success: function(data) {
									
			}
		});
 }
 
 function showSearchedCounty(data) {
 	if (data.totalFeatures > 0) {
	if (map.hasLayer(shownPolyCounty)) {
		map.removeLayer(shownPolyCounty);
	}
	shownPolyCounty = L.mapbox.featureLayer(data).setStyle(countyStyleSearched).addTo(map);
	map.fitBounds(shownPolyCounty.getBounds());
		
	var p = data.features[0].properties;

	var tooltipTxt = makeTooltipTxt(p);		
	$("#tooltip_box_div").html(tooltipTxt);
	$("#tooltip_box_div").show();
			
	shownPolyCounty.on("mouseover", function(e) {
	if (map.hasLayer(shownPolyCounty)) {
		map.removeLayer(shownPolyCounty);
	}
	});
	
	}	
}

 function showMapLegendBox() {
     $("#map-legend-box").show()
 }

 function hideMapLegendBox() {
     $("#map-legend-box").hide()
 }

 $(document).ready(function() {
     createMap();
     setListener();
	 applyCountyLayer();

     $('.btn-legend').click(function(){ 
        $(this).hide();
        $('.legend').show('fast');
    });

    $('.btn-closeLegend').click(function() { 
        $('.legend').hide('fast');
        $('.btn-legend').show();
    });

    $('.links-download').on('click', 'a', function(e) {
        downloadFile(e);
    }).on('click', '.btn', function(e) {
        $('#download-menu-box').hide();
    });

    $('#download-btn-small').on('click', function(){
        setDownloadSelect();
        $("#download-menu-box").show('fast');
    });
});



