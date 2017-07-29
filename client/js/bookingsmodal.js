import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.bookingsModal.helpers({
  //this is duplicated in addevent
  courses: function(){
    return Courses.find({}, {sort: {'course_name': 1, 'start_date': -1, 'clinic': 1}});
  },
  'courseDatesForCourse': function(start_date, end_date){
    var start = start_date;
    var end = end_date;
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
    var numberOfBookingsForCourse = Bookings.find({course: course_id}).count();
    return numberOfBookingsForCourse;
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
    return bookingHolder.profile.name;
  },
  'bookingHolderEmail': function(booked_by){
    var bookingHolder = Meteor.users.findOne({_id: booked_by});
    return bookingHolder.emails[0].address;
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
  'selectedCourse': function(){
    var selectedCourse = Session.get('selectedCourse');
    var course = Courses.findOne({_id: selectedCourse});
    return course;
  }
});

Template.bookingsModal.events({
//this is copied from add events
'click #cancelCourseButton': function(){
  Session.set('selectedCourseForDelete', this._id);
  Modal.hide(this);
  Modal.show('modalDeleteCourse');
},
'click #cancelBookingButton': function(){
  Session.set('bookingSelected', this._id);
  Modal.hide(this);
  Modal.show('modalDeleteBooking');
},
'click #addCourseButton': function(){
  console.log('clicked');
  Modal.show('modalAddCourse');
}
});

//private functions

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
