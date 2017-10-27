import { assert } from 'chai'
import { typeOf, contractOf } from '../src/adt/pair'
import { transducer } from '../src/shared/util'
import { notNull, hasShape, notEmpty, isBlacklisted } from '../src/server/validation'
import Validation from 'data.validation'
import { Success, Failure } from 'data.validation'
import { identity } from 'ramda'

describe('Util Test Suite', () => {
  it('Should check object type', () => {
    assert.equal(typeOf(String)(''), '')
    assert.equal(typeOf(Number)(42), 42)
  })

  it('Should check for contract violations', () => {
    assert.isEmpty(contractOf('concat')(''), '')
    assert.deepEqual(contractOf('concat')([1,2,3]), [1,2,3])
  })

  it('Should check for transducer Success with applicatives', () => {
    const transduce = transducer(
        Success(x => y => w => z => z),
        [notNull, hasShape, notEmpty, isBlacklisted]
    )
    assert.isTrue(transduce({msg: 'Hello Bob!', name: 'Alice'}).isSuccess)
    assert.equal(transduce({msg: 'Hello Bob!', name: 'Alice'}).merge(), 'Hello Bob!')
  })

  it('Should check for transducer Failure with applicatives by triggering all validations', () => {
    const transduce = transducer(
        Success(x => y => w => z => z),
        [notNull, hasShape, notEmpty, isBlacklisted]
    )
    assert.isTrue(transduce(null).isFailure)
    assert.deepEqual(transduce(null).fold(identity), [
        "Expecting non-null message object",
        "Expecting message to have both 'name' and 'msg' properties",
        "Ignoring empty message",
        "Skipping forbidden word"
      ])
  })
})
