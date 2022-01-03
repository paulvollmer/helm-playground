import React from 'react'
import TestRenderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'
import App from './App'

test.skip('renders learn react link', () => {
  render(<App />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})

test.skip('renders App', () => {
  const tree = TestRenderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
