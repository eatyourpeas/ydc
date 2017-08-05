import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import { Announcements } from '/imports/api/announcements/announcements';
import { Courses } from '/imports/api/courses/courses';
import { Bookings } from '/imports/api/bookings/bookings';
import { Documents } from '/imports/api/documents/documents';
import { Images } from '/imports/api/images/images';
import { Posts } from '/imports/api/posts/posts';
import { Resources } from '/imports/api/resources/resources';

Meteor.startup(() => {
  // code to run on server at startup

  //   if users database is empty, seed these values
  /*
    if(Meteor.users.find().count() < 1) {
      // users array
      var users = [ ///note these are fictional email addresses and for demon only
        { name: 'Simon', email: 'simon.chapman@nhs.net', password: 'password', roles: ['clinician', 'admin'], group: 'KCH' },
        { name: 'Martha', email: 'martha.ford-adams@nhs.net', password: 'password', roles: ['clinician'], group: 'KCH' },
        { name: 'Tony', email: 'tony.hulse@gstt.nhs.uk', password: 'password', roles: ['clinician'], group: 'ELCH' },
        { name: 'Joanna', email: 'joanna.lawrence@uhl.nhs.uk', password: 'password', roles: ['clinician'], group: 'UHL' },
        { name: 'Psychologist', email: 'psychology@kings.com', password: 'password', roles: ['clinician'], group: 'KCH' },
        { name: 'Dietician', email: 'dietician@kings.com', password: 'password', roles: ['clinician'], group: 'KCH' },
        { name: 'Parent', email: 'kingsparent@example.com', password: 'password', roles: ['parent'], group: 'KCH' },
        { name: 'Headmaster', email: 'headmaster@school.com', password: 'password', roles: ['school'], group: 'KCH' }

      ];
      // user creation
      _.each(users, function(d) {
        // return id for use in roles assignment below
        var userId = Accounts.createUser({
          email: d.email,
          password: d.password,
          username: d.email,
          profile: {
            name: d.name,
            clinician: true
          }
        });
        // verify user email
        Meteor.users.update({ _id: userId }, { $set: { 'emails.0.verified': true } });
        // add roles to user

          Roles.addUsersToRoles(userId, d.roles, d.group);

      });

  }*/
});


//// Meteor Methods


