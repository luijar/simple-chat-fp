import { assert } from 'chai'
import { History } from '../src/history'
import { typeOf } from '../src/util'

describe('History Test Suite', () => {
  it('Should create an empty History object', () => {
    const empty = History.empty()
    assert.deepEqual(empty.left, [])
    assert.isEmpty(empty.right)
  })
  it('Should create an normal History object', () => {
    const now = Date.now()
    const empty = History([now], 'Hello')
    assert.deepEqual(empty.left, [now])
    assert.notEmpty(empty.right)
    assert.equal(empty.right, 'Hello')
  })
})
