import React from 'react'
import TestRenderer from 'react-test-renderer'
import Logo from './Logo'

test('renders Logo', () => {
  const tree = TestRenderer.create(<Logo />).toJSON()
  expect(tree).toMatchSnapshot()
})

