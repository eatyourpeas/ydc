import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalAddTeamMember.events({
  'submit form': function(event, template){

    var clinician = event.target.clinician.checked;
    var admin = event.target.admin.checked;
    var school = event.target.school.checked;
    var email = $("#clinician-email").val();
    var name = $("#clinician-name").val();
    var selectedClinic = Template.instance().selectedClinic.get();

    Meteor.call('createAdminOrClinicianOrSchoolUser', clinician, admin, school, email, name, selectedClinic, function(error, result){
      if (result) {
        alert('new user created');
        Session.set("userAdminSuccess", "Created User");
      } else {
        console.log('failed');
        Session.set("userAdminError", "Failed to Create User");
      }
    });

  },
  'change #clinic': function(event, template){
    var selectedClinic = event.target.value;
    template.selectedClinic.set(selectedClinic);
  }
});

Template.modalAddTeamMember.onCreated(function(){
  this.selectedClinic = new ReactiveVar("ELCH");
});
