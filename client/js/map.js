import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.map.onCreated(function(){

  var address = Session.get('address');

  GoogleMaps.ready("ydcMap", function(map) {
    //called once map has rendered
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });

  });

});

Template.map.onRendered(function(){

});

Template.map.helpers({
  ydcMapOptions: function() {

    var latitude = Session.get('latitude');
    var longitude = Session.get('longitude');

        if (!latitude || !longitude) return;
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options

            return {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 17
            };
        }
  },
  address: function(){
    return Session.get('address');
  }
});

Template.map.events({
  'click #closeMapButton': function(event, template){
    history.back();
  },

});
