Accounts.ui.config({
    requestPermissions: {},
    forceEmailLowercase: true,
    extraSignupFields: [{
        fieldName: 'name',
        fieldLabel: 'First Name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please enter your first name");
            return false;
          } else {
            return true;
          }
        }
        }, {
        fieldName: 'clinic',
        fieldLabel: 'Clinic',
        inputType: 'select',
        showFieldLabel: true,
        empty: 'Please select your diabetes clinic',
        data: [{
            id: 1,
            label: 'Evelina London Children\'s Hospital',
            value: 'ELCH'
          }, {
            id: 2,
            label: 'King\'s College Hospital',
            value: 'KCH'
          }, {
            id: 3,
            label: 'Princess Royal University Hospital',
            value: 'PRUH',
          }, {
            id: 4,
            label: 'University Hospital Lewisham',
            value: 'UHL',
          }],
          saveToProfile: false,
          validate: function(value, errorFunction) {
              if (value) {
                  return true;
              } else {
                  errorFunction('You must select a clinic.');
                  return false;
              }
          },
        visible: true
    }, {
        fieldName: 'terms',
        fieldLabel: "I accept the terms and conditions.<a href='termsandconditions' style='font-style: italic; text-decoration: underline; font-size: 1.0em;'>terms and conditions</a>",
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false,
        validate: function(value, errorFunction) {
            if (value) {
                return true;
            } else {
                errorFunction('You must accept the terms and conditions.');
                return false;
            }
        }
    }]
});
