import React from 'react'
import { AppBar, Button, Toolbar, Typography, IconButton } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import Logo from './Logo'

export type NavigationProps = {
  // handleImport: () => void
  handleExport: () => void
  handleSettings: () => void
  className: string
}

const Navigation = (props: NavigationProps): JSX.Element => {
  const handleGithub = () => {
    window.open('http://github.com/paulvollmer/helm-playground')
  }

  return (
    <AppBar position="fixed" style={{ background: '#0f1689' }}>
      <Toolbar>
        <Logo />
        <Typography variant="h6" color="inherit" className={props.className}>
          Playground
        </Typography>
        {/* <Button color="inherit" onClick={props.handleImport}>Import</Button> */}
        <Button color="inherit" onClick={props.handleExport}>
          Export
        </Button>
        <Button color="inherit" onClick={props.handleSettings}>
          Settings
        </Button>
        <IconButton color="inherit" onClick={handleGithub}>
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
