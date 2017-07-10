import { FilesCollection } from 'meteor/ostrio:files';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  this.uploadErrorMessage = new ReactiveVar("");
});

Template.uploadForm.onRendered(function(){
  $('#errorAlert').hide();
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  alertMessage() {
    return Template.instance().uploadErrorMessage.get();
  },
  'notLoaded': function(percentage){
    if (percentage < 100) {
      return true;
    } else {
      return false;
    }
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

        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {

        if (error) {
          template.uploadErrorMessage.set('Error during upload: ' + error);
          $('#successAlert').show();
        } else {
          //add the file _id to Session to access later for the resources collection
          Session.set('document_id', fileObj._id);
        }
        //template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});
