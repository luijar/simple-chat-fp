import { assert } from 'chai'
import { typeOf, contractOf } from '../src/adt/pair'
import { transducer } from '../src/shared/util'
import { notNull, hasShape, notEmpty, isBlacklisted } from '../src/server/validation'
import Validation from 'data.validation'
import { Success, Failure } from 'data.validation'

describe('Util Test Suite', () => {
  it('Should check object type', () => {
    assert.equal(typeOf(String)(''), '')
    assert.equal(typeOf(Number)(42), 42)
  })

  it('Should check for contract violations', () => {
    assert.isEmpty(contractOf('concat')(''), '')
    assert.deepEqual(contractOf('concat')([1,2,3]), [1,2,3])
  })

  it('Should check for transducer with applicatives', () => {
    const transduce = transducer(
        (acc, a) => acc.ap(a),
        Success(x => y => w => z => z),
        [notNull, hasShape, notEmpty, isBlacklisted]
    )
    assert.isTrue(transduce({msg: 'Hello Bob!', name: 'Alice'}).isSuccess)
  })
})
