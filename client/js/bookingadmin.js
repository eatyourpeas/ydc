import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.bookingadmin.helpers({ //
  'getAllBookings': function(){
    var bookings = Bookings.find({},{sort: [
          ["booked_by", "asc"]
      ]}).fetch();
    return bookings;

  },
  'courseNameForBooking': function(course_id){
    var course = Courses.findOne({_id: course_id});
    return course.course_name;
  },
  'courseDatesForBooking': function(course_id){
    var course = Courses.findOne({_id: course_id});
    var start = course.start_date;
    var end = course.end_date;
    var returnDates;
    if (shortenDateRemoveTime(start)==shortenDateRemoveTime(end)) {
      returnDates = shortenDateIncludeTime(start) + " - " + shortenDateRemoveDate(end);
    } else {
      returnDates = shortenDateIncludeTime(start) + " - " + shortenDateIncludeTime(end);
    }

    return returnDates;
  },
  'courseUserForBooking': function(booking_by){
    var user = Meteor.users.findOne({_id: booking_by});
    if (user) {
      return user.emails[0].address;
    } else {
      return 'deleted user';
    }

  },
  'bookingExpiredClass': function(course_id){
    var course = Courses.findOne({_id: course_id});
    var start = course.start_date;
    var end = course.end_date;
    var momentStart = moment(start);
    if (momentStart.isAfter(moment())) {
      return 'info';
    } else {
      return 'danger';
    }
  },
    'courseHasCompleted': function(course_id){
      var course = Courses.findOne({_id: course_id});
      var start = course.start_date;
      var end = course.end_date;
      var momentStart = moment(start);
      if (momentStart.isAfter(moment())) {
        return false;
      } else {
        return true;
      }
  },
  'courseClinicForBooking': function(booking_id){
    var course = Courses.findOne({_id: booking_id});
    return course.clinic;
  }
});

Template.bookingadmin.events({
  'click #cancelBookingButton': function(){
    Session.set('selectedBooking', this._id);
    Modal.show('modalDeleteBooking');
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
