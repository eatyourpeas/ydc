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

    Meteor.call("addAnnouncement", announcement_text, clinic, function(error, result){
      if (error) {
        console.log(error);
      } else {
        if (result) {
          console.log('announcement added');
        } else {
          console.log('announcement add failed');
        }
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
