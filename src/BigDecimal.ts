/**
 * This module provides utility functions and type class instances for working with the `BigDecimal` type in TypeScript.
 * It includes functions for basic arithmetic operations, as well as type class instances for `Equivalence` and `Order`.
 *
 * A `BigDecimal` allows storing any real number to arbitrary precision; which avoids common floating point errors
 * (such as 0.1 + 0.2 ≠ 0.3) at the cost of complexity.
 *
 * Internally, `BigDecimal` uses a `BigInt` object, paired with a 64-bit integer which determines the position of the
 * decimal point. Therefore, the precision *is not* actually arbitrary, but limited to 2<sup>63</sup> decimal places.
 *
 * It is not recommended to convert a floating point number to a decimal directly, as the floating point representation
 * may be unexpected.
 *
 * @since 2.0.0
 */

/**
 * @since 2.0.0
 * @internal
 */
export * from "./impl/BigDecimal.js"
/**
 * @since 2.0.0
 * @internal
 */
export * from "./impl/BigDecimal.interface.js"
/**
 * @since 2.0.0
 * @internal
 */
export * from "./internal/Jumpers/BigDecimal.js"

/**
 * @since 2.0.0
 */
export declare namespace BigDecimal {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export type * from "./impl/BigDecimal.js"
}
