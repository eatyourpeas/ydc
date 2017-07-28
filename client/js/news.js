import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FilesCollection } from 'meteor/ostrio:files';

Template.news.onCreated(function(){
  var post = Meteor.call('mostRecentPost', function(error, post){
    if (error) {
      console.log(error);
      return;
    } else {
      Session.set('selectedPost', post._id);
      Session.set("editPost", false);
    }
  });

  this.announcement_visible = new ReactiveVar(true);

});

Template.news.events({
  'click #newPostButton': function(){
    Session.set("editPost", false);
    Modal.show('modalNewPost');
  },
  'click #editPostButton': function(){
    Session.set("editPost", true);
    Modal.show('modalEditPost');
  },
  'click #deletePostButton': function(){
    Session.set("editPost", false);
    Modal.show('modalDeletePost');
  },
  'click #post': function(event, template){
    var post = Posts.findOne({_id: this._id});
    Session.set('selectedPost', post._id);
  },
  'click #deleteimagebutton': function(event){
    Meteor.call('deleteImages', this._id);
  },
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

Template.news.helpers({
  'thereArePosts': function(){
    var number = Posts.find({}, {sort: {post_date: -1}}).count();
    if (number > 0) {
        return true;
    } else {
      return false;
    }
  },
  'mostRecentPost': function(){
    return Posts.findOne({}, {sort: {post_date: -1, limit: 1}});
  },
  'postsInDateOrder': function(){
    return Posts.find({}, {sort: {post_date: -1}});
  },
  'selectedPost': function(){
    var post_id = Session.get('selectedPost');
    var post = Posts.findOne(post_id);
    return post;
  },
  'imageForId': function(image_id){
    if (image_id) {
      var image = Images.findOne(image_id);
      return image;
    }
  },
  'allImages': function(){
    return Images.find();
  },
  'imageDelete': function(fileToDelete){
    Meteor.call('deleteImages', fileToDelete);
  },
  'disabled': function(){
    if (Session.get('selectedPost')) {
      return ""
    } else {
      return "disabled";
    }
  },
  'thereIsNoImage': function(){
    var selectedPost = Session.get("selectedPost");
    if (selectedPost) {
      var post = Posts.findOne(selectedPost);
      if (post.post_image) {
        return false;
      } else {
        return true;
      }
    } else {
      return true
    }
  },
  'announcement_visible': function(){

    var me = Meteor.userId();
    var myCentre = Roles.getGroupsForUser(me);
    var admin = false;

    if (Roles.userIsInRole(me,'admin', myCentre[0])) {
      admin = true;
    }

    var a_week_ago = new Date();
    a_week_ago.setDate(a_week_ago.getDate() - 7);
    var announcement = Announcements.findOne({clinic: myCentre[0], announcement_datetime: {$gt: a_week_ago.getTime()}}, {sort: {createdAt: -1}, limit: 1});
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
    return Announcements.findOne({clinic: myCentre[0], announcement_datetime: {$gt: a_week_ago.getTime()}}, {sort: {createdAt: -1}, limit: 1});
  }
});
