import type { Inspectable } from "./Inspectable.js"
import type { MutableList } from "./MutableList.js"
import type { EmptyMutableQueue, TypeId } from "./MutableQueue.impl.js"
import type { Pipeable } from "./Pipeable.js"

export * from "./internal/Jumpers/MutableQueue.js"
export * from "./MutableQueue.impl.js"

export declare namespace MutableQueue {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export type * from "./MutableQueue.impl.js"
}
/**
 * @since 2.0.0
 * @category model
 */
export interface MutableQueue<A> extends Iterable<A>, Pipeable, Inspectable {
  readonly [TypeId]: TypeId

  /** @internal */
  queue: MutableList<A>
  /** @internal */
  capacity: number | undefined
}

/**
 * @since 2.0.0
 */
export declare namespace MutableQueue {
  /**
   * @since 2.0.0
   */
  export type Empty = typeof EmptyMutableQueue
}
