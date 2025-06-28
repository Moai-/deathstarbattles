interface PositionedDestructibleObject {
  x: number;
  y: number;
  setPosition: (
    x?: number,
    y?: number,
    z?: number,
    w?: number,
  ) => Phaser.GameObjects.GameObject;
  destroy: (fromScene?: boolean) => void;
}

export const nailToContainer = (
  container: Phaser.GameObjects.Container,
  obj: PositionedDestructibleObject,
) => {
  return new Proxy(container, {
    get(target, prop, receiver) {
      if (prop === 'setPosition') {
        return function (x: number, y?: number, z?: number, w?: number) {
          const result = target.setPosition(x, y, z, w);
          obj.setPosition(x, y ?? 0);
          return result;
        };
      }

      if (prop === 'destroy') {
        return function (fromScene = false) {
          const result = target.destroy(fromScene);
          obj.destroy(fromScene);
          return result;
        };
      }

      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      if (prop === 'x' || prop === 'y') {
        Reflect.set(target, prop, value, receiver);
        if (prop === 'x') obj.x = value;
        if (prop === 'y') obj.y = value;
        return true;
      }

      return Reflect.set(target, prop, value, receiver);
    },
  });
};

export const rotateToward = <
  T extends Phaser.GameObjects.Components.Transform & { rotation: number },
>(
  obj: T,
  tx: number,
  ty: number,
  leadAngle = Math.PI / 2,
): void => {
  obj.rotation = Phaser.Math.Angle.Between(obj.x, obj.y, tx, ty) + leadAngle;
};
