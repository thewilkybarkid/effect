import type { Chunk } from "../Chunk.js"
import { Clock } from "../Clock.js"
import { Duration } from "../Duration.js"
import type { Effect } from "../Effect.js"
import type { LazyArg } from "../Function.js"
import { constVoid, dual, identity, pipe } from "../Function.js"
import { globalValue } from "../GlobalValue.js"
import { HashSet } from "../HashSet.js"
import type { Metric } from "../Metric.js"
import type { MetricBoundaries } from "../MetricBoundaries.js"
import type { MetricHook } from "../MetricHook.js"
import type { MetricKey } from "../MetricKey.js"
import type { MetricKeyType } from "../MetricKeyType.js"
import type { MetricLabel } from "../MetricLabel.js"
import type { MetricPair } from "../MetricPair.js"
import type { MetricRegistry } from "../MetricRegistry.js"
import type { MetricState } from "../MetricState.js"
import { pipeArguments } from "../Pipeable.js"
import { ReadonlyArray } from "../ReadonlyArray.js"
import { Cause } from "./cause.js"
import * as _effect from "./core-effect.js"
import * as core from "./core.js"
import * as metricBoundaries from "./metric/boundaries.js"
import * as metricKey from "./metric/key.js"
import * as metricLabel from "./metric/label.js"
import * as metricRegistry from "./metric/registry.js"

/** @internal */
const MetricSymbolKey = "effect/Metric"

/** @internal */
export const MetricTypeId: Metric.MetricTypeId = Symbol.for(
  MetricSymbolKey
) as Metric.MetricTypeId

/** @internal */
const metricVariance = {
  _Type: (_: any) => _,
  _In: (_: unknown) => _,
  _Out: (_: never) => _
}

/** @internal */
export const globalMetricRegistry: MetricRegistry = globalValue(
  Symbol.for("effect/Metric/globalMetricRegistry"),
  () => metricRegistry.make()
)

/** @internal */
export const make: Metric.MetricApply = function<Type, In, Out>(
  keyType: Type,
  unsafeUpdate: (input: In, extraTags: HashSet<MetricLabel>) => void,
  unsafeValue: (extraTags: HashSet<MetricLabel>) => Out
): Metric<Type, In, Out> {
  const metric: Metric<Type, In, Out> = Object.assign(
    <R, E, A extends In>(effect: Effect<R, E, A>): Effect<R, E, A> =>
      core.tap(
        effect,
        (a) => core.sync(() => unsafeUpdate(a, HashSet.empty()))
      ),
    {
      [MetricTypeId]: metricVariance,
      keyType,
      unsafeUpdate,
      unsafeValue,
      pipe() {
        return pipeArguments(this, arguments)
      }
    } as const
  )
  return metric
}

/** @internal */
export const mapInput = dual<
  <In, In2>(f: (input: In2) => In) => <Type, Out>(self: Metric<Type, In, Out>) => Metric<Type, In2, Out>,
  <Type, In, Out, In2>(self: Metric<Type, In, Out>, f: (input: In2) => In) => Metric<Type, In2, Out>
>(2, (self, f) =>
  make(
    self.keyType,
    (input, extraTags) => self.unsafeUpdate(f(input), extraTags),
    self.unsafeValue
  ))

/** @internal */
export const counter: {
  (name: string, options?: {
    readonly description?: string
    readonly bigint?: false
    readonly incremental?: boolean
  }): Metric.Counter<number>
  (name: string, options: {
    readonly description?: string
    readonly bigint: true
    readonly incremental?: boolean
  }): Metric.Counter<bigint>
} = (name, options) => fromMetricKey(metricKey.counter(name, options as any)) as any

/** @internal */
export const frequency = (name: string, description?: string): Metric.Frequency<string> =>
  fromMetricKey(metricKey.frequency(name, description))

/** @internal */
export const withConstantInput = dual<
  <In>(input: In) => <Type, Out>(self: Metric<Type, In, Out>) => Metric<Type, unknown, Out>,
  <Type, In, Out>(self: Metric<Type, In, Out>, input: In) => Metric<Type, unknown, Out>
>(2, (self, input) => mapInput(self, () => input))

/** @internal */
export const fromMetricKey = <Type extends MetricKeyType<any, any>>(
  key: MetricKey<Type>
): Metric<
  Type,
  MetricKeyType.InType<Type>,
  MetricKeyType.OutType<Type>
> => {
  const hook = (extraTags: HashSet<MetricLabel>): MetricHook<
    MetricKeyType.InType<Type>,
    MetricKeyType.OutType<Type>
  > => {
    const fullKey = pipe(key, metricKey.taggedWithLabelSet(extraTags))
    return globalMetricRegistry.get(fullKey)
  }
  return make(
    key.keyType,
    (input, extraTags) => hook(extraTags).update(input),
    (extraTags) => hook(extraTags).get()
  )
}

