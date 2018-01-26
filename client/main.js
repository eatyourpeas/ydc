import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Bookings } from '/imports/api/bookings/bookings';
import { Courses } from '/imports/api/courses/courses';
import { Posts } from '/imports/api/posts/posts';
import { Documents } from '/imports/api/documents/documents';
import { FilesCollection } from 'meteor/ostrio:files';

//import './main.html';

// counter starts at 0
Session.setDefault('counter', 0);
Session.setDefault('selectedUser', "");
Session.setDefault('bookingSelected', "");
Session.setDefault('mapLoaded', false);
Session.setDefault('userSelected', "");
Session.setDefault('alert_class', "alert alert-success");
Session.setDefault('alert_visible', false);
Session.setDefault('alert_message', "");


Meteor.subscribe('adminUsers');
Meteor.subscribe('findallbookings');
Meteor.subscribe('findAllCourses');
Meteor.subscribe('findmybookings');
Meteor.subscribe('findAllResources');
Meteor.subscribe('findAllPosts');
Meteor.subscribe('files.images.all');
Meteor.subscribe('files.documents.all');
Meteor.subscribe('findAllAnnouncementsAtMyCentre');

selectedBookings = [];

Meteor.startup(function(){
  GoogleMaps.load({ v: '3', key: 'AIzaSyBOdKuGzNAH-Nv1i5P5MzY9jxbrXGZBNr4', libraries: 'geometry,places' });
});

//global helpers

Template.registerHelper('basketHasItems', function(){
    var basketHasItems;
    var bookings = Bookings.find({ booked_by: Meteor.userId(), booking_validated: false });
    if (bookings.count() > 0) {
      basketHasItems = true;
    } else {
      basketHasItems = false;
    }
    return basketHasItems;
});

Template.registerHelper('numberOfBasketItems', function(){
    var basketHasItems;
    var bookings = Bookings.find({booked_by: Meteor.userId(), booking_validated: false });
    return bookings.count();
});

