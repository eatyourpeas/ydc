import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.error_success.onRendered(function(){
  if (Session.get('alert_visible')) {
    $('#errorAlert').show();
  } else {
    $('#errorAlert').hide();
  }
});

Tracker.autorun(function() {
  var visible = Session.get("alert_visible");
  if (visible) {
    $('#errorAlert').show();
  } else {
    $('#errorAlert').hide();
  }
});

Template.error_success.helpers({
  alert_class: function(){
    return Session.get('alert_class');
  },
  alert_visible: function(){
    var visible = Session.get('alert_visible');
    console.log('helper called: show is '+ visible);
    if (visible) {
      $('#errorAlert').show();
      //return "visible";
    } else {
      $('#errorAlert').hide();
      //return "";
    }
  },
  alert_message: function(){
    return Session.get('alert_message');
  }
});
