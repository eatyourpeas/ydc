import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { deleteCourse } from '/imports/api/courses/methods.js';

Template.modalDeleteCourse.events({
  'click #deleteCourse': function(){
    var selectedCourse = Session.get('selectedCourseForDelete');

    const course = {
      _id: selectedCourse
    }

    deleteCourse.call(course, function(error){
      if (error) {
        Session.set('alert_class', 'alert alert-warning');
        Session.set('alert_message', error.message);
        Session.set('alert_visible', true);
      } else {
        Session.set('alert_class', 'alert alert-success');
        Session.set('alert_message', 'Course deleted.');
        Session.set('alert_visible', true);
        Modal.hide('modalDeleteCourse');
      }
    });
  }
});
