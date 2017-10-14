import { curry } from 'ramda'
import { typeOf, contractOf } from './util'

// Typed 2-tuple (pair) of monoids
// Pair :: (A, B) -> (a, b) -> Object
const Pair = (A, B) => (left, right) =>
    ((left, right) => (
      {
        left,
        right,
        concat: curry(({left: l, right: r}) => Pair(A, B)(left.concat(l), right.concat(r))),
        bimap: (f, g) => Pair(A, B)(f(left), g(right)),
        foldL: (f, _) => f(left),
        foldR: (_, g) => g(right),
        toString: () => `Pair [${left}, ${right}]`,
      })
      // Check proper right and contract
    )(typeOf(A)(left) && contractOf('concat')(left), typeOf(B)(right) && contractOf('concat')(right))


// History pair with a log (Array) on the left, and a String value on the right
// History :: (a, b) -> Object
export const History = Pair(Array, String)
History.empty = () => History([], '') // First empty log with empty value
History.separator = '|'
export const cleanUp = log => log.replace(new RegExp(`\\${History.separator}`, 'g'), '\n')



// Sort backwards with a profunctor or contramap
