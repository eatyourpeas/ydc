import { FilesCollection } from 'meteor/ostrio:files';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

///MongoDB declarations

//Bookings = new Mongo.Collection('bookings');
//Courses = new Mongo.Collection('courses');
//Resources = new Mongo.Collection('resources');
//Posts = new Mongo.Collection('posts');
//Announcements = new Mongo.Collection('announcements');


/*
Images = new FilesCollection({
  collectionName: 'YDCImages',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      if (file.size <= 10485760) {
        return 'Please upload image with size equal or less than 10MB';
      } else{
        return 'This file type is not supported';
      }

    }
  }/*,
  storagePath: '/images' //comment in in production, out in development
});

/*
Documents = new FilesCollection({
  collectionName: 'YDCDocuments',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /doc|docx|pdf/i.test(file.extension)) {
      return true;
    } else {
      if (file.size <= 10485760) {
        return 'Please upload file with size equal or less than 10MB';
      } else{
        return 'This file type is not supported';
      }

    }
  },
  storagePath: '/documents'   //comment in in production, out in development
});*/
