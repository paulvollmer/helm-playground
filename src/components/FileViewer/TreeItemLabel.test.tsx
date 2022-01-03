import React from 'react'
import TestRenderer from 'react-test-renderer'
import TreeItemLabel from './TreeItemLabel'

describe('TreeItemLabel', () => {
  test('render', () => {
    const mockFunction = jest.fn()
    const tree = TestRenderer.create(<TreeItemLabel onDelete={mockFunction} title="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