/** @internal */
export const gauge: {
  (name: string, options?: {
    readonly description?: string
    readonly bigint?: false
  }): Metric.Gauge<number>
  (name: string, options: {
    readonly description?: string
    readonly bigint: true
  }): Metric.Gauge<bigint>
} = (name, options) => fromMetricKey(metricKey.gauge(name, options as any)) as any

/** @internal */
export const histogram = (name: string, boundaries: MetricBoundaries, description?: string) =>
  fromMetricKey(metricKey.histogram(name, boundaries, description))

/* @internal */
export const increment = (
  self: Metric.Counter<number> | Metric.Counter<bigint>
): Effect<never, never, void> =>
  update(self as Metric.Counter<number>, self.keyType.bigint ? BigInt(1) as any : 1)

/* @internal */
export const incrementBy = dual<
  {
    (amount: number): (self: Metric.Counter<number>) => Effect<never, never, void>
    (amount: bigint): (self: Metric.Counter<bigint>) => Effect<never, never, void>
  },
  {
    (self: Metric.Counter<number>, amount: number): Effect<never, never, void>
    (self: Metric.Counter<bigint>, amount: bigint): Effect<never, never, void>
  }
>(2, (self, amount) => update(self as any, amount))

/** @internal */
export const map = dual<
  <Out, Out2>(f: (out: Out) => Out2) => <Type, In>(self: Metric<Type, In, Out>) => Metric<Type, In, Out2>,
  <Type, In, Out, Out2>(self: Metric<Type, In, Out>, f: (out: Out) => Out2) => Metric<Type, In, Out2>
>(2, (self, f) =>
  make(
    self.keyType,
    self.unsafeUpdate,
    (extraTags) => f(self.unsafeValue(extraTags))
  ))

/** @internal */
export const mapType = dual<
  <Type, Type2>(
    f: (type: Type) => Type2
  ) => <In, Out>(
    self: Metric<Type, In, Out>
  ) => Metric<Type2, In, Out>,
  <Type, In, Out, Type2>(
    self: Metric<Type, In, Out>,
    f: (type: Type) => Type2
  ) => Metric<Type2, In, Out>
>(2, (self, f) => make(f(self.keyType), self.unsafeUpdate, self.unsafeValue))

/* @internal */
export const set = dual<
  {
    (value: number): (self: Metric.Gauge<number>) => Effect<never, never, void>
    (value: bigint): (self: Metric.Gauge<bigint>) => Effect<never, never, void>
  },
  {
    (self: Metric.Gauge<number>, value: number): Effect<never, never, void>
    (self: Metric.Gauge<bigint>, value: bigint): Effect<never, never, void>
  }
>(2, (self, value) => update(self as any, value))

/** @internal */
export const succeed = <Out>(out: Out): Metric<void, unknown, Out> => make(void 0 as void, constVoid, () => out)

/** @internal */
export const sync = <Out>(evaluate: LazyArg<Out>): Metric<void, unknown, Out> =>
  make(void 0 as void, constVoid, evaluate)

/** @internal */
export const summary = (
  options: {
    readonly name: string
    readonly maxAge: Duration.DurationInput
    readonly maxSize: number
    readonly error: number
    readonly quantiles: Chunk<number>
    readonly description?: string
  }
): Metric.Summary<number> => withNow(summaryTimestamp(options))

/** @internal */
export const summaryTimestamp = (
  options: {
    readonly name: string
    readonly maxAge: Duration.DurationInput
    readonly maxSize: number
    readonly error: number
    readonly quantiles: Chunk<number>
    readonly description?: string
  }
): Metric.Summary<readonly [value: number, timestamp: number]> => fromMetricKey(metricKey.summary(options))

/** @internal */
export const tagged = dual<
  <Type, In, Out>(key: string, value: string) => (self: Metric<Type, In, Out>) => Metric<Type, In, Out>,
  <Type, In, Out>(self: Metric<Type, In, Out>, key: string, value: string) => Metric<Type, In, Out>
>(3, (self, key, value) => taggedWithLabels(self, HashSet.make(metricLabel.make(key, value))))

/** @internal */
export const taggedWithLabelsInput = dual<
  <In>(
    f: (input: In) => Iterable<MetricLabel>
  ) => <Type, Out>(self: Metric<Type, In, Out>) => Metric<Type, In, void>,
  <Type, In, Out>(
    self: Metric<Type, In, Out>,
    f: (input: In) => Iterable<MetricLabel>
  ) => Metric<Type, In, void>
>(2, (self, f) =>
  map(
    make(
      self.keyType,
      (input, extraTags) =>
        self.unsafeUpdate(
          input,
          HashSet.union(HashSet.fromIterable(f(input)), extraTags)
        ),
      self.unsafeValue
    ),
    constVoid
  ))

