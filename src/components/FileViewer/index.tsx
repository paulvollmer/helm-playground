import React from 'react'
import { TreeItem, TreeView } from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { chartFilename } from '../../defaults/chart_yaml'
import { valuesFilename } from '../../defaults/values_yaml'
import { helmignoreFilename } from '../../defaults/helmignore'
import TreeItemLabel from './TreeItemLabel'

export type FileViewerProps = {
  className: string
  onNodeSelect?: (event: React.ChangeEvent<{}>, nodeIds: string) => void // eslint-disable-line 
  sources: any
  onDelete: (event: React.ChangeEvent<{}>, src: string) => void // eslint-disable-line
  selected: string | undefined
}

function FileViewer(props: FileViewerProps): JSX.Element {
  return (
    <TreeView
      className={props.className}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={['templates']}
      onNodeSelect={props.onNodeSelect}
      selected={props.selected}
    >
      <TreeItem nodeId={chartFilename} label={chartFilename} />
      <TreeItem nodeId={valuesFilename} label={valuesFilename} />
      <TreeItem nodeId={helmignoreFilename} label={helmignoreFilename} />
      <TreeItem nodeId="templates" label="templates">
        {Object.keys(props.sources).map((filename) => {
          return <TreeItem key={filename} nodeId={filename} label={<TreeItemLabel onDelete={props.onDelete} title={filename} />} />
        })}
        <TreeItem nodeId="__ADD__" label="+" />
      </TreeItem>
    </TreeView>
  )
}
export default FileViewer
