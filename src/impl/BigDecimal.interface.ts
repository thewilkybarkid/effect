import type { Equal } from "../Equal.js"
import type { Inspectable } from "../Inspectable.js"
import type { Pipeable } from "../Pipeable.js"
import type { TypeId } from "./BigDecimal.js"

/**
 * @since 2.0.0
 * @category models
 */
export interface BigDecimal extends Equal, Pipeable, Inspectable {
  readonly [TypeId]: TypeId
  readonly value: bigint
  readonly scale: number
  /** @internal */
  normalized?: BigDecimal
}

/**
 * @since 2.0.0
 * @internal
 */
export * from "./BigDecimal.js"

/**
 * @since 2.0.0
 */
export declare namespace BigDecimal {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export * from "./BigDecimal.js"
}
/**
 * @since 2.0.0
 * @internal
 */
export * from "../internal/Jumpers/BigDecimal.js"