/** @internal */
export const taggedWithLabels = dual<
  <Type, In, Out>(
    extraTags: Iterable<MetricLabel>
  ) => (self: Metric<Type, In, Out>) => Metric<Type, In, Out>,
  <Type, In, Out>(
    self: Metric<Type, In, Out>,
    extraTags: Iterable<MetricLabel>
  ) => Metric<Type, In, Out>
>(2, (self, extraTagsIterable) => {
  const extraTags = HashSet.isHashSet(extraTagsIterable) ? extraTagsIterable : HashSet.fromIterable(extraTagsIterable)
  return make(
    self.keyType,
    (input, extraTags1) => self.unsafeUpdate(input, pipe(extraTags, HashSet.union(extraTags1))),
    (extraTags1) => self.unsafeValue(pipe(extraTags, HashSet.union(extraTags1)))
  )
})

/** @internal */
export const timer = (name: string): Metric<
  MetricKeyType.Histogram,
  Duration,
  MetricState.Histogram
> => {
  const boundaries = metricBoundaries.exponential({
    start: 1,
    factor: 2,
    count: 100
  })
  const base = pipe(histogram(name, boundaries), tagged("time_unit", "milliseconds"))
  return mapInput(base, Duration.toMillis)
}

/** @internal */
export const timerWithBoundaries = (
  name: string,
  boundaries: Chunk<number>
): Metric<
  MetricKeyType.Histogram,
  Duration,
  MetricState.Histogram
> => {
  const base = pipe(
    histogram(name, metricBoundaries.fromChunk(boundaries)),
    tagged("time_unit", "milliseconds")
  )
  return mapInput(base, Duration.toMillis)
}

/* @internal */
export const trackAll = dual<
  <In>(
    input: In
  ) => <Type, Out>(
    self: Metric<Type, In, Out>
  ) => <R, E, A>(effect: Effect<R, E, A>) => Effect<R, E, A>,
  <Type, In, Out>(
    self: Metric<Type, In, Out>,
    input: In
  ) => <R, E, A>(effect: Effect<R, E, A>) => Effect<R, E, A>
>(2, (self, input) => (effect) =>
  core.matchCauseEffect(effect, {
    onFailure: (cause) => {
      self.unsafeUpdate(input, HashSet.empty())
      return core.failCause(cause)
    },
    onSuccess: (value) => {
      self.unsafeUpdate(input, HashSet.empty())
      return core.succeed(value)
    }
  }))

