import { Renderable } from './components/renderable';
import renderMap from './objects';
import renderBoundaryIndicator from './objects/boundaryIndicator';
export class GameObjectManager {
    constructor(scene) {
        this.scene = scene;
        this.objects = new Map();
        this.children = new Map();
        this.boundaryIndicators = new Map();
    }
    create(eid) {
        this.objects.set(eid, this.renderEntity(eid));
    }
    createChild(eid, child) {
        if (!this.children.has(eid)) {
            this.children.set(eid, []);
        }
        this.children.get(eid)?.push(child);
    }
    getLastChild(eid) {
        if (this.children.has(eid)) {
            const children = this.children.get(eid);
            if (children && children.length) {
                return children[children.length - 1];
            }
        }
    }
    get(eid) {
        return this.objects.get(eid);
    }
    remove(eid) {
        const obj = this.objects.get(eid);
        if (obj) {
            obj.destroy();
            this.objects.delete(eid);
        }
    }
    getChildren(eid) {
        if (!this.children.has(eid)) {
            return [];
        }
        return this.children.get(eid) || [];
    }
    hideChildren(eid) {
        if (this.children.has(eid)) {
            for (const child of this.children.get(eid)) {
                child.setVisible(false);
            }
        }
    }
    showChildren(eid) {
        if (this.children.has(eid)) {
            for (const child of this.children.get(eid)) {
                child.setVisible(true);
            }
        }
    }
    hideAllchildren() {
        for (const [_, value] of this.children.entries()) {
            for (const child of value) {
                child.setVisible(false);
            }
        }
    }
    removeChildren(eid) {
        if (this.children.has(eid)) {
            for (const child of this.children.get(eid)) {
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
    updatePosition(eid, x, y) {
        const obj = this.objects.get(eid);
        if (obj && 'x' in obj && 'y' in obj) {
            obj.x = x;
            obj.y = y;
        }
    }
    upsertBoundaryIndicator(eid, { x, y }, angle, distance) {
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
    removeBoundaryIndicator(eid) {
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
    renderEntity(eid) {
        const renderType = Renderable.type[eid];
        return renderMap[renderType](this.scene, eid);
    }
}
