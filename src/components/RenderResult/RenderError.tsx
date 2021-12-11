import React from 'react'
import { Typography } from '@mui/material'
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
        <br />
        {props.error.line ? `Line: ${props.error.line}` : ''}
      </Typography>
    </div>
  )
}
