import { stampFeathered } from "src/render/utils";

type EllipticalMaskOpts = {
  x: number;
  y: number;
  outerRadius: number;

  tilt: number;       // 0..1
  rotation: number;   // radians

  featherFrac?: number; // 0..1, how wide the fade band is (default 0.22)
  padFrac?: number;     // extra padding outside radius (default 0.35)
};

export const makeEllipticalMask = (
  scene: Phaser.Scene,
  opts: EllipticalMaskOpts,
) => {
  const featherFrac = opts.featherFrac ?? 0.22;
  const padFrac = opts.padFrac ?? 0.35;

  const axisRatio = Phaser.Math.Linear(1.0, 0.15, Phaser.Math.Clamp(opts.tilt, 0, 1));

  const pad = opts.outerRadius * padFrac;
  const size = Math.ceil((opts.outerRadius + pad) * 2);
  const cx = size / 2;
  const cy = size / 2;

  const rt = scene.make.renderTexture({ width: size, height: size }).setVisible(false);
  rt.clear();

  const g = scene.add.graphics().setVisible(false);

  g.setPosition(cx, cy);
  g.setRotation(opts.rotation);
  g.setScale(1, axisRatio);

  // Stamp a white feathered circle in local space at (0,0)
  // Because of scaleY, it becomes an ellipse.
  const featherSteps = 18; // smooth gradient
  const r = opts.outerRadius;

  // Make the edge fade band: larger feather => softer edge
  // featherFrac controls how “wide” the fade is.
  // We emulate a “harder” interior by stamping twice:
  // - big soft stamp
  // - smaller stronger stamp
  const softAlpha = 1.0;
  const hardAlpha = 1.0;

  // Outer soft (gives the fade-to-zero at the edge)
  stampFeathered(g, 0, 0, r, 0xffffff, softAlpha, featherSteps);

  // Inner reinforcement (keeps center closer to fully opaque)
  const innerR = r * (1 - featherFrac);
  if (innerR > 0) {
    stampFeathered(g, 0, 0, innerR, 0xffffff, hardAlpha, Math.floor(featherSteps * 0.6));
  }

  rt.draw(g);
  g.destroy();

  return { rt, size };
};

export const applyMask = (targetTex: Phaser.GameObjects.RenderTexture, scene: Phaser.Scene, opts: EllipticalMaskOpts) => {
  const targetKey = Phaser.Math.RND.uuid();
  targetTex.saveTexture(targetKey);

  const {rt} = makeEllipticalMask(scene, opts);

  const maskKey = Phaser.Math.RND.uuid();
  rt.saveTexture(maskKey);

  const targetImg = scene.add
    .image(0, 0, targetKey)
    .setOrigin(0, 0)
    .setVisible(false);

  const maskImg = scene.add
    .image(opts.x, opts.y, maskKey)
    .setOrigin(0.5, 0.5)
    .setVisible(false);

  const bitmapMask = maskImg.createBitmapMask();
  targetImg.setMask(bitmapMask);



  const cleanUp = () => {
    maskImg.destroy();
    rt.destroy();
    targetTex.destroy();

    scene.textures.remove(targetKey);
    scene.textures.remove(maskKey);
  }

  return {targetImg, cleanUp};
}