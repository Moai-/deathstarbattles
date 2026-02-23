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

    this.circles = [];

    const totalCircles = colors.length;
    for (let i = 0; i < totalCircles; i++) {
      const circle = scene.add.circle(0, 0, innerRadius, colors[i]);
      circle.setAlpha(1);
      circle.setScale(1);
      this.add(circle);
      this.circles.push(circle);
    }

    scene.add.existing(this);
  }

  playLaser(duration = 1000) {
    const totalCircles = this.circles.length;
    const timelineSteps: Array<Phaser.Types.Time.TimelineEventConfig> = [];

    this.circles.forEach((circle, index) => {
      const expandScale = 3;
      const shrinkScale = 1.5;
      const expandDuration =
        duration * (0.4 + (0.6 * (index + 1)) / totalCircles);
      const shrinkDuration = (duration * 0.5 * (index + 1)) / totalCircles;

      timelineSteps.push({
        at: 0,
        tween: {
          targets: circle,
          scale: expandScale,
          ease: 'Sine.easeOut',
          duration: expandDuration,
        },
      });

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

    const timeline = this.scene.add.timeline(timelineSteps);

    timeline.on('complete', () => {
      this.destroy();
    });

    timeline.play();
  }

  play(duration = 1000) {
    const total = this.circles.length;

    // timing proportions
    const expandFrac = 0.55; // % of `duration` spent expanding
    const staggerFrac = 0.25; // % used to stagger circle starts
    const expandDur = duration * expandFrac;
    const stagger = duration * staggerFrac;
    const delayStep = total > 1 ? stagger / (total - 1) : 0;

    const timelineSteps: Phaser.Types.Time.TimelineEventConfig[] = [];

    this.circles.forEach((circle, i) => {
      const delay = delayStep * i; // when this circle starts
      const expandScale = 3 - (1.5 * i) / (total - 1); 
      const shrinkScale = expandScale * 0.5; 

      // expansion
      timelineSteps.push({
        at: delay,
        tween: {
          targets: circle,
          scale: expandScale,
          ease: 'Sine.easeOut',
          duration: expandDur,
        },
      });

      const shrinkStart = delay + expandDur * 0.8; // overlap a bit
      const shrinkDur = duration - shrinkStart; // auto-fit
      timelineSteps.push({
        at: shrinkStart,
        tween: {
          targets: circle,
          scale: shrinkScale,
          alpha: 0,
          ease: 'Sine.easeIn',
          duration: shrinkDur,
        },
      });
    });

    const tl = this.scene.add.timeline(timelineSteps);
    tl.once('complete', () => this.destroy());
    tl.play();
  }
}

export const laserCols = [0x80332c, 0x930000, 0xb50000, 0xbe5f00, 0xbfc200];
export const stationCols = [0xed7504, 0xfee000, 0xf6f573, 0xf4f771, 0xfdf9f4];
