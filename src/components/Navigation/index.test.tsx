import React from 'react'
import TestRenderer from 'react-test-renderer'
import Navigation from './index'

it('renders Navigation', () => {
  const tree = TestRenderer.create(
    <Navigation handleExport={console.log}/>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
