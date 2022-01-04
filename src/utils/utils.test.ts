import { extensionIsTpl, getAllTplFilenamesFromList, getFileExtension } from './utils'

describe('getFileExtension', () => {
  test('filename with extension', () => {
    const result = getFileExtension('test.yaml')
    expect(result).toBe('yaml')
  })

  test('filename without extension', () => {
    const result = getFileExtension('test')
    expect(result).toBe('')
  })

  test('dotfile', () => {
    const result = getFileExtension('.test')
    expect(result).toBe('')
  })

  test('empty string', () => {
    const result = getFileExtension('')
    expect(result).toBe('')
  })
})

describe('extensionIsTpl', () => {
  test('is tpl extension', () => {
    const result = extensionIsTpl('tpl')
    expect(result).toBe(true)
  })

  test('is empty string', () => {
    const result = extensionIsTpl('')
    expect(result).toBe(false)
  })

  test('is not tpl extension', () => {
    const result = extensionIsTpl('yaml')
    expect(result).toBe(false)
  })
})

describe('getAllTplFilenamesFromList', () => {
  test('is empty array', () => {
    const result = getAllTplFilenamesFromList([])
    expect(result).toStrictEqual([])
  })

  test('has no tpl file', () => {
    const result = getAllTplFilenamesFromList(['sample.yaml'])
    expect(result).toStrictEqual([])
  })

  test('has tpl file', () => {
    const result = getAllTplFilenamesFromList(['sample.yaml', 'helper.tpl'])
    expect(result).toStrictEqual(['helper.tpl'])
  })
})
