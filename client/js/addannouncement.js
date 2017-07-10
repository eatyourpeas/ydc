import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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

    Announcements.insert({
      announcement_datetime: Date.now(),
      announcement_text: announcement_text,
      clinic: clinic
    });
  },
  'change #clinic': function(event, template){
    console.log('changed'+ event.target.value);
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
