/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 * 
 * Modified for custom Phaser 3.88.2 build by Sergei Gmyria (2026)
 * Changes: 
 * - Modified for 3.88.2 (original was written for 3.50)
 * - Removed modules not used in this project
 * - Added modules that were used
 * 
 * For development, I recommend using the full Phaser package, then updating this file
 * when you know what packages your project will be using. In order to switch back to
 * the full version of Phaser, remove this line from `frontend/vite.config.mts`:
 * `phaser: path.resolve(__dirname, 'vendor/phaser-custom/dist/phaser-custom.js')`
 */

require('polyfills');

var CONST = require('const');
var Extend = require('utils/object/Extend');

/**
 * @namespace Phaser
 */

var Phaser = {
    BlendModes: require('renderer/BlendModes'),
    Cameras: { Scene2D: require('cameras/2d') },
    Core: require('core'),
    Class: require('utils/Class'),
    Display: { 
      Masks: require('display/mask'), 
      Color: require('display/color') 
    },
    Events: require('events/EventEmitter'),
    Geom: {
      Line: require('geom/line'),
      Rectangle: require('geom/rectangle'),
      Intersects: {
        LineToLine: require('geom/intersects/LineToLine.js')
      }
    },
    Game: require('core/Game'),
    GameObjects: {
        Arc: require('gameobjects/shape/arc/Arc'),
        Container: require('gameobjects/container/Container.js'),
        DisplayList: require('gameobjects/DisplayList'),
        GameObjectFactory: require('gameobjects/GameObjectFactory'),
        UpdateList: require('gameobjects/UpdateList'),
        Components: require('gameobjects/components'),
        BuildGameObject: require('gameobjects/BuildGameObject'),
        GameObject: require('gameobjects/GameObject'),
        Graphics: require('gameobjects/graphics/Graphics.js'),
        Image: require('gameobjects/image/Image'),
        Layer: require('gameobjects/layer/Layer'),
        RenderTexture: require('gameobjects/rendertexture/RenderTexture.js'),
        Shape: require('gameobjects/shape/Shape'),
        Triangle: require('gameobjects/shape/triangle/Triangle.js'),
        Factories: {
            Arc: require('gameobjects/shape/arc/ArcFactory'),
            Container: require('gameobjects/container/ContainerFactory'),
            Graphics: require('gameobjects/graphics/GraphicsFactory'),
            Image: require('gameobjects/image/ImageFactory'),
            Layer: require('gameobjects/layer/LayerFactory'),
            RenderTexture: require('gameobjects/rendertexture/RenderTextureFactory.js'),
            Triangle: require('gameobjects/shape/triangle/TriangleFactory.js'),
        },
        Creators: {
            RenderTexture: require('gameobjects/rendertexture/RenderTextureCreator.js'),
        }
    },
    Input: require('input'),
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
        DegToRad: require('math/DegToRad'),
        FloatBetween: require('math/FloatBetween'),
        Linear: require('math/Linear'),
        RadToDeg: require('math/RadToDeg'),
        Vector2: require('math/Vector2'),
    },
    Renderer: require('renderer'),
    Scale: require('scale'),
    ScaleModes: require('renderer/ScaleModes'),
    Scene: require('scene/Scene'),
    Scenes: require('scene'),
    Structs: require('structs'),
    Textures: require('textures'),
    Time: require('time'),
    Tweens: require('tweens')
};

//   Merge in the consts//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND)
{
    Phaser.Sound = require('sound');
}

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

/**
 * The root types namespace.
 *
 * @namespace Phaser.Types
 * @since 3.17.0
 */

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;