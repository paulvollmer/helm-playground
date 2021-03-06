import React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-yaml'
import Typography from '@mui/material/Typography'
import { HelmRenderReturn } from '../../types'
import { RenderError } from './RenderError'

export type RenderResultProps = {
  data: HelmRenderReturn
}

/**
 * call the helmRender function and dispay the result
 */
function RenderResult(props: RenderResultProps): JSX.Element {
  if (props.data.error) {
    return <RenderError error={props.data.error} />
  }

  return (
    <>
      <Typography variant="subtitle1">Render Output</Typography>
      <AceEditor
        mode="yaml"
        theme="github"
        name="editor"
        width="100%"
        height="calc(100vh - 110px)"
        readOnly
        value={props.data.result}
        editorProps={{ $blockScrolling: true }}
      />
    </>
  )
}

export default RenderResult
