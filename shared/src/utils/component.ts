const COMPONENT_META = Symbol.for("bitecs.componentMeta");

export type EditorControlType =
  | "number"
  | "slider"
  | "colour"
  | "enum"
  | "time"
  | "entity"
  | "angle"
  | "checkbox";

type EnumOption<T extends number | string = number | string> = {
  label: string;
  value: T;
};

type PropertyMeta = {
  label?: string;
  description?: string;

  control?: EditorControlType;

  step?: number;
  min?: number;
  max?: number;
  precision?: number;

  enumOptions?: ReadonlyArray<EnumOption>;

  readOnly?: boolean;
  hidden?: boolean;
};

type ComponentMeta = {
  name: string;
  description?: string;
  props?: Record<string, PropertyMeta>;
};

type RegisteredComponent = object;

const componentsByName = new Map<string, RegisteredComponent>();
const metaByComponent = new WeakMap<object, ComponentMeta>();

export function defineComponentMeta<T extends object>(
  component: T,
  meta: ComponentMeta
): T {
  Object.defineProperty(component, COMPONENT_META, {
    value: meta,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  metaByComponent.set(component, meta);

  const existing = componentsByName.get(meta.name);
  if (existing && existing !== component) {
    throw new Error(`A component named "${meta.name}" is already registered.`);
  }

  componentsByName.set(meta.name, component);

  return component;
}

export function getComponentMeta(component: object): ComponentMeta | undefined {
  return (component as any)[COMPONENT_META];
}

export function getComponentName(component: object): string | undefined {
  return getComponentMeta(component)?.name;
}

export function getPropertyMeta(
  component: object,
  prop: string
): PropertyMeta | undefined {
  return getComponentMeta(component)?.props?.[prop];
}

export function getComponentFromName<T extends object = object>(
  name: string
): T | undefined {
  return componentsByName.get(name) as T | undefined;
}

type EnumLike = Record<string, string | number>;

const formatEnum = (str: string) => str
  .split('_')
  .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
  .join(' ')

export function enumToOptions<E extends EnumLike>(
  e: E
): ReadonlyArray<{ label: string; value: E[keyof E] }> {
  return Object.keys(e)
    .filter((k) => Number.isNaN(Number(k)))
    .map((k) => ({
      label: formatEnum(k),
      value: e[k] as E[keyof E],
    }));
}