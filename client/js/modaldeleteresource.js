import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeleteResource.events({
  'click #deleteresourcebutton': function(event){
    var resourceToDeleteId = Session.get('selectedResource');
    Meteor.call('deleteResource', resourceToDeleteId, function(error, result){
      if (error) {
        console.log(error);
      } else {
        if (result) {
          console.log('successfully deleted resource');
        } else {
          console.log('could not delete resource');
        }
      }
      Modal.hide('modalDeleteResource');
    });
  }
});
