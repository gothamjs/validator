## Validator

Strings validation in javascript for the browser.

> Note : Validator class doesn’t come with any default validation rules. You must create your own.

## Installation 
```
bower install --save gotham-validator
```

## Examples 

### Simple example
```html
<!DOCTYPE html>
<html>
<head>
    <title>Demo Validator</title>
    
    <!-- Include library -->
    <script src="bower_components/validator/dist/validator.js"></script>
</head>
<body>
    <script>
        // We create the rule email
        Validator.rule('email', function(attribute, value, params) {
            if (value === 'batman@gotham.io' || value === 'robin@gotham.io')
            {
                return true;
            } else {
                return false;
            }
        });
        
        // We create an error message for that rule
        Validator.error('email', 'The :attribute isn\'t a valid email');
        
        // We set some datas to validate
        datas = {
            "user_email": "joker@gotham.io"
        };
        
        // We set some rules for the datas
        rules = {
            "user_email": "email"
        };
        
        // Perform validation
        validation = new Validator();
        validation.make(datas, rules);
        
        // Check if validation fails (in that case it will fails)
        if (validation.fails())
        {
            // Will display : "The user_email isn't a valid email"
            console.log(validation.errors.first('user_email');
        }
    </script>
</body>
```

### Example with rule with params
```html
<!DOCTYPE html>
<html>
<head>
    <title>Demo Validator</title>
    
    <!-- Include library -->
    <script src="bower_components/validator/dist/validator.js"></script>
</head>
<body>
    <script>
        // We create a new rule
        Validator.rule('between', function (attribute, value, params) {
          length = value.toString().length
          
          if (length >= params[0] && length <= params[1])
          {
            return true
          }
          
          return false
        });
            
        // We create an error message for that rule
        Validator.error('between', 'The size of :attribute must be between :value1 and :value2');
        
        // We set some datas to validate
        datas = {
            "username": "jeremie"
        };
        
        // We set some rules for the datas
        rules = {
            "username": "size:20,25"
        };
        
        // Perform validation
        validation = new Validator();
        validation.make(datas, rules);
        
        // Check if validation fails (in that case it will fails)
        if (validation.fails())
        {
            // Will display : "The username must be between 20 and 25"
            console.log(validation.errors.first('username');
        }
    </script>
</body>
```

## API

####```rule(name, callback)```
Add a new rule in the Validator class. The callback must return ```true``` or ```false```

```javascript
Validator.rule('size', function(attribute, value, params) {
    size = value.toString().length;
    
    if (size === params[0])
    {
        return true;
    } else {
        return false;
    }
    
});
```

####```attribute(key, value)```
Will replace in the error messages the attribute by the new value.

```javascript
Validator.attribute('user[email]', 'email');
```

####```attributes(attributes)```
Like attribute() method but for a bunch of attributes.

```javascript
Validator.attribures({
  "user[name]": "name",
  "user_email": "email",
  "user[password]": "password"
});
```

####```make(datas, rules)```
Perform the validation.

```javascript
datas = {
  "email": "batman@gotham.io",
  "name": "batman"
};

rules = {
  "email": "required|email",
  "name": "required|between:5,26"
};

validation = new Validator();

validation.make(datas, rules);
```

####```passes()```
Check if the validation passed

```javascript
if (validation.passes()) {
  console.log("Yes !");
}
```

####```fails()```
Check if the validation failed

```javascript
if (validation.fails()) {
  console.log("Nop :(");
}
```

####```error(rule, message)```
Add a template error for a rule

```javascript
Validator.error('between', 'The size of :attribute must be between :value1 and :value2 of length');
```

####```errors(messages)```
Add some template errors for the rules

```javascript
Validator.errors({
  required: 'The :attribute is required',
  between: 'The size of :attribute must be between :value1 and :value2 of length'
});
```



####```errors.all()```
Return all messages errors

```javascript
console.log(validation.errors.all());
```

####```errors.first(field)```
Return the first error for the field given

```javascript
console.log(validation.errors.first('username'));
```

####```errors.get(field)```
Return all errors for the field given

```javascript
console.log(validation.errors.get('password'));
```

####```errors.has(field)```
Determining if messages exist for a field

```javascript
if (validation.errors.has('password'))
{
  console.log(validation.error.get('password'));
}
```

## How to compile source files 

In the root of the project, execute that : 

```
coffee --compile --watch --output dist/ src/
```

## Tests 
Test are written with Qunit, just launch with your browser the file ```tests/index.html```
