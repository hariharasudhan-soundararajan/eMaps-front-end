(function(){

  getTimestampLocal = function() {
    return Math.round((new Date().getTime())/1000)
  }

  showPopup = function(event, lat, lng, timezone, dateUTC, dateDestination) {
    left = event.pixel.x + 20;
    right = event.pixel.y + 20;
    var options = {
      weekday: "long", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    $popup = $("#popup");
    $("#lat").text(lat);
    $("#lng").text(lng);
    $("#timezone").text(timezone);
    $("#dateUTC").text(dateUTC.toLocaleTimeString("en-us", options));
    $("#dateDestination").text(dateDestination.toLocaleTimeString("en-us", options));
    $popup.css("left", left);
    $popup.css("top", right);
    $popup.css("display", "inline");
  }

  initialize = function() {
    var mapOptions = {
      center: {lat: -36.8404, lng: 174.7399},
      zoom: 4
    };
    var map = new google.maps.Map(document.getElementById("map_wrap"), mapOptions);

    google.maps.event.addListener(map, "rightclick", function(event) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      var e = event;
      $.ajax({
        url:"https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + lng + "&timestamp=" + getTimestampLocal().toString() + "&sensor=false",
      }).done(function(response) {
        if(response.status == 'OK' && response.timeZoneId != null) {
          timeZone = response.timeZoneId;
          timestampLocal = getTimestampLocal();
          timestampUTC = timestampLocal + (new Date().getTimezoneOffset()*60);
          timestampDestination = timestampUTC + response.dstOffset + response.rawOffset;
          dateUTC = new Date(timestampUTC*1000);
          dateDestination = new Date(timestampDestination*1000);;
          showPopup(e, lat, lng, timeZone, dateUTC, dateDestination)
        }
      });
    });

    google.maps.event.addListener(map, "bounds_changed", function(event) {
      $("#popup").hide()
    });
  }

  google.maps.event.addDomListener(window, "load", initialize);

}())
