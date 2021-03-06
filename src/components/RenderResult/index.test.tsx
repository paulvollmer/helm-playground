import React from 'react'
import TestRenderer from 'react-test-renderer'
import RenderResult from './index'
import { HelmRenderReturn } from '../../types'

describe('RenderResult', () => {
  test('render with result', () => {
    const testData: HelmRenderReturn = { result: 'test-result' }
    const tree = TestRenderer.create(<RenderResult data={testData} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders with error', () => {
    const testData: HelmRenderReturn = {
      error: {
        kind: 'test-kind',
        file: 'test-file',
        line: 1,
        message: 'test-message',
      },
    }
    const tree = TestRenderer.create(<RenderResult data={testData} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
