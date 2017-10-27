/**
 * Module containing utility (helper) functions
 */
import { curry, identity, applyTo } from 'ramda'

export const prettyDate = timeMs => (new Date(timeMs)).toString()

export function foldM(M) {
  // TODO: Check M has monoid contract
  return arr =>
    arr.reduce((acc, m) => acc.concat(m), M.empty())
}

export function transducer(applicative, transformers) {
  // TODO: Check contract has applicative contract
  return val => transformers.map(applyTo(val)).reduce((acc, a) => acc.ap(a), applicative)
}

export const orElse = f => F => F.orElse(f)

// Add listener for an event (side effect)
// on :: String -> Function -> WebSocket -> ()
export const on = curry((event, handler, handle) => handle.on(event, handler(handle)))

export const composeMessage = curry((name, msg) => JSON.stringify({name, msg}))

export const fork = (join, func1, func2) => val => join(func1(val), func2(val))

export const seq = (...fns) => val => fns.forEach(f => f(val))

// Takes any string and returns an effectful computation that
// lazily wraps the console log of that message
export const logStr = str => () => console.log(str)

// Takes a message object and returns an effectul computation that
// lazily wraps the console log of that message
export const logMsg = msg => console.log(`${msg.name}: ${msg.msg}`)
