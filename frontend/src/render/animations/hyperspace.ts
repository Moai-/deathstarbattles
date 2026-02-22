import { AnyPoint } from 'shared/src/types';
import { Depths } from '../types';

export default class Hyperspace extends Phaser.GameObjects.Container {
  private circle: Phaser.GameObjects.Arc;
  private isIn: boolean;

  constructor(
    scene: Phaser.Scene,
    pos: AnyPoint,
    radius: number,
    isIn: boolean = false, // default: fade-out animation
  ) {
    const { x, y } = pos;
    super(scene, x, y);
    this.setDepth(Depths.GFX);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.isIn = isIn;

    // Create a white circle covering the station
    this.circle = scene.add.circle(0, 0, radius, 0xffffff);
    this.circle.setAlpha(isIn ? 0 : 0); // Start transparent for both
    this.add(this.circle);

    scene.add.existing(this);
  }

  play(
    onFullOpaque: () => void,
    onDone: () => void = () => {},
    duration = 1000,
  ) {
    const fadeInDuration = duration * 0.3; // Quick fade in
    const fadeOutDuration = duration * 0.7; // Slow fade out

    const timelineSteps: Phaser.Types.Time.TimelineEventConfig[] = [];

    if (!this.isIn) {
      // Hyperspace out (fade in quickly, then fade out slowly)
      timelineSteps.push({
        at: 0,
        tween: {
          targets: this.circle,
          alpha: 1,
          ease: 'Sine.easeIn',
          duration: fadeInDuration,
          onComplete: onFullOpaque,
        },
      });
      timelineSteps.push({
        at: fadeInDuration,
        tween: {
          targets: this.circle,
          alpha: 0,
          ease: 'Sine.easeOut',
          duration: fadeOutDuration,
          onComplete: onDone,
        },
      });
    } else {
      // Hyperspace in (fade in slowly, then fade out quickly)
      timelineSteps.push({
        at: 0,
        tween: {
          targets: this.circle,
          alpha: 1,
          ease: 'Sine.easeOut',
          duration: fadeOutDuration,
          onComplete: onFullOpaque,
        },
      });
      timelineSteps.push({
        at: fadeOutDuration,
        tween: {
          targets: this.circle,
          alpha: 0,
          ease: 'Sine.easeIn',
          duration: fadeInDuration,
          onComplete: onDone,
        },
      });
    }

    const timeline = this.scene.add.timeline(timelineSteps);

    // Cleanup after complete
    timeline.on('complete', () => this.destroy());

    timeline.play();
  }
}
