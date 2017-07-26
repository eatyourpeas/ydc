import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.cookies.helpers({
  'cookiesAreEnabled': function(){
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
  	if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
  	{
  		document.cookie="testcookie";
  		cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
  	}

    Template.instance().cookiesAreEnabled.set(cookieEnabled);

    if (cookieEnabled) {
      return "Cookies are Enabled";
    } else {
      return "Cookies are Disabled";
    }
  },
  'cookiesEnabled': function(){
    var cookiesAreEnabled = Template.instance().cookiesAreEnabled.get();
    if (cookiesAreEnabled) {
      return 'Disable Cookies';
    } else {
      return 'Enable Cookies';
    }
  }
});

Template.cookies.events({
  'click #disableenablecookiesbutton': function(event, template){
    var cookiesAreEnabled = template.cookiesAreEnabled.get();
    if (cookiesAreEnabled) {
      navigator.cookieEnabled = "undefined";
    }
    Template.instance().cookiesAreEnabled.set(!cookiesAreEnabled);
  }

});

Template.cookies.onCreated(function(){
  this.cookiesAreEnabled = new ReactiveVar(true);
});
