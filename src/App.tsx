import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Box, Container, createTheme, CssBaseline, Grid, makeStyles, Typography } from '@material-ui/core';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools';

import Navigation from "./components/Navigation";
import RenderResult from "./components/RenderResult";
import FileViewer from "./components/FileViewer";
import { chartContent, chartFilename } from "./defaults/chart_yaml";
import { helpersContent, helpersFilename } from "./defaults/helpers";
import { valuesContent, valuesFilename } from "./defaults/values_yaml";
import { ingressContent, ingressFilename } from "./defaults/ingress";
import { serviceContent, serviceFilename } from "./defaults/service";
import { notesContent, notesFilename } from "./defaults/notes";
import { serviceaccountContent, serviceaccountFilename } from "./defaults/serviceaccount";
import { deploymentContent, deploymentFilename } from "./defaults/deployment_yaml";
import { helmignoreContent, helmignoreFilename } from "./defaults/helmignore";
import handleExport from "./components/Export";
import handleImport from "./components/import";
import Settings from "./components/Settings";
import { helmRenderReturn, SettingsData, Sources } from "./types";
import { Ace } from "ace-builds";

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    navTitle: {
        flexGrow: 1,
        marginLeft: "20px"
    },
}));

let initialTemplateSources: Sources = {}
initialTemplateSources[helpersFilename] = helpersContent
initialTemplateSources[deploymentFilename] = deploymentContent
initialTemplateSources[ingressFilename] = ingressContent
initialTemplateSources[notesFilename] = notesContent
initialTemplateSources[serviceFilename] = serviceContent
initialTemplateSources[serviceaccountFilename] = serviceaccountContent

type AppProps = {
    defaultCapabilities: SettingsData;
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
        meta: 'The version of the app that this contains (optional). Needn\'t be SemVer. Quotes recommended.',
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


const App = (props: AppProps) => {
    const classes = useStyles();

    const [chartSource, setChartSource] = useState(chartContent)
    const [valuesSource, setValuesSource] = useState(valuesContent)
    const [helmignoreSource, setHelmignoreSource] = useState(helmignoreContent)
    const [sources, setSources] = useState(initialTemplateSources)

    const [selected, setSelected] = useState(chartFilename)
    const [editor, setEditor] = useState(chartContent)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [aceAnnotations, setAceAnnotations] = useState<Ace.Annotation[]>([]);
    const [aceEditor, setAceEditor] = useState<Ace.Editor>();
    const [aceEditorError, setAceEditorError] = useState({ row: 0, text: "" });
    const [fileRename, setfileRename] = useState("")

    const [renderResult, setRenderResult] = useState<helmRenderReturn>({ result: "" })

    const [showSettings, setShowSettings] = useState(false)
    const [settings, setSettings] = useState<SettingsData>(props.defaultCapabilities)

    useEffect(() => {
        addCompleter({
            getCompletions: function (editor: any, session: any, pos: any, prefix: any, callback: (arg0: null, arg1: { name: string; value: string; caption: string; meta: string; score: number; }[]) => void) {
                callback(null, [
                    ...autocompleteChartYaml,
                ]);
            },
        });
    })

    useEffect(() => {
        const filesToRender: Sources = {}
        filesToRender["_helpers.tpl"] = sources["_helpers.tpl"]
        filesToRender[selected] = sources[selected]

        const result = window.helmRender(JSON.stringify(filesToRender), valuesSource, chartSource, JSON.stringify(settings))
        setRenderResult(result)

        var tmpError = { row: -1, text: "" }
        if (result.error) {
            if (result.error.kind !== "") {
                switch (result?.error.kind) {
                    case "input":
                        switch (result.error.file) {
                            case valuesFilename:
                                tmpError = { row: result.error.line - 1, text: result.error.message }
                                break

                            case chartFilename:
                                tmpError = { row: result.error.line - 1, text: result.error.message }
                                break
                        }
                        break
                    case "templates":
                }
            }
        }
        setAceEditorError(tmpError)
    }, [editor, sources, valuesSource, chartSource, settings, selected])


    useEffect(() => {
        if (aceEditor) {
            // @ts-ignore
            let customAnnotations = []
            if (aceEditorError.row !== -1) {
                customAnnotations = [
                    { row: aceEditorError.row, column: 0, type: 'error', text: aceEditorError.text, custom: true }
                ]
            }
            // @ts-ignore
            aceEditor?.getSession().setAnnotations(customAnnotations);
        }
    }, [aceEditor, aceEditorError]);

    const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => {
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

            case "__ADD__":
                let tmp = sources
                tmp["untitled.yaml"] = ""
                setSelected("untitled.yaml")
                setSources(tmp)
                setEditor("")
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
                let tmp = sources
                // @ts-ignore
                tmp[selected] = newValue
                setSources(tmp)
        }

        // setRenderResult(window.helmRender(JSON.stringify(sources), valuesSource, chartSource, JSON.stringify(settings)))
    }

    const handleDelete = (event: React.ChangeEvent<{}>, src: string) => {
        setSelected(chartFilename)
        setEditor(sources[chartFilename])
        let tmp = sources
        delete sources[src]
        setSources(tmp)
    }

    const handleSettings = () => {
        setShowSettings(!showSettings)
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navigation
                className={classes.navTitle}
                handleImport={handleImport}
                handleExport={() => {
                    const options = {
                        chart: chartSource,
                        values: valuesSource,
                        helmignore: helmignoreSource,
                        templates: sources
                    }
                    handleExport("test", options)
                }}
                handleSettings={handleSettings}
            />

            <Box sx={{ pt: 10, pb: 8, }}>
                {showSettings ? (
                    <Container maxWidth="md" disableGutters={true}>
                        <Settings
                            show={true}
                            data={settings}
                            handleSave={(data) => {
                                setShowSettings(false)
                                setSettings(data)
                            }}
                        />
                    </Container>
                ) : (
                    <Container maxWidth="xl" disableGutters={true}>
                        <Grid container spacing={0}>

                            <Grid item lg={2}>
                                <FileViewer
                                    className={classes.root}
                                    onNodeSelect={handleSelect}
                                    sources={sources}
                                    onDelete={handleDelete}
                                    selected={selected}
                                />
                            </Grid>

                            <Grid item lg={5}>
                                <Typography variant="subtitle1">
                                    <input
                                        value={fileRename === "" ? selected: fileRename}
                                        style={{ border: "none", width: "100%" }}
                                        onChange={e => {
                                            console.log("edit name", e.target.value)
                                            setfileRename(e.target.value)
                                        }}
                                        onBlur={e => {
                                            console.log("blur name", e.target.value)
                                            
                                            let tmp = sources
                                            const tmpContent = sources[selected]
                                            delete tmp[selected]
                                            tmp[e.target.value] = tmpContent
                                            setSources(tmp)
                                            setSelected(e.target.value)
                                            setfileRename("")
                                        }}
                                    />
                                </Typography>

                                <AceEditor
                                    mode="yaml"
                                    theme="github"
                                    onLoad={setAceEditor}
                                    // @ts-ignore
                                    onValidate={setAceAnnotations}
                                    onChange={handleEditor}
                                    name="editor"
                                    value={editor}
                                    width="100%"
                                    height="80vh"
                                    editorProps={{
                                        $blockScrolling: true
                                    }}
                                    setOptions={{
                                        useWorker: true,
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                    }}
                                />
                            </Grid>

                            <Grid item lg={5}>
                                <RenderResult data={renderResult} />
                            </Grid>

                        </Grid>
                    </Container>
                )}
            </Box>

        </ThemeProvider>
    );
}

export default App;
