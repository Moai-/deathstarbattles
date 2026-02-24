export const COMPONENT_NAME = Symbol.for("bitecs.componentName");

export function nameComponent<T extends object>(component: T, name: string): T {
  Object.defineProperty(component, COMPONENT_NAME, {
    value: name,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return component;
}

export function getComponentName(component: object): string | undefined {
  return (component as any)[COMPONENT_NAME];
}