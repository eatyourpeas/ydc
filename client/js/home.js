import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.home.events({
  'click #phonebutton': function(event){
    console.log('phone button');
  },
  'click #inhoursbutton': function(event){
    Router.go('/news');
  },
  'click .home-promo-green':function(){
    Router.go('/aboutcourses');
  },
  'click .home-promo-pink': function(){
    Router.go('/resources');
  },
  'click .home-promo-blue': function(){
    Router.go('/news');
  },
  'click #seedbutton': function(){
    Meteor.call('seedDatabase');
  }
});
