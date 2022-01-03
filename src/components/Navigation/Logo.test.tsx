import React from 'react'
import TestRenderer from 'react-test-renderer'
import Logo from './Logo'

describe('Logo', () => {
  test('render', () => {
    const tree = TestRenderer.create(<Logo />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
