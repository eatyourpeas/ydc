import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.searchform.events({
  'submit #searchForm': function(event){
    event.preventDefault();
    var email = event.target.email.value;
    var user = Meteor.users.findOne({username: email});
    Session.set('selectedUser', user._id);
  }
});
