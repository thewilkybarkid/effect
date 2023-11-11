import * as Chunk from "../../Chunk.js"
import { dual, pipe } from "../../Function.js"
import * as Option from "../../Option.js"
import * as Interval from "../../ScheduleInterval.js"
import type * as Intervals from "../../ScheduleIntervals.js"

/** @internal */
const IntervalsSymbolKey = "effect/ScheduleIntervals"

/** @internal */
export const IntervalsTypeId: Intervals.IntervalsTypeId = Symbol.for(
  IntervalsSymbolKey
) as Intervals.IntervalsTypeId

/** @internal */
export const make = (intervals: Chunk.Chunk<Interval.ScheduleInterval>): Intervals.ScheduleIntervals => {
  return {
    [IntervalsTypeId]: IntervalsTypeId,
    intervals
  }
}
/** @internal */
export const empty: Intervals.ScheduleIntervals = make(Chunk.empty())

/** @internal */
export const fromIterable = (intervals: Iterable<Interval.ScheduleInterval>): Intervals.ScheduleIntervals =>
  Array.from(intervals).reduce(
    (intervals, interval) => pipe(intervals, union(make(Chunk.of(interval)))),
    empty
  )

/** @internal */
export const union = dual<
  (that: Intervals.ScheduleIntervals) => (self: Intervals.ScheduleIntervals) => Intervals.ScheduleIntervals,
  (self: Intervals.ScheduleIntervals, that: Intervals.ScheduleIntervals) => Intervals.ScheduleIntervals
>(2, (self, that) => {
  if (!Chunk.isNonEmpty(that.intervals)) {
    return self
  }
  if (!Chunk.isNonEmpty(self.intervals)) {
    return that
  }
  if (Chunk.headNonEmpty(self.intervals).startMillis < Chunk.headNonEmpty(that.intervals).startMillis) {
    return unionLoop(
      Chunk.tailNonEmpty(self.intervals),
      that.intervals,
      Chunk.headNonEmpty(self.intervals),
      Chunk.empty()
    )
  }
  return unionLoop(
    self.intervals,
    Chunk.tailNonEmpty(that.intervals),
    Chunk.headNonEmpty(that.intervals),
    Chunk.empty()
  )
})

/** @internal */
const unionLoop = (
  _self: Chunk.Chunk<Interval.ScheduleInterval>,
  _that: Chunk.Chunk<Interval.ScheduleInterval>,
  _interval: Interval.ScheduleInterval,
  _acc: Chunk.Chunk<Interval.ScheduleInterval>
): Intervals.ScheduleIntervals => {
  let self = _self
  let that = _that
  let interval = _interval
  let acc = _acc
  while (Chunk.isNonEmpty(self) || Chunk.isNonEmpty(that)) {
    if (!Chunk.isNonEmpty(self) && Chunk.isNonEmpty(that)) {
      if (interval.endMillis < Chunk.headNonEmpty(that).startMillis) {
        acc = pipe(acc, Chunk.prepend(interval))
        interval = Chunk.headNonEmpty(that)
        that = Chunk.tailNonEmpty(that)
        self = Chunk.empty()
      } else {
        interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(that).endMillis)
        that = Chunk.tailNonEmpty(that)
        self = Chunk.empty()
      }
    } else if (Chunk.isNonEmpty(self) && Chunk.isEmpty(that)) {
      if (interval.endMillis < Chunk.headNonEmpty(self).startMillis) {
        acc = pipe(acc, Chunk.prepend(interval))
        interval = Chunk.headNonEmpty(self)
        that = Chunk.empty()
        self = Chunk.tailNonEmpty(self)
      } else {
        interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(self).endMillis)
        that = Chunk.empty()
        self = Chunk.tailNonEmpty(self)
      }
    } else if (Chunk.isNonEmpty(self) && Chunk.isNonEmpty(that)) {
      if (Chunk.headNonEmpty(self).startMillis < Chunk.headNonEmpty(that).startMillis) {
        if (interval.endMillis < Chunk.headNonEmpty(self).startMillis) {
          acc = pipe(acc, Chunk.prepend(interval))
          interval = Chunk.headNonEmpty(self)
          self = Chunk.tailNonEmpty(self)
        } else {
          interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(self).endMillis)
          self = Chunk.tailNonEmpty(self)
        }
      } else if (interval.endMillis < Chunk.headNonEmpty(that).startMillis) {
        acc = pipe(acc, Chunk.prepend(interval))
        interval = Chunk.headNonEmpty(that)
        that = Chunk.tailNonEmpty(that)
      } else {
        interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(that).endMillis)
        that = Chunk.tailNonEmpty(that)
      }
    } else {
      throw new Error("BUG: Intervals.unionLoop - please report an issue at https://github.com/Effect-TS/effect/issues")
    }
  }
  return make(pipe(acc, Chunk.prepend(interval), Chunk.reverse))
}

/** @internal */
export const intersect = dual<
  (that: Intervals.ScheduleIntervals) => (self: Intervals.ScheduleIntervals) => Intervals.ScheduleIntervals,
  (self: Intervals.ScheduleIntervals, that: Intervals.ScheduleIntervals) => Intervals.ScheduleIntervals
>(2, (self, that) => intersectLoop(self.intervals, that.intervals, Chunk.empty()))

/** @internal */
const intersectLoop = (
  _left: Chunk.Chunk<Interval.ScheduleInterval>,
  _right: Chunk.Chunk<Interval.ScheduleInterval>,
  _acc: Chunk.Chunk<Interval.ScheduleInterval>
): Intervals.ScheduleIntervals => {
  let left = _left
  let right = _right
  let acc = _acc
  while (Chunk.isNonEmpty(left) && Chunk.isNonEmpty(right)) {
    const interval = pipe(Chunk.headNonEmpty(left), Interval.intersect(Chunk.headNonEmpty(right)))
    const intervals = Interval.isEmpty(interval) ? acc : pipe(acc, Chunk.prepend(interval))
    if (pipe(Chunk.headNonEmpty(left), Interval.lessThan(Chunk.headNonEmpty(right)))) {
      left = Chunk.tailNonEmpty(left)
    } else {
      right = Chunk.tailNonEmpty(right)
    }
    acc = intervals
  }
  return make(Chunk.reverse(acc))
}

/** @internal */
export const start = (self: Intervals.ScheduleIntervals): number => {
  return pipe(
    self.intervals,
    Chunk.head,
    Option.getOrElse(() => Interval.empty)
  ).startMillis
}

/** @internal */
export const end = (self: Intervals.ScheduleIntervals): number => {
  return pipe(
    self.intervals,
    Chunk.head,
    Option.getOrElse(() => Interval.empty)
  ).endMillis
}

/** @internal */
export const lessThan = dual<
  (that: Intervals.ScheduleIntervals) => (self: Intervals.ScheduleIntervals) => boolean,
  (self: Intervals.ScheduleIntervals, that: Intervals.ScheduleIntervals) => boolean
>(2, (self, that) => start(self) < start(that))

/** @internal */
export const isNonEmpty = (self: Intervals.ScheduleIntervals): boolean => {
  return Chunk.isNonEmpty(self.intervals)
}

/** @internal */
export const max = dual<
  (that: Intervals.ScheduleIntervals) => (self: Intervals.ScheduleIntervals) => Intervals.ScheduleIntervals,
  (self: Intervals.ScheduleIntervals, that: Intervals.ScheduleIntervals) => Intervals.ScheduleIntervals
>(2, (self, that) => lessThan(self, that) ? that : self)
