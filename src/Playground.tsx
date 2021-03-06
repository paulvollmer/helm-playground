import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
import { version, wasmSize } from './envvars'
import { defaultHelmGitCommit, defaultHelmGitTreeState, defaultHelmGoVersion, defaultHelmVersion } from './defaults/helm'
import { defaultKubernetesVersion } from './components/Settings/kubernetesVersions'
import { extensionIsTpl, getAllTplFilenamesFromList, getFileExtension } from './utils/utils'

// log the version to console
// eslint-disable-next-line no-console
console.log(`git hash: ${version}`)

const drawerWidth = 280

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}))

const initialTemplateSources: Sources = {}
initialTemplateSources[helpersFilename] = helpersContent
initialTemplateSources[deploymentFilename] = deploymentContent
initialTemplateSources[ingressFilename] = ingressContent
initialTemplateSources[notesFilename] = notesContent
initialTemplateSources[serviceFilename] = serviceContent
initialTemplateSources[serviceaccountFilename] = serviceaccountContent

function Playground(): JSX.Element {
  const classes = useStyles()

  const [wasmLoaded, setWasmLoaded] = useState<boolean>(false)
  const [wasmLoadProgress, setWasmLoadProgress] = useState(0)
  const [wasmError, setWasmError] = useState<string>('')

  const [chartSource, setChartSource] = useState(chartContent)
  const [valuesSource, setValuesSource] = useState(valuesContent)
  const [helmignoreSource, setHelmignoreSource] = useState(helmignoreContent)
  const [sources, setSources] = useState(initialTemplateSources)

  const [selected, setSelected] = useState(chartFilename)
  const [prevSelectedTemplate, setPrevSelectedTemplate] = useState(deploymentFilename)
  const [editor, setEditor] = useState(chartContent)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customAnnotations, setCustomAnnotations] = useState<Ace.Annotation>({ text: '', type: '' })
  const [aceEditor] = useState<Ace.Editor>()
  const [aceEditorError, setAceEditorError] = useState({ row: 0, text: '' })
  const [fileRename, setfileRename] = useState('')

  const [renderResult, setRenderResult] = useState<HelmRenderReturn>({
    result: '',
  })

  const [releaseName, setReleaseName] = useState<string>('sample')
  const [releaseNamespace, setReleaseNamespace] = useState<string>('default')
  const [releaseIsUpgrade, setReleaseIsUpgrade] = useState<string>('false')
  const [releaseIsInstall, setReleaseIsInstall] = useState<string>('false')
  const [releaseRevision, setReleaseRevision] = useState<string>('1')
  const [releaseService, setReleaseService] = useState<string>('Helm')
  const [kubeVersion, setKubeVersion] = useState<string>(defaultKubernetesVersion)
  const [helmVersion, setHelmVersion] = useState<string>(defaultHelmVersion)
  const [helmGitCommit, setHelmGitCommit] = useState<string>(defaultHelmGitCommit)
  const [helmGitTreeState, setHelmGitTreeState] = useState<string>(defaultHelmGitTreeState)
  const [helmGoVersion, setHelmGoVersion] = useState<string>(defaultHelmGoVersion)

  const getSettingsObject = (): SettingsData => {
    return {
      release: {
        name: releaseName,
        namespace: releaseNamespace,
        isUpgrade: releaseIsUpgrade,
        isInstall: releaseIsInstall,
        revision: releaseRevision,
        service: releaseService,
      },
      kubeVersion: {
        version: kubeVersion,
      },
      helmVersion: {
        version: helmVersion,
        gitCommit: helmGitCommit,
        gitTreeState: helmGitTreeState,
        goVersion: helmGoVersion,
      },
    }
  }

  useEffect(() => {
    axios
      .request({
        method: 'get',
        url: 'main.wasm',
        responseType: 'arraybuffer',
        onDownloadProgress: (p) => {
          setWasmLoadProgress((p.loaded / wasmSize) * 100)
        },
      })
      .then((res) => {
        setWasmLoadProgress(100)
        return new Blob([res.data]).arrayBuffer()
      })
      .then((bin) => {
        const go = new Go()
        WebAssembly.instantiate(bin, go.importObject)
          .then((result) => {
            go.run(result.instance)
            // @ts-ignore
            window.helmRender = helmRender
            setWasmLoaded(true)
          })
          .catch((err) => {
            console.error('webassembly instantiate error', err)
            setWasmError('could not instantiate helm renderer')
          })
      })
  }, [])

  useEffect(() => {
    if (wasmLoaded) {
      const ext = getFileExtension(selected)

      const filesToRender: Sources = {}

      // find all template helper files
      getAllTplFilenamesFromList(Object.keys(sources)).forEach((filename) => {
        filesToRender[filename] = sources[filename]
      })

      // when the selcted source is a template render it,
      // if not render the previous selected template.
      if (!extensionIsTpl(ext)) {
        filesToRender[selected] = sources[selected]
      } else {
        filesToRender[prevSelectedTemplate] = sources[prevSelectedTemplate]
      }

      const result = window.helmRender(JSON.stringify(filesToRender), valuesSource, chartSource, getSettingsObject())
      setRenderResult(result)

      let annotation: Ace.Annotation = { text: '', type: '' }
      let tmpError = { row: -1, text: '' }
      if (result.error) {
        if (result.error.kind !== '') {
          switch (result?.error.kind) {
            case 'input':
              switch (result.error.file) {
                case valuesFilename:
                  tmpError = {
                    row: result.error.line ? result.error.line - 1 : 0,
                    text: result.error.message,
                  }
                  break

                case chartFilename:
                  tmpError = {
                    row: result.error.line ? result.error.line - 1 : 0,
                    text: result.error.message,
                  }
                  break
                default:
                  break
              }
              break

            case 'render':
              annotation = {
                row: result.error.line ? result.error.line - 1 : 0,
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
  }, [
    wasmLoaded,
    editor,
    sources,
    valuesSource,
    chartSource,
    selected,
    releaseName,
    releaseNamespace,
    releaseIsUpgrade,
    releaseIsInstall,
    releaseRevision,
    releaseService,
    kubeVersion,
    helmVersion,
    helmGitCommit,
    helmGitTreeState,
    helmGoVersion,
  ])

  useEffect(() => {
    if (wasmLoaded && aceEditor) {
      let annotations: Ace.Annotation = { text: '', type: '' }
      if (aceEditorError.row !== -1) {
        annotations = {
          row: aceEditorError.row,
          column: 0,
          type: 'error',
          text: aceEditorError.text,
        }
      }
      aceEditor?.getSession().setAnnotations([annotations])
    }
  }, [wasmLoaded, aceEditor, aceEditorError])

  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => { // eslint-disable-line
    const ext = getFileExtension(nodeIds)
    setSelected(nodeIds)

    if (!extensionIsTpl(ext)) {
      setPrevSelectedTemplate(nodeIds)
    }

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
        tmp[selected] = newValue
        setSources(tmp)
    }
  }

  const handleDelete = (event: React.ChangeEvent<{}>, src: string) => { // eslint-disable-line
    setSelected(chartFilename)
    setEditor(sources[chartFilename])
    const tmp = sources
    delete sources[src]
    setSources(tmp)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation
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
      />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="settings" id="settings">
              <Typography>Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Settings
                releaseName={releaseName}
                releaseNamespace={releaseNamespace}
                releaseIsUpgrade={releaseIsUpgrade}
                releaseIsInstall={releaseIsInstall}
                releaseRevision={releaseRevision}
                releaseService={releaseService}
                kubeVersion={kubeVersion}
                helmVersion={helmVersion}
                helmGitCommit={helmGitCommit}
                helmGitTreeState={helmGitTreeState}
                helmGoVersion={helmGoVersion}
                onChangeReleaseName={(d) => setReleaseName(d)}
                onChangeReleaseNamespace={(d) => setReleaseNamespace(d)}
                onChangeReleaseIsUpgrade={(d) => setReleaseIsUpgrade(d)}
                onChangeReleaseIsInstall={(d) => setReleaseIsInstall(d)}
                onChangeReleaseRevision={(d) => setReleaseRevision(d)}
                onChangeReleaseService={(d) => setReleaseService(d)}
                onChangeKubeVersion={(d) => setKubeVersion(d)}
                onChangeHelmVersion={(d) => setHelmVersion(d)}
                onChangeHelmGitCommit={(d) => setHelmGitCommit(d)}
                onChangeHelmGitTreeState={(d) => setHelmGitTreeState(d)}
                onChangeHelmGoVersion={(d) => setHelmGoVersion(d)}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="files" id="files">
              <Typography>Files</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FileViewer
                className={classes.root}
                onNodeSelect={handleSelect}
                sources={sources}
                onDelete={handleDelete}
                selected={selected}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Box sx={{ pt: 10, pb: 8 }}>
          {wasmLoaded ? (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {wasmError !== '' ? (
                <Container maxWidth="md" disableGutters style={{ textAlign: 'center' }}>
                  <p>{wasmError}</p>
                </Container>
              ) : (
                <Container maxWidth="xl" disableGutters>
                  <Grid container spacing={0} style={{ height: 'calc(100vh - 150px)' }}>
                    <Grid item xs={6}>
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

                    <Grid item xs={6}>
                      <RenderResult data={renderResult} />
                    </Grid>
                  </Grid>
                </Container>
              )}
            </>
          ) : (
            <Container maxWidth="md" disableGutters style={{ textAlign: 'center' }}>
              <LinearProgress variant="determinate" value={wasmLoadProgress} />
              <p>Loading Helm Renderer</p>
            </Container>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Playground
