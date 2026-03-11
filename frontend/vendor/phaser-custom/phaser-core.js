/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 *
 * Modified for custom Phaser 3.88.2 build by Sergei Gmyria (2026)
 * Core bundle
 */

/** * @namespace Phaser */

require('polyfills');

var CONST = require('const');
var Extend = require('utils/object/Extend');

var Phaser = {
  Core: require('core'),
  Renderer: require('renderer'),
  Scale: require('scale'),
  ScaleModes: require('renderer/ScaleModes'),
};

Phaser = Extend(false, Phaser, CONST);

module.exports = Phaser;
global.Phaser = Phaser;