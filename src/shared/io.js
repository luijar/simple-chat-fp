import { tap, compose, is } from 'ramda'
import IO from 'io-monad'

/**
 * Package of functions that perform side effects
 */
// Takes any string and returns an effectful computation that
// lazily wraps the console log of that message
export const logStr = str => () => console.log(str)

// Takes a message object and returns an effectul computation that
// lazily wraps the console log of that message
export const logMsg = msg => console.log(`${msg.name}: ${msg.msg}`)

// TODO: Log to file
