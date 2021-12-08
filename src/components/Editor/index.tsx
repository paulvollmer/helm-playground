import React, { useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-github'

export type EditorProps = {
  annotations: any
  value: string
  onChange: any
}

// @ts-ignore
const Editor = (props: EditorProps): JSX.Element => {
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
      height="calc(100vh - 100px)"
    />
  )
}

export default Editor
