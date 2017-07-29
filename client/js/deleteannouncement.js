import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.deleteAnnouncementModal.events({
  'click #deleteannouncement': function(event, template){
      Meteor.call('deleteAnnouncement', Session.get('selectedAnnouncement'), function(error, result){
        if (error) {
            console.log(error);
        } else {
          if (result) {
            console.log('announcement removed');
          } else {
            console.log('failed to remove announcement');
          }
          Modal.hide('modalDeleteAnnouncement');
        }
      });
  }
});
