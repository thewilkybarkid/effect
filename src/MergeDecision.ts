/**
 * @since 2.0.0
 */
import type { Effect } from "./exports/Effect.js"
import type { Exit } from "./exports/Exit.js"
import * as internal from "./internal/channel/mergeDecision.js"

import type { MergeDecision } from "./exports/MergeDecision.js"

/**
 * @since 2.0.0
 * @category symbols
 */
export const MergeDecisionTypeId: unique symbol = internal.MergeDecisionTypeId

/**
 * @since 2.0.0
 * @category symbols
 */
export type MergeDecisionTypeId = typeof MergeDecisionTypeId

/**
 * @since 2.0.0
 * @category constructors
 */
export const Done: <R, E, Z>(effect: Effect<R, E, Z>) => MergeDecision<R, unknown, unknown, E, Z> = internal.Done

/**
 * @since 2.0.0
 * @category constructors
 */
export const Await: <R, E0, Z0, E, Z>(
  f: (exit: Exit<E0, Z0>) => Effect<R, E, Z>
) => MergeDecision<R, E0, Z0, E, Z> = internal.Await

/**
 * @since 2.0.0
 * @category constructors
 */
export const AwaitConst: <R, E, Z>(effect: Effect<R, E, Z>) => MergeDecision<R, unknown, unknown, E, Z> =
  internal.AwaitConst

/**
 * Returns `true` if the specified value is a `MergeDecision`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export const isMergeDecision: (u: unknown) => u is MergeDecision<unknown, unknown, unknown, unknown, unknown> =
  internal.isMergeDecision

/**
 * @since 2.0.0
 * @category folding
 */
export const match: {
  <R, E0, Z0, E, Z, Z2>(
    options: {
      readonly onDone: (effect: Effect<R, E, Z>) => Z2
      readonly onAwait: (f: (exit: Exit<E0, Z0>) => Effect<R, E, Z>) => Z2
    }
  ): (self: MergeDecision<R, E0, Z0, E, Z>) => Z2
  <R, E0, Z0, E, Z, Z2>(
    self: MergeDecision<R, E0, Z0, E, Z>,
    options: {
      readonly onDone: (effect: Effect<R, E, Z>) => Z2
      readonly onAwait: (f: (exit: Exit<E0, Z0>) => Effect<R, E, Z>) => Z2
    }
  ): Z2
} = internal.match
