import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.schedule.onCreated(function scheduleOnCreated() {
  Meteor.subscribe('findmybookings');
  Meteor.subscribe('findAllCourses');
});


Template.schedule.helpers({
  validatedbookings: function () {
    var myBookings = Bookings.find({ booking_validated: true },{fields:{'course':1}});
    return myBookings;
  },

  'bookedPlaces': function(booking_id){
    var myBookings = Bookings.findOne({ _id: booking_id});
    return myBookings.places_booked;
  },

  thereAreNoValidatedBookings: function(){
    var numberOfBookings = Bookings.find({ booking_validated: true },{fields:{'course':1}}).count();
    if (numberOfBookings > 0) {
      return false;
    } else {
      return true;
    }
  },

  unvalidatedbookings: function () {
    var myBookings = Bookings.find({ booking_validated: false },{fields:{'course':1}}).fetch();
    return myBookings;
  },

  courseForBooking: function(course_id){
    var thisCourse =  Courses.findOne({_id: course_id});
    return thisCourse;
  },

  courseHasCompleted: function(course_end_date){
    var end_date = moment(course_end_date);
    var now = moment();
    if (end_date.isAfter(now)) {
      return false;
    }
    return true;
  },

  courseDatesForCourse: function(){
    var selectedCourse = Session.get('selectedCourse');
    return Courses.find({
      course_name: selectedCourse,
      start_date: { $gt: new Date() }
    }, {sort: {start_date: -1}}); //select all courses which have not yet started, in descending order
    ////NB MUST INCLUDE AND DISABLE ANY OPTIONS WHICH ARE FULLY BOOKED - TO DO
  },

  courseHasDates: function(){
    var selectedCourse = Session.get('selectedCourse');
    if (Courses.find({course_name: selectedCourse}).count() > 0) {
      return true;
    } else {
      return false;
    }
  },

  datesForCourse: function(){

  }

});

Template.schedule.events({
  'change #course': function(event){
    var selectedCourse = event.target.value;
    Session.set('selectedCourse', selectedCourse);
  },

  'submit form': function(event, template){

    var course_id = $("#availablebookings").val();
    if (course_id) {
      var now = new Date();
      //check if this user ahs already booked a space

      //update the users bookings
      Bookings.insert({
        booked_by: Meteor.userId(),
        course: course_id,
        booked_at: Date.now(),
        booking_validated: false,
        places_booked: 1
      });
    } else {
      event.preventDefault();
    }
  },
  'click .mapmarker': function(event, template){
    Modal.show('modalMap', function(){
      Session.set('address', event.currentTarget.id);
    });
  }
});

//////// private functions

function shortenDateIncludeTime(date_to_shorten){
  var newDate = moment(date_to_shorten).format('ddd DD MMM YYYY HH:mm');
  return newDate;
}

function shortenDateRemoveTime(date_to_shorten){
  var newDate = moment(date_to_shorten).format('ddd DD MMM YYYY');
  return newDate;
}

function shortenDateRemoveDate(date_to_shorten){
  var newDate = moment(date_to_shorten).format('HH:mm');
  return newDate;
}
