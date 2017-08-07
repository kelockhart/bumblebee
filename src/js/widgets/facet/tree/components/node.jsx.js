'use strict';
define([
  'react'
], function (React) {

  var Node = function (props) {

    return (
      <div className="facet__toggle">
        <i className="facet__icon facet__icon--open"></i>
        <h3 className="facet__header">{props.title}</h3>
      </div>
    );
  };

  return Node;
});
