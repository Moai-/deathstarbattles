/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 *
 * Modified for custom Phaser 3.88.2 build by Sergei Gmyria (2026)
 * Extras bundle
 */

/** * @namespace Phaser */

var Extend = require('utils/object/Extend');
var Phaser = require('./phaser-core');

Phaser = Extend(false, Phaser, {
  BlendModes: require('renderer/BlendModes'),
  Cameras: { Scene2D: require('cameras/2d') },
  Class: require('utils/Class'),
  Events: require('events/EventEmitter'),
  Game: require('core/Game'),
  Input: require('input'),
  Scene: require('scene/Scene'),
  Scenes: require('scene'),
  Structs: require('structs'),
  Textures: require('textures'),

  Time: require('time'),
  Tweens: require('tweens'),

  Geom: {
    Line: require('geom/line'),
    Rectangle: require('geom/rectangle'),
    Intersects: {
      LineToLine: require('geom/intersects/LineToLine.js')
    }
  },

  GameObjects: {
    Arc: require('gameobjects/shape/arc/Arc'),
    BuildGameObject: require('gameobjects/BuildGameObject'),
    Components: require('gameobjects/components'),
    Container: require('gameobjects/container/Container.js'),
    DisplayList: require('gameobjects/DisplayList'),
    GameObject: require('gameobjects/GameObject'),
    GameObjectFactory: require('gameobjects/GameObjectFactory'),
    Graphics: require('gameobjects/graphics/Graphics.js'),
    Image: require('gameobjects/image/Image'),
    Layer: require('gameobjects/layer/Layer'),
    Line: require('gameobjects/shape/line/Line'),
    RenderTexture: require('gameobjects/rendertexture/RenderTexture.js'),
    Shape: require('gameobjects/shape/Shape'),
    Triangle: require('gameobjects/shape/triangle/Triangle.js'),
    UpdateList: require('gameobjects/UpdateList'),
    Factories: {
      Arc: require('gameobjects/shape/arc/ArcFactory'),
      Container: require('gameobjects/container/ContainerFactory'),
      Graphics: require('gameobjects/graphics/GraphicsFactory'),
      Image: require('gameobjects/image/ImageFactory'),
      Layer: require('gameobjects/layer/LayerFactory'),
      Line: require('gameobjects/shape/line/LineFactory'),
      RenderTexture: require('gameobjects/rendertexture/RenderTextureFactory.js'),
      Triangle: require('gameobjects/shape/triangle/TriangleFactory.js'),
    },

    Creators: {
      RenderTexture: require('gameobjects/rendertexture/RenderTextureCreator.js'),
    }
  },

  Loader: {
    FileTypes: {
      AudioFile: require('loader/filetypes/AudioFile'),
    },
    File: require('loader/File'),
    FileTypesManager: require('loader/FileTypesManager'),
    GetURL: require('loader/GetURL'),
    LoaderPlugin: require('loader/LoaderPlugin'),
  },

  Math: {
    Between: require('math/Between'),
    Clamp: require('math/Clamp'),
    Distance: require('math/distance'),
    DegToRad: require('math/DegToRad'),
    FloatBetween: require('math/FloatBetween'),
    Linear: require('math/Linear'),
    RadToDeg: require('math/RadToDeg'),
    Vector2: require('math/Vector2'),
  },
  Display: {
    Masks: require('display/mask'),
    Color: require('display/color')
  },

});

if (typeof FEATURE_SOUND) {
  Phaser.Sound = require('sound');
}

module.exports = Phaser;
global.Phaser = Phaser;