Meteor.methods({

  createAdminOrClinicianOrSchoolUser: function(clinician, admin, school, email, name, clinic){
    //creating admin  - must be logged in as admin to  be able to do this

    if (isAdmin(Meteor.user())) {
    var newUser = Accounts.createUser({
        email: email,
        password: "password",
        profile: {
          name: name
        },
        clinic: clinic
      });
      if (clinician) {
        Roles.addUsersToRoles(newUser, "clinician", clinic);
        Roles.removeUsersFromRoles(newUser, "parent", clinic);
      }
      if (admin) {
        Roles.addUsersToRoles(newUser, "admin", clinic);
        Roles.removeUsersFromRoles(newUser, "parent", clinic);
      }
      if (school) {
        Roles.addUsersToRoles(newUser, "school", clinic);
        Roles.removeUsersFromRoles(newUser, "parent", clinic);
      }
      if (!school && !admin && !clinician) {
        Roles.addUsersToRoles(newUser, "parent", clinic);
      }
      return true;
    } else {
      return false;
    }
  },
  updateUser: function(selectedUser, name, clinician, selectedClinic, admin, school){
    if (isAdmin(Meteor.userId)) {
      Meteor.users.update({_id: selectedUser}, {
        $set: {
          profile: {
            name: name
          },
          clinic: selectedClinic
        }
      });
      if (admin) {
        Roles.addUsersToRoles(selectedUser, "admin", selectedClinic);
      } else {
        Roles.removeUsersFromRoles(selectedUser, "admin", selectedClinic);
      }
      if (school) {
        Roles.addUsersToRoles(selectedUser, "school", selectedClinic);
      } else {
        Roles.removeUsersFromRoles(selectedUser, "school", selectedClinic);
      }
      if (clinician) {
        Roles.addUsersToRoles(selectedUser, "clinician", selectedClinic);
      } else {
        Roles.removeUsersFromRoles(selectedUser, "clinician", selectedClinic);
      }
      if (!clinician && !school && !admin) {
        //this must be a parent
        Roles.addUsersToRoles(selectedUser, "parent", selectedClinic);
      }
      return true;
    } else {
      return false;
    }
  },
  /*
  deleteBooking: function(booking_id){
    if (isAdmin(this.userId)) {
      Bookings.remove({_id: booking_id});
      return true;
    } else {
      return false;
    }
  },
  createBooking: function(course_id, places_booked){
    if (isClinician(this.userId) || isAdmin(this.userId)) {
      //update the users bookings
      Bookings.insert({
        booked_by: this.userId,
        course: course_id,
        booked_at: Date.now(),
        booking_validated: false,
        places_booked: places_booked
      });
      return true;
    } else {
      return false;
    }
  },
  updateBookingToValidated: function(booking_id){
    if (this.userId) {
      Bookings.update(booking_id, {
        $set: { booking_validated : true }
      });
      return true;
    } else {
      return false;
    }
  },
  /*
  createCourse: function(course, startdate, enddate, selectedClinic, address, course_places){
    if (isAdmin(this.userId) || isClinician(this.userId)) {

      Courses.insert({
        course_name: course,
        start_date: startdate,
        end_date: enddate,
        created_by: this.userId,
        created_at: Date.now(),
        clinic: selectedClinic,
        address: address,
        course_places: course_places
      });
      return true;
    } else {
      return false;
    }
  },
  deleteCourse: function(course_id){
    if (isAdmin(this.userId) || isClinician(this.userId)) {
      Courses.remove({_id:course_id});
      return true;
    } else {
      return false;
    }
  },
  */
  deleteUser: function(user_id){ //can only delete user if logged in user has admin status
    if (isAdmin(Meteor.userId)) {
      Meteor.users.remove({_id: user_id});
      return true;
    } else {
      return false;
    }
  },
  /*
  createPost: function(newsheadlinetext, newssubtitletext, newstext, image_id){
    if (isAdmin(this.userId)) {
      Posts.insert({
        post_headline: newsheadlinetext,
        post_subtitle: newssubtitletext,
        post_text: newstext,
        post_image: image_id,
        post_date: Date.now()
      });
      return true;
    } else {
      return false;
    }
  },
  deletePost: function(post_id){
    if (isAdmin(this.userId)) {
      var post = Posts.findOne(post_id);
      Images.remove({_id: post.post_image});
      Posts.remove({_id: post_id});
      return true;
    } else {
      return false;
    }
  },
  updatePost: function(post_id, newsheadlinetext, newssubtitletext, newstext, post_image){
    if (isAdmin(this._id)) {
      Posts.update(post_id,{
        $set: { post_headline: newsheadlinetext,
        post_subtitle: newssubtitletext,
        post_text: newstext,
        post_image: post_image,
        post_date: Date.now()
        }
      });
      return true;
    } else {
      return false;
    }
  },
  */
  mostRecentPost: function(){
    var post = Posts.findOne({}, {sort: {post_date: -1, limit: 1}});
    if (post) {
      return post;
    } else {
      //throw new Meteor.Error('Error', 'No Posts');
      return "";
    }
  },
  deleteImages: function(image_id){
    if (isAdmin(this.userId)) {
      Images.remove({_id: image_id});
      return true;
    } else {
      return false;
    }
  },
  deleteDocuments: function(document_id){
    if (isAdmin(this.userId)) {
        Documents.remove({_id: document_id});
        return true;
    } else {
      return false;
    }
  },
  /*
  createResource: function(description, clinic, myChosenCategories, document_id, document_title){
    if (this.userId) {
      // need to be logged in to update resource
      Resources.insert({
        file_date: Date.now(),
        file_summary: description,
        file_clinic: clinic,
        file_category: myChosenCategories,
        file_id: document_id,
        file_title: document_title
      });
      return true;
    } else {
      return false;
    }
  },
  */
  deleteResource: function(resource_id){
    //can only delete resources if logged in as admin - this must be a meteor method as removal included Documents as well as Resources collections
    if (isAdmin(this.userId)) {
      var this_resource = Resources.findOne(resource_id);
      var document_id = this_resource.file_id;
      const resourceToRemove = { _id: this_resource };
      deleteResource.call(resourceToRemove, function(error){
        if (error) {
          console.log(error.message);
        } else {
          console.log('resource removed');
        }
      })
      Resources.remove({_id: resource_id});
      Documents.remove({_id:document_id});
    }

  },
  updateResource: function(selectedResource, category, clinic, description, document_title){
    if (Meteor.userId) {
      Resources.update(selectedResource, {
        $set:{
          file_date: Date.now(),
          file_summary: description,
          file_clinic: clinic,
          file_category: category,
          file_title: document_title
        }
      });
    }
  },
  documentForResource: function(document_id){
    return Documents.findOne(document_id);
  },
  imageForPost: function(post_id){
    var this_post = Posts.findOne(post_id);
    var image_id = this_post.post_image;
    return Images.findOne(image_id).cursor;
  },
  'coordinatesForAddress': function(address){
    var geo = new GeoCoder({
      geocoderProvider: "google",
      httpAdapter: "https",
      apiKey: 'AIzaSyBOdKuGzNAH-Nv1i5P5MzY9jxbrXGZBNr4'
    });
    var result = geo.geocode(address);
    return result;
  }
});

