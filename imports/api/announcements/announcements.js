import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Mongo } from 'meteor/mongo';

export const Announcements = new Mongo.Collection('announcements');
