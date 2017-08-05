import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FilesCollection } from 'meteor/ostrio:files';
import { Announcements } from '/imports/api/announcements/announcements';
import { Posts } from '/imports/api/posts/posts';
import { Images } from '/imports/api/images/images';

Template.posts.onCreated(function(){
  var post = Meteor.call('mostRecentPost', function(error, post){
    if (error) {
      console.log(error);
      return;
    } else {
      Session.set('selectedPost', post._id);
      Session.set("editPost", false);
    }
  });
});

Template.posts.events({
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
  'click #deleteimagebutton': function(event){
    Meteor.call('deleteImages', this._id);
  }
});

Template.posts.helpers({
  'thereArePosts': function(){
    var number = Posts.find({}, {sort: {post_date: -1}}).count();
    if (number > 0) {
        return true;
    } else {
      return false;
    }
  },
  'postsInDateOrder': function(){
    return Posts.find({}, {sort: {post_date: -1}});
  },
  'selectedPost': function(){
    var post_id = Session.get('selectedPost');
    var post = Posts.findOne(post_id);
    return post;
  },
  'disabled': function(){
    if (Session.get('selectedPost')) {
      return ""
    } else {
      return "disabled";
    }
  }
});
