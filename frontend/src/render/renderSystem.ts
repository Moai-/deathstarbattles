import { defineQuery, enterQuery, defineSystem, exitQuery } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Renderable } from './components/renderable';
import { GameObjectManager } from './objectManager';
import {
  LeavesTrail,
  MAX_STRING_DIST_SQ,
  TrailType,
} from './components/leavesTrail';
import { Collision } from 'shared/src/ecs/components/collision';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { AnyPoint } from 'shared/src/types';
import { Depths } from './types';
import { getSquaredDistance } from 'shared/src/ai/functions';
import { ui32ToCol, getPosition } from 'shared/src/utils';

const renderQuery = defineQuery([Position, Renderable]);
const renderQueryEnter = enterQuery(renderQuery);
const renderQueryExit = exitQuery(renderQuery);

const trailQuery = defineQuery([Position, LeavesTrail]);
const exitTrailQuery = exitQuery(trailQuery);

const projectileQuery = defineQuery([Projectile]);

export const createRenderSystem = (
  scene: Phaser.Scene,
  objectManager: GameObjectManager,
) => {
  return defineSystem((world) => {
    const enteredEntities = renderQueryEnter(world);

    for (const eid of enteredEntities) {
      objectManager.createObject(eid);
    }

    const exitedEntities = renderQueryExit(world);

    for (const eid of exitedEntities) {
      objectManager.removeObject(eid);
    }

    const updatedEntities = renderQuery(world);

    for (const eid of updatedEntities) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      objectManager.updateObjectPosition(eid, x, y);
    }

    const updatedTrails = trailQuery(world);

    for (const eid of updatedTrails) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      const trailType = LeavesTrail.type[eid];
      if (
        trailType === TrailType.BEADS ||
        trailType === TrailType.BEADS_ON_A_STRING ||
        trailType === TrailType.MANY_BEADS
      ) {
        const radius = Collision.radius[eid];
        const col = ui32ToCol(LeavesTrail.col[eid]);
        const circle = scene.add.circle(x, y, radius, col, 1).setVisible(false);
        circle.setDepth(Depths.PROJECTILES);
        if (trailType === TrailType.BEADS_ON_A_STRING) {
          const lastChild = objectManager.getLastChild(
            eid,
          ) as Phaser.GameObjects.Arc;
          const bead =
            lastChild || objectManager.getObject(Projectile.parent[eid]);
          // const bead = lastChild as Phaser.GameObjects.Arc;
          if (bead) {
            const sqDist = getSquaredDistance(circle, bead);
            const line = scene.add.graphics();
            const sizeRatio = sqDist / MAX_STRING_DIST_SQ;
            const max = radius * 2;
            const size = lastChild ? (radius * 2) / sizeRatio : max;
            circle.radius = Math.min(radius, radius / sizeRatio);
            line.lineStyle(Math.min(max, size), col);
            line.lineBetween(bead.x, bead.y, x, y);
            line.setDepth(Depths.PROJECTILES);
            objectManager.createChild(eid, line);
            const children = objectManager.getChildren(eid);
            for (let i = 0; i < children.length; i++) {
              if (i >= children.length - 5) {
                (children[i] as Phaser.GameObjects.Graphics).setAlpha(1);
              } else {
                (children[i] as Phaser.GameObjects.Graphics).setAlpha(0.7);
              }
            }
          }
        }
        if (trailType === TrailType.MANY_BEADS) {
          const lastChild = objectManager.getLastChild(eid);
          if (lastChild) {
            const bead = lastChild as Phaser.GameObjects.Arc;
            const dx = x - bead.x;
            const dy = y - bead.y;
            const stepX = dx / 4; // 2 extra circles => divide by 3
            const stepY = dy / 4;
            objectManager.createChild(
              eid,
              scene.add.circle(x + stepX, y + stepY, radius, col, 1),
            );
            objectManager.createChild(
              eid,
              scene.add.circle(x + stepX * 2, y + stepY * 2, radius, col, 1),
            );
            objectManager.createChild(
              eid,
              scene.add.circle(x + stepX * 3, y + stepY * 3, radius, col, 1),
            );
            // const midX = (bead.x + x) / 2;
            // const midY = (bead.y + y) / 2;
            // const nextBead = scene.add.circle(midX, midY, radius, col, 0.4);
            // objectManager.createChild(eid, nextBead);
          }
        }
        objectManager.createChild(eid, circle);
        // const children = objectManager.getChildren(eid);
        // const len = children.length;
        // for (let i = 0; i < len - 5; i++) {
        //   (children[i] as Phaser.GameObjects.Graphics).alpha = 0.4;
        // }
      }
    }

    const exitedTrails = exitTrailQuery(world);

    for (const eid of exitedTrails) {
      const children = objectManager.getChildren(eid);
      for (let i = children.length - 1; i > 0; i--) {
        const c = children[i] as Phaser.GameObjects.Graphics;
        if (c.alpha === 0.7) {
          break;
        } else {
          c.setAlpha(0.7);
        }
      }
    }

    const updatedProjectiles = projectileQuery(world);

    for (const eid of updatedProjectiles) {
      const x = Position.x[eid];
      const y = Position.y[eid];

      const bounds = new Phaser.Geom.Rectangle(
        0,
        0,
        scene.scale.width,
        scene.scale.height,
      );

      if (!bounds.contains(x, y)) {
        const sourcePos = getPosition(Projectile.parent[eid]);
        const dx = x - sourcePos.x;
        const dy = y - sourcePos.y;
        const angle = Math.atan2(dy, dx);
        const edgePoint = getEdgePoint(bounds, sourcePos, angle);
        const ex = x - edgePoint.x;
        const ey = y - edgePoint.y;
        const distance = Math.sqrt(ex * ex + ey * ey);

        objectManager.upsertBoundaryIndicator(eid, edgePoint, angle, distance);
      } else {
        objectManager.removeBoundaryIndicator(eid);
      }
    }

    return world;
  });
};

function getEdgePoint(
  rect: Phaser.Geom.Rectangle,
  centerPt: AnyPoint,
  angle: number,
) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const centerX = centerPt.x;
  const centerY = centerPt.y;

  // Extend the line far beyond the screen bounds
  const farPointX = centerX + dx * 10000;
  const farPointY = centerY + dy * 10000;

  const line = new Phaser.Geom.Line(centerX, centerY, farPointX, farPointY);
  const intersections: Phaser.Math.Vector2[] = [];

  // Check intersection with each rectangle side
  const sides = [
    new Phaser.Geom.Line(rect.left, rect.top, rect.right, rect.top), // Top
    new Phaser.Geom.Line(rect.right, rect.top, rect.right, rect.bottom), // Right
    new Phaser.Geom.Line(rect.right, rect.bottom, rect.left, rect.bottom), // Bottom
    new Phaser.Geom.Line(rect.left, rect.bottom, rect.left, rect.top), // Left
  ];

  for (const side of sides) {
    const intersection = new Phaser.Math.Vector2();
    if (Phaser.Geom.Intersects.LineToLine(line, side, intersection)) {
      intersections.push(intersection);
    }
  }

  if (intersections.length > 0) {
    // Find the closest intersection point
    intersections.sort(
      (a, b) =>
        Phaser.Math.Distance.Between(centerX, centerY, a.x, a.y) -
        Phaser.Math.Distance.Between(centerX, centerY, b.x, b.y),
    );
    return intersections[0];
  }

  // Fallback: center of screen
  return new Phaser.Math.Vector2(centerX, centerY);
}
