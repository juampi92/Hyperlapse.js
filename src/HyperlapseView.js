var eventEmitter = require('event-emitter');

/**
 * @module Hyperlapse
 */

/**
 * @class HyperlapseView
 * @extends {EventEmitter}
 */

/**
 * @constructor
 * @param {Hyperlapse} hyperlapse Base Hyperlapse
 * @param {HTML Element} element Container for the View
 */

var HyperlapseView = function(hyperlapse, element){
  "use strict";

  eventEmitter(this);
};

module.exports = HyperlapseView;