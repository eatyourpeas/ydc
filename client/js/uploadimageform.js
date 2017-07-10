import { FilesCollection } from 'meteor/ostrio:files';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.uploadImageForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
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
  }
});

Template.uploadImageForm.events({
  'change #fileInput'(e, template) {

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
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
          //add the file _id to Session to access later for the resources collection
          Session.set('image_id', fileObj._id);
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});

Template.uploadImageForm.onDestroyed(function(){
  if (Session.get("image_id") == "") {
    //there is no image
  } else {
    //there is an image it could be old or new
    var post = Posts.findOne(Session.get('selectedPost'));
    if (Session.get('image_id') != post.post_image) {
      // this is a new image_id: delete it:
      Meteor.call('deleteImages', Session.get('image_id'), function(error, success){
        if (error) {
          console.log(error);
        } else {
          console.log('successfully deleted this image');
        }
      })
    }
  }
})
