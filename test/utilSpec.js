import { assert } from 'chai'
import { typeOf } from '../src/util'

describe('Util Test Suite', () => {
  it('Should check object type', () => {
    assert.equal(typeOf(String)(''), '')
    assert.equal(typeOf(Number)(42), 42)
  })
})
