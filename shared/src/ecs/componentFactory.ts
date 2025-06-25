import { defineComponent } from 'bitecs';
import type { ComponentType, ISchema } from 'bitecs';

export const makeComponent = <S extends ISchema>(schema: S): ComponentType<S> =>
  defineComponent(schema);

export const cloneComponent = <S extends ISchema>(
  original: ComponentType<S>,
): ComponentType<S> => defineComponent(original.$schema);

export type Schema = ISchema;
