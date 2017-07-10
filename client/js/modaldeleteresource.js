import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeleteResource.events({
  'click #deleteresourcebutton': function(event){
    var resourceToDeleteId = Session.get('selectedResource');
    Meteor.call('deleteResource', resourceToDeleteId, function(error, doc){
      if (error) {
        console.log(error);
      } else {
        console.log('successfully deleted resource');
      }
      Modal.hide('modalDeleteResource');
    });
  }
});
