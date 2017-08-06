import { Meteor } from 'meteor/meteor';
import { Bookings } from './bookings';
import { Courses } from '/imports/api/courses/courses';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { currentUserisLoggedInAsAdmin } from '/imports/api/users/user_role_validation';
import { currentUserisLoggedInAsClinician } from '/imports/api/users/user_role_validation';

export const insertBooking = new ValidatedMethod({
  name: 'Bookings.methods.insert',
  validate: new SimpleSchema({
    booked_by: { type: String },
    course: { type: String },
    booked_at: { type: Date },
    booking_validated: { type: Boolean },
    places_booked: { type: Number }
  }).validator(),
  run(booking) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to make a booking!');
    }
    //test if course full
    var course_id_to_book_on = booking.course;
    var numberOfPlacesBooked = numberOfPlacesBookedOnCourse(course_id_to_book_on);
    var totalNumberOfPlaces = totalNumberOfPlacesOnCourse(course_id_to_book_on);
    var numberOfPlacesRemaining = totalNumberOfPlaces - numberOfPlacesBooked;
    if ((numberOfPlacesRemaining - booking.places_booked)< 0) {
      return Meteor.error('There are only '+numberOfPlacesRemaining+' places remaining.');
    }
    if ((numberOfPlacesRemaining - booking.places_booked)== 0) {
      return Meteor.error('This course is fully booked.')
    } else {
      Bookings.insert(booking);
      return (totalNumberOfPlaces - numberOfPlacesBooked - booking.places_booked) + " places remaining. ";
    }
  },
});

export const deleteBooking = new ValidatedMethod({
    name: 'Bookings.methods.remove',
    validate: new SimpleSchema({
      _id: { type: String }
    }).validator(),
    run(booking) {
      if (!this.userId || !currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to remove a booking!');
      } else {
        Bookings.remove(booking);
      }
    }
});

export const updateBooking = new ValidatedMethod({
    name: 'Bookings.methods.update',
    validate: new SimpleSchema({
      _id: {type: String},
      booked_by: { type: String },
      course: { type: String },
      booked_at: { type: Date },
      booking_validated: { type: Boolean },
      places_booked: { type: Number }
    }).validator(),
    run( booking ) {
      if (!this.userId || !currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to edit a booking!');
      } else {
        Bookings.update(booking._id, {
          $set: {
            booked_by: booking.booked_by,
            course: booking.course,
            booked_at: booking.booked_at,
            booking_validated: booking.booking_validated,
            places_booked: booking.places_booked
          }
        });
      }
    }
});

export const updatePlacesBooked = new ValidatedMethod({
  name: 'Bookings.methods.updatePlacesBooked',
  validate: new SimpleSchema({
    _id: {type: String},
    places_booked: { type: Number }
  }).validator(),
  run( booking ) {
    if (!this.userId || !currentUserisLoggedInAsAdmin) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to edit a booking!');
    } else {
      Bookings.update(booking._id, {
        $set: {
          places_booked: booking.places_booked
        }
      });
    }
  }
});

export const updateBookingToValidated = new ValidatedMethod({
  name: 'Bookings.methods.updateToValidated',
  validate: new SimpleSchema({
    _id: {type: String},
    booking_validated: { type: Boolean }
  }).validator(),
  run( booking ) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to make a booking!');
      return;
    } else {
      var selectedBooking = Bookings.findOne(booking._id, {fields: {places_booked: 1, course: 1}});

      var course_id_to_book_on = selectedBooking.course;
      var numberOfPlacesBooked = numberOfPlacesBookedOnCourse(course_id_to_book_on);
      var totalNumberOfPlaces = totalNumberOfPlacesOnCourse(course_id_to_book_on);
      var numberOfPlacesRemaining = totalNumberOfPlaces - numberOfPlacesBooked;
      if (numberOfPlacesRemaining < selectedBooking.places_booked) {
        throw new Meteor.Error('Unauthorized', 'There are only ' + numberOfPlacesRemaining + ' places left. Please reduce your booking or contact the administrator for your clinic.');
        return;
      }
      if (selectedBooking.places_booked > 4) {
        throw new Meteor.Error('Unauthorized', 'You cannot book more than 4 places!');
        return;
      }

      Bookings.update(booking._id, {
        $set: {
          booking_validated: booking.booking_validated
        }
      });

    }
  }
});

function numberOfPlacesBookedOnCourse(course_id){

  var bookings_for_course = [];
  bookings_for_course = Bookings.find({'course': course_id, 'booking_validated': true}).fetch();
  var total_bookings_for_course = 0;
  for (var i = 0; i < bookings_for_course.length; i++) {
    total_bookings_for_course += bookings_for_course[i].places_booked;
  }
  return total_bookings_for_course;
}

function totalNumberOfPlacesOnCourse(course_id){
  var course_to_book_on = Courses.findOne(course_id);
  return total_course_places = course_to_book_on.course_places;
}
