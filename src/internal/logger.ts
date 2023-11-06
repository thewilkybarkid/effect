import type { CauseExt } from "../Cause.js"
import type { FiberId } from "../FiberId.js"
import type { FiberRefs } from "../FiberRefs.js"
import type { LazyArg } from "../Function.js"
import { constVoid, dual, pipe } from "../Function.js"
import { HashMap } from "../HashMap.js"
import { List } from "../List.js"
import type { Logger } from "../Logger.js"
import type { LogLevel } from "../LogLevel.js"
import { LogSpan } from "../LogSpan.js"
import { Option } from "../Option.js"
import { pipeArguments } from "../Pipeable.js"
import { Cause } from "./cause.js"
import * as _fiberId from "./fiberId.js"

/** @internal */
const LoggerSymbolKey = "effect/Logger"

/** @internal */
export const LoggerTypeId: Logger.LoggerTypeId = Symbol.for(
  LoggerSymbolKey
) as Logger.LoggerTypeId

/** @internal */
const loggerVariance = {
  _Message: (_: unknown) => _,
  _Output: (_: never) => _
}

/** @internal */
export const makeLogger = <Message, Output>(
  log: (
    options: {
      readonly fiberId: FiberId
      readonly logLevel: LogLevel
      readonly message: Message
      readonly cause: CauseExt.Cause<unknown>
      readonly context: FiberRefs
      readonly spans: List<LogSpan>
      readonly annotations: HashMap<string, unknown>
      readonly date: Date
    }
  ) => Output
): Logger<Message, Output> => ({
  [LoggerTypeId]: loggerVariance,
  log,
  pipe() {
    return pipeArguments(this, arguments)
  }
})

/** @internal */
export const mapInput = dual<
  <Message, Message2>(
    f: (message: Message2) => Message
  ) => <Output>(self: Logger<Message, Output>) => Logger<Message2, Output>,
  <Output, Message, Message2>(
    self: Logger<Message, Output>,
    f: (message: Message2) => Message
  ) => Logger<Message2, Output>
>(2, (self, f) =>
  makeLogger(
    (options) => self.log({ ...options, message: f(options.message) })
  ))

/** @internal */
export const filterLogLevel = dual<
  (
    f: (logLevel: LogLevel) => boolean
  ) => <Message, Output>(self: Logger<Message, Output>) => Logger<Message, Option<Output>>,
  <Message, Output>(
    self: Logger<Message, Output>,
    f: (logLevel: LogLevel) => boolean
  ) => Logger<Message, Option<Output>>
>(2, (self, f) =>
  makeLogger((options) =>
    f(options.logLevel)
      ? Option.some(self.log(options))
      : Option.none()
  ))

/** @internal */
export const map = dual<
  <Output, Output2>(
    f: (output: Output) => Output2
  ) => <Message>(self: Logger<Message, Output>) => Logger<Message, Output2>,
  <Message, Output, Output2>(
    self: Logger<Message, Output>,
    f: (output: Output) => Output2
  ) => Logger<Message, Output2>
>(2, (self, f) => makeLogger((options) => f(self.log(options))))

/** @internal */
export const none: Logger<unknown, void> = {
  [LoggerTypeId]: loggerVariance,
  log: constVoid,
  pipe() {
    return pipeArguments(this, arguments)
  }
} as Logger<unknown, void>

/** @internal */
export const simple = <A, B>(log: (a: A) => B): Logger<A, B> => ({
  [LoggerTypeId]: loggerVariance,
  log: ({ message }) => log(message),
  pipe() {
    return pipeArguments(this, arguments)
  }
})

/** @internal */
export const succeed = <A>(value: A): Logger<unknown, A> => {
  return simple(() => value)
}

/** @internal */
export const sync = <A>(evaluate: LazyArg<A>): Logger<unknown, A> => {
  return simple(evaluate)
}

/** @internal */
export const zip = dual<
  <Message2, Output2>(
    that: Logger<Message2, Output2>
  ) => <Message, Output>(
    self: Logger<Message, Output>
  ) => Logger<Message & Message2, readonly [Output, Output2]>,
  <Message, Output, Message2, Output2>(
    self: Logger<Message, Output>,
    that: Logger<Message2, Output2>
  ) => Logger<Message & Message2, readonly [Output, Output2]>
>(2, (self, that) => makeLogger((options) => [self.log(options), that.log(options)] as const))

