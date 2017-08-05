import { Meteor } from 'meteor/meteor';
import { Posts } from './posts';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { currentUserisLoggedInAsAdmin } from '/imports/api/users/user_role_validation';
import { currentUserisLoggedInAsClinician } from '/imports/api/users/user_role_validation';

export const insertPost = new ValidatedMethod({
  name: 'Posts.methods.insert',
  validate: new SimpleSchema({
    post_headline: { type: String, label: "Post Title" },
    post_subtitle: { type: String, label: "Post Subtitle" },
    post_text: { type: String, label: "Post Text" },
    post_image: { type: String, label: "Post Image" },
    post_date: { type: Date, label: "Post Date" }
  }).validator(),
  run(post) {
    if (!currentUserisLoggedInAsClinician) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as a clinician to create a course!');
    } else {
        Posts.insert(post);
    }
  },
});

export const deletePost = new ValidatedMethod({
    name: 'Posts.methods.remove',
    validate: new SimpleSchema({
      _id: { type: String }
    }).validator(),
    run(post) {
      if (!currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to remove a booking!');
      } else {
        Posts.remove(post);
      }
    }
});

export const updatePost = new ValidatedMethod({
    name: 'Posts.methods.update',
    validate: new SimpleSchema({
      post_headline: { type: String, label: "Post Title" },
      post_subtitle: { type: String, label: "Post Subtitle" },
      post_text: { type: String, label: "Post Text" },
      post_image: { type: String, label: "Post Image" },
      post_date: { type: Date, label: "Post Date" }
    }).validator(),
    run( post ) {
      if (!currentUserisLoggedInAsAdmin) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as an administrator to edit an announcement!');
      } else {
        Posts.update(post._id, {
          $set: {
            post_headline: post.post_headline,
            post_subtitle: post.post_subtitle,
            post_text: post.post_text,
            post_image: post.post_image,
            post_date: post.post_date
          }
        });
      }
    }
});
