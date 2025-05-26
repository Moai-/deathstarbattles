import { AnyPoint } from 'shared/src/types';
import { Renderable } from './components/renderable';
import renderMap from './objects';
import { RenderableTypes } from './types';
import renderBoundaryIndicator from './objects/boundaryIndicator';

export class GameObjectManager {
  private objects = new Map<number, Phaser.GameObjects.Container>();
  private children = new Map<number, Array<Phaser.GameObjects.GameObject>>();
  private boundaryIndicators = new Map<number, Phaser.GameObjects.Triangle>();

  constructor(private scene: Phaser.Scene) {}

  create(eid: number) {
    this.objects.set(eid, this.renderEntity(eid));
  }

  createChild(eid: number, child: Phaser.GameObjects.GameObject) {
    if (!this.children.has(eid)) {
      this.children.set(eid, []);
    }
    this.children.get(eid)?.push(child);
  }

  getLastChild(eid: number) {
    if (this.children.has(eid)) {
      const children = this.children.get(eid);
      if (children && children.length) {
        return children[children.length - 1];
      }
    }
  }

  get(eid: number) {
    return this.objects.get(eid);
  }

  remove(eid: number) {
    const obj = this.objects.get(eid);
    if (obj) {
      obj.destroy();
      this.objects.delete(eid);
    }
  }

  getChildren(eid: number): Array<Phaser.GameObjects.GameObject> {
    if (!this.children.has(eid)) {
      return [];
    }
    return this.children.get(eid) || [];
  }

  hideChildren(eid: number) {
    if (this.children.has(eid)) {
      for (const child of this.children.get(eid)!) {
        (child as Phaser.GameObjects.Graphics).setVisible(false);
      }
    }
  }

  showChildren(eid: number) {
    if (this.children.has(eid)) {
      for (const child of this.children.get(eid)!) {
        (child as Phaser.GameObjects.Graphics).setVisible(true);
      }
    }
  }

  hideAllchildren() {
    for (const [_, value] of this.children.entries()) {
      for (const child of value) {
        (child as Phaser.GameObjects.Graphics).setVisible(false);
      }
    }
  }

  removeChildren(eid: number) {
    if (this.children.has(eid)) {
      for (const child of this.children.get(eid)!) {
        child.destroy();
      }
    }
    this.children.delete(eid);
  }

  removeAllChildren() {
    for (const [_, value] of this.children.entries()) {
      for (const child of value) {
        child.destroy();
      }
    }
    this.children.clear();
  }

  updatePosition(eid: number, x: number, y: number) {
    const obj = this.objects.get(eid);
    if (obj && 'x' in obj && 'y' in obj) {
      obj.x = x;
      obj.y = y;
    }
  }

  upsertBoundaryIndicator(
    eid: number,
    { x, y }: AnyPoint,
    angle: number,
    distance: number,
  ) {
    let indicator = this.boundaryIndicators.get(eid);
    if (!indicator) {
      indicator = renderBoundaryIndicator(this.scene, eid);
      indicator.setVisible(true);

      this.boundaryIndicators.set(eid, indicator);
    }
    indicator.setRotation(angle - Math.PI / 2);
    indicator.setPosition(x, y);
    indicator.setScale(1, 1 + distance / 200);
  }

  removeBoundaryIndicator(eid: number) {
    const indicator = this.boundaryIndicators.get(eid);
    if (indicator) {
      indicator.destroy();
      this.boundaryIndicators.delete(eid);
    }
  }

  // playEffect(eid: number, fx: 'explosion' | 'teleport') {
  //   const obj = this.objects.get(eid);
  //   if (!obj) return;

  //   const effect = this.scene.add.sprite(obj.x, obj.y, fx);
  //   effect.play(fx);
  //   effect.once('animationcomplete', () => effect.destroy());
  // }

  private renderEntity(eid: number) {
    const renderType = Renderable.type[eid] as RenderableTypes;
    return renderMap[renderType](this.scene, eid);
  }
}
