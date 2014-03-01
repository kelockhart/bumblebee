
define(['backbone', 'underscore', 'jquery'], function(Backbone, _, $) {


  var ApiQuery = Backbone.Model.extend({

    // we allow only strings and numbers; instead of sending
    // signal we throw a direct error
    _validate: function(attributes, options) {
      // check we have only numbers and/or finite numbers
      for (attr in attributes) {
        if (!_.isString(attr)) {
          throw new Error('Keys must be strings, not: ' + attr);
        }
        // remove empty strings
        var tempVal = attributes[attr];

        if (!_.isArray(tempVal)) {
          throw new Error('Values were not converted to an Array');
        }

        tempVal =_.compact(tempVal);
        if (_.isEmpty(tempVal)) {
          throw new Error('Empty values not allowed');
        }

        if (!(_.every(tempVal, function(v) {
          return _.isString(v) || (_.isNumber(v) && !_.isNaN(v))}))) {
          throw new Error('Invalid value: ' + tempVal);
        }

        attributes[attr] = tempVal;
      }
      return true;
    },

    // Every value is going to be multi-valued by default
    // in this way we can treat all objects in the same way
    set: function(key, val, options) {
      var attrs;

      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      for (attr in attrs) {
        var tempVal = attrs[attr];

        // convert to array if necessary
        if (!(_.isArray(tempVal))) {
          attrs[attr] = _.compact([tempVal]);
        }
      }

      Backbone.Model.prototype.set.call(this, attrs, options);
    },

    // synchronization is disabled
    sync: function() {
      throw Error("ApiQuery cannot be saved to server");
    },

    // instead of url, we provide the complete url parameters that define
    // this query (by default, all params are used and sorted) but this
    // implementation doesn't do anything fancy with them
    url: function() {
      return $.param(this.attributes, true); // use traditional encoding
    },

    // re-construct the query from the url string, returns the json attributes
    parse: function(resp, options) {
      if (_.isString(resp)) {
        var attrs  = {};
        resp = decodeURIComponent(resp);
        var hashes = resp.slice(resp.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          if (attrs[hash[0]] !== undefined) {
            attrs[hash[0]].push(hash[1]);
          }
          else {
            attrs[hash[0]] = [ hash[1] ];
          }
        }
        return attrs;
      }
      return resp; // else return resp object
    }

  });

  return ApiQuery;
});
