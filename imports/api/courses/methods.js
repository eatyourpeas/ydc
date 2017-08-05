import { Meteor } from 'meteor/meteor';
import { Courses } from './courses';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { currentUserisLoggedInAsAdmin } from '/imports/api/users/user_role_validation';
import { currentUserisLoggedInAsClinician } from '/imports/api/users/user_role_validation';

export const insertCourse = new ValidatedMethod({
  name: 'Courses.methods.insert',
  validate: new SimpleSchema({
    course_name: { type: String, label: "Course Title" },
    start_date: { type: Date, label: "Course Start" },
    end_date: { type: Date, label: "Course end_date" },
    clinic: { type: String, allowedValues: ["KCH", "ELCH", "UHL", "PRUH"], label: "Clinic" },
    address: { type: String, label: "Address" },
    course_places: { type: Number, defaultValue: 12, label: "Number of Places Available" }
  }).validator(),
  run(course) {
    if (!currentUserisLoggedInAsClinician) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as a clinician to create a course!');
    }
    Courses.insert(course);
  },
});

export const deleteCourse = new ValidatedMethod({
    name: 'Courses.methods.remove',
    validate: new SimpleSchema({
      _id: { type: String }
    }).validator(),
    run(course) {
      if (!currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to remove a booking!');
      } else {
        Courses.remove(course);
      }
    }
});

export const updateCourse = new ValidatedMethod({
    name: 'Courses.methods.update',
    validate: new SimpleSchema({
      _id: {type: String}
    }).validator(),
    run( course ) {
      if (!currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to edit an announcement!');
      } else {
        Courses.update(course._id, {
          $set: {
            course_name: { type: String, label: "Course Title" },
            start_date: { type: Date, label: "Course Start" },
            end_date: { type: Date, label: "Course end_date" },
            clinic: { type: String, allowedValues: ["KCH", "ELCH", "UHL", "PRUH"], label: "Clinic" },
            address: { type: String, label: "Address" },
            course_places: { type: Number, defaultValue: 12, label: "Number of Places Available" }
          }
        });
      }
    }
});
