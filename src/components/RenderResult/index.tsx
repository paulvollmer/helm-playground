import React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-yaml'
import { Typography } from '@material-ui/core'
import { helmRenderReturn, helmRenderReturnError } from '../../types'

type RenderResultProps = {
  data: helmRenderReturn
}

/**
 * call the helmRender function and dispay the result
 */
const RenderResult = (props: RenderResultProps) => {
  return (
    <>
      {props.data.error ? (
        <RenderError error={props.data.error} />
      ) : (
        <>
          <Typography variant="subtitle1">Render Output</Typography>
          <AceEditor
            mode="yaml"
            theme="github"
            name="editor"
            width="100%"
            height="calc(100vh - 100px)"
            value={props.data.result}
            editorProps={{ $blockScrolling: true }}
          />
        </>
      )}
    </>
  )
}

type RenderErrorProps = {
  error: helmRenderReturnError
}

const RenderError = (props: RenderErrorProps) => {
  return (
    <div>
      <Typography variant="subtitle1">Error Kind: {props.error.kind}</Typography>
      <Typography variant="h6">{props.error.message}</Typography>
      <Typography variant="body1">
        File: {props.error.file}
        <br />
        {props.error.line ? `Line: ${props.error.line}` : ''}
      </Typography>
    </div>
  )
}

export default RenderResult
