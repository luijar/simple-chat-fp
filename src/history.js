import { curry } from 'ramda'
import { typeOf } from './util'

/**
 * Typed 2-tuple (pair) of monoids
 *
 * @param {A} left  Any monoidal type
 * @param {B} right Any monoidal type
 */
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
    )(typeOf(A)(left), typeOf(B)(right))

/**
 * History monoid
 *
 * @param {Number} time Timestamp (also monoidal)
 * @param {String} log  Log string (also monoidal)
 */
export const History = Pair(Array, Array)
History.empty = () => History([], [])
History.separator = '|'

export const cleanUp = log => log.replace(new RegExp(`\\${History.separator}`, 'g'), '\n')



// Sort backwards with a profunctor or contramap
