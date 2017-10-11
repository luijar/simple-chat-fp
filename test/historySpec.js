import { assert } from 'chai'
import { History } from '../src/history'
import { typeOf } from '../src/util'

describe('History Test Suite', () => {
  it('Should create an empty History object', () => {
    const empty = History.empty()
    assert.equal(empty.left, 0)
    assert.isEmpty(empty.right)
  })
  it('Should create an normal History object', () => {
    const now = Date.now()
    const empty = History(now, 'Hello')
    assert.equal(empty.left, now)
    assert.notEmpty(empty.right)
    assert.equal(empty.right, 'Hello')
  })
})