Template.registerHelper('userIsAdmin', function(){
    var userIsAdmin = false;
    if ((Roles.userIsInRole(Meteor.userId(),['admin'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'UHL'))) {
      return true;
    } else {
      return false;
    }
});

Template.registerHelper('courseForBooking', function(course_id){
    var course = Courses.findOne({_id: course_id});
    return course;
});

Template.registerHelper('getBasketItems', function(){
  var bookings = Bookings.find({booked_by: Meteor.userId(), booking_validated: false });

  return bookings;
});

Template.registerHelper('spacesRemaining', function(course_id){
    var course = Courses.findOne(course_id);
    var bookingsForCourse = Bookings.find({course: course_id, booking_validated: true}).fetch();
    var totalBookingsForThisCourse = 0
    for (var i = 0; i < bookingsForCourse.length; i++) {
      if(bookingsForCourse[i].course == course_id){
        totalBookingsForThisCourse += bookingsForCourse[i].places_booked;
      }
    }
    return course.course_places - totalBookingsForThisCourse;
});

Template.registerHelper('dateTimeShorten', function(date_to_shorten){
  var newDate = moment(date_to_shorten).format('ddd DD MMM YYYY HH:mm');
  return newDate;
});

Template.registerHelper('dateTimeShortenToTime', function(date_to_shorten){
  var newDate = shortenDateRemoveTime(date_to_shorten);
  return newDate;
});

Template.registerHelper('dateTimeShortenToDate', function(date_to_shorten){
  var newDate = shortenDateRemoveTime(date_to_shorten);
  return newDate;
});

Template.registerHelper('currentUserIsParent', function(){
  var currentUser = Meteor.userId();
  var myGroup = Roles.getGroupsForUser(currentUser);
  if (Roles.userIsInRole(currentUser,'parent', myGroup[0])) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper('currentUserIsSchool', function(){
  var currentUser = Meteor.userId();
  var myGroup = Roles.getGroupsForUser(currentUser);
  if (Roles.userIsInRole(currentUser,'school', myGroup[0])) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper('currentUserIsClinician', function(){
  var currentUser = Meteor.userId();
  var myGroup = Roles.getGroupsForUser(currentUser); //which centre do they belong to?
  if (Roles.userIsInRole(currentUser,'clinician', myGroup[0])) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper('currentUserIsClinicianOrAdmin', function(){
  var currentUser = Meteor.userId();
  var myGroup = Roles.getGroupsForUser(currentUser); //which centre do they belong to?
  if (Roles.userIsInRole(currentUser,'clinician', myGroup[0]) || Roles.userIsInRole(currentUser,'admin', myGroup[0])) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper('currentUserIsSchoolOrParent', function(){
  var currentUser = Meteor.userId();
  var myGroup = Roles.getGroupsForUser(currentUser);
  if (Roles.userIsInRole(currentUser,'school', myGroup[0]) || Roles.userIsInRole(currentUser,'parent', myGroup[0])) {
    return true;
  } else {
    return false;
  }
});

Template.registerHelper('documentForResource', function(document_id){
  var document = Documents.findOne(document_id).fetch();
  return document[0];
});

Template.registerHelper('documentNameForResource', function(document_id){
  var document = Documents.findOne(document_id);
  return document.name;
});

Template.registerHelper('clinicOptions', function(){
  return [{value: "ELCH", text:"Evelina Children's Hospital", medics:"", nurses: "", dieticians:"", psychologists:"", admin:"", team_email:"PaediatricDiabetesandEndocrinologyTeam@gstt.nhs.uk"}, {value: "KCH", text: "King's College Hospital", medics:"", nurses: "02032991738", dieticians:"02032992618", psychologists:"020329942892489", admin:"02032992335", team_email:"kch_tr.KingsPaediatricDiabetes@nhs.net"}, {value: "PRUH", text:"Princess Royal University Hospital", medics:"", nurses: "", dieticians:"01689 865 743", psychologists:"", admin:"", team_email:"KCH_TR.PRUHPaediatricDiabetes@nhs.net"}, {value: "UHL", text: "University Hospital Lewisham", medics:"", nurses: "07917267656", dieticians:"07825196306", psychologists:"", admin:"", team_email:"LH.PaediatricDiabetes@nhs.net"}];
});

Template.registerHelper('courseOptions', function(){
  return [{value: "New Diagnosis", text:"New Diagnosis"}, {value: "Carbohydrate Counting", text: "Carbohydrate Counting"}, {value:"Secondary Transfer", text:"Secondary Transfer"}, {value:"Pump Start", text:"Pump Start"}, {value:"Pump Refresher", text:"Pump Refresher"}, {value:"DAFNE", text:"DAFNE"}];
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

///////// Routes


Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    template: 'home'
});


Router.route('/posts',{
  template: 'posts',
  data: function(){
    //redirect to first posts
    var latestPost = Posts.findOne({},{sort: {post_date: -1, limit: 1}});
    if (latestPost) {
      Router.go('/posts/'+latestPost._id);
    } else {
      //there are no posts - redirect to no posts page
    }

  }
});

Router.route('/posts/:_id', {
    template: 'posts',
    data: function(){
      //return Posts.findOne({_id: this.params.post_id});
      var post_id = this.params._id;
      return Posts.findOne({_id: post_id});
    }
});

Router.route('/schedule', {
    template: 'schedule',
    onBeforeAction: function(){
          var currentUser = Meteor.userId();
          var myGroup = Roles.getGroupsForUser(currentUser);
          if(currentUser){
            if (Roles.userIsInRole(currentUser,'parent', myGroup[0]) || Roles.userIsInRole(currentUser,'school', myGroup[0])) {
              this.next();
            } else {
              this.render("home");
            }
          } else {
              this.render("home");
          }
      }
});

Router.route('aboutcourses',{
  template: 'aboutcourses'
});

Router.route('/kings', {
    template: 'kings'
});

Router.route('/elch', {
  template: 'elch'
});

Router.route('/uhl', {
    template: 'uhl'
});

Router.route('/pruh', {
    template: 'pruh'
});

Router.route('/resources', {
    template: 'resources'
});

Router.route('/contact-us', {
    template: 'contact_us'
});

Router.route('/addevent',{
  template: 'addevent',
  onBeforeAction: function(){
        var currentUser = Meteor.userId();
        var myGroup = Roles.getGroupsForUser(currentUser);
        if(currentUser){
          if (Roles.userIsInRole(currentUser,'clinician', myGroup[0])) {
            this.next();
          } else {
            this.render("home");
          }
        } else {
            this.render("home");
        }
    }
});

Router.route('/useradmin',{
  template: 'useradmin',
  onBeforeAction: function(){
        var currentUser = Meteor.userId();
        var myGroup = Roles.getGroupsForUser(currentUser);
        if(currentUser){
          if (Roles.userIsInRole(currentUser,'admin', myGroup[0])) {
            this.next();
          } else {
            this.render("home");
          }
        } else {
            this.render("home");
        }
    }
});

Router.route('/bookingadmin',{
  template: 'bookingadmin',
  onBeforeAction: function(){
        var currentUser = Meteor.userId();
        var myGroup = Roles.getGroupsForUser(currentUser);
        if(currentUser){
          if (Roles.userIsInRole(currentUser,'admin', myGroup[0])) {
            this.next();
          } else {
            this.render("home");
          }
        } else {
            this.render("home");
        }
    }
});

Router.route('/map',{
  template: 'map'
});

Router.route('/termsandconditions', {
  template: 'termsandconditions'
});

Router.route('/accessibility', {
    template: 'accessibility'
});

Router.route('/cookies', {
    template: 'cookies'
});
