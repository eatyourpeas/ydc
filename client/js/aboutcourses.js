import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.aboutcourses.events({
  'click #booknowbutton': function(events, template){
    Router.go('/schedule');
  }
})
