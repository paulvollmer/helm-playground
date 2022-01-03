import React from 'react'
import TestRenderer from 'react-test-renderer'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import Playground from './Playground'

test.skip('renders Playground', () => {
  const theme = createTheme()
  const tree = TestRenderer.create(
    <ThemeProvider theme={theme}>
      <Playground />
    </ThemeProvider>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
