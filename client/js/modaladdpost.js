import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalNewPost.events({
  'submit #newpost': function(event){

    var newsheadlinetext = event.target.newsheadlinetext.value;
    var newssubtitletext = event.target.newsstraplinetext.value;
    var newstext = event.target.newstext.value;

    var image_id = Session.get("image_id");

    Meteor.call('createPost', newsheadlinetext, newssubtitletext, newstext, image_id, function(error, result){
      if (error) {
        console.log(error);
      } else {
        if (result) {
          console.log("post created");
        } else {
          console.log("post did not create");
        }
      }
    });

    Session.set("image_id", "");

  },
  'click #closeNewPostButton': function(){
    if (Session.get("image_id")) {
      var image_id = Session.get("image_id");
      Meteor.call('deleteImages', image_id);
    }
  }
});

Template.modalNewPost.helpers({
  'getDateTime': function(){
    return Date.now();
  }
});

Template.modalNewPost.onDestroyed(function(){
  var image_id = Session.get('image_id');
  if (image_id == "") {

  } else {

    Meteor.call('deleteImages', image_id, function(error, image){
      if (error) {
        console.log(error);
      } else {
        console.log('success');
      }
    })
  }
});
