import { getPosition, ui32ToCol } from 'shared/src/utils';
import { EntityRenderManager } from '../managers/entityRenderManager';
import { Depths } from '../types';
import { Collision, LeavesTrail, Projectile } from 'shared/src/ecs/components';
import { getSquaredDistance } from 'shared/src/ai/functions';
import { getPersistTrails } from 'src/ui/components/editor';
import { MAX_STRING_DIST_SQ, TrailType } from '../components';

const PERSISTED_TRAIL_ALPHA = 0.4;

type MakeTrail = (
  projEid: number,
  renderManager: EntityRenderManager,
  scene: Phaser.Scene,
) => void;

const beadTrail: MakeTrail = (projEid, renderManager, scene) => {
  const { x, y } = getPosition(projEid);
  const radius = Collision.radius[projEid];
  const col = ui32ToCol(LeavesTrail.col[projEid]);
  const circle = scene.add.circle(x, y, radius, col, 1).setVisible(true);
  circle.setDepth(Depths.PROJECTILES);
  renderManager.createChild(projEid, circle);
};

const manyBeadsTrail: MakeTrail = (projEid, renderManager, scene) => {
  const { x, y } = getPosition(projEid);
  const radius = Collision.radius[projEid];
  const col = ui32ToCol(LeavesTrail.col[projEid]);
  const circle = scene.add.circle(x, y, radius, col, 1).setVisible(false);
  circle.setDepth(Depths.PROJECTILES);
  const lastChild = renderManager.getLastChild(projEid);
  if (lastChild) {
    const bead = lastChild as Phaser.GameObjects.Arc;
    const dx = x - bead.x;
    const dy = y - bead.y;
    const stepX = dx / 4; // 2 extra circles => divide by 3
    const stepY = dy / 4;
    renderManager.createChild(
      projEid,
      scene.add.circle(x + stepX, y + stepY, radius, col, 1),
    );
    renderManager.createChild(
      projEid,
      scene.add.circle(x + stepX * 2, y + stepY * 2, radius, col, 1),
    );
    renderManager.createChild(
      projEid,
      scene.add.circle(x + stepX * 3, y + stepY * 3, radius, col, 1),
    );
  }
  renderManager.createChild(projEid, circle);
};

const beadsOnAStringTrail: MakeTrail = (projEid, renderManager, scene) => {
  const { x, y } = getPosition(projEid);
  const radius = Collision.radius[projEid];
  const col = ui32ToCol(LeavesTrail.col[projEid]);
  const circle = scene.add.circle(x, y, radius, col, 1).setVisible(false);
  circle.setDepth(Depths.PROJECTILES);
  const lastChild = renderManager.getLastChild(projEid) as Phaser.GameObjects.Arc;
  const bead = lastChild || renderManager.getObject(Projectile.parent[projEid]);
  if (bead) {
    const sqDist = getSquaredDistance(circle, bead);
    const line = scene.add.graphics();
    const sizeRatio = sqDist / MAX_STRING_DIST_SQ;
    const max = radius * 2.5;
    const size = lastChild ? max / sizeRatio : max;
    line.lineStyle(Math.min(max, size), col);
    line.lineBetween(bead.x, bead.y, x, y);
    line.setDepth(Depths.PROJECTILES);
    renderManager.createChild(projEid, line);
    const children = renderManager.getChildren(projEid);
    for (let i = 0; i < children.length; i++) {
      if (i >= children.length - 5) {
        (children[i] as Phaser.GameObjects.Graphics).setAlpha(1);
      } else {
        (children[i] as Phaser.GameObjects.Graphics).setAlpha(0.7);
      }
    }
  }
  renderManager.createChild(projEid, circle);
};

export const makeTrail: MakeTrail = (projEid, renderManager, scene) => {
  if (getPersistTrails()) {
    const existing = renderManager.getChildren(projEid);
    if (existing.length > 0) {
      for (const child of existing) {
        (child as Phaser.GameObjects.Graphics).setAlpha(PERSISTED_TRAIL_ALPHA);
      }
    }
  }
  switch (LeavesTrail.type[projEid]) {
    case TrailType.BEADS_ON_A_STRING:
      return beadsOnAStringTrail(projEid, renderManager, scene);
    case TrailType.MANY_BEADS:
      return manyBeadsTrail(projEid, renderManager, scene);
    case TrailType.BEADS:
      return beadTrail(projEid, renderManager, scene);
    default:
      return;
  }
};

export const dimTrail: MakeTrail = (projEid, renderManager) => {
  const children = renderManager.getChildren(projEid);
  for (let i = children.length - 1; i > 0; i--) {
    const c = children[i] as Phaser.GameObjects.Graphics;
    if (c.alpha === 0.7) {
      break;
    } else {
      c.setAlpha(0.7);
    }
  }
};
