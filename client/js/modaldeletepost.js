import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeletePost.events({
  'click #deletepostbutton': function(event){
    var post_id = Session.get('selectedPost');
    Meteor.call('deletePost', post_id, function(error, result) {
    if (error) {
      alert(error);
      Modal.hide('modalDeletePost');
    } else {
      Meteor.call('mostRecentPost', function(error, post){
        if (error) {
          console.log(error);
        } else {
          Session.set('selectedPost', post._id);
          Modal.hide('modalDeletePost');
        }
      });

    }
    });
  }
});
