import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FilesCollection } from 'meteor/ostrio:files';

export const Documents = new FilesCollection({
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
  storagePath: '/documents'   //comment in in production, out in development*/
});
