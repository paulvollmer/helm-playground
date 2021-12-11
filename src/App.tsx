import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { Box, Container, createTheme, CssBaseline, Grid, makeStyles, Typography, LinearProgress } from '@material-ui/core'
import { Ace } from 'ace-builds'
import axios from 'axios'

import Navigation from './components/Navigation'
import RenderResult from './components/RenderResult'
import FileViewer from './components/FileViewer'
import { chartContent, chartFilename } from './defaults/chart_yaml'
import { helpersContent, helpersFilename } from './defaults/helpers'
import { valuesContent, valuesFilename } from './defaults/values_yaml'
import { ingressContent, ingressFilename } from './defaults/ingress'
import { serviceContent, serviceFilename } from './defaults/service'
import { notesContent, notesFilename } from './defaults/notes'
import { serviceaccountContent, serviceaccountFilename } from './defaults/serviceaccount'
import { deploymentContent, deploymentFilename } from './defaults/deployment_yaml'
import { helmignoreContent, helmignoreFilename } from './defaults/helmignore'
import handleExport from './components/Export'
// import handleImport from './components/import'
import Editor from './components/Editor'
import Settings from './components/Settings'
import { HelmRenderReturn, SettingsData, Sources } from './types'

const totalWasmSize = 56719824 // TODO: set the value at build time

const theme = createTheme()

const useStyles = makeStyles((t) => ({
  root: {
    flexGrow: 1,
  },
  navTitle: {
    flexGrow: 1,
    marginLeft: '20px',
  },
}))

const initialTemplateSources: Sources = {}
initialTemplateSources[helpersFilename] = helpersContent
initialTemplateSources[deploymentFilename] = deploymentContent
initialTemplateSources[ingressFilename] = ingressContent
initialTemplateSources[notesFilename] = notesContent
initialTemplateSources[serviceFilename] = serviceContent
initialTemplateSources[serviceaccountFilename] = serviceaccountContent

const emptySettings = {
  release: {
    name: '',
    namespace: '',
    revision: '',
    isUpgrade: '',
    isInstall: '',
    service: '',
  },
  kubeVersion: {
    version: '',
    major: '',
    minor: '',
  },
  helmVersion: {
    version: '',
    gitCommit: '',
    gitTreeState: '',
    goVersion: '',
  },
}

