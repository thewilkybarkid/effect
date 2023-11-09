import { dual, pipe } from "../../exports/Function.js"
import { Option } from "../../exports/Option.js"
import type { Order } from "../../exports/Order.js"
import type { Predicate } from "../../exports/Predicate.js"
import { ReadonlyArray } from "../../exports/ReadonlyArray.js"
import { SortedMap } from "../../exports/SortedMap.js"
import type { STM } from "../../exports/STM.js"
import type { TPriorityQueue } from "../../exports/TPriorityQueue.js"
import type { TRef } from "../../exports/TRef.js"
import * as core from "./core.js"
import * as tRef from "./tRef.js"

/** @internal */
const TPriorityQueueSymbolKey = "effect/TPriorityQueue"

/** @internal */
export const TPriorityQueueTypeId: TPriorityQueue.TPriorityQueueTypeId = Symbol.for(
  TPriorityQueueSymbolKey
) as TPriorityQueue.TPriorityQueueTypeId

/** @internal */
const tPriorityQueueVariance = {
  _A: (_: never) => _
}

/** @internal */
export class TPriorityQueueImpl<A> implements TPriorityQueue<A> {
  readonly [TPriorityQueueTypeId] = tPriorityQueueVariance
  constructor(readonly ref: TRef<SortedMap<A, [A, ...Array<A>]>>) {}
}

/** @internal */
export const empty = <A>(order: Order<A>): STM<never, never, TPriorityQueue<A>> =>
  pipe(
    tRef.make(SortedMap.empty<A, [A, ...Array<A>]>(order)),
    core.map((ref) => new TPriorityQueueImpl(ref))
  )

/** @internal */
export const fromIterable = <A>(order: Order<A>) => (iterable: Iterable<A>): STM<never, never, TPriorityQueue<A>> =>
  pipe(
    tRef.make(
      Array.from(iterable).reduce(
        (map, value) =>
          pipe(
            map,
            SortedMap.set(
              value,
              pipe(
                map,
                SortedMap.get(value),
                Option.match({
                  onNone: () => ReadonlyArray.of(value),
                  onSome: ReadonlyArray.prepend(value)
                })
              )
            )
          ),
        SortedMap.empty<A, [A, ...Array<A>]>(order)
      )
    ),
    core.map((ref) => new TPriorityQueueImpl(ref))
  )

/** @internal */
export const isEmpty = <A>(self: TPriorityQueue<A>): STM<never, never, boolean> =>
  core.map(tRef.get(self.ref), SortedMap.isEmpty)

/** @internal */
export const isNonEmpty = <A>(self: TPriorityQueue<A>): STM<never, never, boolean> =>
  core.map(tRef.get(self.ref), SortedMap.isNonEmpty)

/** @internal */
export const make = <A>(order: Order<A>) => (...elements: Array<A>): STM<never, never, TPriorityQueue<A>> =>
  fromIterable(order)(elements)

/** @internal */
export const offer = dual<
  <A>(value: A) => (self: TPriorityQueue<A>) => STM<never, never, void>,
  <A>(self: TPriorityQueue<A>, value: A) => STM<never, never, void>
>(2, (self, value) =>
  tRef.update(self.ref, (map) =>
    SortedMap.set(
      map,
      value,
      Option.match(SortedMap.get(map, value), {
        onNone: () => ReadonlyArray.of(value),
        onSome: ReadonlyArray.prepend(value)
      })
    )))

/** @internal */
export const offerAll = dual<
  <A>(values: Iterable<A>) => (self: TPriorityQueue<A>) => STM<never, never, void>,
  <A>(self: TPriorityQueue<A>, values: Iterable<A>) => STM<never, never, void>
>(2, (self, values) =>
  tRef.update(self.ref, (map) =>
    Array.from(values).reduce(
      (map, value) =>
        SortedMap.set(
          map,
          value,
          Option.match(SortedMap.get(map, value), {
            onNone: () => ReadonlyArray.of(value),
            onSome: ReadonlyArray.prepend(value)
          })
        ),
      map
    )))

/** @internal */
export const peek = <A>(self: TPriorityQueue<A>): STM<never, never, A> =>
  core.withSTMRuntime((runtime) => {
    const map = tRef.unsafeGet(self.ref, runtime.journal)
    return Option.match(
      SortedMap.headOption(map),
      {
        onNone: () => core.retry,
        onSome: (elements) => core.succeed(elements[0])
      }
    )
  })

/** @internal */
export const peekOption = <A>(self: TPriorityQueue<A>): STM<never, never, Option<A>> =>
  tRef.modify(self.ref, (map) => [
    Option.map(SortedMap.headOption(map), (elements) => elements[0]),
    map
  ])

