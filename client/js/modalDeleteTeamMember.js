import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeleteTeamMember.events({
  'submit #deleteteammemberform':function(event, template){
    var selectedUser = Session.get('selectedUser');
    Meteor.call('deleteUser', selectedUser, function(error, result) {
      if (error) {
        alert(error);
      } else {
        if (result) {
          console.log('user deleted');
        } else {
          console.log('failed to delete user');
        }
      }
    });
  }
});
