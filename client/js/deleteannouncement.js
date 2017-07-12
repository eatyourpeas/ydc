import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.deleteAnnouncementModal.events({
  'click #deleteannouncement': function(event, template){
      Meteor.call('deleteAnnouncement', Session.get('selectedAnnouncement'), function(error){
        if (error) {
            console.log(error);
        } else {
          Modal.hide('modalDeleteAnnouncement');
        }
      });
  }
});
