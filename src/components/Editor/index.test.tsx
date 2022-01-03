import React from 'react'
import TestRenderer from 'react-test-renderer'
import Editor from './index'

describe('Editor', () => {
  test('render', () => {
    const mockFunction = jest.fn()
    const tree = TestRenderer.create(<Editor annotations="" onChange={mockFunction} value="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
