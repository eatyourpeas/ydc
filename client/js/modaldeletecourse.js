import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { deleteCourse } from '/imports/api/courses/methods.js';

Template.modalDeleteCourse.events({
  'click #deleteCourse': function(){
    var selectedCourse = Session.get('selectedCourseForDelete');

    /*
    Meteor.call('deleteCourse', selectedCourse, function(error, result) {
      if (error) {
        alert(error);
      } else {
        if (result) {
          console.log('course deleted');
        } else {
          console.log('failed to delete course');
        }
      }
    });
    */

    const course = {
      _id: selectedCourse
    }

    deleteCourse.call(course, function(error){
      if (error) {
        console.log(error.message);
      } else {
        console.log("course removed");
        Modal.hide('modalDeleteCourse');
      }
    });
  }
});
