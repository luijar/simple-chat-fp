import { curry } from 'ramda'
import { typeOf, contractOf } from './util'

// Typed 2-tuple (pair) of monoids
// Pair :: (A, B) -> (a, b) -> Object
export const Pair = (A, B) => (left, right) =>
    ((left, right) => (
      {
        left,
        right,
        concat: curry(({left: l, right: r}) => Pair(A, B)(left.concat(l), right.concat(r))),
        // Bifunctor
        // bimap :: (A -> C) -> (B -> D) -> Pair(a, b) -> Pair(c, d)
        bimap: (C, D) => (f, g) => Pair(C, D)(f(left), g(right)),
        // Prounfctor
        // dimap :: (C -> A) -> (B -> D) -> Pair(a, b) -> Pair(c, d)
        dimap: (C, D) => (f, g) => Pair(C, D)(f(left), g(right)),
        foldL: (f, _) => f(left),
        foldR: (_, g) => g(right),
        merge: (f)    => f(left, right),
        toString: ()  => `Pair [${left}, ${right}]`,
      })
      // Check that objects passed into this tuple have the proper semigroup contract
    )(typeOf(A)(left) && contractOf('concat')(left), typeOf(B)(right) && contractOf('concat')(right))

export default Pair
