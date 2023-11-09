import { dual } from "../../exports/Function.js"
import { hasProperty } from "../../exports/Predicate.js"
import type { UpstreamPullRequest } from "../../exports/UpstreamPullRequest.js"
import * as OpCodes from "../opCodes/channelUpstreamPullRequest.js"

/** @internal */
const UpstreamPullRequestSymbolKey = "effect/ChannelUpstreamPullRequest"

/** @internal */
export const UpstreamPullRequestTypeId: UpstreamPullRequest.UpstreamPullRequestTypeId = Symbol.for(
  UpstreamPullRequestSymbolKey
) as UpstreamPullRequest.UpstreamPullRequestTypeId

/** @internal */
const upstreamPullRequestVariance = {
  _A: (_: never) => _
}

/** @internal */
const proto = {
  [UpstreamPullRequestTypeId]: upstreamPullRequestVariance
}

/** @internal */
export const Pulled = <A>(value: A): UpstreamPullRequest<A> => {
  const op = Object.create(proto)
  op._tag = OpCodes.OP_PULLED
  op.value = value
  return op
}

/** @internal */
export const NoUpstream = (activeDownstreamCount: number): UpstreamPullRequest<never> => {
  const op = Object.create(proto)
  op._tag = OpCodes.OP_NO_UPSTREAM
  op.activeDownstreamCount = activeDownstreamCount
  return op
}

/** @internal */
export const isUpstreamPullRequest = (u: unknown): u is UpstreamPullRequest<unknown> =>
  hasProperty(u, UpstreamPullRequestTypeId)

/** @internal */
export const isPulled = <A>(
  self: UpstreamPullRequest<A>
): self is UpstreamPullRequest.Pulled<A> => self._tag === OpCodes.OP_PULLED

/** @internal */
export const isNoUpstream = <A>(
  self: UpstreamPullRequest<A>
): self is UpstreamPullRequest.NoUpstream => self._tag === OpCodes.OP_NO_UPSTREAM

/** @internal */
export const match = dual<
  <A, Z>(
    options: {
      readonly onPulled: (value: A) => Z
      readonly onNoUpstream: (activeDownstreamCount: number) => Z
    }
  ) => (self: UpstreamPullRequest<A>) => Z,
  <A, Z>(
    self: UpstreamPullRequest<A>,
    options: {
      readonly onPulled: (value: A) => Z
      readonly onNoUpstream: (activeDownstreamCount: number) => Z
    }
  ) => Z
>(2, <A, Z>(
  self: UpstreamPullRequest<A>,
  { onNoUpstream, onPulled }: {
    readonly onPulled: (value: A) => Z
    readonly onNoUpstream: (activeDownstreamCount: number) => Z
  }
): Z => {
  switch (self._tag) {
    case OpCodes.OP_PULLED: {
      return onPulled(self.value)
    }
    case OpCodes.OP_NO_UPSTREAM: {
      return onNoUpstream(self.activeDownstreamCount)
    }
  }
})
