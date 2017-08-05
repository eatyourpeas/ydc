import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { deleteAnnouncement } from '/imports/api/announcements/methods.js';

Template.deleteAnnouncementModal.events({
  'click #deleteannouncement': function(event, template){
    const announcement = {_id: Session.get('selectedAnnouncement')};

    deleteAnnouncement.call(announcement, function(error){
      if (error) {
        console.log(error.message);
      } else {
        console.log('announcement removed ');
        Modal.hide('modalDeleteAnnouncement');
      }
    });

  }
});
