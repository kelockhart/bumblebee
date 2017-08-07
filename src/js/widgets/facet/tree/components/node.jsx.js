'use strict';
define([
  'react'
], function (React) {

  var Node = function (props) {
    return (<h3>{props.type}</h3>)
  };

  return Node;
});
