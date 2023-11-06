import * as it from "effect-test/utils/extend"
import { Deferred } from "effect/Deferred"
import { Effect } from "effect/Effect"
import { Exit } from "effect/Exit"
import { Fiber } from "effect/Fiber"
import { Option } from "effect/Option"
import { SynchronizedRef } from "effect/SynchronizedRef"
import { assert, describe } from "vitest"

const current = "value"
const update = "new value"
const failure = "failure"

type State = Active | Changed | Closed

interface Active {
  readonly _tag: "Active"
}

interface Changed {
  readonly _tag: "Changed"
}

interface Closed {
  readonly _tag: "Closed"
}

export const Active: State = { _tag: "Active" }
export const Changed: State = { _tag: "Changed" }
export const Closed: State = { _tag: "Closed" }

const isActive = (self: State): boolean => self._tag === "Active"
const isChanged = (self: State): boolean => self._tag === "Changed"
const isClosed = (self: State): boolean => self._tag === "Closed"

describe.concurrent("SynchronizedRef", () => {
  it.effect("get", () =>
    Effect.gen(function*($) {
      const result = yield* $(SynchronizedRef.make(current), Effect.flatMap(SynchronizedRef.get))
      assert.strictEqual(result, current)
    }))
  it.effect("getAndUpdateEffect - happy path", () =>
    Effect.gen(function*($) {
      const ref = yield* $(SynchronizedRef.make(current))
      const result1 = yield* $(SynchronizedRef.getAndUpdateEffect(ref, () => Effect.succeed(update)))
      const result2 = yield* $(SynchronizedRef.get(ref))
      assert.strictEqual(result1, current)
      assert.strictEqual(result2, update)
    }))
  it.effect("getAndUpdateEffect - with failure", () =>
    Effect.gen(function*($) {
      const ref = yield* $(SynchronizedRef.make(current))
      const result = yield* $(SynchronizedRef.getAndUpdateEffect(ref, (_) => Effect.fail(failure)), Effect.exit)
      assert.deepStrictEqual(result, Exit.fail(failure))
    }))
  it.effect("getAndUpdateSomeEffect - happy path", () =>
    Effect.gen(function*($) {
      const ref = yield* $(SynchronizedRef.make<State>(Active))
      const result1 = yield* $(SynchronizedRef.getAndUpdateSomeEffect(ref, (state) =>
        isClosed(state) ?
          Option.some(Effect.succeed(Changed)) :
          Option.none()))
      const result2 = yield* $(SynchronizedRef.get(ref))
      assert.deepStrictEqual(result1, Active)
      assert.deepStrictEqual(result2, Active)
    }))
  it.effect("getAndUpdateSomeEffect - twice", () =>
    Effect.gen(function*($) {
      const ref = yield* $(SynchronizedRef.make<State>(Active))
      const result1 = yield* $(SynchronizedRef.getAndUpdateSomeEffect(ref, (state) =>
        isActive(state) ?
          Option.some(Effect.succeed(Changed)) :
          Option.none()))
      const result2 = yield* $(SynchronizedRef.getAndUpdateSomeEffect(ref, (state) =>
        isClosed(state)
          ? Option.some(Effect.succeed(Active))
          : isChanged(state)
          ? Option.some(Effect.succeed(Closed))
          : Option.none()))
      const result3 = yield* $(SynchronizedRef.get(ref))
      assert.deepStrictEqual(result1, Active)
      assert.deepStrictEqual(result2, Changed)
      assert.deepStrictEqual(result3, Closed)
    }))
  it.effect("getAndUpdateSomeEffect - with failure", () =>
    Effect.gen(function*($) {
      const ref = yield* $(SynchronizedRef.make<State>(Active))
      const result = yield* $(
        SynchronizedRef.getAndUpdateSomeEffect(ref, (state) =>
          isActive(state) ?
            Option.some(Effect.fail(failure)) :
            Option.none()),
        Effect.exit
      )
      assert.deepStrictEqual(result, Exit.fail(failure))
    }))
  it.effect("getAndUpdateSomeEffect - interrupt parent fiber and update", () =>
    Effect.gen(function*($) {
      const deferred = yield* $(Deferred.make<never, SynchronizedRef.SynchronizedRef<State>>())
      const latch = yield* $(Deferred.make<never, void>())
      const makeAndWait = Deferred.complete(deferred, SynchronizedRef.make<State>(Active)).pipe(
        Effect.zipRight(Deferred.await(latch))
      )
      const fiber = yield* $(Effect.fork(makeAndWait))
      const ref = yield* $(Deferred.await(deferred))
      yield* $(Fiber.interrupt(fiber))
      const result = yield* $(SynchronizedRef.updateAndGetEffect(ref, (_) => Effect.succeed(Closed)))
      assert.deepStrictEqual(result, Closed)
    }))
})
