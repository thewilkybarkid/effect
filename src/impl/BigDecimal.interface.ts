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
