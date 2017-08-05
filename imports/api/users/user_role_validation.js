import { Meteor } from 'meteor/meteor';

export const isAdmin = function(userId){
  var isAdmin = false;
  if ((Roles.userIsInRole(userId,['admin'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'UHL'))) {
    isAdmin = true;
  } else {
    isAdmin = false;
  }
  return isAdmin;
}

export const isClinician = function(userId){
  var isClinician = false;
  if ((Roles.userIsInRole(userId,['clinician'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'UHL'))) {
    isClinician = true;
  } else {
    isClinician = false;
  }
  return isClinician;
}

export const isSchool = function(userId){
  var isClinician = false;
  if ((Roles.userIsInRole(userId,['school'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'UHL'))) {
    isClinician = true;
  } else {
    isClinician = false;
  }
  return isClinician;
}

export const currentUserisLoggedInAsAdmin = function(){
  var userId = Meteor.userId();
  var isAdmin = false;
  if ((Roles.userIsInRole(userId,['admin'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'UHL'))) {
    isAdmin = true;
  } else {
    isAdmin = false;
  }
  return isAdmin;
}

export const currentUserisLoggedInAsClinician = function(){
  var userId = Meteor.userId();
  var isClinician = false;
  if ((Roles.userIsInRole(userId,['clinician'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'UHL'))) {
    isClinician = true;
  } else {
    isClinician = false;
  }
  return isClinician;
}

export const currentUserisLoggedInAsSchool = function(){
  var userId = Meteor.userId();
  var isSchool = false;
  if ((Roles.userIsInRole(userId,['school'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'UHL'))) {
    isSchool = true;
  } else {
    isSchool = false;
  }
  return isSchool;
}
