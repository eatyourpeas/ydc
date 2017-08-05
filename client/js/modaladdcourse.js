import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { insertCourse } from '/imports/api/courses/methods.js';

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
    var course_places = parseInt(event.target.course_places.value);


    if (course_places == undefined) {
      course_places = 12;
    }

    const newCourse = {
      course_name: course,
      start_date: startdate.toDate(),
      end_date: enddate.toDate(),
      clinic: selectedClinic,
      address: address,
      course_places: course_places
    }

    insertCourse.call(newCourse, function(error){
      if (error) {
        console.log(error.message);
      }
    });
  },
  'change #clinic': function(event, template){
    var clinic = event.target.value;
    template.selectedClinic.set(clinic);
  }
});
