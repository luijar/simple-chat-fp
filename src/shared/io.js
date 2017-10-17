import { tap } from 'ramda'

/**
 * Package of functions that perform side effects
 */

export const logStr = str => tap(() => console.log(str))

export const logMsg = tap(({msg}) => console.log(`${msg.name}: ${msg.msg}`))

// Write to file
