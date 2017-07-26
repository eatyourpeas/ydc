import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.contact_us.onCreated(function(){
  this.clinicSelected = ReactiveVar("");
});

Template.contact_us.events({
  'change #clinic': function(event, template){
    template.clinicSelected.set(event.target.value);
  },
  'click #inhoursbutton':function(event, template){
    console.log('inhoursbutton clicked');
  }
});

Template.contact_us.helpers({
  'selectedClinic': function(clinicOption){
    if (clinicOption == Template.instance().clinicSelected.get()) {
      return 'selected';
    } else {
      return '';
    }
  },
  'group': function(){
    var me = Meteor.userId();
    var myCentre = Roles.getGroupsForUser(me);
    if (myCentre[0] == "KCH") {
    //  return "Kings College Hospital";
    }
    switch (myCentre[0]) {
      case "KCH":
        return "King's College Hospital";
        break;
      case "ELCH":
        return "Evelina London Children's Hospital";
        break;
      case "PRUH":
        return "Princess Royal University Hospital";
        break;
      case "UHL":
        return "University Hospital Lewisham";
        break;
      default:
        return "King's College Hospital";
    }
  }
});
