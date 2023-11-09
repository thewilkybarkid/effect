/**
 * @since 2.0.0
 */
import type * as Cause from "../Cause.js"
import type * as Chunk from "../Chunk.js"
import type * as Effect from "../Effect.js"
import type * as Exit from "../Exit.js"

/**
 * @since 2.0.0
 * @category models
 */
export interface EmitOps<R, E, A, B> {
  /**
   * Emits a chunk containing the specified values.
   */
  readonly chunk: (chunk: Chunk.Chunk<A>) => Promise<B>

  /**
   * Terminates with a cause that dies with the specified defect.
   */
  readonly die: <Err>(defect: Err) => Promise<B>

  /**
   * Terminates with a cause that dies with a `Throwable` with the specified
   * message.
   */
  readonly dieMessage: (message: string) => Promise<B>

  /**
   * Either emits the specified value if this `Exit` is a `Success` or else
   * terminates with the specified cause if this `Exit` is a `Failure`.
   */
  readonly done: (exit: Exit.Exit<E, A>) => Promise<B>

  /**
   * Terminates with an end of stream signal.
   */
  readonly end: () => Promise<B>

  /**
   * Terminates with the specified error.
   */
  readonly fail: (error: E) => Promise<B>

  /**
   * Either emits the success value of this effect or terminates the stream
   * with the failure value of this effect.
   */
  readonly fromEffect: (effect: Effect.Effect<R, E, A>) => Promise<B>

  /**
   * Either emits the success value of this effect or terminates the stream
   * with the failure value of this effect.
   */
  readonly fromEffectChunk: (effect: Effect.Effect<R, E, Chunk.Chunk<A>>) => Promise<B>

  /**
   * Terminates the stream with the specified cause.
   */
  readonly halt: (cause: Cause.Cause<E>) => Promise<B>

  /**
   * Emits a chunk containing the specified value.
   */
  readonly single: (value: A) => Promise<B>
}