/** @internal */
export const removeIf = dual<
  <A>(predicate: Predicate<A>) => (self: TPriorityQueue<A>) => STM<never, never, void>,
  <A>(self: TPriorityQueue<A>, predicate: Predicate<A>) => STM<never, never, void>
>(2, (self, predicate) => retainIf(self, (a) => !predicate(a)))

/** @internal */
export const retainIf = dual<
  <A>(predicate: Predicate<A>) => (self: TPriorityQueue<A>) => STM<never, never, void>,
  <A>(self: TPriorityQueue<A>, predicate: Predicate<A>) => STM<never, never, void>
>(
  2,
  <A>(self: TPriorityQueue<A>, predicate: Predicate<A>) =>
    tRef.update(
      self.ref,
      (map) =>
        SortedMap.reduce(map, SortedMap.empty(SortedMap.getOrder(map)), (map, value, key) => {
          const filtered: ReadonlyArray<A> = ReadonlyArray.filter(value, predicate)
          return filtered.length > 0 ?
            SortedMap.set(map, key, filtered as [A, ...Array<A>]) :
            SortedMap.remove(map, key)
        })
    )
)

/** @internal */
export const size = <A>(self: TPriorityQueue<A>): STM<never, never, number> =>
  tRef.modify(
    self.ref,
    (map) => [SortedMap.reduce(map, 0, (n, as) => n + as.length), map]
  )

/** @internal */
export const take = <A>(self: TPriorityQueue<A>): STM<never, never, A> =>
  core.withSTMRuntime((runtime) => {
    const map = tRef.unsafeGet(self.ref, runtime.journal)
    return Option.match(SortedMap.headOption(map), {
      onNone: () => core.retry,
      onSome: (values) => {
        const head = values[1][0]
        const tail = values[1].slice(1)
        tRef.unsafeSet(
          self.ref,
          tail.length > 0 ?
            SortedMap.set(map, head, tail as [A, ...Array<A>]) :
            SortedMap.remove(map, head),
          runtime.journal
        )
        return core.succeed(head)
      }
    })
  })

/** @internal */
export const takeAll = <A>(self: TPriorityQueue<A>): STM<never, never, Array<A>> =>
  tRef.modify(self.ref, (map) => {
    const builder: Array<A> = []
    for (const entry of map) {
      builder.push(...entry[1])
    }
    return [builder, SortedMap.empty(SortedMap.getOrder(map))]
  })

/** @internal */
export const takeOption = <A>(self: TPriorityQueue<A>): STM<never, never, Option<A>> =>
  core.effect<never, Option<A>>((journal) => {
    const map = pipe(self.ref, tRef.unsafeGet(journal))
    return Option.match(SortedMap.headOption(map), {
      onNone: (): Option<A> => Option.none(),
      onSome: ([key, value]) => {
        const tail = value.slice(1)
        tRef.unsafeSet(
          self.ref,
          tail.length > 0 ?
            SortedMap.set(map, key, tail as [A, ...Array<A>]) :
            SortedMap.remove(map, key),
          journal
        )
        return Option.some(value[0])
      }
    })
  })

/** @internal */
export const takeUpTo = dual<
  (n: number) => <A>(self: TPriorityQueue<A>) => STM<never, never, Array<A>>,
  <A>(self: TPriorityQueue<A>, n: number) => STM<never, never, Array<A>>
>(2, <A>(self: TPriorityQueue<A>, n: number) =>
  tRef.modify(self.ref, (map) => {
    const builder: Array<A> = []
    const iterator = map[Symbol.iterator]()
    let updated = map
    let index = 0
    let next: IteratorResult<readonly [A, [A, ...Array<A>]], any>
    while ((next = iterator.next()) && !next.done && index < n) {
      const [key, value] = next.value
      const [left, right] = pipe(value, ReadonlyArray.splitAt(n - index))
      builder.push(...left)
      if (right.length > 0) {
        updated = SortedMap.set(updated, key, right as [A, ...Array<A>])
      } else {
        updated = SortedMap.remove(updated, key)
      }
      index = index + left.length
    }
    return [builder, updated]
  }))

/** @internal */
export const toChunk = <A>(self: TPriorityQueue<A>): STM<never, never, Array<A>> =>
  tRef.modify(self.ref, (map) => {
    const builder: Array<A> = []
    for (const entry of map) {
      builder.push(...entry[1])
    }
    return [builder, map]
  })

/** @internal */
export const toReadonlyArray = <A>(self: TPriorityQueue<A>): STM<never, never, ReadonlyArray<A>> =>
  tRef.modify(self.ref, (map) => {
    const builder: Array<A> = []
    for (const entry of map) {
      builder.push(...entry[1])
    }
    return [builder, map]
  })
