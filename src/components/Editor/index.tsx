import React, { useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-github'
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools'
import { Ace } from 'ace-builds'
import autocompleteChartYaml from './autocomplete/chart_yaml'

export type EditorProps = {
  annotations?: Ace.Annotation[]
  value: string
  onChange: (s: string) => void
}

addCompleter({
  getCompletions(
    editor: Ace.Editor,
    session: Ace.EditSession,
    pos: Ace.Point,
    prefix: string,
    callback: (arg0: null, arg1: Ace.Completion[]) => void
  ) {
    callback(null, [...autocompleteChartYaml])
  },
})

function Editor(props: EditorProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [annotations, setAnnotations] = useState([])
  const [editor, setEditor] = useState<Ace.Editor>()

  useEffect(() => {
    if (props.annotations) {
      if (props.annotations.length > 0) {
        if (props.annotations[0].text !== '') {
          const nextAnnotations = [
            // ...annotations.filter(({ custom }) => !custom),  // annotations by worker
            ...props.annotations.map((annotation) => ({
              ...annotation,
              custom: true,
            })), // flag for exclusion
          ]

          if (editor) {
            editor.getSession().setAnnotations(nextAnnotations)
          }
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
