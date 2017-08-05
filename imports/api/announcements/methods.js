import { Meteor } from 'meteor/meteor';
import { Announcements } from './announcements';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { currentUserisLoggedInAsAdmin } from '/imports/api/users/user_role_validation';
import { currentUserisLoggedInAsClinician } from '/imports/api/users/user_role_validation';

export const insertAnnouncement = new ValidatedMethod({
  name: 'Announcements.methods.insert',
  validate: new SimpleSchema({
    announcement_datetime: { type: Date, label: "Date and Time Announcement Made" },
    announcement_text: { type: String, label: "Announcement", optional: false },
    clinic: { type: String, allowedValues: ["KCH", "ELCH", "UHL", "PRUH"], label: "Clinic" }
  }).validator(),
  run(announcement) {
    if (!this.userId || !currentUserisLoggedInAsClinician) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to create an announcement!');
    }

    Announcements.insert(announcement);
  },
});

export const deleteAnnouncement = new ValidatedMethod({
    name: 'Announcements.methods.remove',
    validate: new SimpleSchema({
      _id: { type: String }
    }).validator(),
    run(announcement) {
      if (!this.userId || !currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to remove an announcement!');
      } else {
        Announcements.remove(announcement);
      }
    }
});

export const updateAnnouncement = new ValidatedMethod({
    name: 'Announcements.methods.update',
    validate: new SimpleSchema({
      _id: {type: String},
      announcement_datetime: { type: Date, label: "Date and Time Announcement Made" },
      announcement_text: { type: String, label: "Announcement", optional: false },
      clinic: { type: String, allowedValues: ["KCH", "ELCH", "UHL", "PRUH"], label: "Clinic" }
    }).validator(),
    run( announcement ) {
      if (!this.userId || !currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to edit an announcement!');
      } else {
        Announcements.update(announcement._id, {
          $set: {
            announcement_datetime: announcement.announcement_datetime,
            announcement_text: announcement.announcement_text,
            clinic: announcement.clinic
          }
        });
      }
    }
});
