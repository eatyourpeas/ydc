import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Geolocation} from "meteor/mdg:geolocation";

import './main.html';

import { FilesCollection } from 'meteor/ostrio:files';
const Images = new FilesCollection({collectionName: 'Images'});
export default Images; // To be imported in other files

// counter starts at 0
Session.setDefault('counter', 0);
Session.setDefault('selectedUser', "");
Session.setDefault('bookingSelected', "");
Session.setDefault('mapLoaded', false);
Session.setDefault('userSelected', "");

Meteor.subscribe('adminUsers');
Meteor.subscribe('findallbookings');
Meteor.subscribe('findAllCourses');
Meteor.subscribe('findmybookings');
Meteor.subscribe('findAllResources');
Meteor.subscribe('findAllPosts');
Meteor.subscribe('files.images.all');
Meteor.subscribe('files.documents.all');
Meteor.subscribe('findAllAnnouncementsAtMyCentre');

Meteor.startup(function(){
  Geolocation.currentLocation();
  GoogleMaps.load({ key: 'AIzaSyBOdKuGzNAH-Nv1i5P5MzY9jxbrXGZBNr4' });
});

//global helpers

Template.registerHelper('basketHasItems', function(){
    var basketHasItems;
    var bookings = Bookings.find({booked_by: Meteor.userId(), booking_validated: false });
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

Router.route('/news', {
    template: 'news'
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

Router.route('/termsandconditions', {
  template: 'termsandconditions'
});

Router.route('/accessibility', {
    template: 'accessibility'
});
