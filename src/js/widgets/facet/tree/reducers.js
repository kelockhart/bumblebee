'use strict';
define([], function () {

  var initialState = function () {
    return {
      activeNodes: []
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
      case 'UPDATE_ACTIVE_NODES':
        return Object.assign({}, state, {
          activeNodes: action.value
        });
      default:
        return state;
    }
  };

  return exports;
});