/* @internal */
export const trackDefect = dual<
  <Type, Out>(
    metric: Metric<Type, unknown, Out>
  ) => <R, E, A>(self: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E, A, Type, Out>(
    self: Effect<R, E, A>,
    metric: Metric<Type, unknown, Out>
  ) => Effect<R, E, A>
>(2, (self, metric) => trackDefectWith(self, metric, identity))

/* @internal */
export const trackDefectWith = dual<
  <Type, In, Out>(
    metric: Metric<Type, In, Out>,
    f: (defect: unknown) => In
  ) => <R, E, A>(self: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E, A, Type, In, Out>(
    self: Effect<R, E, A>,
    metric: Metric<Type, In, Out>,
    f: (defect: unknown) => In
  ) => Effect<R, E, A>
>(3, (self, metric, f) => {
  const updater = (defect: unknown): void => metric.unsafeUpdate(f(defect), HashSet.empty())
  return _effect.tapDefect(self, (cause) =>
    core.sync(() =>
      pipe(
        Cause.defects(cause),
        ReadonlyArray.forEach(updater)
      )
    ))
})

/* @internal */
export const trackDuration = dual<
  <Type, Out>(
    metric: Metric<Type, Duration, Out>
  ) => <R, E, A>(self: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E, A, Type, Out>(
    self: Effect<R, E, A>,
    metric: Metric<Type, Duration, Out>
  ) => Effect<R, E, A>
>(2, (self, metric) => trackDurationWith(self, metric, identity))

/* @internal */
export const trackDurationWith = dual<
  <Type, In, Out>(
    metric: Metric<Type, In, Out>,
    f: (duration: Duration.Duration) => In
  ) => <R, E, A>(effect: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E, A, Type, In, Out>(
    self: Effect<R, E, A>,
    metric: Metric<Type, In, Out>,
    f: (duration: Duration.Duration) => In
  ) => Effect<R, E, A>
>(3, (self, metric, f) =>
  Clock.clockWith((clock) => {
    const startTime = clock.unsafeCurrentTimeNanos()
    return core.map(self, (a) => {
      const endTime = clock.unsafeCurrentTimeNanos()
      const duration = Duration.nanos(endTime - startTime)
      metric.unsafeUpdate(f(duration), HashSet.empty())
      return a
    })
  }))

/* @internal */
export const trackError = dual<
  <Type, In, Out>(
    metric: Metric<Type, In, Out>
  ) => <R, E extends In, A>(self: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E extends In, A, Type, In, Out>(
    self: Effect<R, E, A>,
    metric: Metric<Type, In, Out>
  ) => Effect<R, E, A>
>(2, <R, E extends In, A, Type, In, Out>(
  self: Effect<R, E, A>,
  metric: Metric<Type, In, Out>
) => trackErrorWith(self, metric, (a: In) => a))

/* @internal */
export const trackErrorWith = dual<
  <Type, In, Out, In2>(
    metric: Metric<Type, In, Out>,
    f: (error: In2) => In
  ) => <R, E extends In2, A>(effect: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E extends In2, A, Type, In, Out, In2>(
    self: Effect<R, E, A>,
    metric: Metric<Type, In, Out>,
    f: (error: In2) => In
  ) => Effect<R, E, A>
>(3, <R, E extends In2, A, Type, In, Out, In2>(
  self: Effect<R, E, A>,
  metric: Metric<Type, In, Out>,
  f: (error: In2) => In
) => {
  const updater = (error: E): Effect<never, never, void> => update(metric, f(error))
  return _effect.tapError(self, updater)
})

/* @internal */
export const trackSuccess = dual<
  <Type, In, Out>(
    metric: Metric<Type, In, Out>
  ) => <R, E, A extends In>(self: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E, A extends In, Type, In, Out>(
    self: Effect<R, E, A>,
    metric: Metric<Type, In, Out>
  ) => Effect<R, E, A>
>(2, <R, E, A extends In, Type, In, Out>(
  self: Effect<R, E, A>,
  metric: Metric<Type, In, Out>
) => trackSuccessWith(self, metric, (a: In) => a))

/* @internal */
export const trackSuccessWith = dual<
  <Type, In, Out, In2>(
    metric: Metric<Type, In, Out>,
    f: (value: In2) => In
  ) => <R, E, A extends In2>(self: Effect<R, E, A>) => Effect<R, E, A>,
  <R, E, A extends In2, Type, In, Out, In2>(
    self: Effect<R, E, A>,
    metric: Metric<Type, In, Out>,
    f: (value: In2) => In
  ) => Effect<R, E, A>
>(3, <R, E, A extends In2, Type, In, Out, In2>(
  self: Effect<R, E, A>,
  metric: Metric<Type, In, Out>,
  f: (value: In2) => In
) => {
  const updater = (value: A): Effect<never, never, void> => update(metric, f(value))
  return core.tap(self, updater)
})

/* @internal */
export const update = dual<
  <In>(input: In) => <Type, Out>(self: Metric<Type, In, Out>) => Effect<never, never, void>,
  <Type, In, Out>(self: Metric<Type, In, Out>, input: In) => Effect<never, never, void>
>(2, (self, input) =>
  core.fiberRefGetWith(
    core.currentMetricLabels,
    (tags) => core.sync(() => self.unsafeUpdate(input, tags))
  ))

/* @internal */
export const value = <Type, In, Out>(
  self: Metric<Type, In, Out>
): Effect<never, never, Out> =>
  core.fiberRefGetWith(
    core.currentMetricLabels,
    (tags) => core.sync(() => self.unsafeValue(tags))
  )

/** @internal */
export const withNow = <Type, In, Out>(
  self: Metric<Type, readonly [In, number], Out>
): Metric<Type, In, Out> => mapInput(self, (input: In) => [input, Date.now()] as const)

/** @internal */
export const zip = dual<
  <Type2, In2, Out2>(
    that: Metric<Type2, In2, Out2>
  ) => <Type, In, Out>(
    self: Metric<Type, In, Out>
  ) => Metric<readonly [Type, Type2], readonly [In, In2], readonly [Out, Out2]>,
  <Type, In, Out, Type2, In2, Out2>(
    self: Metric<Type, In, Out>,
    that: Metric<Type2, In2, Out2>
  ) => Metric<readonly [Type, Type2], readonly [In, In2], readonly [Out, Out2]>
>(
  2,
  <Type, In, Out, Type2, In2, Out2>(self: Metric<Type, In, Out>, that: Metric<Type2, In2, Out2>) =>
    make(
      [self.keyType, that.keyType] as const,
      (input: readonly [In, In2], extraTags) => {
        const [l, r] = input
        self.unsafeUpdate(l, extraTags)
        that.unsafeUpdate(r, extraTags)
      },
      (extraTags) => [self.unsafeValue(extraTags), that.unsafeValue(extraTags)] as const
    )
)

/** @internal */
export const unsafeSnapshot = (): HashSet<MetricPair.Untyped> => globalMetricRegistry.snapshot()

/** @internal */
export const snapshot: Effect<never, never, HashSet<MetricPair.Untyped>> = core.sync(
  unsafeSnapshot
)
