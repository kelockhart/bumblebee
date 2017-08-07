define([
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
], function (Backbone, ApiQuery, ApiRequest, BaseWidget, ApiQueryUpdater,
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
    initialize: function (options) {
      this.options = _.pick(options, [
        'facetTitle', 'facetField', 'preprocessors',
        'hierMaxLevels', 'logicOptions', 'openByDefault'
      ]);

      //will be used by dispatchRequest
      this.defaultQueryArguments = _.extend({},
        this.defaultQueryArguments,
        options.defaultQueryArguments, {
          "facet.field": options.facetField
        }
      );

      var middleware = Redux.applyMiddleware(
        ReduxThunk.default.withExtraArgument(this));
      this.store = Redux.createStore(reducers, middleware);

      this.view = new View ({
        store: this.store
      });
    },
    activate: function (beehive) {
      this.setBeeHive(beehive);
      _.bindAll(this, 'dispatchRequest', 'processResponse');
      var pubsub = this.getPubSub();
      pubsub.subscribe(pubsub.INVITING_REQUEST, this.dispatchRequest);

      this.store.dispatch(actions.updateActiveNodes([
        'Author', 'Citations'
      ]))
    }
  });

  return Widget;
});
