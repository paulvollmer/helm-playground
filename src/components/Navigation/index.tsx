import React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import GitHubIcon from '@mui/icons-material/GitHub'
import Bowser from 'bowser'
import Logo from './Logo'

export type NavigationProps = {
  // handleImport: () => void
  handleExport: () => void
}

function Navigation(props: NavigationProps): JSX.Element {
  const [anchorElGithubMenu, setAnchorElGithubMenu] = React.useState<null | HTMLElement>(null)
  const openGithubMenu = Boolean(anchorElGithubMenu)

  const handleClickGithubMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElGithubMenu(event.currentTarget)
  }

  const handleCloseGithubMenu = () => {
    setAnchorElGithubMenu(null)
  }

  const handleGithubRepo = () => {
    window.open('https://github.com/paulvollmer/helm-playground')
  }

  const handleGithubIssueBug = () => {
    const browser = Bowser.getParser(window.navigator.userAgent)
    window.open(
      `https://github.com/paulvollmer/helm-playground/issues/new?assignees=&labels=bug&template=bug-report.yaml&title=%5BBUG%5D+%3Ctitle%3E&browser=Browser:%20${browser.getBrowserName()}%0AVersion:%20${browser.getBrowserVersion()}`
    )
  }

  const handleGithubIssueFeature = () => {
    window.open(
      'https://github.com/paulvollmer/helm-playground/issues/new?assignees=&labels=enhancement&template=feature-request.yaml&title=%5BFEATURE%5D+%3Ctitle%3E'
    )
  }

  return (
    <>
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
          <IconButton color="inherit" onMouseOver={handleClickGithubMenu} size="large">
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorElGithubMenu}
        open={openGithubMenu}
        onClose={handleCloseGithubMenu}
        onClick={handleCloseGithubMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleGithubRepo}>Github Repo</MenuItem>
        <MenuItem onClick={handleGithubIssueBug}>Bug Report</MenuItem>
        <MenuItem onClick={handleGithubIssueFeature}>Feature Request</MenuItem>
      </Menu>
    </>
  )
}

export default Navigation
