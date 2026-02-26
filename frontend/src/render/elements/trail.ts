import { getPosition, ui32ToCol } from 'shared/src/utils';
import {
  LeavesTrail,
  MAX_STRING_DIST_SQ,
  TrailType,
} from '../components/leavesTrail';
import { GameObjectManager } from '../objectManager';
import { Depths } from '../types';
import { Collision, Projectile } from 'shared/src/ecs/components';
import { getSquaredDistance } from 'shared/src/ai/functions';
import { getPersistTrails } from 'src/editorOptions';

const PERSISTED_TRAIL_ALPHA = 0.4;

type MakeTrail = (
  projEid: number,
  manager: GameObjectManager,
  scene: Phaser.Scene,
) => void;

const beadTrail: MakeTrail = (projEid, manager, scene) => {
  const { x, y } = getPosition(projEid);
  const radius = Collision.radius[projEid];
  const col = ui32ToCol(LeavesTrail.col[projEid]);
  const circle = scene.add.circle(x, y, radius, col, 1).setVisible(true);
  circle.setDepth(Depths.PROJECTILES);
  manager.createChild(projEid, circle);
};

const manyBeadsTrail: MakeTrail = (projEid, manager, scene) => {
  const { x, y } = getPosition(projEid);
  const radius = Collision.radius[projEid];
  const col = ui32ToCol(LeavesTrail.col[projEid]);
  const circle = scene.add.circle(x, y, radius, col, 1).setVisible(false);
  circle.setDepth(Depths.PROJECTILES);
  const lastChild = manager.getLastChild(projEid);
  if (lastChild) {
    const bead = lastChild as Phaser.GameObjects.Arc;
    const dx = x - bead.x;
    const dy = y - bead.y;
    const stepX = dx / 4; // 2 extra circles => divide by 3
    const stepY = dy / 4;
    manager.createChild(
      projEid,
      scene.add.circle(x + stepX, y + stepY, radius, col, 1),
    );
    manager.createChild(
      projEid,
      scene.add.circle(x + stepX * 2, y + stepY * 2, radius, col, 1),
    );
    manager.createChild(
      projEid,
      scene.add.circle(x + stepX * 3, y + stepY * 3, radius, col, 1),
    );
  }
  manager.createChild(projEid, circle);
};

const beadsOnAStringTrail: MakeTrail = (projEid, manager, scene) => {
  const { x, y } = getPosition(projEid);
  const radius = Collision.radius[projEid];
  const col = ui32ToCol(LeavesTrail.col[projEid]);
  const circle = scene.add.circle(x, y, radius, col, 1).setVisible(false);
  circle.setDepth(Depths.PROJECTILES);
  const lastChild = manager.getLastChild(projEid) as Phaser.GameObjects.Arc;
  const bead = lastChild || manager.getObject(Projectile.parent[projEid]);
  if (bead) {
    const sqDist = getSquaredDistance(circle, bead);
    const line = scene.add.graphics();
    const sizeRatio = sqDist / MAX_STRING_DIST_SQ;
    const max = radius * 2.5;
    const size = lastChild ? max / sizeRatio : max;
    line.lineStyle(Math.min(max, size), col);
    line.lineBetween(bead.x, bead.y, x, y);
    line.setDepth(Depths.PROJECTILES);
    manager.createChild(projEid, line);
    const children = manager.getChildren(projEid);
    for (let i = 0; i < children.length; i++) {
      if (i >= children.length - 5) {
        (children[i] as Phaser.GameObjects.Graphics).setAlpha(1);
      } else {
        (children[i] as Phaser.GameObjects.Graphics).setAlpha(0.7);
      }
    }
  }
  manager.createChild(projEid, circle);
};

export const makeTrail: MakeTrail = (projEid, manager, scene) => {
  if (getPersistTrails()) {
    const existing = manager.getChildren(projEid);
    if (existing.length > 0) {
      for (const child of existing) {
        (child as Phaser.GameObjects.Graphics).setAlpha(PERSISTED_TRAIL_ALPHA);
      }
    }
  }
  switch (LeavesTrail.type[projEid]) {
    case TrailType.BEADS_ON_A_STRING:
      return beadsOnAStringTrail(projEid, manager, scene);
    case TrailType.MANY_BEADS:
      return manyBeadsTrail(projEid, manager, scene);
    case TrailType.BEADS:
      return beadTrail(projEid, manager, scene);
    default:
      return;
  }
};

export const dimTrail: MakeTrail = (projEid, manager) => {
  const children = manager.getChildren(projEid);
  for (let i = children.length - 1; i > 0; i--) {
    const c = children[i] as Phaser.GameObjects.Graphics;
    if (c.alpha === 0.7) {
      break;
    } else {
      c.setAlpha(0.7);
    }
  }
};
