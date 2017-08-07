define([], function () {
  var exports = {
    updateActiveNodes: function (value) {
      return {
        type: 'UPDATE_ACTIVE_NODES',
        value: value
      }
    }
  };

  return exports;
});
