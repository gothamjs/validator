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

## How to compile source files 

In the root of the project, execute that : 

```
coffee --compile --watch --output dist/ src/
```

## Tests 
Test are written with Qunit, just launch with your browser the file ```tests/index.html```
