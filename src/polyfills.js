/**
 * Transforms angle from degrees to radians
 * @method Number.toRad
 * @return {Number} radian
 */
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
};

/**
 * Transforms angle from radians to degrees
 * @method Number.toDeg
 * @return {Number} degree
 */
Number.prototype.toDeg = function() {
  return this * 180 / Math.PI;
};

/**
 * Array Remove - By John Resig (MIT Licensed)
 * @method remove
 * @param  {Number} from
 * @param  {Number} to
 * @return {Array}
 */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var pointOnLine = function(t, a, b) {
  var lat1 = a.lat().toRad(),
    lon1 = a.lng().toRad();
  var lat2 = b.lat().toRad(),
    lon2 = b.lng().toRad();

  x = lat1 + t * (lat2 - lat1);
  y = lon1 + t * (lon2 - lon1);

  return new google.maps.LatLng(x.toDeg(), y.toDeg());
};

module.exports = {
  pointOnLine: pointOnLine
};