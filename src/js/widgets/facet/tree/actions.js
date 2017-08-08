define([
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
});
