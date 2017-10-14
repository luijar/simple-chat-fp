/**
 * Module containing utility (helper) functions
 */
import { tap, curry, is, type, has, compose } from 'ramda'

export const prettyDate = timeMs => (new Date(timeMs)).toString()

export function foldM(M) {
  return arr =>
    arr.reduce((acc, m) => acc.concat(m), M.empty())
}

// Use either?
const typeErr = curry((name, cond) => {
  if(!cond) {
    throw new TypeError(`Wrong type used: ${name}`)
  }
  return cond
})

// Use either?
const contractErr = curry((name, cond) => {
  if(!cond) {
    throw new TypeError(`Contract violation of: ${name}`)
  }
  return cond
})

export const fork = (join, func1, func2) => val => join(func1(val), func2(val))

// Checks if the provided object of type T
// typeOf :: T -> a -> a | Error
export const typeOf = T => tap(fork(typeErr, type, is(T)))

// Checks if the provided object has contract C
// hasContract :: String -> a -> a | Error
export const contractOf = c => tap(compose(contractErr(c), has(c), Object.getPrototypeOf))

export const orElse = f => F => F.orElse(f)

// Add listener for an event (side effect)
// on :: String -> Function -> WebSocket -> ()
export const on = curry((event, handler, handle) => handle.on(event, handler(handle)))

export const composeMessage = curry((name, msg) => JSON.stringify({name, msg}))
