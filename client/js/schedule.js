import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '/imports/api/courses/courses';
import { insertBooking } from '/imports/api/bookings/methods.js';
import { Bookings } from '/imports/api/bookings/bookings';

Template.schedule.onCreated(function scheduleOnCreated() {
  Meteor.subscribe('findmybookings');
  Meteor.subscribe('findAllCourses');
  this.selectedCourse = new ReactiveVar('New Diagnosis');
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

  courseUnavailable: function(course_value){
    var courses = Courses.find({
      course_name: course_value,
      start_date: { $gt: new Date() }
    }).fetch();
    if (courses.length > 0) {
      return false;
    } else {
      return true;
    }
  },

  courseDatesForCourse: function(){
    var selectedCourse = Session.get('selectedCourse');
    return Courses.find({
      course_name: selectedCourse,
      start_date: { $gt: new Date() }
    }, {sort: {start_date: -1}});
  },

  courseIsFullyBooked: function(course_id){
    if (course_id) {
      var course = Courses.findOne(course_id);
      var bookingsForCourse = Bookings.find({course: course_id}).fetch();
      var totalBookingsForThisCourse = 0
      for (var i = 0; i < bookingsForCourse.length; i++) {
        if(bookingsForCourse[i].course == course_id){
          totalBookingsForThisCourse += bookingsForCourse[i].places_booked;
        }
      }
      var places_remaining = course.course_places - totalBookingsForThisCourse;
      if (places_remaining == 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  courseHasDates: function(){
    var selectedCourse = Session.get('selectedCourse');
    if (Courses.find({course_name: selectedCourse}).count() > 0) {
      return true;
    } else {
      return false;
    }
  },
  selectedCourse: function(courseOption){
    var selectedCourse = Template.instance().selectedCourse.get();
    if (selectedCourse == courseOption) {
      return 'selected';
    } else {
      return '';
    }
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

      const newBooking = {
        booked_at: new Date(),
        places_booked: 1,
        course: course_id,
        booking_validated: false,
        booked_by: Meteor.userId()
      };

      insertBooking.call(newBooking, function(error, result){
        if (error) {
          console.log(error.message);
        } else {
          console.log('booking created' + result);
        }
      });
    } else {
      event.preventDefault();
    }
  },
  'click .mapmarker': function(event, template){
    Session.set('address', event.currentTarget.id);
    Meteor.call('coordinatesForAddress', event.currentTarget.id, function(error, result){
      if (error) {
        console.log(error);
      }
      if (result.length > 0) {
        Session.set('latitude', result[0].latitude);
        Session.set('longitude', result[0].longitude);
      Router.go('/map');
      }
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
