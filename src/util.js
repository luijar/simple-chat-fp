/**
 *
 * Package of utility functions
 */

import { History } from './history'
import { tap, curry } from 'ramda'

export const prettyDate = timeMs => (new Date(timeMs)).toString()

export const cleanUp = log => log.replace(new RegExp(`\\${History.separator}`, 'g'), '\n')

export function foldM(M) {
  return arr =>
    arr.reduce((acc, m) => acc.concat(m), M.empty())
}

export const orElse = f => F => F.orElse(f)

// Add listener for an event (side effect)
// on :: String -> Function -> WebSocket -> ()
export const on = curry((event, handler, handle) => handle.on(event, handler(handle)))

export const composeMessage = curry((name, msg) => JSON.stringify({name, msg}))
