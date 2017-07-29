import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


Template.modalEditPost.helpers({
  'selectedPost': function(){
    var post_id = Session.get('selectedPost');
    var post = Posts.findOne(post_id);
    return post;
  }
});

Template.modalEditPost.events({
  'submit #editpost': function(event){
    var newsheadlinetext = event.target.newsheadlinetext.value;
    var newssubtitletext = event.target.newsstraplinetext.value;
    var newstext = event.target.newstext.value;
    var post_image = Session.get('image_id');

    var currentPost = Posts.findOne(Session.get('selectedPost'));
    if (currentPost.post_image != post_image) {
      //I am replacing the current image - delete the old one
      Meteor.call('deleteImages', currentPost.post_image, function(error, success){
        if (error) {
          console.log(error);
        } else {
          console.log('success');
        }
      });
    }

    Meteor.call('updatePost', this._id, newsheadlinetext, newssubtitletext, newstext, post_image, function(error, result){
      if (error) {
        console.log(error);
      } else {
        if (result) {
          console.log('post updated');
        } else {
          console.log('post failed to update');
        }
      }
    });

  }
});

Template.modalEditPost.helpers({
  'getDateTime': function(){
    return Date.now();
  }
});
