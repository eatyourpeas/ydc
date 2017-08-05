import { FilesCollection } from 'meteor/ostrio:files';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Documents } from '/imports/api/documents/documents.js';

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  this.warningOrSuccess = new ReactiveVar("warning")
  this.alertMessage = new ReactiveVar("");
});


Template.uploadForm.onRendered(function(){
  $('#errorAlert').hide();
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  'notLoaded': function(percentage){
    if (percentage < 100) {
      return true;
    } else {
      return false;
    }
  },
  'thereIsADocument': function(){
    if (Session.get("document_id") == "") {
      return false;
    } else {
      return true;
    }
  },
  'underOneHundred': function(percentage){
    if (percentage < 100) {
        return true;
    } else {
      return false;
    }
  },
  'alert_class': function(){
    if (Template.instance().warningOrSuccess.get()=="warning") {
      return "alert alert-danger";
    } else {
      return "alert alert-success";
    }
  },
  'alert_visible': function(){
    if(Template.instance().alertMessage.get()==""){
      return 'hidden';
    } else {
      return '';
    }
  },
  'alertMessage': function(){
    return Template.instance().alertMessage.get();
  }
});

Template.uploadForm.events({
  'change #fileInput'(e, template) {

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = Documents.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        console.log('started upload');
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        /*
        if (error) {
          template.uploadErrorMessage.set('Error during upload: ' + error);
          $('#successAlert').show();
        } else {
          //add the file _id to Session to access later for the resources collection
          Session.set('document_id', fileObj._id);
        }
        //template.currentUpload.set(false);
      });
      */

      if (error) {
        template.warningOrSuccess.set("warning");
        template.alertMessage.set('Error during upload: ' + error);
        $('#errorAlert').show();
      } else {
        template.warningOrSuccess.set("success");
        template.alertMessage.set('File "' + fileObj.name + '" successfully uploaded');
        $('#errorAlert').show();
        //add the file _id to Session to access later for the resources collection
        Session.set('document_id', fileObj._id);
      }
      template.currentUpload.set(false);
    });

      upload.start();
    }
  }
});

Template.uploadForm.onDestroyed(function(){
  $('#errorAlert').hide();
  if (Session.get("document_id") == undefined) {
    //there is no document
    return;
  } else {
    //there is a document it could be old or new
      Meteor.call('deleteDocuments', Session.get('document_id'), function(error, result){
        if (error) {
          console.log(error);
        } else {
          if (result) {
            console.log('successfully deleted this document');
          } else {
            console.log('failed to delete document');
          }
        }
      });
  }
})
