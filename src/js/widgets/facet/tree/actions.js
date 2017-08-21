define([
<<<<<<< Updated upstream
  'underscore'
], function (_) {

  var exports = {
    updateQuery: function (query) {
      return {
        type: 'UPDATE_QUERY',
        query: query
      }
    },
    createApiRequest: function (data, cb) {
      return function (dispatch, getState, widget) {
        var prevQ, prevRes;
        var handler = function () {
          var query = getState().query;
          if (query) {
            var pubsub = widget.getPubSub();
            var q = widget.customizeQuery(query);
            q.set('facet.offset', 0);
            q.set('rows', 1);
            q.set('facet.field', data.field);
            q.set('facet.prefix', '0/');
            var req = widget.composeRequest(q);
            if (prevQ && _.isEqual(
                _.flatten(_.toArray(q.toJSON())),
                _.flatten(_.toArray(prevQ.toJSON()))
              )
            ) {
              console.log('reusing response');
              return cb(prevRes);
            }
            prevQ = q;
            pubsub.subscribeOnce(pubsub.DELIVERING_RESPONSE, function (apiResponse) {
              prevRes = apiResponse;
              cb(apiResponse);
            });
            pubsub.publish(pubsub.DELIVERING_REQUEST, req);
          }
          cb(null);
        };
        widget.store.subscribe(handler);
        handler();
      };
    }
  };

  return exports;
=======
  'jquery',
  'underscore'
], function ($, _) {

  var actions = {};

  actions.updateQuery = function (query) {
    return {
      type: 'UPDATE_QUERY',
      query: query
    }
  };

  actions.hasError = function (error, type) {
    return {
      type: 'HAS_ERROR',
      hasError: error
    };
  };

  function SimpleRequestCache() {
    var collection = [];
    var TTL = 1800; // 30 minutes
    var flat = function (val) {
      return _.flatten(_.toArray(val.toJSON()));
    }

    setInterval(function () {
      collection = _.filter(collection, function (entry) {
        return !entry.expire();
      });
      console.log('DOING EXPIRE CHECK', collection);
    }, TTL * 1000);

    // return a found element, otherwise undefined
    this.get = function (query, response) {
      var getFields = function (res) {
        return res.get('facet_counts')['facet_fields'];
      }
      var flatQuery = flat(query);
      var flatResponse = (response) ? getFields(response) : null;
      return _.find(collection, function (entry) {
        if (!response) {
          return _.isEqual(flatQuery, entry.query);
        }
        return _.isEqual(flatQuery, entry.query) &&
          _.isEqual(flatResponse, getFields(entry.response));
      });
    };

    // insert a new entry into the cache
    this.put = function (query, response) {
      if (!this.get(query, response)) {
        collection.push({
          query: flat(query),
          response: response,
          expire: (function () {
            var time = Date.now();
            return function () {
              return (Date.now() - time) / 1000 <= TTL;
            };
          })()
        });
      }
      return this;
    };

    // return the internal collection
    this.getCollection = function () {
      return collection;
    };
  }
  var simpleCache = new SimpleRequestCache();

  /**
   * Create and send a new request based on customizations from components
   * returns a promise
   *
   * @returns {Promise}
   */
  actions.createApiRequest = function (data, cb) {
    return function (dispatch, getState, widget) {
      var state = getState();
      var dfd = $.Deferred();
      var pubsub = widget.getPubSub();

      // start by grabbing the current query
      var currentQuery = state.query;

      // if the query is undefined, reject the promise with an error message
      if (!currentQuery) {
        dfd.reject('Query Not Found');
      }

      // reject if there was an error returned in feedback from the api
      if (state.hasError) {
        dispatch(actions.hasError(false));
        dfd.reject('Error During Request');
      }

      // only send off a request if we are still awaiting a resolution
      if (dfd.state() === 'pending') {

        // attempt to customize the query using data from component
        try {
          var customizedQuery = widget.customizeQuery(currentQuery);
          customizedQuery.set('facet.offset', 0);
          customizedQuery.set('rows', 1);
          customizedQuery.set('facet.field', data.field);
          if (data.hierarchical) {
            customizedQuery.set('facet.prefix', data.title ? '1/' + data.title : '0/');
          }
        } catch (e) {
          dfd.reject('Failed To Customize Query', e);
        }

        // do a quick check to see if we recently cached
        var previous = simpleCache.get(customizedQuery);
        console.log(previous, simpleCache.getCollection());
        if (previous) {
          console.log('REUSING PREVIOUS RESPONSE');
          dfd.resolve(previous.response);
        }

        // do not continue unless we haven't been resolved yet
        if (dfd.state() === 'pending') {
          // create the new request using the shiny new query
          var request = widget.composeRequest(customizedQuery);

          // start a one-time subscription that will listen for the response
          pubsub.subscribeOnce(pubsub.DELIVERING_RESPONSE, function (apiResponse) {
            console.log('recieved response');
            simpleCache.put(customizedQuery, apiResponse);
            dfd.resolve(apiResponse);
          });

          console.log('Sending off request');
          // send off the request to the server
          pubsub.publish(pubsub.DELIVERING_REQUEST, request);
        }
      }

      // return a promise to the callback
      return cb(dfd.promise());
    };
  };





    //   var storeSubscription;
    //   var prevQ;
    //   var onQueryUpdate = _.debounce(function () {
    //     var state = getState();
    //     var query = state.query;
    //     if (state.hasError) {
    //       storeSubscription();
    //       dispatch(actions.hasError(false));
    //       storeSubscription = widget.store.subscribe(onQueryUpdate);
    //       return cb(null, true);
    //     }

    //     if (query) {
    //       var pubsub = widget.getPubSub();
    //       var q = widget.customizeQuery(query);
    //       q.set('facet.offset', 0);
    //       q.set('rows', 1);
    //       q.set('facet.field', data.field);
    //       if (data.hierarchical) {
    //         q.set('facet.prefix', data.title ? '1/' + data.title : '0/');
    //       }
    //       if (prevQ && _.isEqual(
    //         _.flatten(_.toArray(q.toJSON())),
    //         _.flatten(_.toArray(prevQ.toJSON()))
    //       )) {
    //         return cb(null);
    //       }

    //       var req = widget.composeRequest(q);
    //       pubsub.subscribeOnce(pubsub.DELIVERING_RESPONSE, function (apiResponse) {
    //         prevQ = q;
    //         cb(apiResponse);
    //       });
    //       pubsub.publish(pubsub.DELIVERING_REQUEST, req);
    //     }
    //     cb(null);
    //   }, 50);
    //   storeSubscription = widget.store.subscribe(onQueryUpdate);
    //   onQueryUpdate();
    // };
  //};

  // actions.createApiRequest = function (data, cb) {
  //   return function (dispatch, getState, widget) {
  //     var prevQ, prevRes;
  //     var handler = function () {
  //       var query = getState().query;
  //       if (query) {
  //         var pubsub = widget.getPubSub();
  //         var q = widget.customizeQuery(query);
  //         q.set('facet.offset', 0);
  //         q.set('rows', 1);
  //         q.set('facet.field', data.field);
  //         if (data.hierarchical) {
  //           q.set('facet.prefix', data.title ? '1/' + data.title : '0/');
  //         }
  //         var req = widget.composeRequest(q);
  //         if (prevQ && _.isEqual(
  //             _.flatten(_.toArray(q.toJSON())),
  //             _.flatten(_.toArray(prevQ.toJSON()))
  //           )
  //         ) {
  //           console.log('reusing response');
  //           return cb(prevRes);
  //         }
  //         prevQ = q;
  //         pubsub.subscribeOnce(pubsub.DELIVERING_RESPONSE, function (apiResponse) {
  //           prevRes = apiResponse;
  //           cb(apiResponse);
  //         });
  //         pubsub.publish(pubsub.DELIVERING_REQUEST, req);
  //       }
  //       cb(null);
  //     };
  //     widget.store.subscribe(handler);
  //     handler();
  //   };
  // };

  actions.handleFeedback = function (feedback) {
    return function (dispatch, getState, widget) {
      var state = getState();
      var widgetId = null;
      try {
        widgetId = widget.getPubSub().getCurrentPubSubKey().getId();
      } catch (e) {
        // In the case that the widget has already been destroyed, the beehive
        // will be inactive -- don't let this error bubble up.
      }
      var stateQuery = (state.query && state.query.get) ?
        state.query.get('q')[0] : null;
      var errorId = (feedback.psk && feedback.psk.getId) ?
        feedback.psk.getId() : -1;

      if (
        widgetId === errorId &&
        feedback &&
        feedback.request &&
        feedback.request.has('query') &&
        feedback.request.get('query').has('q')
      ) {
        var query = feedback.request.get('query').get('q');
        var feedbackQuery = (query.length) ? query[0] : null;
        if (feedbackQuery === stateQuery) {
          console.log('error');

          if (!getState().hasError) {
            dispatch(actions.hasError(true));
          }
        }
      }
    };
  };

  return actions;
>>>>>>> Stashed changes
});