Accounts.onCreateUser((options, user) => {

    var admin = false;
    var clinician = false;

      user.emails[0].verified = true; //this to be changed if email validation enabled
      user.clinic = options.clinic;
      user.profile = options.profile;

      return user;

});

Meteor.users.after.insert(function(userId, doc){

  if (!isAdmin(Meteor.user())) {
    //I am not admin so no one is logged in. This must be a parent. New users created by admin are allocated roles to this new user is done elsewhere
    Roles.addUsersToRoles(doc._id, "parent", doc.clinic);
  }
});

///publications

  Meteor.publish('files.images.all', function(){
    return Images.find().cursor;
  });

  Meteor.publish('files.documents.all', function(){
    return Documents.find().cursor;
  });

  Meteor.publish('findmybookings', function(){
    return Bookings.find({
      booked_by: this.userId
    });
  });

  Meteor.publish('findallbookings', function(){
  //  var result = [];
    if (isAdmin(this.userId)||isClinician(this.userId)) {
         return Bookings.find(); //protected - accessible only by clinicians or admin
    } else {
         this.stop();
         // YOUUU SHALL NOT.... PASS!!!  ~Gandalf
    }
    return [];
  })

  Meteor.publish('findAllCourses', function(){
    return Courses.find({});
  });

  Meteor.publish("adminUsers", function(){
     var result = [];
     if (Roles.userIsInRole(this.userId, 'admin', 'KCH')||Roles.userIsInRole(this.userId, 'clinician', 'KCH')) { //only admin/clinicians can see all users
          result = Meteor.users.find();
     } else {
          this.stop();
          // YOUUU SHALL NOT.... PASS!!!  ~Gandalf
     }
     return result;
  });

  Meteor.publish("findAllResources", function(){
    return Resources.find({});
  });

  Meteor.publish('findAllPosts', function(){
    return Posts.find({});
  });

  Meteor.publish('findAllAnnouncementsAtMyCentre', function(){
    var myCentre = Roles.getGroupsForUser(this.UserId);
    return Announcements.find({centre: myCentre[0]});
  });

  Meteor.users.deny({
    'update': function() {
      if (isAdmin(Meteor.userId)) {
          return false;
      } else {
        return true;
      }
    },
    'remove': function(){
      if (isAdmin(Meteor.userId)) {
          return false;
      } else {
        return true;
      }
    }
  });


  Bookings.allow({
    'insert': function (userId, doc) {
      /* user and doc checks ,
      return true to allow insert */
      if (Meteor.userId) { //I can create new bookings if logged in as a YDC user of any type
        return true;
      } else {
        return false;
      }
    },
    'update': function (userId, doc) {
      if (Meteor.userId) { //I can alter any bookings if logged in as a YDC user of any type
        return true;
      } else {
        return false;
      }
    },
    'remove': function (userId, doc) { //I can delete any bookings if logged in as a YDC user of any type
      if (Meteor.userId) {
        return true;
      } else {
        return false;
      }

    }
  });

  Courses.allow({
    'insert': function (userId,doc) {
      var mayInsert = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayInsert = true;
      }
      return mayInsert;
  },
    'update': function (userId,doc) {
      var mayUpdate = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayUpdate = true;
      }
      return mayUpdate;
  },
    'remove': function (userId,doc) {
      var mayRemove = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayRemove = true;
      }
      return mayRemove;
  }
  });

  Resources.allow({
    'insert': function(userId, doc){
      var mayInsert = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayInsert = true;
      }
      return mayInsert;
    },
    'update': function (userId,doc) {
      var mayUpdate = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayUpdate = true;
      }
      return mayUpdate;
    },
    'remove': function (userId,doc) {
      var mayRemove = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayRemove = true;
      }
      return mayRemove;
    }
  });

  Posts.allow({
    'insert': function(userId, doc){
      var mayInsert = isAdmin(userId);
      return mayInsert;
    },
    'update': function (userId,doc) {
      var mayUpdate = isAdmin(userId);
      return mayUpdate;
    },
    'remove': function (userId,doc) {
      var mayRemove = isAdmin(userId);
      return mayRemove;
    }
  });

  Images.allow({
    'insert': function(userId, doc){
      var mayInsert = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayInsert = true;
      }
      return mayInsert;
    },
    'update': function (userId,doc) {
      var mayUpdate = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayUpdate = true;
      }
      return mayUpdate;
    },
    'remove': function (userId,doc) {
      var mayRemove = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayRemove = true;
      }
      return mayRemove;
    }
  });

  Documents.allow({
    'insert': function(userId, doc){
      var mayInsert = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayInsert = true;
      }
      return mayInsert;
    },
    'update': function (userId,doc) {
      var mayUpdate = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayUpdate = true;
      }
      return mayUpdate;
    },
    'remove': function (userId,doc) {
      var mayRemove = false;
      if(isClinician(userId) || isAdmin(userId)){
        mayRemove = true;
      }
      return mayRemove;
    }
  });

/*
  Announcements.allow({
    'insert': function(userId, doc){
      var mayInsert = false;
      if(isAdmin(userId)){
        mayInsert = true;
      }
      return mayInsert;
    },
    'update': function (userId, doc) {
      var mayUpdate = false;
      if(isAdmin(userId)){
        mayUpdate = true;
      }
      return mayUpdate;
    },
    'remove': function (userId, doc) {
      var mayRemove = false;
      if(isAdmin(userId)){
        mayRemove = true;
      }
      return mayRemove;
    }
  });
  */

  //private functions

  function isAdmin(userId){
    var isAdmin = false;
    if ((Roles.userIsInRole(userId,['admin'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'UHL'))) {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
    return isAdmin;
  }

  function isClinician(userId){
    var isClinician = false;
    if ((Roles.userIsInRole(userId,['clinician'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'UHL'))) {
      isClinician = true;
    } else {
      isClinician = false;
    }
    return isClinician;
  }

  function isSchool(userId){
    var isClinician = false;
    if ((Roles.userIsInRole(userId,['school'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['school'],'UHL'))) {
      isClinician = true;
    } else {
      isClinician = false;
    }
    return isClinician;
  }
