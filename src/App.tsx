import React from 'react'
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles'
import { createTheme, CssBaseline } from '@mui/material'
import Playground from './Playground'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme()

const App = (): JSX.Element => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Playground />
    </ThemeProvider>
  </StyledEngineProvider>
)

export default App
