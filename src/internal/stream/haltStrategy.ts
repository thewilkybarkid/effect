import { dual } from "../../exports/Function.js"
import type { HaltStrategy } from "../../exports/StreamHaltStrategy.js"
import * as OpCodes from "../opCodes/streamHaltStrategy.js"

/** @internal */
export const Left: HaltStrategy = {
  _tag: OpCodes.OP_LEFT
}

/** @internal */
export const Right: HaltStrategy = {
  _tag: OpCodes.OP_RIGHT
}

/** @internal */
export const Both: HaltStrategy = {
  _tag: OpCodes.OP_BOTH
}

/** @internal */
export const Either: HaltStrategy = {
  _tag: OpCodes.OP_EITHER
}

/** @internal */
export const fromInput = (input: HaltStrategy.HaltStrategyInput): HaltStrategy => {
  switch (input) {
    case "left":
      return Left
    case "right":
      return Right
    case "both":
      return Both
    case "either":
      return Either
    default:
      return input
  }
}

/** @internal */
export const isLeft = (self: HaltStrategy): self is HaltStrategy.Left => self._tag === OpCodes.OP_LEFT

/** @internal */
export const isRight = (self: HaltStrategy): self is HaltStrategy.Right => self._tag === OpCodes.OP_RIGHT

/** @internal */
export const isBoth = (self: HaltStrategy): self is HaltStrategy.Both => self._tag === OpCodes.OP_BOTH

/** @internal */
export const isEither = (self: HaltStrategy): self is HaltStrategy.Either => self._tag === OpCodes.OP_EITHER

/** @internal */
export const match = dual<
  <Z>(onLeft: () => Z, onRight: () => Z, onBoth: () => Z, onEither: () => Z) => (self: HaltStrategy) => Z,
  <Z>(
    self: HaltStrategy,
    onLeft: () => Z,
    onRight: () => Z,
    onBoth: () => Z,
    onEither: () => Z
  ) => Z
>(5, <Z>(
  self: HaltStrategy,
  onLeft: () => Z,
  onRight: () => Z,
  onBoth: () => Z,
  onEither: () => Z
): Z => {
  switch (self._tag) {
    case OpCodes.OP_LEFT: {
      return onLeft()
    }
    case OpCodes.OP_RIGHT: {
      return onRight()
    }
    case OpCodes.OP_BOTH: {
      return onBoth()
    }
    case OpCodes.OP_EITHER: {
      return onEither()
    }
  }
})
