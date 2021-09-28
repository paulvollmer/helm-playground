import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import {helmRenderReturn, helmRenderReturnError} from "../../types";
import {Typography} from "@material-ui/core";

type RenderResultProps = {
    data: helmRenderReturn
}

/**
 * call the helmRender function and dispay the result
 */
const RenderResult = (props: RenderResultProps) => {
    return (
        <>
            {props.data.error ? (
                <RenderError error={props.data.error}/>
            ) : (
                <>
                    <Typography variant="subtitle1">Render Output</Typography>
                    <AceEditor
                        mode="yaml"
                        theme="github"
                        name="editor"
                        width="100%"
                        height="80vh"
                        value={props.data.result}
                        editorProps={{$blockScrolling: true}}
                    />
                </>
            )}
        </>
    )
}


type RenderErrorProps = {
    error: helmRenderReturnError;
}

const RenderError = (props: RenderErrorProps) => {
    return (
        <div>
            <Typography variant="subtitle1">
                Error Kind: {props.error.kind}
            </Typography>
            <Typography variant="h6">
                File: {props.error.file} {props.error.line ? (`Line: ${props.error.line}`): ""}
            </Typography>
            <Typography variant="body1">
                {props.error.message}
            </Typography>
        </div>
    )
}

export default RenderResult
