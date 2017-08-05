import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeleteBooking.events({
  'click #deleteBooking': function(){
    var selectedBooking = Session.get('bookingSelected');
    const thisBooking = {
      _id: selectedBooking
    };
    /*
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
  */
    deleteBooking.call(thisBooking, function(error){
      if (error) {
        console.log(error.message);
      } else {
        Modal.hide('modalDeleteBooking');
      }
    });


  }
});
