import type { IntervalTypeId } from "./ScheduleInterval.impl.js"

export * from "./internal/Jumpers/ScheduleInterval.js"
export * from "./ScheduleInterval.impl.js"

/**
 * An `Interval` represents an interval of time. ScheduleIntervals can encompass all
 * time, or no time at all.
 *
 * @since 2.0.0
 * @category models
 */
export interface Interval {
  readonly [IntervalTypeId]: IntervalTypeId
  readonly startMillis: number
  readonly endMillis: number
}

export declare namespace Interval {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export type * from "./ScheduleInterval.impl.js"
}
