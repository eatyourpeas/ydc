import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

    /* if users database is empty, seed these values
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
            name: d.name
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
  
  deleteBooking: function(booking_id){
    Bookings.remove({_id: booking_id});
  },
  deleteCourse: function(course_id){
    Courses.remove({_id:course_id});
  },
  deleteUser: function(user_id){
    Meteor.users.remove({_id: user_id});
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
    console.log('course_id: ' + course_id);
    console.log(Bookings.find({booking_validated: true, course: course_id}).fetch());
    var me = Bookings.aggregate(
      {$match: { booking_validated: 'true', course_id: course_id } },
      {$group: {_id: {course: '$course_id'}, total: { $sum: '$places_booked' } } }
    );
    console.log(me);
  }
});

Accounts.onCreateUser((options, user) => {
  /*
    var admin = false;
    var clinician = false;

      if (options.profile.admin) {
        admin = true;
      }
      if (options.profile.clinician) {
        clinician = true;
      }
      if (options.profile.school) {
        school = true;
      }

      user.emails[0].verified = true;
      user.clinic = options.clinic;
      user.profile = options.profile;
      user.profile.clinician = clinician;
      user.profile.admin = admin;

      return user;
      */
});

Meteor.users.after.insert(function(userId, doc){
/*
  //after new user created, add to role
  if (doc.profile.clinician) {
    Roles.addUsersToRoles(doc._id, "clinician", doc.clinic);
  } else if (doc.profile.parent || (!doc.profile.clinician && !doc.profile.admin && !doc.profile.school)) {
    Roles.addUsersToRoles(doc._id, "parent", doc.clinic);
  }
  if (doc.profile.admin) {
    Roles.addUsersToRoles(doc._id, "admin", doc.clinic);
  }
  if (doc.profile.school) {
    Roles.addUsersToRoles(doc._id, "school", doc.clinic);
  }
  */
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

  Meteor.users.allow({
    update: function() {
      if (isAdmin(Meteor.userId)) {
        console.log('I am logged in as admin');
          return true;
      } else {
        console.log('iamnotadmin');
        return false;
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
        console.log('i cannot update bookings');
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
    'update': function (userId,doc) {
      var mayUpdate = false;
      if(isAdmin(userId)){
        mayUpdate = true;
      }
      return mayUpdate;
    },
    'remove': function (userId,doc) {
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
    if ((Roles.userIsInRole(Meteor.userId(),['admin'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['admin'],'UHL'))) {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
    return isAdmin;
  }

  function isClinician(userId){
    var isClinician = false;
    if ((Roles.userIsInRole(Meteor.userId(),['clinician'],'KCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'ELCH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'PRUH'))||(Roles.userIsInRole(Meteor.userId(),['clinician'],'UHL'))) {
      isClinician = true;
    } else {
      isClinician = false;
    }
    return isClinician;
  }