const Playground = (): JSX.Element => {
  const classes = useStyles()

  const [wasmLoaded, setWasmLoaded] = useState<boolean>(false)
  const [wasmLoadProgress, setWasmLoadProgress] = useState(0)
  const [wasmError, setWasmError] = useState<string>('')

  const [chartSource, setChartSource] = useState(chartContent)
  const [valuesSource, setValuesSource] = useState(valuesContent)
  const [helmignoreSource, setHelmignoreSource] = useState(helmignoreContent)
  const [sources, setSources] = useState(initialTemplateSources)

  const [selected, setSelected] = useState(chartFilename)
  const [editor, setEditor] = useState(chartContent)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customAnnotations, setCustomAnnotations] = useState({})
  const [aceEditor] = useState<Ace.Editor>()
  const [aceEditorError, setAceEditorError] = useState({ row: 0, text: '' })
  const [fileRename, setfileRename] = useState('')

  const [renderResult, setRenderResult] = useState<HelmRenderReturn>({
    result: '',
  })

  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<SettingsData>(emptySettings)

  useEffect(() => {
    axios
      .request({
        method: 'get',
        url: 'main.wasm',
        responseType: 'arraybuffer',
        onDownloadProgress: (p) => {
          setWasmLoadProgress((p.loaded / totalWasmSize) * 100)
        },
      })
      .then((res) => {
        setWasmLoadProgress(100)
        return new Blob([res.data]).arrayBuffer()
      })
      .then((bin) => {
        // @ts-ignore
        const go = new Go()
        WebAssembly.instantiate(bin, go.importObject)
          .then((result) => {
            // @ts-ignore
            go.run(result.instance)
            // @ts-ignore
            window.helmRender = helmRender
            // @ts-ignore
            window.helmDefaultCapabilities = helmDefaultCapabilities
            setWasmLoaded(true)
            setSettings(window.helmDefaultCapabilities())
          })
          .catch((err) => {
            console.error('webassembly instantiate error', err)
            setWasmError('could not instantiate helm renderer')
          })
      })

    // load the golang wasm artifact and then render the react application
    // fetch('main.wasm')
    //     .then(response => response.arrayBuffer())
    //     .then(function (bin) {
    //         // @ts-ignore
    //         const go = new Go();
    //         WebAssembly.instantiate(bin, go.importObject)
    //             .then((result) => {
    //                 go.run(result.instance);
    //                 // @ts-ignore
    //                 window.helmRender = helmRender
    //                 // @ts-ignore
    //                 window.helmDefaultCapabilities = helmDefaultCapabilities
    //                 setWasmLoaded(true)
    //                 setSettings(window.helmDefaultCapabilities())
    //             })
    //             .catch(err => {
    //                 console.error("webassembly instantiate error", err)
    //                 setWasmError("could not instantiate helm renderer")
    //             });
    //     })
    //     .catch((err) => {
    //         setWasmError("could not load helm renderer")
    //         console.error("fetch wasm error", err)
    //     });

    // addCompleter({
    //     getCompletions: function (editor: any, session: any, pos: any, prefix: any, callback: (arg0: null, arg1: { name: string; value: string; caption: string; meta: string; score: number; }[]) => void) {
    //         callback(null, [
    //             ...autocompleteChartYaml,
    //         ]);
    //     },
    // });
  }, [])

  useEffect(() => {
    if (wasmLoaded) {
      const filesToRender: Sources = {}
      filesToRender['_helpers.tpl'] = sources['_helpers.tpl']
      filesToRender[selected] = sources[selected]

      const result = window.helmRender(JSON.stringify(filesToRender), valuesSource, chartSource, JSON.stringify(settings))
      setRenderResult(result)

      let annotation = {}
      let tmpError = { row: -1, text: '' }
      if (result.error) {
        if (result.error.kind !== '') {
          switch (result?.error.kind) {
            case 'input':
              switch (result.error.file) {
                case valuesFilename:
                  tmpError = {
                    row: result.error.line - 1,
                    text: result.error.message,
                  }
                  break

                case chartFilename:
                  tmpError = {
                    row: result.error.line - 1,
                    text: result.error.message,
                  }
                  break
                default:
                  break
              }
              break

            case 'render':
              annotation = {
                row: result.error.line - 1,
                column: 0,
                text: result.error.message,
                type: 'error',
              }
              break

            default:
              break
          }
        }
      }
      setCustomAnnotations(annotation)
      setAceEditorError(tmpError)
    }
  }, [wasmLoaded, editor, sources, valuesSource, chartSource, settings, selected])

  useEffect(() => {
    if (wasmLoaded && aceEditor) {
      // @ts-ignore
      let customAnnotations = [] // eslint-disable-line
      if (aceEditorError.row !== -1) {
        customAnnotations = [
          {
            row: aceEditorError.row,
            column: 0,
            type: 'error',
            text: aceEditorError.text,
            custom: true,
          },
        ]
      }
      // @ts-ignore
      aceEditor?.getSession().setAnnotations(customAnnotations)
    }
  }, [wasmLoaded, aceEditor, aceEditorError])

  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => { // eslint-disable-line
    setSelected(nodeIds)
    switch (nodeIds) {
      case chartFilename:
        setEditor(chartSource)
        break
      case valuesFilename:
        setEditor(valuesSource)
        break
      case helmignoreFilename:
        setEditor(helmignoreSource)
        break

      case '__ADD__':
        const tmp = sources // eslint-disable-line
        tmp['untitled.yaml'] = ''
        setSelected('untitled.yaml')
        setSources(tmp)
        setEditor('')
        break
      default:
        // @ts-ignore
        setEditor(sources[nodeIds])
    }
  }

  const handleEditor = (newValue: string) => {
    setEditor(newValue)
    switch (selected) {
      case chartFilename:
        setChartSource(newValue)
        break
      case valuesFilename:
        setValuesSource(newValue)
        break
      case helmignoreFilename:
        setHelmignoreSource(newValue)
        break
      default:
        const tmp = sources // eslint-disable-line
        // @ts-ignore
        tmp[selected] = newValue
        setSources(tmp)
    }

    // setRenderResult(window.helmRender(JSON.stringify(sources), valuesSource, chartSource, JSON.stringify(settings)))
  }

  const handleDelete = (event: React.ChangeEvent<{}>, src: string) => { // eslint-disable-line
    setSelected(chartFilename)
    setEditor(sources[chartFilename])
    const tmp = sources
    delete sources[src]
    setSources(tmp)
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
  }

  return (
    <>
      <CssBaseline />
      <Navigation
        className={classes.navTitle}
        // handleImport={handleImport}
        handleExport={() => {
          const options = {
            chart: chartSource,
            values: valuesSource,
            helmignore: helmignoreSource,
            templates: sources,
          }
          handleExport('test', options)
        }}
        handleSettings={handleSettings}
      />
      <Box sx={{ pt: 10, pb: 8 }}>
        {wasmLoaded ? (
          <>
            {wasmError !== '' ? (
              <Container maxWidth="md" disableGutters style={{ textAlign: 'center' }}>
                <p>{wasmError}</p>
              </Container>
            ) : (
              <>
                {showSettings ? (
                  <Container maxWidth="md" disableGutters>
                    <Settings
                      show
                      data={settings}
                      handleSave={(data) => {
                        setShowSettings(false)
                        setSettings(data)
                      }}
                    />
                  </Container>
                ) : (
                  <Container maxWidth="xl" disableGutters>
                    <Grid container spacing={0}>
                      <Grid item xs={2}>
                        <FileViewer
                          className={classes.root}
                          onNodeSelect={handleSelect}
                          sources={sources}
                          onDelete={handleDelete}
                          selected={selected}
                        />
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="subtitle1">
                          <input
                            value={fileRename === '' ? selected : fileRename}
                            style={{ border: 'none', width: '100%' }}
                            onChange={(e) => {
                              setfileRename(e.target.value)
                            }}
                            onBlur={(e) => {
                              const tmp = sources
                              const tmpContent = sources[selected]
                              delete tmp[selected]
                              tmp[e.target.value] = tmpContent
                              setSources(tmp)
                              setSelected(e.target.value)
                              setfileRename('')
                            }}
                          />
                        </Typography>

                        <Editor value={editor} onChange={handleEditor} annotations={[customAnnotations]} />
                      </Grid>

                      <Grid item xs={5}>
                        <RenderResult data={renderResult} />
                      </Grid>
                    </Grid>
                  </Container>
                )}
              </>
            )}
          </>
        ) : (
          <Container maxWidth="md" disableGutters style={{ textAlign: 'center' }}>
            {/* <CircularProgress /> */}
            <LinearProgress variant="determinate" value={wasmLoadProgress} />
            <p>Loading Helm Renderer</p>
          </Container>
        )}
      </Box>
    </>
  )
}

const App = (): JSX.Element => (
  <ThemeProvider theme={theme}>
    <Playground />
  </ThemeProvider>
)

export default App
