import React, { useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-github'
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools'

export type EditorProps = {
  annotations: any
  value: string
  onChange: any
}

const autocompleteChartYaml = [
  {
    name: 'apiVersion',
    value: 'apiVersion: ',
    caption: 'apiVersion',
    meta: 'The chart API version (required)',
    score: 1,
  },
  {
    name: 'name',
    value: 'name: ',
    caption: 'name',
    meta: 'Chart',
    score: 1,
  },
  {
    name: 'version',
    value: 'version: ',
    caption: 'version',
    meta: 'A SemVer 2 version (required)',
    score: 1,
  },
  {
    name: 'kubeVersion',
    value: 'kubeVersion: ',
    caption: 'kubeVersion',
    meta: 'A SemVer range of compatible Kubernetes versions (optional)',
    score: 1,
  },
  {
    name: 'description',
    value: 'description: ',
    caption: 'description',
    meta: 'A single-sentence description of this project (optional)',
    score: 1,
  },
  {
    name: 'type',
    value: 'type: ',
    caption: 'type',
    meta: 'The type of the chart (optional)',
    score: 1,
  },
  {
    name: 'keywords',
    value: 'keywords:\n  - ',
    caption: 'keywords',
    meta: 'A list of keywords about this project (optional)',
    score: 1,
  },
  {
    name: 'home',
    value: 'home: ',
    caption: 'home',
    meta: 'The URL of this projects home page (optional)',
    score: 1,
  },
  {
    name: 'sources',
    value: 'sources:\n  - ',
    caption: 'sources',
    meta: 'A list of URLs to source code for this project (optional)',
    score: 1,
  },
  {
    name: 'dependencies',
    value: 'dependencies:\n  - name: \n    version: ',
    caption: 'dependencies',
    meta: 'A list of the chart requirements (optional)',
    score: 1,
  },
  {
    name: 'maintainers',
    value: 'maintainers:\n  - name: \n    email: \n    url: ',
    caption: 'maintainers',
    meta: '',
    score: 1,
  },
  {
    name: 'icon',
    value: 'icon: ',
    caption: 'icon',
    meta: 'A URL to an SVG or PNG image to be used as an icon (optional).',
    score: 1,
  },
  {
    name: 'appVersion',
    value: 'appVersion: ',
    caption: 'appVersion',
    meta: "The version of the app that this contains (optional). Needn't be SemVer. Quotes recommended.",
    score: 1,
  },
  {
    name: 'deprecated',
    value: 'deprecated: true',
    caption: 'deprecated',
    meta: 'Whether this chart is deprecated (optional, boolean)',
    score: 1,
  },
  {
    name: 'annotations',
    value: 'annotations:\n  key: value',
    caption: 'annotations',
    meta: '',
    score: 1,
  },
]

addCompleter({
  getCompletions(
    editor: any, // eslint-disable-line
    session: any,
    pos: any,
    prefix: any,
    callback: (
      arg0: null,
      arg1: {
        name: string
        value: string
        caption: string
        meta: string
        score: number
      }[]
    ) => void
  ) {
    callback(null, [...autocompleteChartYaml])
  },
})

// @ts-ignore
function Editor(props: EditorProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [annotations, setAnnotations] = useState([])
  const [editor, setEditor] = useState()

  useEffect(() => {
    if (props.annotations.length > 0) {
      if (props.annotations[0].message !== '') {
        const nextAnnotations = [
          // ...annotations.filter(({ custom }) => !custom),  // annotations by worker
          // @ts-ignore
          ...props.annotations.map((annotation) => ({
            ...annotation,
            custom: true,
          })), // flag for exclusion
        ]

        if (editor) {
          // @ts-ignore
          editor.getSession().setAnnotations(nextAnnotations)
        }
      }
    }
  }, [editor, setAnnotations, props.annotations])

  return (
    <AceEditor
      name="editor"
      mode="yaml"
      theme="github"
      // @ts-ignore
      onLoad={setEditor}
      onChange={props.onChange}
      // @ts-ignore
      onValidate={setAnnotations}
      setOptions={{
        useWorker: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      }}
      editorProps={{
        $blockScrolling: true,
      }}
      value={props.value}
      width="100%"
      height="calc(100vh - 110px)"
    />
  )
}

export default Editor
