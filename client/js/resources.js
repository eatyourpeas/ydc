import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FilesCollection } from 'meteor/ostrio:files';
import { Documents } from '/imports/api/documents/documents';
import { Resources } from '/imports/api/resources/resources';


Template.resources.helpers({
  'thereAreResources': function(){
    var numberOfResources = Resources.find({}).count();
    if (numberOfResources > 0) {
      return true;
    } else {
      return false;
    }
  },
  'resources': function(){
    return Resources.find({}).fetch();
  },
  'getDocuments': function(){
    return Documents.find().fetch();
  },
  'thereAreDieteticResources': function(){
    var numberOfResources = Resources.find({}).count();
    if (numberOfResources > 0) {
      return true;
    } else {
      return false;
    }
  },
  'resourceCategories': function(){
    var categories = [{"Medical/Nursing" : "Medical/Nursing"}, {"Dietetic":"Dietetic"}, {"Psychology": "Psychology"}, {"School":"School"}, {"Transition/Young Adult":"Transition/Young Adult"},{"DUKLands":"DUKLands"}];
  },
  'medicalResources': function(){
    return Resources.find({'file_category': {$elemMatch:{'$eq':'Medical/Nursing'}}}, {sort: {'file_name': 1, 'file_date': -1, 'clinic': 1}}).fetch();
  },
  'dieteticResources': function(){
    return Resources.find({'file_category': {$elemMatch:{'$eq':'Dietetic'}}}, {sort: {'file_name': 1, 'file_date': -1, 'clinic': 1}}).fetch();
  },
  'psychologyResources': function(){
    return Resources.find({'file_category': {$elemMatch:{'$eq':'Psychology'}}}, {sort: {'file_name': 1, 'file_date': -1, 'clinic': 1}}).fetch();
  },
  'schoolResources': function(){
    return Resources.find({'file_category': {$elemMatch:{'$eq':'School'}}}, {sort: {'file_name': 1, 'file_date': -1, 'clinic': 1}}).fetch();
  },
  'transitionResources': function(){
    return Resources.find({'file_category': {$elemMatch:{'$eq':'Transition/Young Adult'}}}, {sort: {'file_name': 1, 'file_date': -1, 'clinic': 1}}).fetch();
  },
  'duklandsResources': function(){
    return Resources.find({'file_category': {$elemMatch:{'$eq':'DUKLands'}}}, {sort: {'file_name': 1, 'file_date': -1, 'clinic': 1}}).fetch();
  },
  'resourceForMedicalSelectedId': function(){
    var medicalResource_Id = Template.instance().medicalSelection.get();
    if (medicalResource_Id != null) {
      return Resources.findOne(medicalResource_Id);
    }
  },
  'resourceForDieteticSelectedId': function(){
    var dieteticResource_Id = Template.instance().dieteticSelection.get();
    if (dieteticResource_Id != null) {
      return Resources.findOne(dieteticResource_Id);
    }
  },
  'resourceForPsychologySelectedId': function(){
    var psychologyResource_Id = Template.instance().psychologySelection.get();
    if (psychologyResource_Id != null) {
      return Resources.findOne(psychologyResource_Id);
    }
  },
  'resourceForSchoolSelectedId': function(){
    var schoolResource_Id = Template.instance().schoolSelection.get();
    if (schoolResource_Id != null) {
      return Resources.findOne(schoolResource_Id);
    }
  },
  'resourceForTransitionSelectedId': function(){
    var transitionResource_Id = Template.instance().transitionSelection.get();
    if (transitionResource_Id != null) {
      return Resources.findOne(transitionResource_Id);
    }
  },
  'resourceForDUKLandsSelectedId': function(){
    var duklandsResource_Id = Template.instance().duklandsSelection.get();
    if (duklandsResource_Id != null) {
      return Resources.findOne(duklandsResource_Id);
    }
  }
});

Template.resources.events({
  'click #addResourceButton': function(event){
    Modal.show('modalAddResource');
  },
  'click #editResourceButton': function(event){
    Session.set('selectedResource', this._id);
    Modal.show('modalEditResource');
  },
  'click #deleteResourceButton': function(event){
    Session.set('selectedResource', this._id);
    Modal.show('modalDeleteResource');
  },
  'change #medicalSelect': function(event, template){
    template.medicalSelection.set(event.target.value);
  },
  'change #dieteticSelect': function(event, template){
    template.dieteticSelection.set(event.target.value);
  },
  'change #psychologySelect': function(event, template){
    template.psychologySelection.set(event.target.value);
  },
  'change #schoolSelect': function(event, template){
    template.schoolSelection.set(event.target.value);
  },
  'change #transitionSelect': function(event, template){
    template.transitionSelection.set(event.target.value);
  },
  'change #duklandsSelect': function(event, template){
    template.duklandsSelection.set(event.target.value);
  }
});

Template.resources.onCreated(function(){
  this.medicalSelection = new ReactiveVar("");
  this.dieteticSelection = new ReactiveVar("");
  this.psychologySelection = new ReactiveVar("");
  this.schoolSelection = new ReactiveVar("");
  this.transitionSelection = new ReactiveVar("");
  this.duklandsSelection = new ReactiveVar("");
});
