import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FilesCollection } from 'meteor/ostrio:files';
import { Posts } from '/imports/api/posts/posts';
import { Images } from '/imports/api/images/images';

Template.postpage.helpers({
  'imageForId': function(image_id){
    if (image_id) {
      var image = Images.findOne(image_id);
      return image;
    }
  },
  'thereIsNoImage': function(){
    var selectedPost = Session.get("selectedPost");
    if (selectedPost) {
      var post = Posts.findOne(selectedPost);
      if (post.post_image) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
});
