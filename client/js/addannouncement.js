import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { insertAnnouncement } from '/imports/api/announcements/methods.js';

Template.addAnnouncementModal.events({
  'submit #add_announcement_form': function(event, template){

    var announcement_text = event.target.announcement.value;
    var clinic = template.selectedClinic.get();

    $('#alertAnnouncement').hide();

    if (announcement_text == "") {
      event.preventDefault();
      template.alertWarning.set('You must enter an announcement.')
      $('#alertAnnouncement').show();
    }

    if (clinic == "") {
      event.preventDefault();
      template.alertWarning.set('You must enter a clinic.')
    }

    const announcement = {
      announcement_text: announcement_text,
      clinic: clinic,
      announcement_datetime: new Date()
    };

    insertAnnouncement.call(announcement, function(error){
      if (error) {
        console.log(error.message);
      } else {
        console.log('announcement added');
      }
    });
  },
  'change #clinic': function(event, template){
    if (event.target.value != "NoFilter") {
      template.selectedClinic.set(event.target.value);
      $('#alertAnnouncement').hide();
    }
  }
});

Template.addAnnouncementModal.helpers({
  'alertMessage': function(){
    return Template.instance().alertWarning.get();
  }
});

Template.addAnnouncementModal.onCreated(function(){
  this.selectedClinic = new ReactiveVar("");
  this.alertWarning = new ReactiveVar("");
});

Template.addAnnouncementModal.onRendered(function(){
  $('#alertAnnouncement').hide();
})
