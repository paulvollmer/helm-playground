import React from 'react'
import TestRenderer from 'react-test-renderer'
import Navigation from './index'

test('renders Navigation', () => {
  const mockFunction = jest.fn()
  const tree = TestRenderer.create(<Navigation handleExport={mockFunction} />).toJSON()
  expect(tree).toMatchSnapshot()
})
