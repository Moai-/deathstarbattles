import { Renderable } from './components/renderable';
import renderMap from './objects';
import { RenderableTypes } from './types';

export class GameObjectManager {
  private objects = new Map<number, Phaser.GameObjects.GameObject>();
  private children = new Map<number, Array<Phaser.GameObjects.GameObject>>();

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
