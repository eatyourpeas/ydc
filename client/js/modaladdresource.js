import { FilesCollection } from 'meteor/ostrio:files';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

chosenCategories = [];

Template.modalAddResource.events({
  'submit #newresourceform': function(event, template){

    var document_title = event.target.document_title.value;
    var clinic = event.target.clinic.value;
    var description = event.target.description.value;
    var document_id = Session.get('document_id');
    var myChosenCategories = template.categoriesChosen.get("chosenCategories");

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

    Resources.insert({
      file_date: Date.now(),
      file_summary: description,
      file_clinic: clinic,
      file_category: myChosenCategories,
      file_id: document_id,
      file_title: document_title
    });

  },
  'change #category': function(event, template){
    if (!_.contains(chosenCategories, event.target.value) && (event.target.value != 'NoSelection')) {
      chosenCategories.push(event.target.value);
      template.categoriesChosen.set("chosenCategories", chosenCategories);
    }
    template.categorySelected.set(event.target.value);
  },
  'click categoryBadge': function(event, template){
    chosenCategories = template.categoriesChosen.get("chosenCategories");
    chosenCategories = _.without(chosenCategories, event.target.id);
    template.categoriesChosen.set("chosenCategories", chosenCategories);
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
    return Template.instance().categoriesChosen.get("chosenCategories");
  },
  'alertMessage': function(){
    var alertMessage = Template.instance().alertMessage.get();
      return alertMessage;
  }
});

Template.modalAddResource.onCreated(function(){
  this.categorySelected = new ReactiveVar("NoSelection");
  this.categoriesChosen = new ReactiveDict("chosenCategories");
  this.alertMessage = new ReactiveVar("");
});
