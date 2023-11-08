import type { Equal } from "./Equal.js"
import type { TypeId } from "./HashSet.impl.js"
import type { Inspectable } from "./Inspectable.js"
import type { Pipeable } from "./Pipeable.js"

export * from "./HashSet.impl.js"
export * from "./internal/Jumpers/HashSet.js"

export declare namespace HashSet {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export type * from "./HashSet.impl.js"
}
/**
 * @since 2.0.0
 * @category models
 */
export interface HashSet<A> extends Iterable<A>, Equal, Pipeable, Inspectable {
  readonly [TypeId]: TypeId
}