/** @internal */
export const zipLeft = dual<
  <Message2, Output2>(
    that: Logger<Message2, Output2>
  ) => <Message, Output>(
    self: Logger<Message, Output>
  ) => Logger<Message & Message2, Output>,
  <Message, Output, Message2, Output2>(
    self: Logger<Message, Output>,
    that: Logger<Message2, Output2>
  ) => Logger<Message & Message2, Output>
>(2, (self, that) => map(zip(self, that), (tuple) => tuple[0]))

/** @internal */
export const zipRight = dual<
  <Message2, Output2>(
    that: Logger<Message2, Output2>
  ) => <Message, Output>(
    self: Logger<Message, Output>
  ) => Logger<Message & Message2, Output2>,
  <Message, Output, Message2, Output2>(
    self: Logger<Message, Output>,
    that: Logger<Message2, Output2>
  ) => Logger<Message & Message2, Output2>
>(2, (self, that) => map(zip(self, that), (tuple) => tuple[1]))

/** @internal */
export const stringLogger: Logger<unknown, string> = makeLogger<unknown, string>(
  ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
    const nowMillis = date.getTime()

    const outputArray = [
      `timestamp=${date.toISOString()}`,
      `level=${logLevel.label}`,
      `fiber=${_fiberId.threadName(fiberId)}`
    ]

    let output = outputArray.join(" ")
    const stringMessage = serializeUnknown(message)

    if (stringMessage.length > 0) {
      output = output + " message="
      output = appendQuoted(stringMessage, output)
    }

    if (cause != null && cause._tag !== "Empty") {
      output = output + " cause="
      output = appendQuoted(Cause.pretty(cause), output)
    }

    if (List.isCons(spans)) {
      output = output + " "

      let first = true
      for (const span of spans) {
        if (first) {
          first = false
        } else {
          output = output + " "
        }
        output = output + pipe(span, LogSpan.render(nowMillis))
      }
    }

    if (pipe(annotations, HashMap.size) > 0) {
      output = output + " "

      let first = true
      for (const [key, value] of annotations) {
        if (first) {
          first = false
        } else {
          output = output + " "
        }
        output = output + filterKeyName(key)
        output = output + "="
        output = appendQuoted(serializeUnknown(value), output)
      }
    }

    return output
  }
)

export const serializeUnknown = (u: unknown): string => {
  try {
    return typeof u === "object" ? JSON.stringify(u) : String(u)
  } catch (_) {
    return String(u)
  }
}

/** @internal */
const escapeDoubleQuotes = (str: string) => `"${str.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`

const textOnly = /^[^\s"=]+$/

/** @internal */
const appendQuoted = (label: string, output: string): string =>
  output + (label.match(textOnly) ? label : escapeDoubleQuotes(label))

/** @internal */
export const logfmtLogger = makeLogger<unknown, string>(
  ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
    const nowMillis = date.getTime()

    const outputArray = [
      `timestamp=${date.toISOString()}`,
      `level=${logLevel.label}`,
      `fiber=${_fiberId.threadName(fiberId)}`
    ]

    let output = outputArray.join(" ")
    const stringMessage = serializeUnknown(message)

    if (stringMessage.length > 0) {
      output = output + " message="
      output = appendQuotedLogfmt(stringMessage, output)
    }

    if (cause != null && cause._tag !== "Empty") {
      output = output + " cause="
      output = appendQuotedLogfmt(Cause.pretty(cause), output)
    }

    if (List.isCons(spans)) {
      output = output + " "

      let first = true
      for (const span of spans) {
        if (first) {
          first = false
        } else {
          output = output + " "
        }
        output = output + pipe(span, renderLogSpanLogfmt(nowMillis))
      }
    }

    if (pipe(annotations, HashMap.size) > 0) {
      output = output + " "

      let first = true
      for (const [key, value] of annotations) {
        if (first) {
          first = false
        } else {
          output = output + " "
        }
        output = output + filterKeyName(key)
        output = output + "="
        output = appendQuotedLogfmt(serializeUnknown(value), output)
      }
    }

    return output
  }
)

/** @internal */
const filterKeyName = (key: string) => key.replace(/[\s="]/g, "_")

/** @internal */
const escapeDoubleQuotesLogfmt = (str: string) => JSON.stringify(str)

/** @internal */
const appendQuotedLogfmt = (label: string, output: string): string =>
  output + (label.match(textOnly) ? label : escapeDoubleQuotesLogfmt(label))

/** @internal */
const renderLogSpanLogfmt = (now: number) => (self: LogSpan): string => {
  const label = filterKeyName(self.label)
  return `${label}=${now - self.startTime}ms`
}
