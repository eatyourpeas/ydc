import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeleteTeamMember.events({
  'click #deleteteammemberbutton':function(event, template){
    var selectedUser = Session.get('selectedUser');
    Meteor.call('deleteUser', selectedUser, function(error, result) {
      if (error) {
        alert(error);
      } else {
        console.log('user deleted');
      }
    });
  }
});
