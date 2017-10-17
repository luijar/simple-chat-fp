import Pair from '../adt/pair'

// Define concat for number monoid under addition
function ConcatNum() {}
ConcatNum.prototype.concat = function (other) {
  return this + other
}

Object.assign(Number.prototype, ConcatNum.prototype)

// History pair with the log (String) on the left, and an Array value on the right to the values logged
// History :: (a, b) -> History
const HistoryLog = Pair(String, Array)
HistoryLog.empty = () => HistoryLog('', []) // First empty log with empty value
HistoryLog.separator = '|'

export default HistoryLog

// TODO: Sort backwards with a profunctor or contramap
