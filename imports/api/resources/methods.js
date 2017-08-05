import { Meteor } from 'meteor/meteor';
import { Resources } from './resources';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { currentUserisLoggedInAsAdmin } from '/imports/api/users/user_role_validation';
import { currentUserisLoggedInAsClinician } from '/imports/api/users/user_role_validation';

export const insertResource = new ValidatedMethod({
  name: 'Resources.methods.insert',
  validate: new SimpleSchema({
    file_date: { type: Date, label: "Resource Date" },
    file_summary: { type: String, label: "Resource Description" },
    file_clinic: { type: String, allowedValues: ["KCH", "ELCH", "UHL", "PRUH"], label: "Clinic" },
    file_category: { type: [String], allowedValues: ["Medical/Nursing", "Dietetic", "Psychology", "School", "Transition/Young Adult", "DUKLands"], label: "Resource Category" },
    file_id: { type: String, label: "Document Identifier" },
    file_title: { type: String, label: "Resource Title" }
  }).validator(),
  run(resource) {
    if (!currentUserisLoggedInAsClinician) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as a clinician to create a course!');
    }
    Resources.insert(resource);
  },
});

export const deleteResource = new ValidatedMethod({
    name: 'Resources.methods.remove',
    validate: new SimpleSchema({
      _id: { type: String }
    }).validator(),
    run(resource) {
      if (!currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to remove a booking!');
      } else {
        Resources.remove(resource);
      }
    }
});

export const updateResource = new ValidatedMethod({
    name: 'Resources.methods.update',
    validate: new SimpleSchema({
      _id: {type: String},
      file_date: { type: Date, label: "Resource Date" },
      file_summary: { type: String, label: "Resource Description" },
      file_clinic: { type: String, allowedValues: ["KCH", "ELCH", "UHL", "PRUH"], label: "Clinic" },
      file_category: { type: String, allowedValues: ["Medical/Nursing", "Dietetic", "Psychology", "School", "Transition/Young Adult", "DUKLands"], label: "Resource Category" },
      /// file_id: { type: String, label: "Document Identifier" }, note cannot update document - need to remove resource and create new
      file_title: { type: String, label: "Resource Title" }
    }).validator(),
    run( resource ) {
      if (!currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to edit an announcement!');
      } else {
        Resources.update(resource._id, {
          $set: {
            file_date: resource.file_date,
            file_summary: resource.file_summary,
            file_clinic: resource.file_clinic,
            file_category: resource.file_category,
            file_title: resource.file_title
          }
        });
      }
    }
});
