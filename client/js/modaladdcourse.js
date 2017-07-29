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

    Meteor.call('createCourse', course, startdate.toDate(), enddate.toDate(), selectedClinic, address, course_places, function(error, result){
      if (error) {
        console.log(error);
      } else {
        if (result) {
          console.log('course created');
        } else {
          console.log('course failed to create');
        }
      }
    });
  },
  'change #clinic': function(event, template){
    var clinic = event.target.value;
    template.selectedClinic.set(clinic);
  }
});
