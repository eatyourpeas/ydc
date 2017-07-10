import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.headingsandnavigation.events({
  'click #menu-item-home': function(event, template){
    template.selectedPage.set('Search courses...');
  },
  'click #menu-item-events': function(event, template){
    template.selectedPage.set('Search events...');
  },
  'click #menu-item-resources': function(event, template){
    template.selectedPage.set('Search resources...');
  },
  'click #menu-item-courses': function(event, template){
    template.selectedPage.set('Search courses...');
  },
  'submit #searchform': function(event, template){
    var searchtext = event.target.s.value;
    var currentPage = template.selectedPage.get();
    if (currentPage == 'Search courses...') {
    
    }
    if (currentPage == 'Search resources...') {
      ///search resourses
    }
    if (currentPage == 'Search events...') {
      ///search events
    }
  }
});

Template.headingsandnavigation.onCreated(function(){
  this.selectedPage = new ReactiveVar("Search courses...");
});

Template.headingsandnavigation.helpers({
  'searchtext': function(){
    return Template.instance().selectedPage.get();
  }
});
