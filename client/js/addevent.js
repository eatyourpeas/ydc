import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.addevent.helpers({
  'courses': function(){
    return Courses.find({}, {sort: {'course_name': 1, 'start_date': -1}});
  },
  'thereAreCourses': function(){
    var numberOfCourses = Courses.find({}, {sort: {'course_name': 1, 'start_date': -1}}).count();
    if (numberOfCourses > 0) {
      return true;
    } else {
      return false;
    }
  },
  'courseDatesForCourse': function(start_date, end_date){
    var start = start_date;
    var end = end_date
    var returnDates;
    if (shortenDateRemoveTime(start)==shortenDateRemoveTime(end)) {
      returnDates = shortenDateIncludeTime(start) + " - " + shortenDateRemoveDate(end);
    } else {
      returnDates = shortenDateIncludeTime(start) + " - " + shortenDateIncludeTime(end);
    }
    return returnDates;
  },
  'courseHasCompleted': function(start_date, end_date){

    var start = start_date;
    var end = end_date;
    var momentStart = moment(start);
    if (momentStart.isAfter(moment())) {
      return false;
    } else {
      return true;
    }
  },
  'numberOfAttendees': function(course_id){
    var bookingsForCourse = Bookings.find({course: course_id}).fetch();
    var totalBookingsForThisCourse = 0
    for (var i = 0; i < bookingsForCourse.length; i++) {
      if(bookingsForCourse[i].course == course_id){
        totalBookingsForThisCourse += bookingsForCourse[i].places_booked;
      }
    }
    return totalBookingsForThisCourse;
  },
  'thereAreAttendees': function(course_id){
    var numberOfBookingsForCourse = Bookings.find({course: course_id}).count();
    if (numberOfBookingsForCourse >0) {
      return true;
    } else {
      return false;
    }
  },
  'selectedCourseClass': function(){
    var lastSelectedCourse = Session.get('selectedCourse');
    if (lastSelectedCourse == this._id) {
      return 'active';
    } else {
      return 'info';
    }
  },
  'bookingsForCourse': function(){
    var selectedCourse = Session.get('selectedCourse')
    var bookingsForCourse = Bookings.find({course: selectedCourse}).fetch();
    return bookingsForCourse;
  },
  'bookingHolder': function(booked_by){
    var bookingHolder = Meteor.users.findOne({_id: booked_by});
    return bookingHolder;
  },
  'selectedCourseIsComplete': function(){
    var selectedCourse = Session.get('selectedCourse');
    var course = Courses.findOne({_id: selectedCourse});
    var start = course.start_date;
    var momentStart = moment(start);
    if (momentStart.isAfter(moment())) {
      return false;
    } else {
      return true;
    }
  },
  'courseIsSelected': function(){
    var selectedCourse = Session.get('selectedCourse');
    if (selectedCourse) {
      return true;
    } else {
      return false;
    }
  },
  'placesRemaining': function(course_id){
    var course = Courses.findOne(course_id);
    var bookingsForCourse = Bookings.find({course: course_id}).fetch();
    var totalBookingsForThisCourse = 0
    for (var i = 0; i < bookingsForCourse.length; i++) {
      if(bookingsForCourse[i].course == course_id){
        totalBookingsForThisCourse += bookingsForCourse[i].places_booked;
      }
    }
    return course.course_places - totalBookingsForThisCourse;
  }
});

Template.addevent.events({
  'click #cancelCourseButton': function(){
    Session.set('selectedCourseForDelete', this._id);
    Modal.show('modalDeleteCourse');
  },
  'click #courses': function(){
    Session.set('selectedCourse', this._id);
    var numberOfBookingsForCourse = Bookings.find({course: this._id}).count();
    if (numberOfBookingsForCourse >0) {
      Modal.show('bookingsModal');
    }
  },
  'click #cancelBookingButton': function(){
    Session.set('bookingSelected', this._id);
    Modal.show('modalDeleteBooking');
  },
  'click #addCourseButton': function(){
    Modal.show('modalAddCourse');
  },
  'click .mapmarker': function(event, template){
    Session.set('address', event.currentTarget.id);

    Modal.show('modalMap');
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
