type Primitive = string | number | boolean | null | undefined | symbol | bigint;
type SnapshotIgnore = Date | Map<unknown, unknown> | Set<unknown> | Error | RegExp | Primitive;
export type DeepReadonly<T> = T extends SnapshotIgnore
  ? T
  : T extends Promise<unknown>
  ? Awaited<T>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
