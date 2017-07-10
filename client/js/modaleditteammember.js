import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalEditTeamMember.events({
  'submit form': function(event, template){

    var clinician = event.target.clinician.checked;
    var admin = event.target.admin.checked;
    var school = event.target.school.checked;
    var email = $("#clinician-email").val();
    var name = $("#clinician-name").val();
    var selectedClinic = Template.instance().selectedClinic.get();

    var selectedUser = Session.get('selectedUser');

    Meteor.users.update(selectedUser, {
      $set: {
        'emails.0.address': email,
        password: "password",
        profile: {
          name: name,
          clinician: clinician,
          admin: admin,
          parent: false,
          school: school
        },
        clinic: selectedClinic
      }
    });


  },
  'change #clinic': function(event, template){
    var selectedClinic = event.target.value;
    template.selectedClinic.set(selectedClinic);
  }
});

Template.modalEditTeamMember.helpers({
  'selectedUser': function(){
    var selectedUser_id = Session.get('selectedUser');
    var fullUser = Meteor.users.find(selectedUser_id).fetch();
    return fullUser[0];
  },
  'selectedClinic': function(clinicOption){
    if (clinicOption == Template.instance().selectedClinic.get()) {
      return 'selected';
    } else {
      return '';
    }
  },
  'clinicOptions': function(){
    return [{value: "ELCH", text:"Evelina Children's Hospital"}, {value: "KCH", text: "King's College Hospital"}, {value: "PRUH", text:"Princess Royal University Hospital"}, {value: "UHL", text: "University Hospital Lewisham"}];
  },
  'isClinician': function(user_id){
    var myGroup = Roles.getGroupsForUser(user_id);
    if (Roles.userIsInRole(user_id,'clinician', myGroup[0])) {
      return true;
    } else {
      return false;
    }
  },
  'isAdmin': function(user_id){
    var myGroup = Roles.getGroupsForUser(user_id);
    if (Roles.userIsInRole(user_id,'admin', myGroup[0])) {
      return true;
    } else {
      return false;
    }
  },
  'isSchool': function(user_id){
    var myGroup = Roles.getGroupsForUser(user_id);
    if (Roles.userIsInRole(user_id,'school', myGroup[0])) {
      return true;
    } else {
      return false;
    }
  }
});

Template.modalEditTeamMember.onCreated(function(){
  var selectedUser_id = Session.get('selectedUser');
  var fullUser = Meteor.users.find(selectedUser_id).fetch();
  var clinic = Roles.getGroupsForUser(selectedUser_id);
  this.selectedClinic = new ReactiveVar(clinic[0]);
});
