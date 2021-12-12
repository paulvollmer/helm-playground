import React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import Logo from './Logo'

export type NavigationProps = {
  // handleImport: () => void
  handleExport: () => void
}

const Navigation = (props: NavigationProps): JSX.Element => {
  const handleGithub = () => {
    window.open('http://github.com/paulvollmer/helm-playground')
  }

  return (
    <AppBar position="fixed" sx={{ background: '#0f1689', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1, marginLeft: '20px' }}>
          Playground
        </Typography>
        {/* <Button color="inherit" onClick={props.handleImport}>Import</Button> */}
        <Button color="inherit" onClick={props.handleExport}>
          Export
        </Button>
        <IconButton color="inherit" onClick={handleGithub} size="large">
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
