import React from 'react'
import TestRenderer from 'react-test-renderer'
import { RenderError } from './RenderError'
import { HelmRenderReturnError } from '../../types'

describe('RenderError', () => {
  test('render with line', () => {
    const testError: HelmRenderReturnError = {
      kind: 'test-kind',
      file: 'test-file',
      line: 1,
      message: 'test-message',
    }
    const tree = TestRenderer.create(<RenderError error={testError} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('render without line', () => {
    const testError: HelmRenderReturnError = {
      kind: 'test-kind',
      file: 'test-file',
      message: 'test-message',
    }
    const tree = TestRenderer.create(<RenderError error={testError} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
