var eventEmitter = require('event-emitter');

/**
 * Hyperapse.js - JavaScript hyper-lapse utility for Google Street View.
 * @module Hyperlapse
 * @author Peter Nitsch
 * @author Juan Pablo Barreto <juampi92@gmail.com>
 */

var Utils = require('./polyfills');

var HyperlapsePoint = require('./HyperlapsePoint');

/**
 * @class Hyperlapse
 * @extends {EventEmitter}
 * @uses Google.Maps
 * @uses GSVPano.PanoLoader
 */

/**
 * @constructor
 * @param {Node} container - HTML element
 * @param {Object} params
 * @param {Number} params.width
 * @param {Number} params.height
 * @param {Boolean} params.use_elevation
 * @param {Number} params.distance_between_points
 * @param {Number} params.max_points
 * @param {Number} params.fov
 * @param {Number} params.zoom
 * @param {Google.Maps.LatLng} params.lookat
 * @param {Number} params.millis
 * @param {Number} params.elevation
 * @param {Number} params.tilt
 */
var Hyperlapse = function(container, params) {
	"use strict";

	// Inherits EventEmitter
	eventEmitter(this);

	var self = this,
		_params = params || {},

		/**
		 * @attribute _listeners
		 * @type {Array}
		 * @default []
		 * @private
		 */
		_listeners = [],
		/**
		 * @attribute _container
		 * @type {HTML element}
		 * @private
		 */
		_container = container,
		/**
		 * Width
		 * @attribute _w
		 * @type {Number}
		 * @default 800
		 * @private
		 */
		_w = _params.width || 800,
		/**
		 * Height
		 * @attribute _h
		 * @type {Number}
		 * @default 400
		 * @private
		 */
		_h = _params.height || 400,
		/**
		 * @attribute _d
		 * @type {Number}
		 * @default 20
		 * @private
		 */
		_d = 20,
		/**
		 * @attribute _use_elevation
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		_use_elevation = _params.use_elevation || false,
		/**
		 * @attribute _distance_between_points
		 * @type {Number}
		 * @default 5
		 * @private
		 */
		_distance_between_points = _params.distance_between_points || 5,
		/**
		 * @attribute _max_points
		 * @type {Number}
		 * @default 100
		 * @private
		 */
		_max_points = _params.max_points || 100,
		/**
		 * @attribute _fov
		 * @type {Number}
		 * @default 70
		 * @private
		 */
		_fov = _params.fov || 70,
		/**
		 * @attribute _zoom
		 * @type {Number}
		 * @default 1
		 * @private
		 */
		_zoom = _params.zoom || 1,
		/**
		 * @attribute _lat
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_lat = 0,
		/**
		 * @attribute _lon
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_lon = 0,
		/**
		 * @attribute _position_x
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_position_x = 0,
		/**
		 * @attribute _position_y
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_position_y = 0,
		/**
		 * @attribute _is_playing
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		_is_playing = false,
		/**
		 * @attribute _is_loading
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		_is_loading = false,
		/**
		 * @attribute _point_index
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_point_index = 0,
		/**
		 * @attribute _origin_heading
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_origin_heading = 0,
		/**
		 * @attribute _origin_pitch
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_origin_pitch = 0,
		/**
		 * @attribute _forward
		 * @type {Boolean}
		 * @default true
		 * @private
		 */
		_forward = true,
		/**
		 * @attribute _lookat_heading
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_lookat_heading = 0,
		/**
		 * @attribute _lookat_elevation
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_lookat_elevation = 0,
		/**
		 * @attribute _canvas
		 * @type {HTML Element}
		 * @private
		 */
		_canvas = false,
		/**
		 * @attribute _context
		 * @type {Canvas Context}
		 * @private
		 */
		_context = false,
		/**
		 * @attribute _camera
		 * @type {Tree.Camera}
		 * @private
		 */
		_camera = false,
		/**
		 * @attribute _scene
		 * @type {Tree.Scene}
		 * @private
		 */
		_scene = false,
		/**
		 * @attribute _renderer
		 * @type {?}
		 * @private
		 */
		_renderer = false,
		/**
		 * @attribute _mesh
		 * @type {?}
		 * @private
		 */
		_mesh = false,
		/**
		 * @attribute _loader
		 * @type {?}
		 * @private
		 */
		_loader = false,
		/**
		 * @attribute _cancel_load
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		_cancel_load = false,
		/**
		 * @attribute _ctime
		 * @type {Timestamp}
		 * @default now
		 * @private
		 */
		_ctime = Date.now(),
		/**
		 * @attribute _ptime
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_ptime = 0,
		/**
		 * @attribute _dtime
		 * @type {Number}
		 * @default 0
		 * @private
		 */
		_dtime = 0,
		/**
		 * @attribute _prev_pano_id
		 * @type {Number}
		 * @default null
		 * @private
		 */
		_prev_pano_id = null,
		/**
		 * @attribute _raw_points
		 * @type {Array}
		 * @default []
		 * @private
		 */
		_raw_points = [],
		/**
		 * @attribute _h_points
		 * @type {Array}
		 * @default []
		 * @private
		 */
		_h_points = [];

	/**
	 * @event Hyperlapse#error
	 * @param {Object} e
	 * @param {String} e.message
	 */

	/**
	 * @event Hyperlapse#frame
	 * @param {Object} e
	 * @param {Number} e.position
	 * @param {HyperlapsePoint} e.point
	 */

	/**
	 * @event Hyperlapse#play
	 */

	/**
	 * @event Hyperlapse#pause
	 */

	var _elevator = new google.maps.ElevationService();
	var _streetview_service = new google.maps.StreetViewService();

	_canvas = document.createElement('canvas');
	_context = _canvas.getContext('2d');

	_camera = new THREE.PerspectiveCamera(_fov, _w / _h, 1, 1100);
	_camera.target = new THREE.Vector3(0, 0, 0);

	_scene = new THREE.Scene();
	_scene.add(_camera);

	// Check if we can use webGL
	var isWebGL = function() {
		try {
			return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
		} catch (e) {
			console.log('WebGL not available starting with CanvasRenderer');
			return false;
		}
	};

	_renderer = isWebGL() ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
	_renderer.autoClearColor = false;
	_renderer.setSize(_w, _h);

	_mesh = new THREE.Mesh(
		new THREE.SphereGeometry(500, 60, 40),
		new THREE.MeshBasicMaterial({
			map: new THREE.Texture(),
			side: THREE.DoubleSide,
			overdraw: true
		})
	);
	_scene.add(_mesh);

	_container.appendChild(_renderer.domElement);


	_loader = new GSVPANO.PanoLoader({
		zoom: _zoom
	});
	_loader.onError = function(message) {
		self.emit('error', {
			message: message
		});
	};

	_loader.onPanoramaLoad = function() {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext('2d');
		canvas.setAttribute('width', this.canvas.width);
		canvas.setAttribute('height', this.canvas.height);
		context.drawImage(this.canvas, 0, 0);

		_h_points[_point_index].image = canvas;

		if (++_point_index != _h_points.length) {
			self.emit('load.progress', {
				position: _point_index
			});

			if (!_cancel_load) {
				_loader.composePanorama(_h_points[_point_index].pano_id);
			} else {
				_cancel_load = false;
				_is_loading = false;
				self.emit('load.canceled', {});
			}
		} else {
			_is_loading = false;
			_point_index = 0;
			self.emit('load.complete', {});
		}
	};

	/**
	 * @event Hyperlapse#load.canceled
	 */

	/**
	 * @event Hyperlapse#load.progress
	 * @param {Object} e
	 * @param {Number} e.position
	 */

	/**
	 * @event Hyperlapse#load.complete
	 */

	/**
	 * @event Hyperlapse#route.progress
	 * @param {Object} e
	 * @param {HyperlapsePoint} e.point
	 */

	/**
	 * @event Hyperlapse#route.complete
	 * @param {Object} e
	 * @param {google.maps.DirectionsResult} e.response
	 * @param {Array<HyperlapsePoint>} e.points
	 */
	var handleRouteComplete = function(e) {
		var elevations = [];
		for (var i = 0; i < _h_points.length; i++) {
			elevations[i] = _h_points[i].location;
		}

		if (_use_elevation) {
			getElevation(elevations, function(results) {
				if (results) {
					for (i = 0; i < _h_points.length; i++) {
						_h_points[i].elevation = results[i].elevation;
					}
				} else {
					for (i = 0; i < _h_points.length; i++) {
						_h_points[i].elevation = -1;
					}
				}

				self.setLookat(self.lookat, true, function() {
					self.emit('route.complete', e);
				});
			});
		} else {
			for (i = 0; i < _h_points.length; i++) {
				_h_points[i].elevation = -1;
			}

			self.setLookat(self.lookat, false, function() {
				self.emit('route.complete', e);
			});
		}


	};

	var parsePoints = function(response) {

		_loader.load(_raw_points[_point_index], function() {

			if (_loader.id != _prev_pano_id) {
				_prev_pano_id = _loader.id;

				var hp = new HyperlapsePoint(_loader.location, _loader.id, {
					heading: _loader.rotation,
					pitch: _loader.pitch,
					elevation: _loader.elevation,
					copyright: _loader.copyright,
					image_date: _loader.image_date
				});

				_h_points.push(hp);

				self.emit('route.progress', {
					point: hp
				});

				if (_point_index == _raw_points.length - 1) {
					handleRouteComplete({
						response: response,
						points: _h_points
					});
				} else {
					_point_index++;
					if (!_cancel_load) parsePoints(response);
					else self.emit('load.canceled', {});
				}
			} else {

				_raw_points.splice(_point_index, 1);

				if (_point_index == _raw_points.length) {
					handleRouteComplete({
						response: response,
						points: _h_points
					}); // FIX
				} else {
					if (!_cancel_load) parsePoints(response);
					else self.emit('load.canceled', {});
				}

			}

		});
	};

	var getElevation = function(locations, callback) {
		var positionalRequest = {
			locations: locations
		};

		_elevator.getElevationForLocations(positionalRequest, function(results, status) {
			if (status == google.maps.ElevationStatus.OK) {
				callback(results);
			} else {
				if (status == google.maps.ElevationStatus.OVER_QUERY_LIMIT) {
					console.log("Over elevation query limit.");
				}
				_use_elevation = false;
				callback(null);
			}
		});
	};

	var handleDirectionsRoute = function(response) {
		if (!_is_playing) {

			var route = response.routes[0];
			var path = route.overview_path;
			var legs = route.legs;

			var total_distance = 0;
			for (var i = 0; i < legs.length; ++i) {
				total_distance += legs[i].distance.value;
			}

			var segment_length = total_distance / _max_points;
			_d = (segment_length < _distance_between_points) ? _d = _distance_between_points : _d = segment_length;

			var d = 0;
			var r = 0;
			var a, b;

			for (i = 0; i < path.length; i++) {
				if (i + 1 < path.length) {

					a = path[i];
					b = path[i + 1];
					d = google.maps.geometry.spherical.computeDistanceBetween(a, b);

					if (r > 0 && r < d) {
						a = Utils.pointOnLine(r / d, a, b);
						d = google.maps.geometry.spherical.computeDistanceBetween(a, b);
						_raw_points.push(a);

						r = 0;
					} else if (r > 0 && r > d) {
						r -= d;
					}

					if (r === 0) {
						var segs = Math.floor(d / _d);

						if (segs > 0) {
							for (var j = 0; j < segs; j++) {
								var t = j / segs;

								if (t > 0 || (t + i) === 0) { // not start point
									var way = Utils.pointOnLine(t, a, b);
									_raw_points.push(way);
								}
							}

							r = d - (_d * segs);
						} else {
							r = _d * (1 - (d / _d));
						}
					}

				} else {
					_raw_points.push(path[i]);
				}
			}

			parsePoints(response);

		} else {
			self.pause();
			handleDirectionsRoute(response);
		}
	};

	var drawMaterial = function() {
		_mesh.material.map.image = _h_points[_point_index].image;
		_mesh.material.map.needsUpdate = true;

		_origin_heading = _h_points[_point_index].heading;
		_origin_pitch = _h_points[_point_index].pitch;

		if (self.use_lookat)
			_lookat_heading = google.maps.geometry.spherical.computeHeading(_h_points[_point_index].location, self.lookat);

		if (_h_points[_point_index].elevation != -1) {
			var e = _h_points[_point_index].elevation - self.elevation_offset;
			var d = google.maps.geometry.spherical.computeDistanceBetween(_h_points[_point_index].location, self.lookat);
			var dif = _lookat_elevation - e;
			var angle = Math.atan(Math.abs(dif) / d).toDeg();
			_position_y = (dif < 0) ? -angle : angle;
		}

		self.emit('frame', {
			position: _point_index,
			point: _h_points[_point_index]
		});
	};

	var render = function() {
		if (!_is_loading && self.length() > 0) {
			var t = _point_index / (self.length());

			var o_x = self.position.x + (self.offset.x * t);
			var o_y = self.position.y + (self.offset.y * t);
			var o_z = self.tilt + (self.offset.z.toRad() * t);

			var o_heading = (self.use_lookat) ? _lookat_heading - _origin_heading.toDeg() + o_x : o_x;
			var o_pitch = _position_y + o_y;

			var olon = _lon,
				olat = _lat;
			_lon = _lon + (o_heading - olon);
			_lat = _lat + (o_pitch - olat);

			_lat = Math.max(-85, Math.min(85, _lat));
			var phi = (90 - _lat).toRad();
			var theta = _lon.toRad();

			_camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
			_camera.target.y = 500 * Math.cos(phi);
			_camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
			_camera.lookAt(_camera.target);
			_camera.rotation.z -= o_z;

			if (self.use_rotation_comp) {
				_camera.rotation.z -= self.rotation_comp.toRad();
			}
			_mesh.rotation.z = _origin_pitch.toRad();
			_renderer.render(_scene, _camera);
		}
	};

	var animate = function() {
		var ptime = _ctime;
		_ctime = Date.now();
		_dtime += _ctime - ptime;
		if (_dtime >= self.millis) {
			if (_is_playing) loop();
			_dtime = 0;
		}

		requestAnimationFrame(animate);
		render();
	};

	// animates the playhead forward or backward depending on direction
	var loop = function() {
		drawMaterial();

		if (_forward) {
			if (++_point_index == _h_points.length) {
				_point_index = _h_points.length - 1;
				_forward = !_forward;
			}
		} else {
			if (--_point_index == -1) {
				_point_index = 0;
				_forward = !_forward;
			}
		}
	};


	/**
	 * @attribute lookat
	 * @type {Google.Maps.LatLng}
	 */
	this.lookat = _params.lookat || null;

	/**
	 * @attribute millis
	 * @default 50
	 * @type {Number}
	 */
	this.millis = _params.millis || 50;

	/**
	 * @attribute elevation
	 * @default 0
	 * @type {Number}
	 */
	this.elevation_offset = _params.elevation || 0;

	/**
	 * @attribute tilt
	 * @deprecated should use offset instead
	 * @default 0
	 * @type {Number}
	 */
	this.tilt = _params.tilt || 0;

	/**
	 * @attribute position
	 * @default {x:0, y:0}
	 * @type {Object}
	 */
	this.position = {
		x: 0,
		y: 0
	};

	/**
	 * @attribute offset
	 * @default {x:0, y:0, z:0}
	 * @type {Object}
	 */
	this.offset = {
		x: 0,
		y: 0,
		z: 0
	};

	/**
	 * @attribute use_lookat
	 * @default false
	 * @type {Boolean}
	 */
	this.use_lookat = _params.use_lookat || false;

	/**
	 * @attribute use_rotation_comp
	 * @default false
	 * @type {Boolean}
	 */
	this.use_rotation_comp = false;

	/**
	 * @attribute rotation_comp
	 * @default 0
	 * @type {Number}
	 */
	this.rotation_comp = 0;

	/**
	 * @method isPlaying
	 * @return {Boolean}
	 */
	this.isPlaying = function() {
		return _is_playing;
	};

	/**
	 * @method isLoading
	 * @return {Boolean}
	 */
	this.isLoading = function() {
		return _is_loading;
	};

	/**
	 * @method length
	 * @return {Number}
	 */
	this.length = function() {
		return _h_points.length;
	};

	/**
	 * @method setPitch
	 * @param  {Number} v
	 */
	this.setPitch = function(v) {
		_position_y = v;
	};

	/**
	 * @method setDistanceBetweenPoint
	 * @param  {Number} v
	 */
	this.setDistanceBetweenPoint = function(v) {
		_distance_between_points = v;
	};

	/**
	 * @method setMaxPoints
	 * @param  {Number} v
	 */
	this.setMaxPoints = function(v) {
		_max_points = v;
	};

	/**
	 * @method fov
	 * @return {Number}
	 */
	this.fov = function() {
		return _fov;
	};

	/**
	 * @method webgl
	 * @return {Image}
	 */
	this.webgl = function() {
		return _renderer;
	};

	/**
	 * @method getCurrentImage
	 * @return {Image}
	 */
	this.getCurrentImage = function() {
		return _h_points[_point_index].image;
	};

	/**
	 * @method getCurrentPoint
	 * @return {HyperlapsePoint}
	 */
	this.getCurrentPoint = function() {
		return _h_points[_point_index];
	};

	/**
	 * @method setLookat
	 * @param {Google.Maps.LatLng} point
	 * @param {Boolean} call_service
	 * @param {Function} callback
	 */
	this.setLookat = function(point, call_service, callback) {
		self.lookat = point;

		if (_use_elevation && call_service) {
			var e = getElevation([self.lookat], function(results) {
				if (results) {
					_lookat_elevation = results[0].elevation;
				}

				if (callback && callback.apply) callback();
			});
		} else {
			if (callback && callback.apply) callback();
		}

	};

	/**
	 * @method setFov
	 * @param {Number} v
	 */
	this.setFOV = function(v) {
		_fov = Math.floor(v);
		_camera.projectionMatrix.makePerspective(_fov, _w / _h, 1, 1100);
	};

	/**
	 * @method setSize
	 * @param {Number} width
	 * @param {Number} height
	 */
	this.setSize = function(width, height) {
		_w = width;
		_h = height;
		_renderer.setSize(_w, _h);
		_camera.projectionMatrix.makePerspective(_fov, _w / _h, 1, 1100);
	};

	/**
	 * Resets all members to defaults
	 * @method reset
	 */
	this.reset = function() {
		_raw_points.remove(0, -1);
		_h_points.remove(0, -1);

		self.tilt = 0;

		_lat = 0;
		_lon = 0;

		self.position.x = 0;
		self.offset.x = 0;
		self.offset.y = 0;
		self.offset.z = 0;
		_position_x = 0;
		_position_y = 0;

		_point_index = 0;
		_origin_heading = 0;
		_origin_pitch = 0;

		_forward = true;
	};

	/**
	 * @method generate
	 * @param {Object} parameters
	 * @param {Number} parameters.distance_between_points
	 * @param {Number} parameters.max_points
	 * @param {google.maps.DirectionsResult} parameters.route
	 */
	this.generate = function(params) {

		if (!_is_loading) {
			_is_loading = true;
			self.reset();

			var p = params || {};
			_distance_between_points = p.distance_between_points || _distance_between_points;
			_max_points = p.max_points || _max_points;

			if (p.route) {
				handleDirectionsRoute(p.route);
			} else {
				console.log("No route provided.");
			}

		}

	};

	/**
	 * @method load
	 * @fires Hyperlapse#onLoadComplete
	 */
	this.load = function() {
		_point_index = 0;
		_loader.composePanorama(_h_points[_point_index].pano_id);
	};

	/**
	 * @method cancel
	 * @fires Hyperlapse#onLoadCanceled
	 */
	this.cancel = function() {
		if (_is_loading) {
			_cancel_load = true;
		}
	};

	/**
	 * @method getCameraPosition
	 * @return {Google.Maps.LatLng}
	 */
	this.getCameraPosition = function() {
		return new google.maps.LatLng(_lat, _lon);
	};

	/**
	 * Animate through all frames in sequence
	 * @method play
	 * @fires Hyperlapse#onPlay
	 */
	this.play = function() {
		if (!_is_loading) {
			_is_playing = true;
			self.emit('play', {});
		}
	};

	/**
	 * Pause animation
	 * @method pause
	 * @fires Hyperlapse#onPause
	 */
	this.pause = function() {
		_is_playing = false;
		self.emit('pause', {});
	};

	/**
	 * Display next frame in sequence
	 * @method next
	 * @fires Hyperlapse#onFrame
	 */
	this.next = function() {
		self.pause();

		if (_point_index + 1 != _h_points.length) {
			_point_index++;
			drawMaterial();
		}
	};

	/**
	 * Display previous frame in sequence
	 * @method prev
	 * @fires Hyperlapse#onFrame
	 */
	this.prev = function() {
		self.pause();

		if (_point_index - 1 !== 0) {
			_point_index--;
			drawMaterial();
		}
	};
};

global.Hyperlapse = module.exports = Hyperlapse;