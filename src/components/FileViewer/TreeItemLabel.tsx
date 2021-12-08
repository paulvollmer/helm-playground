import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'

export type TreeItemLabelProps = {
    onDelete: (event: React.ChangeEvent<{}>, src: string) => void // eslint-disable-line
  title: string
}

const TreeItemLabel = (props: TreeItemLabelProps): JSX.Element => {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number
    mouseY: number
  } | null>(null)

  const handleContextMenu = (event: any) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    )
  }

  const handleClose = () => {
    setContextMenu(null)
  }

  return (
    <>
      <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
        {props.title}
      </div>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem
          onClick={(e) => {
            props.onDelete(e, props.title)
            handleClose()
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default TreeItemLabel
