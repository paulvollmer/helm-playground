import { Menu, MenuItem } from "@material-ui/core";
import { TreeItem, TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { chartFilename } from "../../defaults/chart_yaml";
import { valuesFilename } from "../../defaults/values_yaml";
import { helmignoreFilename } from "../../defaults/helmignore";
import React from "react";

type FileViewerProps = {
    className: string;
    onNodeSelect?: (event: React.ChangeEvent<{}>, nodeIds: string) => void;
    sources: any;
    onDelete: (event: React.ChangeEvent<{}>, src: string) => void;
    selected: string | undefined;
}

const FileViewer = (props: FileViewerProps) => {
    return (
        <>
            <TreeView
                className={props.className}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultExpanded={['templates']}
                onNodeSelect={props.onNodeSelect}
                selected={props.selected}
            >
                <TreeItem nodeId={chartFilename} label={chartFilename} />
                <TreeItem nodeId={valuesFilename} label={valuesFilename} />
                <TreeItem nodeId={helmignoreFilename} label={helmignoreFilename} />
                <TreeItem nodeId="templates" label="templates">
                    {Object.keys(props.sources).map((filename) => {
                        return <TreeItem key={filename} nodeId={filename} label={<TreeItemLabel onDelete={props.onDelete} title={filename} />} />
                    })}
                <TreeItem nodeId={"__ADD__"} label={"+"} />
                </TreeItem>
            </TreeView>
        </>
    )
}
export default FileViewer;

type TreeItemLabelProps = {
    onDelete: (event: React.ChangeEvent<{}>, src: string) => void;
    title: string;
}

const TreeItemLabel = (props: TreeItemLabelProps) => {
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: any) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX - 2,
                    mouseY: event.clientY - 4,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <>
            <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>{props.title}</div>

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem
                    onClick={e => {
                        props.onDelete(e, props.title)
                        handleClose()
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
        </>
    )
}