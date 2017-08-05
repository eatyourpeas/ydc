import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FilesCollection } from 'meteor/ostrio:files';
import { Announcements } from '/imports/api/announcements/announcements';

Template.announcements.onCreated(function(){
  this.announcement_visible = new ReactiveVar(true);
});

Template.announcements.helpers({
  'announcement_visible': function(){

    var me = Meteor.userId();
    var myCentre = Roles.getGroupsForUser(me);
    var admin = false;

    if (Roles.userIsInRole(me,'admin', myCentre[0])) {
      admin = true;
    }

    var a_week_ago = new Date();
    a_week_ago.setDate(a_week_ago.getDate() - 7);

    var announcement = Announcements.findOne({clinic: myCentre[0], announcement_datetime: {$gt: a_week_ago}}, {sort: {announcement_datetime: -1}, limit: 1});
    if (announcement) {
      Session.set('selectedAnnouncement', announcement._id);
    }
    if ((Template.instance().announcement_visible.get() && announcement)||(Template.instance().announcement_visible.get() && admin)) {
      return '';
    } else {
      return 'hidden';
    }

  },
  'announcement_enabled': function(){
    if (Session.get('selectedAnnouncement')) {
      return '';
    } else {
      return 'disabled';
    }
  },
  'announcementsForMyClinic': function(){
    var me = Meteor.userId();
    var myCentre = Roles.getGroupsForUser(me);
    var a_week_ago = new Date();
    a_week_ago.setDate(a_week_ago.getDate() - 7);
    return Announcements.findOne({clinic: myCentre[0], announcement_datetime: {$gt: a_week_ago}}, {sort: {announcement_datetime: -1}, limit: 1});
  }
});

Template.announcements.events({
  'click #cancel_announcement':function(event, template){
    template.announcement_visible.set(false);
  },
  'click #add_announcement_button': function(event, template){
    Modal.show('addAnnouncementModal');
  },
  'click #edit_announcement_button': function(event, template){
    Modal.show('editAnnouncementModal');
  },
  'click #delete_announcement_button': function(event, template){
    Modal.show('deleteAnnouncementModal');
  }
});
