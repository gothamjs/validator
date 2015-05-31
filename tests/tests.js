module('Pre-Test');

test("Can mount rules", 2, function() {

  Validator.rule('required', function() {});

  deepEqual(typeof Validator._rules['required'], "function", "The rule required mounted");

  Validator.rule('email', function() {});

  deepEqual(typeof Validator._rules['email'], "function", "The rule email mounted");

  Validator._rules = {};
});

test("Can mount an error", 2, function() {

  Validator.error('required', 'The :attribute is required');
  Validator.error('email', 'The :attribute must be an email');

  deepEqual(Validator._messages['required'], 'The :attribute is required');
  deepEqual(Validator._messages['email'], 'The :attribute must be an email');

  Validator._messages = {};

});


test("Can mount a couple of errors", 2, function() {

  Validator.errors({
    required: 'The :attribute is required',
    email: 'The :attribute must be an email'
  });

  deepEqual(Validator._messages['required'], 'The :attribute is required');
  deepEqual(Validator._messages['email'], 'The :attribute must be an email');

  Validator._messages = {};

});

test("Can mount attributes", 2, function() {

  Validator.attributes({
    "user[email]": "email",
    "user[name]": "name"
  });

  deepEqual(Validator._attributes['user[email]'], 'email');
  deepEqual(Validator._attributes['user[name]'], 'name');

  // Reset after
  Validator._attributes = {};

});

module('Validator', {

  beforeEach: function() {

    // We create some rules for the tests
    
    // Required check
    Validator.rule('required', function(attribute, value, params) {

      if (value.length === 0 || typeof value === "undefined") {
        return false;
      }

      return true;

    });

    Validator.error('required', 'The :attribute is required');

    //-----------------------------------

    // Email check
    Validator.rule('email', function(attribute, value, params) {

      valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return valid_email.test(value);

    });

    Validator.error('email', 'The :attribute must be an email');

    //-----------------------------------

    // Boolean check
    Validator.rule('boolean', function(attribute, value, params) {

      if (value === true || value === false) {
        return true;
      }

      return false;


    });

    Validator.error('boolean', 'The :attribute must be a boolean');

    //-----------------------------------

    // Size
    Validator.rule('size', function(attribute, value, params) {

      if (value.length != params[0]) {
        return false;
      }

      return true;

    });

    Validator.error('size', 'The size of :attribute must be :values length');

    //-----------------------------------

    // Fake
    Validator.rule('fake', function(attribute, value, params) {

      return false;

    });

    Validator.error('fake', 'It\'s a fake rule to test some values :value1 and :value2 and :value3');

  }

});


test('Must parse correctly the rules to validate', 1, function() {

  datas = {
    "email": "bonjour@gesjeremie.fr",
  };

  rules = {
    "email": "required|email"
  };

  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation._rulesToValidate, {
    "email": {
      "required": [],
      "email": []
    }
  });

});


test('Must parse correctly the options of a rule', 2, function() {

  datas = {
    "name": "jeremie"
  };

  rules = {
    "name": "size:5"
  };

  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation._rulesToValidate, {

    "name": {
      "size": ["5"]
    }

  }, "Single option");


  rules = {
    "name": "size:5,24,38"
  };

  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation._rulesToValidate, {
    "name": {
      "size": ["5","24","38"]
    }
  }, "Multiple options");

});

test('The validation must fails', 1, function() {

  datas = {
    "name": "jeremie"
  };

  rules = {
    "name": "size:5"
  };

  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation._success, false);

});

test('The validation must pass', 1, function() {

   datas = {
    "name": "jeremie",
    "email": "bonjour@gesjeremie.fr"
  };

  rules = {
    "name": "size:7",
    "email": "email"
  };

  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation._success, true);

}); 

test('Must parse correctly the errors', 3, function() {

  datas = {
    "name": "",
    "user[name]": "jeremie",
    "fake": "fake value"
  };

  rules = {
    "name": "required",
    "user[name]": "size:1",
    "fake": "fake:test,other,again"
  };

  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation._errors['name'][0], 'The name is required');
  deepEqual(validation._errors['user[name]'][0], 'The size of user[name] must be 1 length');
  deepEqual(validation._errors['fake'][0], 'It\'s a fake rule to test some values test and other and again')
});

test('Must parse correctly the custom attributes', 2, function() {
    
  Validator.attributes({
    "user[name]": "name"
  });

  Validator.attribute('user[email]', 'email');

  datas = {
    "user[name]": "",
    "user[email]": ""
  };

  rules = {
    "user[name]": "required",
    "user[email]": "required"
  };

  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation._errors['user[name]'][0], 'The name is required');
  deepEqual(validation._errors['user[email]'][0], 'The email is required');

  // Reset attributes
  Validator._attributes = {};

});

test('No problems with errors', 9, function() {

  datas = {
    "email": "",
    "name": ""
  };

  rules = {
    "email": "required|email",
    "name": "required|size:5"

  };
  
  validation = new Validator();

  validation.make(datas, rules);

  deepEqual(validation.errors.all(), {
    "email": ['The email is required', 'The email must be an email'],
    "name": ['The name is required', 'The size of name must be 5 length']
  });

  deepEqual(validation.errors.first('email'), 'The email is required');
  deepEqual(validation.errors.first('name'), 'The name is required');

  deepEqual(validation.errors.get('email'), ['The email is required', 'The email must be an email']);
  deepEqual(validation.errors.get('name'), ['The name is required', 'The size of name must be 5 length']);

  deepEqual(validation.errors.has('name'), true);
  deepEqual(validation.errors.has('email'), true);
  deepEqual(validation.errors.has('fake'), false);

  // If i re run a new validation, errors must be flushed
  datas = {
    "email": "bonjours@gesjeremie.fr"
  };

  rules = {
    "email": "email"
  };

  validation2 = new Validator();
  validation2.make(datas, rules);

  deepEqual(validation2.errors.all(), {});


});
