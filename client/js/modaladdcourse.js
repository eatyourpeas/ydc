import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalAddCourse.onCreated(function(){
  this.selectedClinic = new ReactiveVar("ELCH");
});

Template.modalAddCourse.events({
  'submit form': function(){

    var startdate = $('#startdatetimepicker').data("DateTimePicker").date(); //.date(); //these are moments
    var enddate = $("#enddatetimepicker").data("DateTimePicker").date();
    var address = event.target.address.value;

    var course = event.target.course.value;
    var selectedClinic = Template.instance().selectedClinic.get();

    var currentUser = Meteor.userId();

    var course_places = event.target.course_places.value;

    if (course_places == undefined) {
      course_places = 12;
    }

        //moments must be converted to js date objects before storing in mongo or error is thrown
        Courses.insert({
          course_name: course,
          start_date: startdate.toDate(),
          end_date: enddate.toDate(),
          created_by: currentUser,
          created_at: Date.now(),
          clinic: selectedClinic,
          address: address,
          course_places: course_places
        });

  },
  'change #clinic': function(event, template){
    var clinic = event.target.value;
    template.selectedClinic.set(clinic);
  }
});
