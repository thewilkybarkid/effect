export * from "./internal/Jumpers/RuntimeFlags.js"
export * from "./RuntimeFlags.impl.js"

export declare namespace RuntimeFlags {
  // eslint-disable-next-line import/no-cycle
  // @ts-expect-error
  export type * from "./RuntimeFlags.impl.js"
}
/**
 * Represents a set of `RuntimeFlag`s. `RuntimeFlag`s affect the operation of
 * the Effect runtime system. They are exposed to application-level code because
 * they affect the behavior and performance of application code.
 *
 * @since 2.0.0
 * @category models
 */
export type RuntimeFlags = number & {
  readonly RuntimeFlags: unique symbol
}
