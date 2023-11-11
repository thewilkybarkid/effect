---
title: index.ts
nav_order: 187
parent: Modules
---

## index overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [BigDecimal](#bigdecimal)
  - [BigInt](#bigint)
  - [Boolean](#boolean)
  - [Brand](#brand)
  - [Cache](#cache)
  - [Cause](#cause)
  - [Channel](#channel)
  - [ChildExecutorDecision](#childexecutordecision)
  - [Chunk](#chunk)
  - [Clock](#clock)
  - [Config](#config)
  - [ConfigError](#configerror)
  - [ConfigProvider](#configprovider)
  - [ConfigProviderPathPatch](#configproviderpathpatch)
  - [ConfigSecret](#configsecret)
  - [Console](#console)
  - [Context](#context)
  - [Data](#data)
  - [DefaultServices](#defaultservices)
  - [Deferred](#deferred)
  - [Differ](#differ)
  - [Duration](#duration)
  - [Effect](#effect)
  - [Effectable](#effectable)
  - [Either](#either)
  - [Encoding](#encoding)
  - [Equal](#equal)
  - [Equivalence](#equivalence)
  - [ExecutionStrategy](#executionstrategy)
  - [Exit](#exit)
  - [Fiber](#fiber)
  - [FiberId](#fiberid)
  - [FiberRef](#fiberref)
  - [FiberRefs](#fiberrefs)
  - [FiberRefsPatch](#fiberrefspatch)
  - [FiberStatus](#fiberstatus)
  - [Function](#function)
  - [GlobalValue](#globalvalue)
  - [GroupBy](#groupby)
  - [HKT](#hkt)
  - [Hash](#hash)
  - [HashMap](#hashmap)
  - [HashSet](#hashset)
  - [Inspectable](#inspectable)
  - [KeyedPool](#keyedpool)
  - [Layer](#layer)
  - [List](#list)
  - [LogLevel](#loglevel)
  - [LogSpan](#logspan)
  - [Logger](#logger)
  - [Match](#match)
  - [MergeDecision](#mergedecision)
  - [MergeState](#mergestate)
  - [MergeStrategy](#mergestrategy)
  - [Metric](#metric)
  - [MetricBoundaries](#metricboundaries)
  - [MetricHook](#metrichook)
  - [MetricKey](#metrickey)
  - [MetricKeyType](#metrickeytype)
  - [MetricLabel](#metriclabel)
  - [MetricPair](#metricpair)
  - [MetricPolling](#metricpolling)
  - [MetricRegistry](#metricregistry)
  - [MetricState](#metricstate)
  - [MutableHashMap](#mutablehashmap)
  - [MutableHashSet](#mutablehashset)
  - [MutableList](#mutablelist)
  - [MutableQueue](#mutablequeue)
  - [MutableRef](#mutableref)
  - [NonEmptyIterable](#nonemptyiterable)
  - [Number](#number)
  - [Option](#option)
  - [Order](#order)
  - [Ordering](#ordering)
  - [Pipeable](#pipeable)
  - [Pool](#pool)
  - [Predicate](#predicate)
  - [PubSub](#pubsub)
  - [Queue](#queue)
  - [Random](#random)
  - [ReadonlyArray](#readonlyarray)
  - [ReadonlyRecord](#readonlyrecord)
  - [RedBlackTree](#redblacktree)
  - [Ref](#ref)
  - [Reloadable](#reloadable)
  - [Request](#request)
  - [RequestBlock](#requestblock)
  - [RequestResolver](#requestresolver)
  - [Resource](#resource)
  - [Runtime](#runtime)
  - [RuntimeFlags](#runtimeflags)
  - [RuntimeFlagsPatch](#runtimeflagspatch)
  - [STM](#stm)
  - [Schedule](#schedule)
  - [ScheduleDecision](#scheduledecision)
  - [ScheduleInterval](#scheduleinterval)
  - [ScheduleIntervals](#scheduleintervals)
  - [Scheduler](#scheduler)
  - [Scope](#scope)
  - [ScopedCache](#scopedcache)
  - [ScopedRef](#scopedref)
  - [SingleProducerAsyncInput](#singleproducerasyncinput)
  - [Sink](#sink)
  - [SortedMap](#sortedmap)
  - [SortedSet](#sortedset)
  - [Stream](#stream)
  - [StreamEmit](#streamemit)
  - [StreamHaltStrategy](#streamhaltstrategy)
  - [Streamable](#streamable)
  - [String](#string)
  - [Struct](#struct)
  - [SubscriptionRef](#subscriptionref)
  - [Supervisor](#supervisor)
  - [Symbol](#symbol)
  - [SynchronizedRef](#synchronizedref)
  - [TArray](#tarray)
  - [TDeferred](#tdeferred)
  - [TMap](#tmap)
  - [TPriorityQueue](#tpriorityqueue)
  - [TPubSub](#tpubsub)
  - [TQueue](#tqueue)
  - [TRandom](#trandom)
  - [TReentrantLock](#treentrantlock)
  - [TRef](#tref)
  - [TSemaphore](#tsemaphore)
  - [TSet](#tset)
  - [Take](#take)
  - [TestAnnotation](#testannotation)
  - [TestAnnotationMap](#testannotationmap)
  - [TestAnnotations](#testannotations)
  - [TestClock](#testclock)
  - [TestConfig](#testconfig)
  - [TestContext](#testcontext)
  - [TestLive](#testlive)
  - [TestServices](#testservices)
  - [TestSized](#testsized)
  - [Tracer](#tracer)
  - [Tuple](#tuple)
  - [Types](#types)
  - [Unify](#unify)
  - [UpstreamPullRequest](#upstreampullrequest)
  - [UpstreamPullStrategy](#upstreampullstrategy)
  - [Utils](#utils-1)
  - [absurd](#absurd)
  - [flow](#flow)
  - [hole](#hole)
  - [identity](#identity)
  - [pipe](#pipe)
  - [unsafeCoerce](#unsafecoerce)

---

# utils

## BigDecimal

This module provides utility functions and type class instances for working with the `BigDecimal` type in TypeScript.
It includes functions for basic arithmetic operations, as well as type class instances for `Equivalence` and `Order`.

A `BigDecimal` allows storing any real number to arbitrary precision; which avoids common floating point errors
(such as 0.1 + 0.2 ≠ 0.3) at the cost of complexity.

Internally, `BigDecimal` uses a `BigInt` object, paired with a 64-bit integer which determines the position of the
decimal point. Therefore, the precision _is not_ actually arbitrary, but limited to 2<sup>63</sup> decimal places.

It is not recommended to convert a floating point number to a decimal directly, as the floating point representation
may be unexpected.

**Signature**

```ts
export declare const BigDecimal: typeof BigDecimal
```

Added in v2.0.0

## BigInt

This module provides utility functions and type class instances for working with the `bigint` type in TypeScript.
It includes functions for basic arithmetic operations, as well as type class instances for
`Equivalence` and `Order`.

**Signature**

```ts
export declare const BigInt: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/BigInt")
```

Added in v2.0.0

## Boolean

This module provides utility functions and type class instances for working with the `boolean` type in TypeScript.
It includes functions for basic boolean operations, as well as type class instances for
`Equivalence` and `Order`.

**Signature**

```ts
export declare const Boolean: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Boolean")
```

Added in v2.0.0

## Brand

This module provides types and utility functions to create and work with branded types,
which are TypeScript types with an added type tag to prevent accidental usage of a value in the wrong context.

The `refined` and `nominal` functions are both used to create branded types in TypeScript.
The main difference between them is that `refined` allows for validation of the data, while `nominal` does not.

The `nominal` function is used to create a new branded type that has the same underlying type as the input, but with a different name.
This is useful when you want to distinguish between two values of the same type that have different meanings.
The `nominal` function does not perform any validation of the input data.

On the other hand, the `refined` function is used to create a new branded type that has the same underlying type as the input,
but with a different name, and it also allows for validation of the input data.
The `refined` function takes a predicate that is used to validate the input data.
If the input data fails the validation, a `BrandErrors` is returned, which provides information about the specific validation failure.

**Signature**

```ts
export declare const Brand: typeof Brand
```

Added in v2.0.0

## Cache

**Signature**

```ts
export declare const Cache: typeof Cache
```

Added in v2.0.0

## Cause

The `Effect<R, E, A>` type is polymorphic in values of type `E` and we can
work with any error type that we want. However, there is a lot of information
that is not inside an arbitrary `E` value. So as a result, an `Effect` needs
somewhere to store things like unexpected errors or defects, stack and
execution traces, causes of fiber interruptions, and so forth.

Effect-TS is very strict about preserving the full information related to a
failure. It captures all type of errors into the `Cause` data type. `Effect`
uses the `Cause<E>` data type to store the full story of failure. So its
error model is lossless. It doesn't throw information related to the failure
result. So we can figure out exactly what happened during the operation of
our effects.

It is important to note that `Cause` is an underlying data type representing
errors occuring within an `Effect` workflow. Thus, we don't usually deal with
`Cause`s directly. Even though it is not a data type that we deal with very
often, the `Cause` of a failing `Effect` workflow can be accessed at any
time, which gives us total access to all parallel and sequential errors in
occurring within our codebase.

**Signature**

```ts
export declare const Cause: typeof Cause
```

Added in v2.0.0

## Channel

**Signature**

```ts
export declare const Channel: typeof Channel
```

Added in v2.0.0

## ChildExecutorDecision

**Signature**

```ts
export declare const ChildExecutorDecision: typeof ChildExecutorDecision
```

Added in v2.0.0

## Chunk

**Signature**

```ts
export declare const Chunk: typeof Chunk
```

Added in v2.0.0

## Clock

**Signature**

```ts
export declare const Clock: typeof Clock
```

Added in v2.0.0

## Config

**Signature**

```ts
export declare const Config: typeof Config
```

Added in v2.0.0

## ConfigError

**Signature**

```ts
export declare const ConfigError: typeof ConfigError
```

Added in v2.0.0

## ConfigProvider

**Signature**

```ts
export declare const ConfigProvider: typeof ConfigProvider
```

Added in v2.0.0

## ConfigProviderPathPatch

**Signature**

```ts
export declare const ConfigProviderPathPatch: typeof ConfigProviderPathPatch
```

Added in v2.0.0

## ConfigSecret

**Signature**

```ts
export declare const ConfigSecret: typeof ConfigSecret
```

Added in v2.0.0

## Console

**Signature**

```ts
export declare const Console: typeof Console
```

Added in v2.0.0

## Context

This module provides a data structure called `Context` that can be used for dependency injection in effectful
programs. It is essentially a table mapping `Tag`s to their implementations (called `Service`s), and can be used to
manage dependencies in a type-safe way. The `Context` data structure is essentially a way of providing access to a set
of related services that can be passed around as a single unit. This module provides functions to create, modify, and
query the contents of a `Context`, as well as a number of utility types for working with tags and services.

**Signature**

```ts
export declare const Context: typeof Context
```

Added in v2.0.0

## Data

**Signature**

```ts
export declare const Data: typeof Data
```

Added in v2.0.0

## DefaultServices

**Signature**

```ts
export declare const DefaultServices: typeof DefaultServices
```

Added in v2.0.0

## Deferred

**Signature**

```ts
export declare const Deferred: typeof Deferred
```

Added in v2.0.0

## Differ

**Signature**

```ts
export declare const Differ: typeof Differ
```

Added in v2.0.0

## Duration

**Signature**

```ts
export declare const Duration: typeof Duration
```

Added in v2.0.0

## Effect

**Signature**

```ts
export declare const Effect: typeof Effect
```

Added in v2.0.0

## Effectable

**Signature**

```ts
export declare const Effectable: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Effectable")
```

Added in v2.0.0

## Either

**Signature**

```ts
export declare const Either: typeof Either
```

Added in v2.0.0

## Encoding

This module provides encoding & decoding functionality for:

- base64 (RFC4648)
- base64 (URL)
- hex

**Signature**

```ts
export declare const Encoding: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Encoding")
```

Added in v2.0.0

## Equal

**Signature**

```ts
export declare const Equal: typeof Equal
```

Added in v2.0.0

## Equivalence

This module provides an implementation of the `Equivalence` type class, which defines a binary relation
that is reflexive, symmetric, and transitive. In other words, it defines a notion of equivalence between values of a certain type.
These properties are also known in mathematics as an "equivalence relation".

**Signature**

```ts
export declare const Equivalence: typeof Equivalence
```

Added in v2.0.0

## ExecutionStrategy

**Signature**

```ts
export declare const ExecutionStrategy: typeof ExecutionStrategy
```

Added in v2.0.0

## Exit

**Signature**

```ts
export declare const Exit: typeof Exit
```

Added in v2.0.0

## Fiber

**Signature**

```ts
export declare const Fiber: typeof Fiber
```

Added in v2.0.0

## FiberId

**Signature**

```ts
export declare const FiberId: typeof FiberId
```

Added in v2.0.0

## FiberRef

**Signature**

```ts
export declare const FiberRef: typeof FiberRef
```

Added in v2.0.0

## FiberRefs

**Signature**

```ts
export declare const FiberRefs: typeof FiberRefs
```

Added in v2.0.0

## FiberRefsPatch

**Signature**

```ts
export declare const FiberRefsPatch: typeof FiberRefsPatch
```

Added in v2.0.0

## FiberStatus

**Signature**

```ts
export declare const FiberStatus: typeof FiberStatus
```

Added in v2.0.0

## Function

**Signature**

```ts
export declare const Function: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Function")
```

Added in v2.0.0

## GlobalValue

**Signature**

```ts
export declare const GlobalValue: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/GlobalValue")
```

Added in v2.0.0

## GroupBy

**Signature**

```ts
export declare const GroupBy: typeof GroupBy
```

Added in v2.0.0

## HKT

**Signature**

```ts
export declare const HKT: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/HKT")
```

Added in v2.0.0

## Hash

**Signature**

```ts
export declare const Hash: typeof Hash
```

Added in v2.0.0

## HashMap

**Signature**

```ts
export declare const HashMap: typeof HashMap
```

Added in v2.0.0

## HashSet

**Signature**

```ts
export declare const HashSet: typeof HashSet
```

Added in v2.0.0

## Inspectable

**Signature**

```ts
export declare const Inspectable: typeof Inspectable
```

Added in v2.0.0

## KeyedPool

**Signature**

```ts
export declare const KeyedPool: typeof KeyedPool
```

Added in v2.0.0

## Layer

A `Layer<RIn, E, ROut>` describes how to build one or more services in your
application. Services can be injected into effects via
`Effect.provideService`. Effects can require services via `Effect.service`.

Layer can be thought of as recipes for producing bundles of services, given
their dependencies (other services).

Construction of services can be effectful and utilize resources that must be
acquired and safely released when the services are done being utilized.

By default layers are shared, meaning that if the same layer is used twice
the layer will only be allocated a single time.

Because of their excellent composition properties, layers are the idiomatic
way in Effect-TS to create services that depend on other services.

**Signature**

```ts
export declare const Layer: typeof Layer
```

Added in v2.0.0

## List

A data type for immutable linked lists representing ordered collections of elements of type `A`.

This data type is optimal for last-in-first-out (LIFO), stack-like access patterns. If you need another access pattern, for example, random access or FIFO, consider using a collection more suited to this than `List`.

**Performance**

- Time: `List` has `O(1)` prepend and head/tail access. Most other operations are `O(n)` on the number of elements in the list. This includes the index-based lookup of elements, `length`, `append` and `reverse`.
- Space: `List` implements structural sharing of the tail list. This means that many operations are either zero- or constant-memory cost.

**Signature**

```ts
export declare const List: typeof List
```

Added in v2.0.0

## LogLevel

**Signature**

```ts
export declare const LogLevel: typeof LogLevel
```

Added in v2.0.0

## LogSpan

**Signature**

```ts
export declare const LogSpan: typeof LogSpan
```

Added in v2.0.0

## Logger

**Signature**

```ts
export declare const Logger: typeof Logger
```

Added in v2.0.0

## Match

**Signature**

```ts
export declare const Match: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Match")
```

Added in v2.0.0

## MergeDecision

**Signature**

```ts
export declare const MergeDecision: typeof MergeDecision
```

Added in v2.0.0

## MergeState

**Signature**

```ts
export declare const MergeState: typeof MergeState
```

Added in v2.0.0

## MergeStrategy

**Signature**

```ts
export declare const MergeStrategy: typeof MergeStrategy
```

Added in v2.0.0

## Metric

**Signature**

```ts
export declare const Metric: typeof Metric
```

Added in v2.0.0

## MetricBoundaries

**Signature**

```ts
export declare const MetricBoundaries: typeof MetricBoundaries
```

Added in v2.0.0

## MetricHook

**Signature**

```ts
export declare const MetricHook: typeof MetricHook
```

Added in v2.0.0

## MetricKey

**Signature**

```ts
export declare const MetricKey: typeof MetricKey
```

Added in v2.0.0

## MetricKeyType

**Signature**

```ts
export declare const MetricKeyType: typeof MetricKeyType
```

Added in v2.0.0

## MetricLabel

**Signature**

```ts
export declare const MetricLabel: typeof MetricLabel
```

Added in v2.0.0

## MetricPair

**Signature**

```ts
export declare const MetricPair: typeof MetricPair
```

Added in v2.0.0

## MetricPolling

**Signature**

```ts
export declare const MetricPolling: typeof MetricPolling
```

Added in v2.0.0

## MetricRegistry

**Signature**

```ts
export declare const MetricRegistry: typeof MetricRegistry
```

Added in v2.0.0

## MetricState

**Signature**

```ts
export declare const MetricState: typeof MetricState
```

Added in v2.0.0

## MutableHashMap

**Signature**

```ts
export declare const MutableHashMap: typeof MutableHashMap
```

Added in v2.0.0

## MutableHashSet

**Signature**

```ts
export declare const MutableHashSet: typeof MutableHashSet
```

Added in v2.0.0

## MutableList

**Signature**

```ts
export declare const MutableList: typeof MutableList
```

Added in v2.0.0

## MutableQueue

**Signature**

```ts
export declare const MutableQueue: typeof MutableQueue
```

Added in v2.0.0

## MutableRef

**Signature**

```ts
export declare const MutableRef: typeof MutableRef
```

Added in v2.0.0

## NonEmptyIterable

**Signature**

```ts
export declare const NonEmptyIterable: typeof NonEmptyIterable
```

Added in v2.0.0

## Number

This module provides utility functions and type class instances for working with the `number` type in TypeScript.
It includes functions for basic arithmetic operations, as well as type class instances for
`Equivalence` and `Order`.

**Signature**

```ts
export declare const Number: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Number")
```

Added in v2.0.0

## Option

**Signature**

```ts
export declare const Option: typeof Option
```

Added in v2.0.0

## Order

**Signature**

```ts
export declare const Order: typeof Order
```

Added in v2.0.0

## Ordering

**Signature**

```ts
export declare const Ordering: typeof Ordering
```

Added in v2.0.0

## Pipeable

**Signature**

```ts
export declare const Pipeable: typeof Pipeable
```

Added in v2.0.0

## Pool

**Signature**

```ts
export declare const Pool: typeof Pool
```

Added in v2.0.0

## Predicate

**Signature**

```ts
export declare const Predicate: typeof Predicate
```

Added in v2.0.0

## PubSub

**Signature**

```ts
export declare const PubSub: typeof PubSub
```

Added in v2.0.0

## Queue

**Signature**

```ts
export declare const Queue: typeof Queue
```

Added in v2.0.0

## Random

**Signature**

```ts
export declare const Random: typeof Random
```

Added in v2.0.0

## ReadonlyArray

This module provides utility functions for working with arrays in TypeScript.

**Signature**

```ts
export declare const ReadonlyArray: typeof ReadonlyArray
```

Added in v2.0.0

## ReadonlyRecord

This module provides utility functions for working with records in TypeScript.

**Signature**

```ts
export declare const ReadonlyRecord: typeof ReadonlyRecord
```

Added in v2.0.0

## RedBlackTree

**Signature**

```ts
export declare const RedBlackTree: typeof RedBlackTree
```

Added in v2.0.0

## Ref

**Signature**

```ts
export declare const Ref: typeof Ref
```

Added in v2.0.0

## Reloadable

**Signature**

```ts
export declare const Reloadable: typeof Reloadable
```

Added in v2.0.0

## Request

**Signature**

```ts
export declare const Request: typeof Request
```

Added in v2.0.0

## RequestBlock

**Signature**

```ts
export declare const RequestBlock: typeof RequestBlock
```

Added in v2.0.0

## RequestResolver

**Signature**

```ts
export declare const RequestResolver: typeof RequestResolver
```

Added in v2.0.0

## Resource

**Signature**

```ts
export declare const Resource: typeof Resource
```

Added in v2.0.0

## Runtime

**Signature**

```ts
export declare const Runtime: typeof Runtime
```

Added in v2.0.0

## RuntimeFlags

**Signature**

```ts
export declare const RuntimeFlags: typeof RuntimeFlags
```

Added in v2.0.0

## RuntimeFlagsPatch

**Signature**

```ts
export declare const RuntimeFlagsPatch: typeof RuntimeFlagsPatch
```

Added in v2.0.0

## STM

**Signature**

```ts
export declare const STM: typeof STM
```

Added in v2.0.0

## Schedule

**Signature**

```ts
export declare const Schedule: typeof Schedule
```

Added in v2.0.0

## ScheduleDecision

**Signature**

```ts
export declare const ScheduleDecision: typeof ScheduleDecision
```

Added in v2.0.0

## ScheduleInterval

**Signature**

```ts
export declare const ScheduleInterval: typeof ScheduleInterval
```

Added in v2.0.0

## ScheduleIntervals

**Signature**

```ts
export declare const ScheduleIntervals: typeof ScheduleIntervals
```

Added in v2.0.0

## Scheduler

**Signature**

```ts
export declare const Scheduler: typeof Scheduler
```

Added in v2.0.0

## Scope

**Signature**

```ts
export declare const Scope: typeof Scope
```

Added in v2.0.0

## ScopedCache

**Signature**

```ts
export declare const ScopedCache: typeof ScopedCache
```

Added in v2.0.0

## ScopedRef

**Signature**

```ts
export declare const ScopedRef: typeof ScopedRef
```

Added in v2.0.0

## SingleProducerAsyncInput

**Signature**

```ts
export declare const SingleProducerAsyncInput: typeof SingleProducerAsyncInput
```

Added in v2.0.0

## Sink

**Signature**

```ts
export declare const Sink: typeof Sink
```

Added in v2.0.0

## SortedMap

**Signature**

```ts
export declare const SortedMap: typeof SortedMap
```

Added in v2.0.0

## SortedSet

**Signature**

```ts
export declare const SortedSet: typeof SortedSet
```

Added in v2.0.0

## Stream

**Signature**

```ts
export declare const Stream: typeof Stream
```

Added in v2.0.0

## StreamEmit

**Signature**

```ts
export declare const StreamEmit: typeof StreamEmit
```

Added in v2.0.0

## StreamHaltStrategy

**Signature**

```ts
export declare const StreamHaltStrategy: typeof StreamHaltStrategy
```

Added in v2.0.0

## Streamable

**Signature**

```ts
export declare const Streamable: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Streamable")
```

Added in v2.0.0

## String

This module provides utility functions and type class instances for working with the `string` type in TypeScript.
It includes functions for basic string manipulation, as well as type class instances for
`Equivalence` and `Order`.

**Signature**

```ts
export declare const String: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/String")
```

Added in v2.0.0

## Struct

This module provides utility functions for working with structs in TypeScript.

**Signature**

```ts
export declare const Struct: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Struct")
```

Added in v2.0.0

## SubscriptionRef

**Signature**

```ts
export declare const SubscriptionRef: typeof SubscriptionRef
```

Added in v2.0.0

## Supervisor

A `Supervisor<T>` is allowed to supervise the launching and termination of
fibers, producing some visible value of type `T` from the supervision.

**Signature**

```ts
export declare const Supervisor: typeof Supervisor
```

Added in v2.0.0

## Symbol

**Signature**

```ts
export declare const Symbol: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Symbol")
```

Added in v2.0.0

## SynchronizedRef

**Signature**

```ts
export declare const SynchronizedRef: typeof SynchronizedRef
```

Added in v2.0.0

## TArray

**Signature**

```ts
export declare const TArray: typeof TArray
```

Added in v2.0.0

## TDeferred

**Signature**

```ts
export declare const TDeferred: typeof TDeferred
```

Added in v2.0.0

## TMap

**Signature**

```ts
export declare const TMap: typeof TMap
```

Added in v2.0.0

## TPriorityQueue

**Signature**

```ts
export declare const TPriorityQueue: typeof TPriorityQueue
```

Added in v2.0.0

## TPubSub

**Signature**

```ts
export declare const TPubSub: typeof TPubSub
```

Added in v2.0.0

## TQueue

**Signature**

```ts
export declare const TQueue: typeof TQueue
```

Added in v2.0.0

## TRandom

**Signature**

```ts
export declare const TRandom: typeof TRandom
```

Added in v2.0.0

## TReentrantLock

**Signature**

```ts
export declare const TReentrantLock: typeof TReentrantLock
```

Added in v2.0.0

## TRef

**Signature**

```ts
export declare const TRef: typeof TRef
```

Added in v2.0.0

## TSemaphore

**Signature**

```ts
export declare const TSemaphore: typeof TSemaphore
```

Added in v2.0.0

## TSet

**Signature**

```ts
export declare const TSet: typeof TSet
```

Added in v2.0.0

## Take

**Signature**

```ts
export declare const Take: typeof Take
```

Added in v2.0.0

## TestAnnotation

**Signature**

```ts
export declare const TestAnnotation: typeof TestAnnotation
```

Added in v2.0.0

## TestAnnotationMap

**Signature**

```ts
export declare const TestAnnotationMap: typeof TestAnnotationMap
```

Added in v2.0.0

## TestAnnotations

**Signature**

```ts
export declare const TestAnnotations: typeof TestAnnotations
```

Added in v2.0.0

## TestClock

**Signature**

```ts
export declare const TestClock: typeof TestClock
```

Added in v2.0.0

## TestConfig

**Signature**

```ts
export declare const TestConfig: typeof TestConfig
```

Added in v2.0.0

## TestContext

**Signature**

```ts
export declare const TestContext: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/TestContext")
```

Added in v2.0.0

## TestLive

**Signature**

```ts
export declare const TestLive: typeof TestLive
```

Added in v2.0.0

## TestServices

**Signature**

```ts
export declare const TestServices: typeof TestServices
```

Added in v2.0.0

## TestSized

**Signature**

```ts
export declare const TestSized: typeof TestSized
```

Added in v2.0.0

## Tracer

**Signature**

```ts
export declare const Tracer: typeof Tracer
```

Added in v2.0.0

## Tuple

This module provides utility functions for working with tuples in TypeScript.

**Signature**

```ts
export declare const Tuple: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Tuple")
```

Added in v2.0.0

## Types

A collection of types that are commonly used types.

**Signature**

```ts
export declare const Types: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Types")
```

Added in v2.0.0

## Unify

**Signature**

```ts
export declare const Unify: typeof Unify
```

Added in v2.0.0

## UpstreamPullRequest

**Signature**

```ts
export declare const UpstreamPullRequest: typeof UpstreamPullRequest
```

Added in v2.0.0

## UpstreamPullStrategy

**Signature**

```ts
export declare const UpstreamPullStrategy: typeof UpstreamPullStrategy
```

Added in v2.0.0

## Utils

**Signature**

```ts
export declare const Utils: typeof import("/Users/patrickroza/pj/effect/effect/src/impl/Utils")
```

Added in v2.0.0

## absurd

**Signature**

```ts
export declare const absurd: <A>(_: never) => A
```

Added in v2.0.0

## flow

**Signature**

```ts
export declare const flow: typeof flow
```

Added in v2.0.0

## hole

**Signature**

```ts
export declare const hole: <T>() => T
```

Added in v2.0.0

## identity

**Signature**

```ts
export declare const identity: <A>(a: A) => A
```

Added in v2.0.0

## pipe

**Signature**

```ts
export declare const pipe: typeof pipe
```

Added in v2.0.0

## unsafeCoerce

**Signature**

```ts
export declare const unsafeCoerce: <A, B>(a: A) => B
```

Added in v2.0.0
