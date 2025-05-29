import { AnyPoint } from 'shared/src/types';
import { Depths } from '../types';

export default class Explosion extends Phaser.GameObjects.Container {
  private circles: Array<Phaser.GameObjects.Arc> = [];

  constructor(
    scene: Phaser.Scene,
    pos: AnyPoint,
    innerRadius: number,
    colors: Array<number>,
  ) {
    const { x, y } = pos;
    super(scene, x, y);
    this.setDepth(Depths.GFX);
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Store the circle GameObjects
    this.circles = [];

    // Create and add concentric circles
    const totalCircles = colors.length;
    for (let i = 0; i < totalCircles; i++) {
      const circle = scene.add.circle(0, 0, innerRadius, colors[i]);
      circle.setAlpha(1); // Start fully visible
      circle.setScale(1); // Start at base scale
      this.add(circle);
      this.circles.push(circle);
    }

    // Add this container to the scene
    scene.add.existing(this);
  }

  play(duration = 1000) {
    const totalCircles = this.circles.length;
    const timelineSteps: Array<Phaser.Types.Time.TimelineEventConfig> = [];

    this.circles.forEach((circle, index) => {
      const expandScale = 3;
      const shrinkScale = 1.5;
      const expandDuration =
        duration * (0.4 + (0.6 * (index + 1)) / totalCircles);
      const shrinkDuration = (duration * 0.5 * (index + 1)) / totalCircles;

      // Add expand step
      timelineSteps.push({
        at: 0, // All tweens can start at 0 if overlapping is desired
        tween: {
          targets: circle,
          scale: expandScale,
          ease: 'Sine.easeOut',
          duration: expandDuration,
        },
      });

      // Add shrink and fade step (offset a bit for overlap)
      timelineSteps.push({
        at: expandDuration * 0.5, // Overlap with the expansion phase
        tween: {
          targets: circle,
          scale: shrinkScale,
          alpha: 0,
          ease: 'Sine.easeIn',
          duration: shrinkDuration,
        },
      });
    });

    // Create the timeline with steps
    const timeline = this.scene.add.timeline(timelineSteps);

    // Cleanup after complete
    timeline.on('complete', () => this.destroy());

    timeline.play();
  }
}

export const laserCols = [0x80332c, 0x930000, 0xb50000, 0xbe5f00, 0xbfc200];
export const stationCols = [0xed7504, 0xfee000, 0xf6f573, 0xf4f771, 0xfdf9f4];
