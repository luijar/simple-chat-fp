import Pair from './pair'

// History pair with a log (Array) on the left, and a String value on the right
// History :: (a, b) -> Object
export const History = Pair(Array, String)
History.empty = () => History([{time: 0, type:'text/plain'}], '') // First empty log with empty value
History.separator = '|'

export const cleanUp = log => log.replace(new RegExp(`\\${History.separator}`, 'g'), '\n')



// Sort backwards with a profunctor or contramap
