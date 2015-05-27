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

    # Each errors found
    @_errors = {}

    # Messages for errors
    @_messages = {}

    # Humanify attributes (Ex. user[email] -> email)
    @_attributes = {}


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
  # Errors
  #
  # @param [String] Type request (Ex. all)
  # @param [String] Attribute to fetch (opt)
  # 
  # @example 
  #
  # validation = new Validator()
  # validation.errors('all') # return all errors found
  # validation.errors('first', 'email') # return first error for the attribute email
  ##
  errors: () ->

    # Just return all errors
    return @_errors

    ###
    switch type

      when 'first'

        if @_errors[attribute]?

          return _.first(@_errors[attribute])

      when 'last'

        if @_errors[attribute]

          return _.last(@_errors[attribute])

      when 'all'

        errors = []

        _.each @_errors, (attributes) =>

          for error in attributes

            errors.push error

        return errors
        
      when 'get'

        if @_errors[attribute]?

          return @_errors[attribute]
    ###
    
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
  error: (rule, message) ->

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
  attributes: (attributes) ->

    _.each attributes, (attribute, index) =>

      @_attributes[index] = attribute


  ##
  # Run
  #
  # Called by make(), run the validation system
  #
  ##
  _run: ->

    for input, rule of @_rulesToValidate

      for index, value of rule

        if Validator._rules[index]? and @_datasToValidate[input]?

          result = Validator._rules[index](input, @_datasToValidate[input], value, @_datasToValidate)
          unless result

            @_success = false

            if @_messages[index]?
              error = @_createErrorMessage(@_messages[index], input, value)
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
  # 
  ##
  _createErrorMessage: (string, attribute, value) ->

    if @_attributes[attribute]?

      attribute = @_attributes[attribute]

    string = string.split(':attribute').join(attribute)


    if value?

      unless value.indexOf(',') is -1

        string = string.split(':options').join(value.join(', '))

      else

        string = string.split(':options').join(value)

      for option, index in value

        string = string.split(':option' + index).join(option)

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

        parsed[rule] = {}

    return parsed