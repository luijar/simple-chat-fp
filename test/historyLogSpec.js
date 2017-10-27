import { assert } from 'chai'
import HistoryLog from '../src/server/history'
import { typeOf } from '../src/adt/pair'

describe('History Test Suite', () => {
  it('Should create an empty History object', () => {
    const empty = HistoryLog.empty()
    assert.equal(empty.left, '')
    assert.isEmpty(empty.right)
  })
  it('Should create an normal History object', () => {
    const notEmpty = HistoryLog('Log', ['Hello'])
    assert.equal(notEmpty.left, 'Log')
    assert.notEmpty(notEmpty.right)
    assert.deepEqual(notEmpty.right, ['Hello'])
  })
})
