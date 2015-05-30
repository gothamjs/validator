##
# Validator Class
#
# Strings validation in javascript for the browser
# 
# @author Ges Jeremie <http://www.gesjeremie.fr>
# @copyright Copyright (c) 2014, Ges Jeremie
#
##
class @Validator

  # Rules function to validate datas
  @_rules = {}

  # Custom messages for errors
  @_messages = {}

  # Humanify attributes (Ex. user[email] -> email)
  @_attributes = {}

  ##
  # Constructor
  #
  # Set basic variables
  #
  ##
  constructor: ->

    # Each rules to validate
    @_rulesToValidate = {}

    # Each datas to validate
    @_datasToValidate = {}

    # Flag to know if the datas are valid or not
    @_success = true

    # Each errors found after _run() method called
    @_errors = {}

    @errors =

      all: =>

        return @_errors

      first: (key) =>

        return @_errors[key][0]

      get: (key) =>

        return @_errors[key]

      has: (key) =>

        if key of @_errors

          return true

        return false


  ##
  # Make
  #
  # Perform a validation
  #
  # @param [Object] Datas to validate
  # @param [Object] Rules to perform
  # 
  # @example 
  #
  # validation = new Validator()
  # validation.make({email: 'killme@zombie.com'}, {email: 'required|email'})
  #
  ##
  make: (datas, rules) ->

    # Clean old errors
    @_errors = {}

    # Set datas to validate
    @_datasToValidate = datas

    # Set rules
    for index, value of rules

      if value isnt '' 
        @_rulesToValidate[index] = @_parseParams(value)

    # Run
    @_run()


    
  ##
  # Passes
  #
  # Return true if datas are valid
  # 
  ##
  passes: ->

    return @_success

  ##
  # Fails
  #
  # Return true if datas aren't valid
  # 
  ##
  fails: ->

    unless @_success
      return true

    return false

  ##
  # Error
  #
  # Add a new error for a rule
  #
  # @param [String] Name of the rule (Ex. email)
  # @param [String] Message for this rule (Ex. Field :attribute must be valid)
  # 
  ##
  @error: (rule, message) ->

    @_messages[rule] = message

  ##
  # Rule
  #
  # Add a new rule function in the class
  #
  # @param [String] Name of the rule (Ex. zombie)
  # @param [Function] The function to validate this rule
  # 
  ##
  @rule: (name, callback) ->

    @_rules[name] = callback
  


  ##
  # Attributes
  #
  # Humanify an attribute
  #
  # @param [Object] Attributes to add in the system
  # 
  ##
  @attributes: (attributes) ->

    for index, attribute of attributes

      Validator._attributes[index] = attribute

  ##
  # Attribute
  #
  # Humanify an attribute
  #
  # @param [string] Attribute to replace
  # @param [string] The new value
  # 
  ##
  @attribute: (key, value) ->

    Validator._attributes[key] = value


  ##
  # Run
  #
  # Called by make(), run the validation system
  #
  ##
  _run: ->

    for input, rules of @_rulesToValidate

      for index, value of rules

        if Validator._rules[index]? and @_datasToValidate[input]?

          result = Validator._rules[index](input, @_datasToValidate[input], value, @_datasToValidate)
          unless result

            @_success = false

            if Validator._messages[index]?
              error = @_createErrorMessage(Validator._messages[index], input, value)
            else
              error = '[Rule ' + index + '] No error message for this rule' 

            if @_errors[input]?
              @_errors[input].push(error)
            else
              @_errors[input] = [error]

  ##
  # Create error messages
  #
  # Fetch a string error and parse the :attribute var
  #
  # @param [String] Error string
  # @param [String] Attribute
  # @param [String] Values
  ##
  _createErrorMessage: (string, attribute, value) ->

    # Find if we need to humanify the attribute
    if Validator._attributes[attribute]?

      attribute = Validator._attributes[attribute]

    string = string.split(':attribute').join(attribute)

    if value.length > 0

      unless value.indexOf(',') is -1

        string = string.split(':values').join(value.join(', '))

      else

        string = string.split(':values').join(value)

      for option, index in value

        string = string.split(':value' + (index+1)).join(option)

    return string

  ##
  # Parse params
  #
  # Take a string like "required|email|in:zombie,killer" and create 
  # an object with all rules and the options of the rule
  #
  # @param [String] String to parse
  # 
  ##
  _parseParams: (str) ->

    parsed = {}
    rules = str.split('|')

    for rule in rules

      if rule.indexOf(':') isnt -1

        attribute = rule.split(':')

        parsed[attribute[0]] = [attribute[1]]

        if attribute[1].indexOf(',') isnt -1

          options = attribute[1].split(',')

          parsed[attribute[0]] = options 

      else

        parsed[rule] = []

    return parsed

