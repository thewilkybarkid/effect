import * as it from "effect-test/utils/extend"
import { unfoldEffect } from "effect-test/utils/unfoldEffect"
import { Chunk } from "effect/Chunk"
import { Effect } from "effect/Effect"
import { Either } from "effect/Either"
import { constVoid, pipe } from "effect/Function"
import { Option } from "effect/Option"
import { Random } from "effect/Random"
import { Sink } from "effect/Sink"
import { Stream } from "effect/Stream"
import { assert, describe } from "vitest"

const findSink = <A>(a: A): Sink<never, void, A, A, A> =>
  pipe(
    Sink.fold<Option<A>, A>(
      Option.none(),
      Option.isNone,
      (_, v) => (a === v ? Option.some(a) : Option.none())
    ),
    Sink.mapEffect(Option.match({
      onNone: () => Effect.failSync(constVoid),
      onSome: Effect.succeed
    }))
  )

const sinkRaceLaw = <E, A, L>(
  stream: Stream<never, never, A>,
  sink1: Sink<never, E, A, L, A>,
  sink2: Sink<never, E, A, L, A>
): Effect<never, never, boolean> =>
  pipe(
    Effect.all({
      result1: pipe(stream, Stream.run(sink1), Effect.either),
      result2: pipe(stream, Stream.run(sink2), Effect.either),
      result3: pipe(stream, Stream.run(pipe(sink1, Sink.raceBoth(sink2))), Effect.either)
    }),
    Effect.map(({ result1, result2, result3 }) =>
      pipe(
        result3,
        Either.match({
          onLeft: () => Either.isLeft(result1) || Either.isLeft(result2),
          onRight: Either.match({
            onLeft: (a) => Either.isRight(result1) && result1.right === a,
            onRight: (a) => Either.isRight(result2) && result2.right === a
          })
        })
      )
    )
  )

describe.concurrent("Sink", () => {
  // TODO: Research why this test is flaky.
  it.effect("raceBoth", () =>
    Effect.gen(function*($) {
      const ints = yield* $(unfoldEffect(
        0,
        (n) =>
          Effect.map(
            Random.nextIntBetween(0, 10),
            (i) => n <= 20 ? Option.some([i, n + 1] as const) : Option.none()
          )
      ))
      const success1 = yield* $(Random.nextBoolean)
      const success2 = yield* $(Random.nextBoolean)
      const chunk = pipe(
        Chunk.unsafeFromArray(ints),
        Chunk.appendAll(success1 ? Chunk.of(20) : Chunk.empty<number>()),
        Chunk.appendAll(success2 ? Chunk.of(40) : Chunk.empty<number>())
      )
      const result = yield* $(
        sinkRaceLaw(
          Stream.fromIterableEffect(Random.shuffle(chunk)),
          findSink(20),
          findSink(40)
        )
      )
      assert.isTrue(result)
    }), { retry: 3 })
})
