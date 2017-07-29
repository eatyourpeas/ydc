import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeleteBooking.events({
  'click #deleteBooking': function(){
    var selectedBooking = Session.get('bookingSelected');
    Meteor.call('deleteBooking', selectedBooking, function(error, result) {
    if (error) {
      alert(error);
    } else {
      if (result) {
        console.log('booking deleted');
      } else {
        console.log('booking created');
      }
    }
  });
    Modal.hide('modalDeleteBooking');
  }
});
