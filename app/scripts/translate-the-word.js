import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';
require('annyang');

export default function (params) {
  this.attach = function($wrapper) {
    ReactDOM.render(<Layout annyang={annyang} {...params} />, $wrapper.get(0));
  }
};
