import { groupMedia } from '../util'
import { testData, processedData } from './testData'

describe('groupMedia fn', () => {
  test('test', () => {
    const result = groupMedia(testData)
    expect(result).toEqual(processedData)
  })
})

