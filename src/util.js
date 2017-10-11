/**
 * Module containing utility (helper) functions
 */
import { tap, curry, is, type } from 'ramda'

export const prettyDate = timeMs => (new Date(timeMs)).toString()

export function foldM(M) {
  return arr =>
    arr.reduce((acc, m) => acc.concat(m), M.empty())
}

export const typeErr = (name, cond) => {
  if(!cond) {
    throw new TypeError(`Wrong type used: ${name}`)
  }
  return cond
}

export const fork = (join, func1, func2) => val => join(func1(val), func2(val))

export const typeOf = T => tap(fork(typeErr, type, is(T)))

export const orElse = f => F => F.orElse(f)

// Add listener for an event (side effect)
// on :: String -> Function -> WebSocket -> ()
export const on = curry((event, handler, handle) => handle.on(event, handler(handle)))

export const composeMessage = curry((name, msg) => JSON.stringify({name, msg}))
