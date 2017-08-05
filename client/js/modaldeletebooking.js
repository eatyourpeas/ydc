import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { deleteBooking } from '/imports/api/bookings/methods.js';

Template.modalDeleteBooking.events({
  'submit #deleteBookingForm': function(){
    var selectedBooking = Session.get('selectedBooking');
    const thisBooking = {
      _id: selectedBooking
    };

    deleteBooking.call(thisBooking, function(error){
      if (error) {
        Session.set('alert_class', 'alert alert-warning');
        Session.set('alert_message', error.message);
        Session.set('alert_visible', true);
      } else {
        Session.set('alert_class', 'alert alert-success');
        Session.set('alert_message', 'Booking Cancelled. An email confirmation has been sent'); //TODO  - implement email
        Session.set('alert_visible', true);
      }
      Modal.hide('modalDeleteBooking');
    });

  }
});
