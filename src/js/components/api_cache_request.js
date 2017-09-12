'use strict';
define([
  'underscore',
  'cache',
  'jquery',
  'js/components/api_request',
  'js/components/api_response',
  'js/components/api_query'
], function (_, Cache, $, ApiRequest, ApiResponse, ApiQuery) {

  var VALID_REQUEST_TARGETS = ['search/query'];
  var CYCLE_WAIT = 500;

  var RequestCache = function () {
    this._cache = new Cache({
      maximumSize: 100,
      expiresAfterWrite: 60 * 30 // 30 minutes
    });

    this._validateRequest = function (request) {
      request = (request && request instanceof ApiRequest) ? request : null;
      var query = request && request.get('query');
      var target = request && request.get('target');

      return (

        // check the query
        (query && query instanceof ApiQuery) &&

        // check to make sure we have fields
        (query.get('fl')) &&

        // check the target
        (target && VALID_REQUEST_TARGETS.indexOf(target) > -1)
      );
    };

    this._validateResponse = function (response) {
      response = (response && response instanceof ApiResponse) ? response : null;
      var query = response && response.getApiQuery && response.getApiQuery();

      return (

        // check the query
        (query && query instanceof ApiQuery) &&

        // check to make sure we have fields
        (query.get('fl')) &&

        // check response
        (response)
      );
    };


    this.pendingPutsQueue = [];
    this.pendingGetsQueue = [];

    // waiting for a cycle to begin
    this.lock = true;

    // starts up an interval
    this._cycleInterval = setInterval(_.bind(function () {
      this.lock = false;

      var entries = [];
      if (this.pendingPutsQueue.length > 0) {

        entries = this.createEntries(this.pendingPutsQueue);

        _.forEach(entries, _.bind(this._put, this));
      }

      if (this.pendingGetsQueue.length > 0) {

        entries = this.createEntries(this.pendingGetsQueue);

        _.forEach(entries, _.bind(this._get, this));
      }

      this.lock = true;
    }, this), CYCLE_WAIT);
  };

  RequestCache.prototype.destroy = function () {
    clearInterval(this._cycleInterval);
    this._cycleInterval = null;
  };

  RequestCache.prototype._createEntry = function (response, promise) {
    var entry = {
      query: response.getApiQuery(),
      fields: response.getApiQuery().get('fl')[0],
      response: response
    };

  };



















  RequestCache.prototype._createEntry = function (entryObject) {

    var obj = {};
    if (entryObject.response) {
      obj.query = entryObject.response.getApiQuery();
      obj.fields = obj.query.get('fl')[0];
      obj.response = entryObject.response;
      obj.query.unset('fl');
      obj.url = obj.response.url();
    } else if (entryObject.request) {
      obj.query = entryObject.request.get('query');
      obj.fields = obj.query.get('fl')[0];
      obj.request = entryObject.request;
      obj.query.unset('fl');
      obj.url = obj.request.url();
    }

    obj.promise = entryObject.promise;

    return obj;
  };

  RequestCache.prototype.createEntries = function (requests) {
    return _.map(requests, this._createEntry);
  };

  RequestCache.prototype.put = function (response) {
    if (!this._validateResponse(response) ) {
      return false;
    }

    // create a new deferred object
    var deferred = $.Deferred();

    // push the request onto the queue
    this.pendingPutsQueue.push({
      response: response,
      promise: deferred
    });

    // return a promise
    return deferred.promise();
  };

  RequestCache.prototype.get = function (request) {
    if (!this._validate(request) ) {
      return false;
    }

    // create a new deferred object
    var deferred = $.Deferred();

    // push the request onto the queue
    this.pendingGetsQueue.push({
      request: request,
      promise: deferred
    });

    // return a promise
    return deferred.promise();
  };

  RequestCache.prototype._put = function (entry) {

    console.log('PUTTING: ', entry);
    this._cache.put(entry.url, entry.response);
  };

  RequestCache.prototype._get = function (entry) {

    console.log('GETTING: ', entry);
    this._cache.get(entry.url, function (data) {
      entry.promise.resolve(data);
    });
  };

  return RequestCache;
});
