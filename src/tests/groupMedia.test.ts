import { groupMedia } from '../util'
import { testData, processedData } from './testData'
import { omit } from 'lodash'

describe('groupMedia fn', () => {
  test('Data is grouped correctly', () => {
    const result = groupMedia(testData)
    const resultNoUids = result.map(r => omit(r, 'uid'))
    const expectedNoUids = processedData.map(r => omit(r, 'uid'))
    expect(resultNoUids).toEqual(expectedNoUids)

    result.forEach(r => {
      expect(r).toHaveProperty('uid')
      expect(r.uid).toBeTruthy()
    })
  })
})

