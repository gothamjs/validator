module('Pre-Test');

test("Can mount rules", 3, function() {

  Validator.rule('required', function() {});

  deepEqual(typeof Validator._rules['required'], "function", "The rule required mounted");

  Validator.rule('email', function() {});

  deepEqual(typeof Validator._rules['email'], "function", "The rule email mounted");

  // We must have 2 rules in the object
  deepEqual(Object.keys(Validator._rules).length, 2, "We have 2 rules");
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

    // Email check
    Validator.rule('email', function(attribute, value, params) {

      valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return valid_email.test(value);

    });

    // Boolean check
    Validator.rule('boolean', function(attribute, value, params) {

      if (value === true || value === false) {
        return true;
      }

      return false;


    });

    // Size
    Validator.rule('size', function(attribute, value, params) {

      if (value.length != params[0]) {
        return false;
      }

      return true;

    });

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
      "required": {},
      "email": {}
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


