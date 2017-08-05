import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { deletePost } from '/imports/api/posts/methods.js';

Template.modalDeletePost.events({
  'click #deletepostbutton': function(event){
    var post_id = Session.get('selectedPost');
    const postToRemove = {
      _id: post_id
    }

    deletePost.call(postToRemove, function(error){
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
            Router.go('/posts');
          }
        });
      }
    });

  }
});
