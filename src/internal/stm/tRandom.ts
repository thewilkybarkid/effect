import { Context } from "../../Context.js"
import { pipe } from "../../Function.js"
import { Layer } from "../../Layer.js"
import type { STM } from "../../STM.js"
import type { TArray } from "../../TArray.js"
import type { TRandom } from "../../TRandom.js"
import type { TRef } from "../../TRef.js"
import * as Random from "../../Utils.js"
import * as core from "./core.js"
import * as stm from "./stm.js"
import * as tArray from "./tArray.js"
import * as tRef from "./tRef.js"

const TRandomSymbolKey = "effect/TRandom"

/** @internal */
export const TRandomTypeId: TRandom.TRandomTypeId = Symbol.for(
  TRandomSymbolKey
) as TRandom.TRandomTypeId

const randomInteger = (state: Random.PCGRandomState): [number, Random.PCGRandomState] => {
  const prng = new Random.PCGRandom()
  prng.setState(state)
  return [prng.integer(0), prng.getState()]
}

const randomIntegerBetween = (low: number, high: number) => {
  return (state: Random.PCGRandomState): [number, Random.PCGRandomState] => {
    const prng = new Random.PCGRandom()
    prng.setState(state)
    return [prng.integer(high - low) + low, prng.getState()]
  }
}

const randomNumber = (state: Random.PCGRandomState): [number, Random.PCGRandomState] => {
  const prng = new Random.PCGRandom()
  prng.setState(state)
  return [prng.number(), prng.getState()]
}

const withState = <A>(
  state: TRef<Random.PCGRandomState>,
  f: (state: Random.PCGRandomState) => [A, Random.PCGRandomState]
): STM<never, never, A> => {
  return pipe(state, tRef.modify(f))
}

const shuffleWith = <A>(
  iterable: Iterable<A>,
  nextIntBounded: (n: number) => STM<never, never, number>
): STM<never, never, Array<A>> => {
  const swap = (buffer: TArray<A>, index1: number, index2: number): STM<never, never, void> =>
    pipe(
      buffer,
      tArray.get(index1),
      core.flatMap((tmp) =>
        pipe(
          buffer,
          tArray.updateSTM(index1, () => pipe(buffer, tArray.get(index2))),
          core.zipRight(
            pipe(
              buffer,
              tArray.update(index2, () => tmp)
            )
          )
        )
      )
    )
  return pipe(
    tArray.fromIterable(iterable),
    core.flatMap((buffer) => {
      const array: Array<number> = []
      for (let i = array.length; i >= 2; i = i - 1) {
        array.push(i)
      }
      return pipe(
        array,
        stm.forEach((n) => pipe(nextIntBounded(n), core.flatMap((k) => swap(buffer, n - 1, k))), { discard: true }),
        core.zipRight(tArray.toArray(buffer))
      )
    })
  )
}

/** @internal */
export const Tag = Context.Tag<TRandom>()

class TRandomImpl implements TRandom {
  readonly [TRandomTypeId]: TRandom.TRandomTypeId = TRandomTypeId
  constructor(readonly state: TRef<Random.PCGRandomState>) {
    this.next = withState(this.state, randomNumber)
    this.nextBoolean = core.flatMap(this.next, (n) => core.succeed(n > 0.5))
    this.nextInt = withState(this.state, randomInteger)
  }

  next: STM<never, never, number>
  nextBoolean: STM<never, never, boolean>
  nextInt: STM<never, never, number>

  nextRange(min: number, max: number): STM<never, never, number> {
    return core.flatMap(this.next, (n) => core.succeed((max - min) * n + min))
  }
  nextIntBetween(low: number, high: number): STM<never, never, number> {
    return withState(this.state, randomIntegerBetween(low, high))
  }
  shuffle<A>(elements: Iterable<A>): STM<never, never, Array<A>> {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n))
  }
}

/** @internal */
export const live: Layer<never, never, TRandom> = Layer.effect(
  Tag,
  pipe(
    tRef.make(new Random.PCGRandom((Math.random() * 4294967296) >>> 0).getState()),
    core.map((seed) => new TRandomImpl(seed)),
    core.commit
  )
)

/** @internal */
export const next: STM<TRandom, never, number> = core.flatMap(Tag, (random) => random.next)

/** @internal */
export const nextBoolean: STM<TRandom, never, boolean> = core.flatMap(Tag, (random) => random.nextBoolean)

/** @internal */
export const nextInt: STM<TRandom, never, number> = core.flatMap(Tag, (random) => random.nextInt)

/** @internal */
export const nextIntBetween = (low: number, high: number): STM<TRandom, never, number> =>
  core.flatMap(Tag, (random) => random.nextIntBetween(low, high))

/** @internal */
export const nextRange = (min: number, max: number): STM<TRandom, never, number> =>
  core.flatMap(Tag, (random) => random.nextRange(min, max))

/** @internal */
export const shuffle = <A>(elements: Iterable<A>): STM<TRandom, never, Array<A>> =>
  core.flatMap(Tag, (random) => random.shuffle(elements))
