define([
  'js/widgets/facet/tree/actions',
  'react',
  'react-redux',
  'es6!js/widgets/facet/tree/components/simple-node.jsx',
  'es6!js/widgets/facet/tree/components/hierarchical-node.jsx'
], function (actions, React, ReactRedux, SimpleNode, HierarchicalNode) {

  var App = React.createClass({
    render: function () {
      var props = this.props;

      // Create a new facet Node for each field
      var nodes = props.facets.map(function (facetInfo) {
        if (facetInfo.hierarchical) {
          return <HierarchicalNode
            {...facetInfo}
            createApiRequest={props.createApiRequest}
          />
        } else {
          return <SimpleNode
            {...facetInfo}
            createApiRequest={props.createApiRequest}
          />
        }
      });

      return (
        <div className="facet__container">
          {nodes}
        </div>
      );
    }
  });

  var mapStateToProps = function (state) {
    return {
      facets: state.facets,
      query: state.query
    };
  };

  var mapDispatchToProps = function (dispatch) {
    return {
      createApiRequest: function (data, cb) {
        dispatch(actions.createApiRequest(data, cb));
      }
    };
  };

  return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App);
});
