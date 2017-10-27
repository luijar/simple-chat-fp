import Validation from 'data.validation'
import { Success, Failure } from 'data.validation'
import { isNil, isEmpty } from 'ramda'

const blackList = [

]

export const notNull = obj =>
   obj ?  Success(obj)
       :  Failure(["Expecting non-null message object"])

export const hasShape = ({name, msg}) =>
    (name && msg) ? Success({name, msg})
                :   Failure(["Expecting message to have both 'name' and 'msg' properties"])

export const notEmpty = ({msg}) =>
  msg.length > 0 ?  Success(msg)
                 :  Failure(["Ignoring empty message"])

export const isBlacklisted = ({msg}) =>
  !blackList.includes(msg) ? Success(msg)
                           : Failure(["Skipping forbidden word"])

// could this be a tranducer?
export default obj => Success(x => y => w => z => obj)
     .ap(notNull(obj))
     .ap(hasShape(obj))
     .ap(notEmpty(obj))
     .ap(isBlacklisted(obj))
