'use strict';
define([
  'json!js/widgets/facet/tree/facets.config.json'
], function (facets) {

  var initialState = function () {
    return {
      facets: facets,
      query: null
    };
  };

  /**
   * Depending on the action type, perform an update to the state
   *
   * @param state
   * @param action
   * @returns {{dataProducts, fullTextSources, isLoading}|*}
   */
  var exports = function reducers (state, action) {
    state = state ? state : initialState();

    switch(action.type) {
      case 'UPDATE_QUERY':
        return Object.assign({}, state, {
          query: action.query
        });
      default:
        return state;
    }
  };

  return exports;
});
