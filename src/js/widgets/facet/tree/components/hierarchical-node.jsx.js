'use strict';
define([
  'react'
], function (React) {

  var HierarchicalNode = React.createClass({
    getInitialState: function () {
      return {
        isLoading: this.props.openByDefault,
        receivedResponse: false,
        isOpen: this.props.openByDefault,
        entries: []
      };
    },
    componentWillMount: function () {
      this.makeRequest();
    },
    makeRequest: function () {
      if (this.state.isOpen && !this.state.receivedResponse) {
        this.props.createApiRequest({
          field: this.props.facetField,
          hierarchical: true
        }, this.onResponse);
        this.loading(true);
      }
    },
    onResponse: function (apiResponse) {
      if (apiResponse === null) {
        return this.loading(true);
      }
      console.log(apiResponse);
      var items = apiResponse.get('facet_counts')['facet_fields'][this.props.facetField];
      var entries = [];

      for (var i = 0; i < items.length; i += 2) {
        entries.push({
          title: items[i].replace(/^\d\//, ''),
          count: items[i + 1]
        });
      }

      this.setState({
        receivedResponse: true,
        entries: entries
      }, function () {
        console.log('gotResponse', apiResponse.toJSON());
        this.loading(false);
      });
    },
    loading: function (done) {
      this.setState({ isLoading: done });
    },
    toggleOpen: function () {
      if (this.state.isLoading) {
        return false;
      }
      this.setState({ isOpen: !this.state.isOpen }, function () {
        this.makeRequest();
      });
    },
    render: function () {
      var icon = <i
        className={`facet__icon facet__icon--${(this.state.isOpen) ? 'open' : 'closed'}`}
        role="button" aria-pressed="false"></i>;
      if (this.state.isLoading) {
        icon = <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i>;
      }

      var items = this.state.entries.map(function (e) {
        return (
          <label className="facet-label">
            <input type="checkbox" value="on"/>
            &nbsp;
            <span>
              <span className="facet-label__title">{e.title}</span>
              <span className="facet-label__amount">{e.count}</span>
            </span>
          </label>
        )
      });

      return (
        <div className="facet__toggle" onClick={this.toggleOpen} disabled={this.state.isLoading}>
          {icon}
          <h3 className="facet__header">{this.props.facetTitle}</h3>
          {items}
        </div>
      );
    }
  });

  return HierarchicalNode;
});
