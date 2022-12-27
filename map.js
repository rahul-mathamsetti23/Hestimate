
var zwsid = "X1-ZWz18yqacuhc0b_32ywy";
var map;
var request = new XMLHttpRequest();
var myLatlng;
var lat;
var long;
var markerarray = [];
var geocoder;
var latonclick;
var longonclick;
var infowindow;
var String;
var longaddress;
function initialize() {
    
    geocoder = new google.maps.Geocoder();
    infowindow = new google.maps.InfoWindow;
    map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 32.75, lng: -97.13},
        	zoom: 17
		});

google.maps.event.addListener(map, 'click', function(event) {
	 latonclick = event.latLng.lat();
	 longonclick = event.latLng.lng();
	 geocodeLatLng(geocoder, map, infowindow);
    
  });


}

function displayResult () {
    if (request.readyState == 4) {
	 clearMarker();
	 var address = document.getElementById('address').value;
	 var city = document.getElementById("city").value;
	 var state = document.getElementById("state").value;
	 var zipcode = document.getElementById("zipcode").value;
	 String = address + "," + city + "," + state + "," + zipcode;
         var xml = request.responseXML.documentElement;
         lat = xml.getElementsByTagName("address")[1].getElementsByTagName("latitude")[0].innerHTML;
 	 long = xml.getElementsByTagName("address")[1].getElementsByTagName("longitude")[0].innerHTML;
	 var zest = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;


	 document.getElementById("output").innerHTML +="<BR/>"+"Address:"+String+"<BR/>" +"latitude:"+ lat + "<BR/>longitude:"+ long +"<BR/>Price:"+ zest +"$<BR/>";

	 geocoder.geocode( { 'address': String}, function(results, status) {
      		if (status == 'OK') {
        			map.setCenter(results[0].geometry.location);
        			var marker = new google.maps.Marker({
            			map: map,
            			position: results[0].geometry.location,
				title: address
        		});
		markerarray.push(marker);
      		} 

		else {
        		alert('Geocode was not successful for the following reason: ' + status);
      			}
    	
	});
     }
}

function sendRequest () {
    request.onreadystatechange = displayResult;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var zipcode = document.getElementById("zipcode").value;
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
    request.withCredentials = "true";
    request.send(null);
}

function display () {
    if (request.readyState == 4) {
	 
         var xml = request.responseXML.documentElement;
         
	 var zest = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;


	 document.getElementById("output").innerHTML +="<BR/>"+"Address:"+longaddress+"<BR/>"+"latitude:"+ latonclick + "<BR/>longitude:"+ longonclick +"<BR/>Price:"+ zest +"$<BR/>";


	}
}


function sendRequestOnClick (addresses) {
    var input = addresses.split(",",3);
    var sz = input[2].split(" ",2);
    
    
    request.onreadystatechange = display;
    
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+input[0]+"&citystatezip="+input[1]+"+"+sz[0]+"+"+sz[1]);
    request.withCredentials = "true";
    request.send(null);
}

function geocodeLatLng(geocoder, map, infowindow) {
  
  clearMarker();
  var latlng = {lat:latonclick,lng:longonclick};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
	markerarray.push(marker);
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
	longaddress = results[0].formatted_address;
	sendRequestOnClick(longaddress);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}


function clearMarker() {
	  for (var i = 0; i < markerarray.length; i++ ) {
	    markerarray[i].setMap(null);
	  }
	  markerarray.length = 0;
	}


function erase(){

    document.getElementById('address').value = " ";    document.getElementById("city").value = " ";    document.getElementById("state").value = " ";    document.getElementById("zipcode").value = " ";

}






