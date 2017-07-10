import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Geolocation} from "meteor/mdg:geolocation";

var marker = false;
var mapUsed = false;

Template.modalMap.onCreated(function(){
  var self = this;
  console.log('on created');
  var address = Session.get('address');
  var mapLoaded = Session.get('mapLoaded');

  //  Session.set('latitude', 51.5353 );
  //  Session.set('longitude', -0.1534);

  GoogleMaps.ready('map', function(map) {

      //get the long & lat from address if exists
      var geocoder = new google.maps.Geocoder();
      var error = Geolocation.error();

      // Detect any geolocation errors
      if(error){
        console.log(error);

      }
      // Render the map
      else {
        var address = Session.get('address');
        if (!address) {
          //defaults to the queen if no address given
          address = "Buckingham Palace, Westminster, London W1 1AA";
        }
        geocoder.geocode( { 'address': address}, function(results, status) {

          var latitude;
          var longitude;

        if (status == google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
            Session.set('latitude', latitude);
            Session.set('longitude', longitude);
            console.log('called geocoder ');

            // If the marker doesn't yet exist, create it.
            //if (! marker) {
              console.log('there is no marker');
              var latitude = Session.get('latitude');
              var longitude = Session.get('longitude');
              marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(latitude, longitude),
                map: map.instance
              });
              // Center and zoom the map view onto the current position.
              map.instance.setCenter(marker.getPosition());
              map.instance.setZoom(15);
          //  }
            // The marker already exists, so we'll just change its position.
        //    else {
        /*
              console.log('there is a marker: '+ marker.getPosition());
              var latitude = Session.get('latitude');
              var longitude = Session.get('longitude');
              marker.setPosition(new google.maps.LatLng(latitude, longitude));
              // Center and zoom the map view onto the current position.
              map.instance.setCenter(marker.getPosition());
              map.instance.setZoom(15);

            } //end there is a marker
            */
          } else {
            console.log('not ok');
          }//end error
        }); //end geocode
      }

  }); //googlemaps ready close


});

Template.modalMap.helpers({
  mapOptions() {

    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      console.log('loaded mapoptions');

        var latitude = Session.get('latitude'); //these are defaults
        var longitude = Session.get('longitude');

        Session.set('mapLoaded', true);

        return {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 14
        };


      }
  },
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  address: function(){
    return Session.get('address');
  }
});

Template.modalMap.events({
  'click #closeMapButton': function(event, template){

  }
});

Template.modalMap.onDestroyed(function(){
  var loaded = Session.get('mapLoaded');
  Session.set('mapLoaded', !loaded);
  if (!loaded) {
    Session.set('address', '');
  }
});
