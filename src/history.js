import { curry } from 'ramda'

// See if I can create a Pair function and then History can extend

export const History = (time, log) => (
  {
    time,
    log,
    concat: curry(({time: t, log: l}) => History(t, (log + History.separator + l).trim())),
    toString: () => `History [${time}, ${log}]`,
    bimap: (f, g) => History(f(time), g(log))
  }
)
History.empty = () => History(0, '')
History.separator = '|'


// Sort backwards with a profunctor or contramap
