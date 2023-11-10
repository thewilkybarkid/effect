/**
 * @since 2.0.0
 */
import type { PullAfterAllEnqueued, PullAfterNext, UpstreamPullStrategyTypeId } from "./impl/UpstreamPullStrategy.js"

/**
 * @since 2.0.0
 * @internal
 */
export * from "./impl/UpstreamPullStrategy.js"
/**
 * @since 2.0.0
 * @internal
 */
export * from "./internal/Jumpers/UpstreamPullStrategy.js"

/**
 * @since 2.0.0
 */
export declare namespace UpstreamPullStrategy {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export type * from "./impl/UpstreamPullStrategy.js"
}
/**
 * @since 2.0.0
 * @category models
 */
export type UpstreamPullStrategy<A> = PullAfterNext<A> | PullAfterAllEnqueued<A>

/**
 * @since 2.0.0
 */
export declare namespace UpstreamPullStrategy {
  /**
   * @since 2.0.0
   * @category models
   */
  export interface Variance<A> {
    readonly [UpstreamPullStrategyTypeId]: {
      readonly _A: (_: never) => A
    }
  }
}
