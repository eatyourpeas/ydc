import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Bookings } from '/imports/api/bookings/bookings';
import { Courses } from '/imports/api/courses/courses';

Template.bookingadmin.onCreated(function(){
  this.course = new ReactiveVar("NoFilter");
})

Template.bookingadmin.helpers({ //
  'getAllBookings': function(){
    var course_to_filter_to = Template.instance().course.get();
    var bookings = [];
    if (course_to_filter_to == "NoFilter") {
      bookings = Bookings.find({},{sort: ["booked_by", "asc"]});
    } else {
      bookings = Bookings.find({"course": course_to_filter_to},{sort: ["booked_by", "asc"]});
    }
    return bookings;
  },
  'allCourses': function(){
    return Courses.find({}, {sort: ["course_name", "asc"]});
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
  //  var start = course.start_date;
    var end = course.end_date;
    var today = new Date();
    if (today < end) {
      return 'info';
    } else {
      return 'danger';
    }
  },
    'courseHasCompleted': function(course_id){
      var course = Courses.findOne({_id: course_id});
      var start = course.start_date;
      var end = course.end_date;
      var today = new Date();
      if (today < start) {
        return false;
      }else {
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
  },
  'change #course_select': function(event, template){
    template.course.set(event.currentTarget.value);
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
