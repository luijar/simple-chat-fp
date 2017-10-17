import Pair from '../adt/pair'

// Define concat for number monoid under addition
function ConcatNum() {}
ConcatNum.prototype.concat = function (other) {
  return this + other
}

Object.assign(Number.prototype, ConcatNum.prototype)

// History pair with a log (Array) on the left, and a String value on the right
// History :: (a, b) -> Object
export const History = Pair(Number, String)
History.empty = () => History(0, '') // First empty log with empty value
History.separator = '|'

export const cleanUp = log => log.replace(new RegExp(`\\${History.separator}`, 'g'), '\n')



// Sort backwards with a profunctor or contramap
