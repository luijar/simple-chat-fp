import { curry, tap, is, has, compose, type } from "ramda";
import { fork } from "../shared/util";

// Use either?
const typeErr = curry((name, cond) => {
  if (!cond) {
    throw new TypeError(`Wrong type used: ${name}`);
  }
  return cond;
});

// Use either?
const contractErr = curry((name, cond) => {
  if (!cond) {
    throw new TypeError(`Contract violation of: ${name}`);
  }
  return cond;
});

// Checks if the provided object of type T
// typeOf :: T -> a -> a | Error
export const typeOf = T => tap(fork(typeErr, type, is(T)));

// Checks if the provided object has contract C
// contractOf :: String -> a -> a | Error
export const contractOf = c =>
  tap(
    compose(
      contractErr(c),
      has(c),
      Object.getPrototypeOf
    )
  );

// Typed 2-tuple (pair) of monoids
// Pair :: (A, B) -> (a, b) -> Object
export const Pair = (A, B) => (left, right) =>
  ((left, right) => ({
    left,
    right,
    concat: curry(({ left: l, right: r }) =>
      Pair(A, B)(left.concat(l), right.concat(r))
    ),
    // Bifunctor
    // bimap :: (A -> C) -> (B -> D) -> Pair(a, b) -> Pair(c, d)
    bimap: (C, D) => (f, g) => Pair(C, D)(f(left), g(right)),
    // Prounfctor
    // dimap :: (C -> A) -> (B -> D) -> Pair(a, b) -> Pair(c, d)
    dimap: (C, D) => (f, g) => Pair(C, D)(f(left), g(right)),
    foldL: (f, _) => f(left),
    foldR: (_, g) => g(right),
    merge: f => f(left, right),
    toString: () => `Pair [${left}, ${right}]`
  }))(
    // Check that objects passed into this tuple have the proper semigroup contract
    typeOf(A)(left) && contractOf("concat")(left),
    typeOf(B)(right) && contractOf("concat")(right)
  );

export default Pair;
