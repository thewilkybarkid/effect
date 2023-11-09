import type { TestLiveTypeId } from "../TestLive.js"
import type { Effect } from "./Effect.js"

export * from "../internal/Jumpers/TestLive.js"
export * from "../TestLive.js"

export declare namespace TestLive {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export type * from "../TestLive.js"
}

/**
 * The `Live` trait provides access to the "live" default Effect services from
 * within tests for workflows such as printing test results to the console or
 * timing out tests where it is necessary to access the real implementations of
 * these services.
 *
 * @since 2.0.0
 */
export interface TestLive {
  readonly [TestLiveTypeId]: TestLiveTypeId
  provide<R, E, A>(effect: Effect<R, E, A>): Effect<R, E, A>
}
