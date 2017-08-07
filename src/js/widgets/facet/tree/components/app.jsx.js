define([
  '../actions',
  'react',
  'react-redux',
  'es6!./node.jsx'
], function (actions, React, ReactRedux, Node) {

  var App = React.createClass({
    render: function () {

      if (this.props.activeNodes.length) {
        var nodes = this.props.activeNodes.map(function (n) {
          return <Node
            title={n.title}
          />;
        });
      }

      return (
        <div className="facet__container">
          {nodes}
        </div>
      );
    }
  });

  var mapStateToProps = function (state) {
    return {
      activeNodes: state.activeNodes
    };
  };

  var mapDispatchToProps = function (dispatch) {
    return {};
  };

  return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App);
});
