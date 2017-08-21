define([
  'js/widgets/facet/tree/actions',
  'react',
  'react-redux',
  'es6!js/widgets/facet/tree/components/simple-item.jsx',
  'es6!js/widgets/facet/tree/components/hierarchical-item.jsx',
  'js/widgets/facet/tree/utils'
], function (actions, React, ReactRedux, SimpleItem, HierarchicalItem, utils) {

  var App = React.createClass({
    render: function () {
      var props = this.props;

      // Create a new facet Node for each field
      var nodes = props.facets.map(function (facetInfo, i) {
        console.log(arguments);
        if (facetInfo.hierarchical) {
          return <HierarchicalItem
            field={facetInfo.facetField}
            title={facetInfo.facetTitle}
            openByDefault={facetInfo.openByDefault}
            createApiRequest={props.createApiRequest}
            errorHandled={props.errorHandled}
            hasError={props.hasError}
            query={props.query}
          />
        } else {
          return <SimpleItem
            field={facetInfo.facetField}
            title={facetInfo.facetTitle}
            openByDefault={facetInfo.openByDefault}
            createApiRequest={props.createApiRequest}
            errorHandled={props.errorHandled}
            hasError={props.hasError}
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
      query: state.query,
      hasError: state.hasError
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
