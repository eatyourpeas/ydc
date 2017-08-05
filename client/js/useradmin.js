import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Bookings } from '/imports/api/bookings/bookings';
import { Courses } from '/imports/api/courses/courses';

Template.useradmin.helpers({
  'adminUsers': function(){
    return Meteor.users.find();
  },
  'groupForUser': function(user_id){
    return Roles.getGroupsForUser(user_id);
  },
  'roleForUser': function(user_id){
    myGroup = Roles.getGroupsForUser(user_id);
    return Roles.getRolesForUser(user_id, myGroup[0]);
  },
  'emailForUser': function(email){
    var thisUserEmail =  email[0].address;
    return thisUserEmail;
  },
  'isClinician': function(user_id){
    var myGroup = Roles.getGroupsForUser(user_id);
    if (Roles.userIsInRole(user_id,'clinician', myGroup[0])) {
      return true;
    } else {
      return false;
    }
  },
  'isAdmin': function(user_id){
    var myGroup = Roles.getGroupsForUser(user_id);
    if (Roles.userIsInRole(user_id,'clinician', myGroup[0])) {
      return true;
    } else {
      return false;
    }
  },
  'getSelectedUser': function(selectedUser){
    var selectedUser = Session.get('selectedUser');
    if (selectedUser) {
      var fullUser = Meteor.users.find(selectedUser).fetch();
      return fullUser[0];
    } else {
      return false;
    }
  },
  'selectedUserClass': function(){
    var lastSelectedUser = Session.get('selectedUser');
    var selectedUser = this._id;
    if (selectedUser === lastSelectedUser) {
      return 'active'
    } else {
      var myGroup = Roles.getGroupsForUser(selectedUser);
      if (Roles.userIsInRole(selectedUser,'clinician', myGroup[0])) {
        return 'info';
      } else {
        return 'success';
      }
    }
  },
  'confirmedBookingsForUser': function(){
    var selectedUser = Session.get('selectedUser');
    if (selectedUser) {
      var userBookings = Bookings.find({'booked_by': selectedUser, booking_validated: true }, {sort: {course: -1}}).fetch();
      return userBookings;
    }
  },
  'coursenameforid': function(course_id){
    var course =  Courses.findOne(course_id);
    return course.course_name;
  },
  'startdateForCourse': function(course_id){
    var course =  Courses.findOne(course_id);
    var start = course.start_date;
    var end = course.end_date;
    return shortenDateIncludeTime(start);
  },
  'enddateForCourse': function(course_id){
    var course =  Courses.findOne(course_id);
    var start = course.start_date;
    var end = course.end_date;
    if (shortenDateRemoveTime(start)==shortenDateRemoveTime(end)) {
      end = shortenDateRemoveDate(course.end_date);
    } else {
      end = shortenDateIncludeTime(course.end_date);
    }
    return end;
  },
  'clinicForCourse_id': function(course_id){
    var course =  Courses.findOne(course_id);
    var clinic = course.clinic;
    return clinic;
  },
  'alertMessage': function(){
    var errorAlert = Session.get('userAdminError');
    var successAlert = Session.get('userAdminSuccess');

    if (errorAlert) {
      return errorAlert;
    }
    if (successAlert) {
      return successAlert;
    }
  }
});

Template.useradmin.events({
  'click #adminUsers': function(){
    var selectedUserId = this._id;
    Session.set('selectedUser', this._id);
  },

  'click #cancelBookingButton': function(event){

    var bookingId = this._id;
    Session.set('bookingSelected', bookingId);
    Modal.show('modalDeleteBooking');

  },
  'click #deleteUserButton': function(event){
    var selectedUserId = this._id;
    Session.set('selectedUser', this._id);
    Modal.show('modalDeleteTeamMember');
  },
  'click #addTeamMemberButton': function(event){
    Modal.show('modalAddTeamMember');
  },
  'click #editTeamMemberButton': function(event){
    Session.set('selectedUser', this._id);
    Modal.show('modalEditTeamMember');
  }
});

Template.useradmin.onRendered(function(){
  var warningMessage = Session.get('userAdminError');
  var successMessage = Session.get('userAdminSuccess');
  if (warningMessage) {
      $('#warningAlert').show();
  };
  if (successMessage) {
    $('#successAlert').show();
  }

});

//////// private functions //

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
