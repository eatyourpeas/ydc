import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.modalEditResource.onCreated(function(){
  this.clinicSelected = new ReactiveVar("ELCH");
  this.categorySelected = new ReactiveVar("Guideline");
});

Template.modalEditResource.helpers({
  'selectedResource': function(){
    var selectedResource = Session.get('selectedResource');
    var returnResource = Resources.findOne(selectedResource);
    Template.instance().clinicSelected.set(returnResource.file_clinic);
    Template.instance().categorySelected.set(returnResource.file_category);
    return returnResource;
  },
  'selectedClinic': function(clinicOption){
    if (clinicOption == Template.instance().clinicSelected.get()) {
      return 'selected';
    } else {
      return '';
    }
  },
  'categoryOptions': function(){
    return [{value: "Medical/Nursing", text: "Medical/Nursing"}, {value: "Dietetic", text: "Dietetic"}, {value: "Psychology", text: "Psychology"}, {value: "School", text: "School"}, {value: "Transition/Young Adult", text: "Transition/Young Adult"}, {value: "DUKLands", text: "DUKLands"}];
  },
  'selectedCategory': function(categoryOption){
    if (categoryOption == Template.instance().categorySelected.get()) {
      return 'selected';
    } else {
      return '';
    }
  },
  'fileNameForResource': function(file_id){
    var image = Images.findOne(file_id);
    return image.name;
  }

});

Template.modalEditResource.events({
  'change #clinic': function(event, template){
    template.clinicSelected.set(event.target.value);
  },
  'change #category': function(event, template){
    template.categorySelected.set(event.target.value);
  },
  'submit #editresourceform': function(event, template){
    var selectedResource = Session.get('selectedResource');
    var category = template.categorySelected.get();
    var clinic = template.clinicSelected.get();
    var description = event.target.description.value;
    var document_title = event.target.document_title.value;

    Meteor.call('updateResource', selectedResource, category, clinic, description, document_title, function(error, result){
      if (error) {
        console.log(error);
      } else {
        if (result) {
          console.log('updated resource');
        } else {
          console.log('failed to update resource');
        }
      }
    })

  }
})
