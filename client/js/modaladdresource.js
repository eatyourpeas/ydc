import { FilesCollection } from 'meteor/ostrio:files';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { insertResource } from '/imports/api/resources/methods.js';

chosenCategories = [];

Template.modalAddResource.events({
  'submit #newresourceform': function(event, template){

    var document_title = event.target.document_title.value;
    var clinic = event.target.clinic.value;
    var description = event.target.description.value;
    var document_id = Session.get('document_id');
    var myChosenCategories = template.categoriesChosen.get();

    if (document_title == "") {
      event.preventDefault();
      var message = "You have to add a title.";
      template.alertMessage.set(message);
      $('#successAlert').show();
    }

    if (myChosenCategories.length < 1) {
      event.preventDefault();
      var message = "You have to add at least one category";
      template.alertMessage.set(message);
      $('#successAlert').show()
      return;
    }

    if (clinic == "NoFilter") {
      event.preventDefault();
      var message = "You have to add a clinic";
      template.alertMessage.set(message);
      $('#successAlert').show()
      return;
    }

    if (document_id == "" || document_id == null) {
      event.preventDefault();
      var message = "You have to add a document";
      template.alertMessage.set(message);
      $('#successAlert').show();
      return;
    }

    const newResource = {
      file_date: new Date(),
      file_summary: description,
      file_clinic: clinic,
      file_category: myChosenCategories,
      file_id: document_id,
      file_title: document_title
    }

    insertResource.call(newResource, function(error){
      if (error) {
        Session.set('alert_class', 'alert alert-warning');
        Session.set('alert_message', error.message);
        Session.set('alert_visible', true);
        console.log('hello error '+ error.message);
      } else {
        Session.set('alert_class', 'alert alert-success');
        Session.set('alert_message', 'Resource upload.');
        Session.set('alert_visible', true);
        console.log('hello success');
      }
    });

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
  }
});

Template.modalAddResource.helpers({
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
  'alertMessage': function(){
    var alertMessage = Template.instance().alertMessage.get();
      return alertMessage;
  }
});

Template.modalAddResource.onCreated(function(){
  this.categorySelected = new ReactiveVar("NoSelection");
  this.categoriesChosen = new ReactiveVar();
  this.alertMessage = new ReactiveVar("");
});

Template.modalAddResource.onDestr
