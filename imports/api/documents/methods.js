import { Meteor } from 'meteor/meteor';
import { Documents } from './documents';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { currentUserisLoggedInAsAdmin } from '/imports/api/users/user_role_validation';
import { currentUserisLoggedInAsClinician } from '/imports/api/users/user_role_validation';

export const insertDocument = new ValidatedMethod({
  name: 'Documents.methods.insert',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run(document) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to add a resource document!');
    }
    Documents.insert(document);
  },
});

export const deleteDocument = new ValidatedMethod({
    name: 'Documents.methods.remove',
    validate: new SimpleSchema({
      _id: { type: String }
    }).validator(),
    run(document) {
      if (!this.userId || !currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to remove a resource document!');
      } else {
        Documents.remove(document);
      }
    }
});
