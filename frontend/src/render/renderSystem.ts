import { defineQuery, enterQuery, defineSystem, exitQuery } from 'bitecs';
import { Position } from 'shared/src/ecs/components/position';
import { Renderable } from './components/renderable';
import { GameObjectManager } from './objectManager';
import { LeavesTrail } from './components/leavesTrail';
import { Collision } from 'shared/src/ecs/components/collision';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { getPosition, ui32ToCol } from '../util';
import { AnyPoint } from 'shared/src/types';

const renderQuery = defineQuery([Position, Renderable]);
const renderQueryEnter = enterQuery(renderQuery);
const renderQueryExit = exitQuery(renderQuery);

const trailQuery = defineQuery([Position, LeavesTrail]);

const projectileQuery = defineQuery([Projectile]);

export const createRenderSystem = (
  scene: Phaser.Scene,
  objectManager: GameObjectManager,
) => {
  return defineSystem((world) => {
    const enteredEntities = renderQueryEnter(world);

    for (const eid of enteredEntities) {
      objectManager.create(eid);
    }

    const exitedEntities = renderQueryExit(world);

    for (const eid of exitedEntities) {
      objectManager.remove(eid);
    }

    const updatedEntities = renderQuery(world);

    for (const eid of updatedEntities) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      objectManager.updatePosition(eid, x, y);
    }

    const updatedTrails = trailQuery(world);

    for (const eid of updatedTrails) {
      const x = Position.x[eid];
      const y = Position.y[eid];
      const radius = Collision.radius[eid];
      const col = ui32ToCol(LeavesTrail.col[eid]);
      const circle = scene.add.circle(x, y, radius, col, 1);
      objectManager.createChild(eid, circle);
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
