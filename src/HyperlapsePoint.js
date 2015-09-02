/**
 * @module Hyperlapse
 */

/**
 * 
 * @class HyperlapsePoint
 * @constructor
 * @param  {google.maps.LatLng} location
 * @param  {Number} pano_id
 * @param  {Object} params
 */
var HyperlapsePoint = function(location, pano_id, params ) {

  var self = this;
  var prams = params || {};

  /**
   * @attribute location
   * @type {google.maps.LatLng}
   */
  this.location = location;

  /**
   * @attribute pano_id
   * @type {Number}
   */
  this.pano_id = pano_id;

  /**
   * @attribute heading
   * @default 0
   * @type {Number}
   */
  this.heading = prams.heading || 0;

  /**
   * @attribute pitch
   * @default 0
   * @type {Number}
   */
  this.pitch = prams.pitch || 0;

  /**
   * @attribute elevation
   * @default 0
   * @type {Number}
   */
  this.elevation = prams.elevation || 0;

  /**
   * @attribute image
   * @type {Image}
   */
  this.image = prams.image || null;

  /**
   * @attribute copyright
   * @default "© 2013 Google"
   * @type {String}
   */
  this.copyright = prams.copyright || "© 2013 Google";

  /**
   * @attribute image_date
   * @type {String}
   */
  this.image_date = prams.image_date || "";

};

module.exports = HyperlapsePoint;