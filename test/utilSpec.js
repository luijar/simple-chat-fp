import { assert } from 'chai'
import { typeOf, contractOf } from '../src/util'

describe('Util Test Suite', () => {
  it('Should check object type', () => {
    assert.equal(typeOf(String)(''), '')
    assert.equal(typeOf(Number)(42), 42)
  })

  it('Should check for contract violations', () => {
    assert.isEmpty(contractOf('concat')(''), '')
    assert.deepEqual(contractOf('concat')([1,2,3]), [1,2,3])
  })
})
