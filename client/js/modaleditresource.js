import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { updateResource } from '/imports/api/resources/methods.js';
import { Resources } from '/imports/api/resources/resources';
import { Documents } from '/imports/api/documents/documents';

chosenCategories = [];

Template.modalEditResource.onCreated(function(){
  this.clinicSelected = new ReactiveVar("ELCH");
  this.categorySelected = new ReactiveVar("NoSelection");
  this.categoriesChosen = new ReactiveVar();
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
  'resourceCategories': function(){
    var categories = [{value: "Medical/Nursing", text: "Medical/Nursing"}, {value: "Dietetic", text: "Dietetic"}, {value: "Psychology", text: "Psychology"}, {value: "School", text: "School"}, {value: "Transition/Young Adult", text: "Transition/Young Adult"}, {value: "DUKLands", text: "DUKLands"}];
    return categories;
  },
  'selectedCategory': function(categoryOption){
    if (categoryOption == Template.instance().categorySelected.get()) {
      return 'selected';
    } else {
      return '';
    }
  },
  'chosenCategories': function(){
    return Template.instance().categoriesChosen.get();
  },
  'fileNameForResource': function(file_id){
    var document = Documents.findOne(file_id);
    return document.name;
  }

});

Template.modalEditResource.events({
  'change #clinic': function(event, template){
    template.clinicSelected.set(event.target.value);
  },
  'change #category': function(event, template){
    if (!_.contains(chosenCategories, event.target.value) && (event.target.value != 'NoSelection')) {
      chosenCategories.push(event.target.value);
      template.categoriesChosen.set(chosenCategories);
    }
    template.categorySelected.set(event.target.value);
  },
  'click .categoryBadge': function(event, template){
    chosenCategories = template.categoriesChosen.get();
    chosenCategories = _.without(chosenCategories, event.target.id);
    template.categoriesChosen.set(chosenCategories);
    if (chosenCategories.length < 1) {
      template.categorySelected.set("NoSelection");
    }
  },
  'submit #editresourceform': function(event, template){
    var selectedResource = Session.get('selectedResource');
    var category = template.categorySelected.get();
    var clinic = template.clinicSelected.get();
    var description = event.target.description.value;
    var document_title = event.target.document_title.value;

    const updatedResource = { //cannot update document in resource - have to delete and reupload new one
      file_date: new Date(),
      file_summary: description,
      file_clinic: clinic,
      file_category: category,
      file_title: document_title
    };

    updateResource.call(updateResource,function(error){
      if (error) {
        Session.set('alert_class', 'alert alert-warning');
        Session.set('alert_message', error.message);
        Session.set('alert_visible', true);
      } else {
        Session.set('alert_class', 'alert alert-success');
        Session.set('alert_message', 'Resource updated');
        Session.set('alert_visible', true);
      }
    });
  }
})
