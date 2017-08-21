'use strict';
define([
  'json!js/widgets/facet/tree/facets.config.json'
], function (facets) {

  var initialState = function () {
    return {
      facets: facets,
<<<<<<< Updated upstream
=======
      hasError: false,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
      case 'HAS_ERROR':
        return Object.assign({}, state, {
          hasError: action.hasError
        });
>>>>>>> Stashed changes
      default:
        return state;
    }
  };

  return exports;
});
