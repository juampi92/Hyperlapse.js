/**
 * https://github.com/heganoo/GSVPano
 * @module GSVPano
 * @class GSVPano.PanoLoader
 */

/**
 * @constructor
 * @param {Object} parameters
 * @param {Number} parameters.zoom Zoom (default 1)
 */

/**
 * Fires onProgress
 * @method setProgress
 * @param p
 */

/**
 * Fires onError
 * @method throwError
 * @param {String} message
 */

/**
 * @method adaptTextureToZoom
 */

/**
 * Fires onPanoramaLoad
 * @method composeFromTile
 * @param {Number} x
 * @param {Number} y
 * @param {Image} texture
 */

/**
 * @method composePanorama
 * @param {Hash} panoId
 */

/**
 * Middle function for working with IDs.
 * @method loadData
 * @param {Google.Maps.Location} location
 */

/**
 * Fires onPanoramaData, onNoPanoramaData
 * @method load
 * @param {Google.Maps.Location} location
 * @param {Hash} id
 */

/**
 * @method setZoom
 * @param {Number} z
 */