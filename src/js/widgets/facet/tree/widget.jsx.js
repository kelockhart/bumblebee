define([
  'underscore',
  'backbone',
  'js/components/api_query',
  'js/components/api_request',
  'js/widgets/base/base_widget',
  'js/components/api_query_updater',
  'analytics',
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'redux-thunk',
  'es6!./components/app.jsx',
  './actions',
  './reducers'
], function (_, Backbone, ApiQuery, ApiRequest, BaseWidget, ApiQueryUpdater,
   analytics, React, ReactDOM, ReactRedux, Redux, ReduxThunk, App, actions, reducers) {

  var View = Backbone.View.extend({
    initialize: function (options) {
      _.assign(this, options);
    },
    render: function () {
      ReactDOM.render(
        <ReactRedux.Provider store={this.store}>
          <App/>
        </ReactRedux.Provider>,
        this.el);
      return this;
    },
    destroy: function () {
      ReactDOM.unmountComponentAtNode(this.el);
    }
  });

  var Widget = BaseWidget.extend({
    defaultQueryArguments: {
      'facet': 'true',
      'facet.mincount': '1',
      'facet.limit': 20,
      'fl': 'id'
    },
    initialize: function (options) {
      this.options = _.pick(options, [
        'facetTitle', 'facetField', 'preprocessors',
        'hierMaxLevels', 'logicOptions', 'openByDefault'
      ]);

      //will be used by dispatchRequest
      this.defaultQueryArguments = _.extend({},
        this.defaultQueryArguments,
        this.options.defaultQueryArguments, {
          'facet.field': 'author_facet_hier'
        }
      );

      var middleware = Redux.applyMiddleware(
        ReduxThunk.default.withExtraArgument(this));
      this.store = Redux.createStore(reducers, middleware);

      this.view = new View ({
        store: this.store
      });

      this.queryUpdater = new ApiQueryUpdater('author_facet_hier');
    },
    activate: function (beehive) {
      this.setBeeHive(beehive);
<<<<<<< Updated upstream
      _.bindAll(this, 'dispatchRequest', 'processResponse');
      var pubsub = this.getPubSub();
      pubsub.subscribe(pubsub.INVITING_REQUEST, this.dispatchRequest);
    },
    dispatchRequest: function (apiQuery) {
      this.store.dispatch(actions.updateQuery(apiQuery));
      //
      // var pubsub = this.getPubSub();
      // pubsub.subscribeOnce(pubsub.DELIVERING_RESPONSE, function (apiResponse) {
      //   console.log('sdlkjf', apiResponse.toJSON());
      // });
      //
      // var q = this.customizeQuery(this.getCurrentQuery());
      // q.set('facet.offset', 0);
      // q.set('rows', 1);
      // q.set('facet.prefix', '2/');
      // var req = this.composeRequest(q);
      // pubsub.publish(pubsub.DELIVERING_REQUEST, req);
=======
      _.bindAll(this, 'dispatchRequest', 'processResponse', 'handleFeedback');
      var pubsub = this.getPubSub();
      pubsub.subscribe(pubsub.INVITING_REQUEST, this.dispatchRequest);
      pubsub.subscribe(pubsub.FEEDBACK, this.handleFeedback);
    },
    dispatchRequest: function (apiQuery) {
      this.store.dispatch(actions.updateQuery(apiQuery));
    },
    handleFeedback: function (feedback) {
      this.store.dispatch(actions.handleFeedback(feedback));
>>>>>>> Stashed changes
    }
  });

  return Widget;
});
