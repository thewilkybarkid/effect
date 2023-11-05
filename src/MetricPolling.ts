/**
 * @since 2.0.0
 */
import type { Effect } from "./Effect.js"
import type { Fiber } from "./Fiber.js"
import * as internal from "./internal/metric/polling.js"
import type { Metric } from "./Metric.js"
import type { Pipeable } from "./Pipeable.js"
import type { Schedule } from "./Schedule.js"
import type { Scope } from "./Scope.js"

/**
 * @since 2.0.0
 * @category symbols
 */
export const PollingMetricTypeId: unique symbol = internal.PollingMetricTypeId

/**
 * @since 2.0.0
 * @category symbols
 */
export type PollingMetricTypeId = typeof PollingMetricTypeId

export * as PollingMetric from "./MetricPolling.js"

declare module "./MetricPolling.js" {
  /**
   * A `PollingMetric` is a combination of a metric and an effect that polls for
   * updates to the metric.
   *
   * @since 2.0.0
   * @category models
   */
  export interface PollingMetric<Type, In, R, E, Out> extends Pipeable {
    readonly [PollingMetricTypeId]: PollingMetricTypeId
    /**
     * The metric that this `PollingMetric` polls to update.
     */
    readonly metric: Metric<Type, In, Out>
    /**
     * An effect that polls a value that may be fed to the metric.
     */
    readonly poll: Effect<R, E, In>
  }
}

/**
 * Constructs a new polling metric from a metric and poll effect.
 *
 * @since 2.0.0
 * @category constructors
 */
export const make: <Type, In, Out, R, E>(
  metric: Metric<Type, In, Out>,
  poll: Effect<R, E, In>
) => PollingMetric<Type, In, R, E, Out> = internal.make

/**
 * Collects all of the polling metrics into a single polling metric, which
 * polls for, updates, and produces the outputs of all individual metrics.
 *
 * @since 2.0.0
 * @category constructors
 */
export const collectAll: <R, E, Out>(
  iterable: Iterable<PollingMetric<any, any, R, E, Out>>
) => PollingMetric<Array<any>, Array<any>, R, E, Array<Out>> = internal.collectAll

/**
 * Returns an effect that will launch the polling metric in a background
 * fiber, using the specified schedule.
 *
 * @since 2.0.0
 * @category utils
 */
export const launch: {
  <R2, A2>(
    schedule: Schedule<R2, unknown, A2>
  ): <Type, In, R, E, Out>(
    self: PollingMetric<Type, In, R, E, Out>
  ) => Effect<R2 | R | Scope, never, Fiber<E, A2>>
  <Type, In, R, E, Out, R2, A2>(
    self: PollingMetric<Type, In, R, E, Out>,
    schedule: Schedule<R2, unknown, A2>
  ): Effect<Scope | R | R2, never, Fiber<E, A2>>
} = internal.launch

/**
 * An effect that polls a value that may be fed to the metric.
 *
 * @since 2.0.0
 * @category utils
 */
export const poll: <Type, In, R, E, Out>(self: PollingMetric<Type, In, R, E, Out>) => Effect<R, E, In> = internal.poll

/**
 * An effect that polls for a value and uses the value to update the metric.
 *
 * @since 2.0.0
 * @category utils
 */
export const pollAndUpdate: <Type, In, R, E, Out>(
  self: PollingMetric<Type, In, R, E, Out>
) => Effect<R, E, void> = internal.pollAndUpdate

/**
 * Returns a new polling metric whose poll function will be retried with the
 * specified retry policy.
 *
 * @since 2.0.0
 * @category constructors
 */
export const retry: {
  <R2, E, _>(
    policy: Schedule<R2, E, _>
  ): <Type, In, R, Out>(self: PollingMetric<Type, In, R, E, Out>) => PollingMetric<Type, In, R2 | R, E, Out>
  <Type, In, R, Out, R2, E, _>(
    self: PollingMetric<Type, In, R, E, Out>,
    policy: Schedule<R2, E, _>
  ): PollingMetric<Type, In, R | R2, E, Out>
} = internal.retry

/**
 * Zips this polling metric with the specified polling metric.
 *
 * @since 2.0.0
 * @category utils
 */
export const zip: {
  <Type2, In2, R2, E2, Out2>(
    that: PollingMetric<Type2, In2, R2, E2, Out2>
  ): <Type, In, R, E, Out>(
    self: PollingMetric<Type, In, R, E, Out>
  ) => PollingMetric<
    readonly [Type, Type2], // readonly because invariant
    readonly [In, In2], // readonly because contravariant
    R2 | R,
    E2 | E,
    [Out, Out2]
  >
  <Type, In, R, E, Out, Type2, In2, R2, E2, Out2>(
    self: PollingMetric<Type, In, R, E, Out>,
    that: PollingMetric<Type2, In2, R2, E2, Out2>
  ): PollingMetric<
    readonly [Type, Type2], // readonly because invariant
    readonly [In, In2], // readonly because contravariant
    R | R2,
    E | E2,
    [Out, Out2]
  >
} = internal.zip
