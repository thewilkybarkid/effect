---
title: NonEmptyIterable.ts
nav_order: 71
parent: Modules
---

## NonEmptyIterable overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [getters](#getters)
  - [unprepend](#unprepend)
- [model](#model)
  - [NonEmptyIterable (interface)](#nonemptyiterable-interface)

---

# getters

## unprepend

**Signature**

```ts
export declare const unprepend: <A>(
  self: NonEmptyIterable<A>
) => [firstElement: A, remainingElements: Iterator<A, any, undefined>]
```

Added in v2.0.0

# model

## NonEmptyIterable (interface)

**Signature**

```ts
export interface NonEmptyIterable<out A> extends Iterable<A> {
  readonly [nonEmpty]: A
}
```

Added in v2.0.0
