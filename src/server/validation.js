import Validation from 'data.validation'
import { Success, Failure } from 'data.validation'
import { isNil, isEmpty } from 'ramda'
import { transducer } from '../shared/util'

const blackList = []

export const notNull = obj =>
  obj ? Success(obj) : Failure(['Expecting non-null message object'])

export const hasShape = obj =>
  obj && obj.name && obj.msg
    ? Success(obj)
    : Failure(["Expecting message to have both 'name' and 'msg' properties"])

export const notEmpty = obj =>
  obj && obj.msg.length > 0 ? Success(obj) : Failure(['Ignoring empty message'])

export const isBlacklisted = obj =>
  obj && !blackList.includes(obj.msg)
    ? Success(obj)
    : Failure(['Skipping forbidden word'])

// Alternative
// export default obj => Success(x => y => w => z => obj)
//      .ap(notNull(obj))
//      .ap(hasShape(obj))
//      .ap(notEmpty(obj))
//      .ap(isBlacklisted(obj))

const validateMessage = transducer(Success(x => y => w => z => z), [
  notNull,
  hasShape,
  notEmpty,
  isBlacklisted
])
export default validateMessage
