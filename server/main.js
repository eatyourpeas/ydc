import { Meteor } from 'meteor/meteor';

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
    if (isAdmin(Meteor.user())) {
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
  deleteBooking: function(booking_id){
    Bookings.remove({_id: booking_id});
  },
  deleteCourse: function(course_id){
    Courses.remove({_id:course_id});
  },
  deleteUser: function(user_id){
    if (isAdmin(Meteor.user())) {
      Meteor.users.remove({_id: user_id});
      return true;
    } else {
      return false;
    }
  },
  deletePost: function(post_id){
    var post = Posts.findOne(post_id);
    Images.remove({_id: post.post_image});
    Posts.remove({_id: post_id});
  },
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
    Images.remove({_id: image_id});
  },
  deleteDocuments: function(document_id){
    Documents.remove({_id: document_id});
  },
  deleteResource: function(resource_id){
    var this_resource = Resources.findOne(resource_id);
    var document_id = this_resource.file_id;
    Resources.remove({_id: resource_id});
    Documents.remove({_id:document_id});
  },
  deleteAnnouncement: function(announcement_id){
    Announcements.remove({_id: announcement_id});
  },
  documentForResource: function(document_id){
    return Documents.findOne(document_id);
  },
  imageForPost: function(post_id){
    var this_post = Posts.findOne(post_id);
    var image_id = this_post.post_image;
    return Images.findOne(image_id).cursor;
  },
  'totalBookingsForCourse_id': function(course_id){

    console.log(Bookings.find({booking_validated: true, course: course_id}).fetch());
    var me = Bookings.aggregate(
      {$match: { booking_validated: 'true', course_id: course_id } },
      {$group: {_id: {course: '$course_id'}, total: { $sum: '$places_booked' } } }
    );
    console.log(me);
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
    var result = [];
    if (Roles.userIsInRole(this.userId, 'admin', 'KCH')||Roles.userIsInRole(this.userId, 'clinician', 'KCH')) {
         result = Bookings.find({}); //protected - accessible only by clinicians or admin
    } else {
         this.stop();
         // YOUUU SHALL NOT.... PASS!!!  ~Gandalf
    }
    return result;
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
  })

  Meteor.users.deny({
    'update': function() {
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
