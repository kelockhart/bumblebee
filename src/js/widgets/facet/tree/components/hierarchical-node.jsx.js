'use strict';
define([
<<<<<<< Updated upstream
  'react'
], function (React) {
=======
  'react',
  'es6!./hierarchical-item.jsx'
], function (React, HierarchicalItem) {
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      this.makeRequest();
    },
    makeRequest: function () {
=======
      this.makeInitialRequest();
    },
    makeInitialRequest: function () {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      this.setState({ isOpen: !this.state.isOpen }, function () {
        this.makeRequest();
      });
    },
    render: function () {
      var icon = <i
        className={`facet__icon facet__icon--${(this.state.isOpen) ? 'open' : 'closed'}`}
        role="button" aria-pressed="false"></i>;
=======

      // User toggled one of the items open, make the request for the initial entry
      this.setState({
        isOpen: !this.state.isOpen
      }, function () {
        this.makeInitialRequest();
      });
    },
    render: function () {
      var props = this.props;
      var icon = <i
        className={`facet__icon facet__icon--${(this.state.isOpen) ? 'open' : 'closed'}`}
        role="button" aria-pressed="false" onClick={this.toggleOpen}></i>;
>>>>>>> Stashed changes
      if (this.state.isLoading) {
        icon = <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i>;
      }

      var items = this.state.entries.map(function (e) {
<<<<<<< Updated upstream
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
=======
        return (<HierarchicalItem
          title={e.title}
          count={e.count}
          createApiRequest={props.createApiRequest}
        ></HierarchicalItem>);
      });

      return (
        <div className="facet__toggle" disabled={this.state.isLoading}>
          {icon}
          <h3 className="facet__header" onClick={this.toggleOpen}>{props.facetTitle}</h3>
>>>>>>> Stashed changes
          {items}
        </div>
      );
    }
  });

  return HierarchicalNode;
});
