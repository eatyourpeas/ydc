import { FilesCollection } from 'meteor/ostrio:files';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.uploadImageForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
  this.warningOrSuccess = new ReactiveVar("warning")
  this.alertMessage = new ReactiveVar("");
  if (Session.get("editPost")) {
    var post = Posts.findOne(Session.get('selectedPost'));
    Session.set('image_id', post.post_image);
  } else {
    Session.set('image_id', "");
  }

});

Template.uploadImageForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  'thumbnail': function(){
    if (Session.get("image_id") == "") {
      console.log("image_id is empty");
      return "";
    } else {
      var image_id = Session.get("image_id");
      var image = Images.findOne(image_id).fetch();
      return image[0];
    }
  },
  'thereIsAnImage': function(){
    if (Session.get("image_id") == "") {
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

Template.uploadImageForm.events({
  'change #fileInput'(e, template) {
    $('errorAlert').hide();
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {

        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {

        if (error) {
          template.warningOrSuccess.set("warning");
          template.alertMessage.set('Error during upload: ' + error);
          $('#errorAlert').show();
        } else {
          template.warningOrSuccess.set("success");
          template.alertMessage.set('File "' + fileObj.name + '" successfully uploaded');
          $('#errorAlert').show();
          //add the file _id to Session to access later for the resources collection
          Session.set('image_id', fileObj._id);
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});

Template.uploadForm.onRendered(function(){
  $('#errorAlert').hide();
});

Template.uploadImageForm.onDestroyed(function(){
  $('#errorAlert').hide();
  if (Session.get("image_id") == "") {
    //there is no image
  } else {
    //there is an image it could be old or new
    var post = Posts.findOne(Session.get('selectedPost'));
    if (Session.get('image_id') != post.post_image) {
      // this is a new image_id: delete it:
      Meteor.call('deleteImages', Session.get('image_id'), function(error, result){
        if (error) {
          console.log(error);
        } else {
          if (result) {
            console.log('successfully deleted this image');
          } else {
            console.log('failed to delete image');
          }
        }
      })
    }
  }
})
