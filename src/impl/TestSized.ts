/**
 * @since 2.0.0
 */
import * as Context from "../Context.js"
import type * as Effect from "../Effect.js"
import type * as FiberRef from "../FiberRef.js"
import * as core from "../internal/core.js"
import type { TestSized } from "../TestSized.js"

/**
 * @since 2.0.0
 */
export const TestSizedTypeId = Symbol.for("effect/TestSized")

/**
 * @since 2.0.0
 */
export type TestSizedTypeId = typeof TestSizedTypeId

/**
 * @since 2.0.0
 */
export const Tag: Context.Tag<TestSized, TestSized> = Context.Tag(TestSizedTypeId)

/** @internal */
class SizedImpl implements TestSized {
  readonly [TestSizedTypeId]: TestSizedTypeId = TestSizedTypeId
  constructor(readonly fiberRef: FiberRef.FiberRef<number>) {}
  size(): Effect.Effect<never, never, number> {
    return core.fiberRefGet(this.fiberRef)
  }
  withSize(size: number) {
    return <R, E, A>(effect: Effect.Effect<R, E, A>): Effect.Effect<R, E, A> =>
      core.fiberRefLocally(this.fiberRef, size)(effect)
  }
}

/**
 * @since 2.0.0
 */
export const make = (size: number): TestSized => new SizedImpl(core.fiberRefUnsafeMake(size))

/**
 * @since 2.0.0
 */
export const fromFiberRef = (fiberRef: FiberRef.FiberRef<number>): TestSized => new SizedImpl(fiberRef)
