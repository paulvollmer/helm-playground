import React from 'react'
import Typography from '@mui/material/Typography'
import { HelmRenderReturnError } from '../../types'

export type RenderErrorProps = {
  error: HelmRenderReturnError
}

export const RenderError = (props: RenderErrorProps): JSX.Element => {
  return (
    <div>
      <Typography variant="subtitle1">Error Kind: {props.error.kind}</Typography>
      <Typography variant="h6">{props.error.message}</Typography>
      <Typography variant="body1">
        File: {props.error.file}
        {props.error.line ? (
          <>
            <br />
            {`Line: ${props.error.line}`}
          </>
        ) : null}
      </Typography>
    </div>
  )
}
