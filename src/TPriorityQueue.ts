/**
 * @since 2.0.0
 */
import type { Option } from "./exports/Option.js"
import type { Order } from "./exports/Order.js"
import type { Predicate } from "./exports/Predicate.js"
import type { STM } from "./exports/STM.js"
import * as internal from "./internal/stm/tPriorityQueue.js"

import type { TPriorityQueue } from "./exports/TPriorityQueue.js"

/**
 * @since 2.0.0
 * @category symbols
 */
export const TPriorityQueueTypeId: unique symbol = internal.TPriorityQueueTypeId

/**
 * @since 2.0.0
 * @category symbols
 */
export type TPriorityQueueTypeId = typeof TPriorityQueueTypeId

/**
 * Constructs a new empty `TPriorityQueue` with the specified `Order`.
 *
 * @since 2.0.0
 * @category constructors
 */
export const empty: <A>(order: Order<A>) => STM<never, never, TPriorityQueue<A>> = internal.empty

/**
 * Makes a new `TPriorityQueue` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
export const fromIterable: <A>(
  order: Order<A>
) => (iterable: Iterable<A>) => STM<never, never, TPriorityQueue<A>> = internal.fromIterable

/**
 * Checks whether the queue is empty.
 *
 * @since 2.0.0
 * @category getters
 */
export const isEmpty: <A>(self: TPriorityQueue<A>) => STM<never, never, boolean> = internal.isEmpty

/**
 * Checks whether the queue is not empty.
 *
 * @since 2.0.0
 * @category getters
 */
export const isNonEmpty: <A>(self: TPriorityQueue<A>) => STM<never, never, boolean> = internal.isNonEmpty

/**
 * Makes a new `TPriorityQueue` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
export const make: <A>(order: Order<A>) => (...elements: Array<A>) => STM<never, never, TPriorityQueue<A>> =
  internal.make

/**
 * Offers the specified value to the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
export const offer: {
  <A>(value: A): (self: TPriorityQueue<A>) => STM<never, never, void>
  <A>(self: TPriorityQueue<A>, value: A): STM<never, never, void>
} = internal.offer

/**
 * Offers all of the elements in the specified collection to the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
export const offerAll: {
  <A>(values: Iterable<A>): (self: TPriorityQueue<A>) => STM<never, never, void>
  <A>(self: TPriorityQueue<A>, values: Iterable<A>): STM<never, never, void>
} = internal.offerAll

/**
 * Peeks at the first value in the queue without removing it, retrying until a
 * value is in the queue.
 *
 * @since 2.0.0
 * @category getters
 */
export const peek: <A>(self: TPriorityQueue<A>) => STM<never, never, A> = internal.peek

/**
 * Peeks at the first value in the queue without removing it, returning `None`
 * if there is not a value in the queue.
 *
 * @since 2.0.0
 * @category getters
 */
export const peekOption: <A>(self: TPriorityQueue<A>) => STM<never, never, Option<A>> = internal.peekOption

/**
 * Removes all elements from the queue matching the specified predicate.
 *
 * @since 2.0.0
 * @category getters
 */
export const removeIf: {
  <A>(predicate: Predicate<A>): (self: TPriorityQueue<A>) => STM<never, never, void>
  <A>(self: TPriorityQueue<A>, predicate: Predicate<A>): STM<never, never, void>
} = internal.removeIf

/**
 * Retains only elements from the queue matching the specified predicate.
 *
 * @since 2.0.0
 * @category getters
 */
export const retainIf: {
  <A>(predicate: Predicate<A>): (self: TPriorityQueue<A>) => STM<never, never, void>
  <A>(self: TPriorityQueue<A>, predicate: Predicate<A>): STM<never, never, void>
} = internal.retainIf

/**
 * Returns the size of the queue.
 *
 * @since 2.0.0
 * @category getters
 */
export const size: <A>(self: TPriorityQueue<A>) => STM<never, never, number> = internal.size

/**
 * Takes a value from the queue, retrying until a value is in the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
export const take: <A>(self: TPriorityQueue<A>) => STM<never, never, A> = internal.take

/**
 * Takes all values from the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeAll: <A>(self: TPriorityQueue<A>) => STM<never, never, Array<A>> = internal.takeAll

/**
 * Takes a value from the queue, returning `None` if there is not a value in
 * the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeOption: <A>(self: TPriorityQueue<A>) => STM<never, never, Option<A>> = internal.takeOption

/**
 * Takes up to the specified maximum number of elements from the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeUpTo: {
  (n: number): <A>(self: TPriorityQueue<A>) => STM<never, never, Array<A>>
  <A>(self: TPriorityQueue<A>, n: number): STM<never, never, Array<A>>
} = internal.takeUpTo

/**
 * Collects all values into a chunk.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toArray: <A>(self: TPriorityQueue<A>) => STM<never, never, Array<A>> = internal.toChunk

/**
 * Collects all values into an array.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toReadonlyArray: <A>(self: TPriorityQueue<A>) => STM<never, never, ReadonlyArray<A>> =
  internal.toReadonlyArray
