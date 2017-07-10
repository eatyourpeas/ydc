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


    Accounts.createUser({
      email: email,
      password: "password",
      profile: {
        name: name,
        clinician: clinician,
        admin: admin,
        parent: false,
        school: school
      },
      clinic: selectedClinic
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
