import React from 'react'
import TestRenderer from 'react-test-renderer'
import FileViewer from './index'

test.skip('renders FileViewer', () => {
  const mockFunction = jest.fn()
  const tree = TestRenderer.create(
    <FileViewer className="test" onDelete={mockFunction} selected="test" sources={{ test: 'foo' }} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
