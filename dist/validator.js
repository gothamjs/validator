// Generated by CoffeeScript 1.8.0
(function() {
  this.Validator = (function() {
    Validator._rules = {};

    Validator._messages = {};

    Validator._attributes = {};

    function Validator() {
      this._rulesToValidate = {};
      this._datasToValidate = {};
      this._success = true;
      this._errors = {};
      this.errors = {
        all: (function(_this) {
          return function() {
            return _this._errors;
          };
        })(this),
        first: (function(_this) {
          return function(field) {
            return _this._errors[field][0];
          };
        })(this),
        get: (function(_this) {
          return function(field) {
            return _this._errors[field];
          };
        })(this),
        has: (function(_this) {
          return function(field) {
            if (field in _this._errors) {
              return true;
            }
            return false;
          };
        })(this)
      };
    }

    Validator.prototype.make = function(datas, rules) {
      var index, value;
      this._errors = {};
      this._datasToValidate = datas;
      for (index in rules) {
        value = rules[index];
        if (value !== '') {
          this._rulesToValidate[index] = this._parseParams(value);
        }
      }
      return this._run();
    };

    Validator.prototype.passes = function() {
      return this._success;
    };

    Validator.prototype.fails = function() {
      if (!this._success) {
        return true;
      }
      return false;
    };

    Validator.error = function(rule, message) {
      return this._messages[rule] = message;
    };

    Validator.errors = function(messages) {
      var message, rule, _results;
      _results = [];
      for (rule in messages) {
        message = messages[rule];
        _results.push(this._messages[rule] = message);
      }
      return _results;
    };

    Validator.rule = function(name, callback) {
      return this._rules[name] = callback;
    };

    Validator.attributes = function(attributes) {
      var attribute, index, _results;
      _results = [];
      for (index in attributes) {
        attribute = attributes[index];
        _results.push(Validator._attributes[index] = attribute);
      }
      return _results;
    };

    Validator.attribute = function(key, value) {
      return Validator._attributes[key] = value;
    };

    Validator.prototype._run = function() {
      var error, index, input, result, rules, value, _ref, _results;
      _ref = this._rulesToValidate;
      _results = [];
      for (input in _ref) {
        rules = _ref[input];
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (index in rules) {
            value = rules[index];
            if ((Validator._rules[index] != null) && (this._datasToValidate[input] != null)) {
              result = Validator._rules[index](input, this._datasToValidate[input], value, this._datasToValidate);
              if (!result) {
                this._success = false;
                if (Validator._messages[index] != null) {
                  error = this._createErrorMessage(Validator._messages[index], input, value);
                } else {
                  error = '[Rule ' + index + '] No error message for this rule';
                }
                if (this._errors[input] != null) {
                  _results1.push(this._errors[input].push(error));
                } else {
                  _results1.push(this._errors[input] = [error]);
                }
              } else {
                _results1.push(void 0);
              }
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Validator.prototype._createErrorMessage = function(string, attribute, value) {
      var index, option, _i, _len;
      if (Validator._attributes[attribute] != null) {
        attribute = Validator._attributes[attribute];
      }
      string = string.split(':attribute').join(attribute);
      if (value.length > 0) {
        if (value.indexOf(',') !== -1) {
          string = string.split(':values').join(value.join(', '));
        } else {
          string = string.split(':values').join(value);
        }
        for (index = _i = 0, _len = value.length; _i < _len; index = ++_i) {
          option = value[index];
          string = string.split(':value' + (index + 1)).join(option);
        }
      }
      return string;
    };

    Validator.prototype._parseParams = function(str) {
      var attribute, options, parsed, rule, rules, _i, _len;
      parsed = {};
      rules = str.split('|');
      for (_i = 0, _len = rules.length; _i < _len; _i++) {
        rule = rules[_i];
        if (rule.indexOf(':') !== -1) {
          attribute = rule.split(':');
          parsed[attribute[0]] = [attribute[1]];
          if (attribute[1].indexOf(',') !== -1) {
            options = attribute[1].split(',');
            parsed[attribute[0]] = options;
          }
        } else {
          parsed[rule] = [];
        }
      }
      return parsed;
    };

    return Validator;

  })();

}).call(this);
