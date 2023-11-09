import type { Equal } from "./Equal.js"
import type { EffectTypeId, EffectUnify, EffectUnifyIgnore } from "./impl/Effect.js"
import type { Pipeable } from "./impl/Pipeable.js"
import type { Unify } from "./Unify.js"

// export * as Effect from "./impl/Effect.js" // causes errors
export * from "./impl/internal/Jumpers/Effect.js"

/**
 * The `Effect` interface defines a value that lazily describes a workflow or job.
 * The workflow requires some context `R`, and may fail with an error of type `E`,
 * or succeed with a value of type `A`.
 *
 * `Effect` values model resourceful interaction with the outside world, including
 * synchronous, asynchronous, concurrent, and parallel interaction. They use a
 * fiber-based concurrency model, with built-in support for scheduling, fine-grained
 * interruption, structured concurrency, and high scalability.
 *
 * To run an `Effect` value, you need a `Runtime`, which is a type that is capable
 * of executing `Effect` values.
 *
 * @since 2.0.0
 * @category models
 */
export interface Effect<R, E, A> extends Effect.Variance<R, E, A>, Equal.Equal, Pipeable {
  readonly [Unify.typeSymbol]?: unknown
  readonly [Unify.unifySymbol]?: EffectUnify<this>
  readonly [Unify.ignoreSymbol]?: EffectUnifyIgnore
}

/**
 * @since 2.0.0
 */
export declare namespace Effect {
  /**
   * @since 2.0.0
   * @category models
   */
  export interface Variance<R, E, A> {
    readonly [EffectTypeId]: VarianceStruct<R, E, A>
  }
  /**
   * @since 2.0.0
   * @category models
   */
  export interface VarianceStruct<R, E, A> {
    readonly _V: string
    readonly _R: (_: never) => R
    readonly _E: (_: never) => E
    readonly _A: (_: never) => A
  }
  /**
   * @since 2.0.0
   * @category models
   */
  export type Unify<Ret extends Effect<any, any, any>> = Effect<
    Context<Ret>,
    Error<Ret>,
    Success<Ret>
  >
  /**
   * @since 2.0.0
   * @category type-level
   */
  export type Context<T extends Effect<any, any, any>> = [T] extends [Effect<infer _R, infer _E, infer _A>] ? _R : never
  /**
   * @since 2.0.0
   * @category type-level
   */
  export type Error<T extends Effect<any, any, any>> = [T] extends [Effect<infer _R, infer _E, infer _A>] ? _E : never
  /**
   * @since 2.0.0
   * @category type-level
   */
  export type Success<T extends Effect<any, any, any>> = [T] extends [Effect<infer _R, infer _E, infer _A>] ? _A : never

  // @ts-expect-error
  export type * from "./impl/Effect.js"
}
