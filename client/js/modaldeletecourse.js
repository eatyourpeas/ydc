import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalDeleteCourse.events({
  'click #deleteCourse': function(){
    var selectedCourse = Session.get('selectedCourseForDelete');
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
    Modal.hide('modalDeleteCourse');
  }
});
