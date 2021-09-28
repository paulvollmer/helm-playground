import React, { useState } from "react";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SettingsData } from "../../types";

const useStyles = makeStyles((theme) => createStyles({
    typography: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    textfield: {
        marginBottom: theme.spacing(1),
    }
}));

type SettingsProps = {
    show: boolean;
    data: SettingsData;
    handleSave: (d: SettingsData) => void;
}

const Settings = (props: SettingsProps) => {
    const classes = useStyles();

    const [releaseName, setReleaseName] = useState<string>(props.data.release.name)
    const [releaseNamespace, setReleaseNamespace] = useState<string>(props.data.release.namespace)
    const [releaseIsUpgrade, setReleaseIsUpgrade] = useState<string>(props.data.release.isUpgrade)
    const [releaseIsInstall, setReleaseIsInstall] = useState<string>(props.data.release.isInstall)
    const [releaseRevision, setReleaseRevision] = useState<string>(props.data.release.revision)
    const [releaseService, setReleaseService] = useState<string>(props.data.release.service)

    const [kubeVersion, setKubeVersion] = useState<string>(props.data.kubeVersion.version)
    const [kubeMajor, setKubeMajor] = useState<string>(props.data.kubeVersion.major)
    const [kubeMinor, setKubeMinor] = useState<string>(props.data.kubeVersion.minor)

    const [helmVersion, setHelmVersion] = useState<string>(props.data.helmVersion.version)
    const [helmGitCommit, setHelmGitCommit] = useState<string>(props.data.helmVersion.gitCommit)
    const [helmGitTreeState, setHelmGitTreeState] = useState<string>(props.data.helmVersion.gitTreeState)
    const [helmGoVersion, setHelmGoVersion] = useState<string>(props.data.helmVersion.goVersion)

    const handleClick = () => {
        let data: SettingsData = {
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
                major: kubeMajor,
                minor: kubeMinor,
            },
            helmVersion: {
                version: helmVersion,
                gitCommit: helmGitCommit,
                gitTreeState: helmGitTreeState,
                goVersion: helmGoVersion,
            }
        }
        props.handleSave(data)
    }

    return (
        <Paper style={{ padding: "2em" }}>
            <Grid container spacing={2} >
                <Grid item md={12}>
                    <Typography variant="h4">
                        Settings
                    </Typography>

                    <Typography variant="h5" className={classes.typography}>
                        Release
                    </Typography>
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="release-name"
                        label="Release Name"
                        value={releaseName}
                        onChange={(e) => setReleaseName(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="release-namespace"
                        label="Release Namespace"
                        value={releaseNamespace}
                        onChange={(e) => setReleaseNamespace(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="release-isupgrade"
                        label="Release Is Upgrade"
                        value={releaseIsUpgrade}
                        onChange={(e) => setReleaseIsUpgrade(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="release-isinstall"
                        label="Release Is Install"
                        value={releaseIsInstall}
                        onChange={(e) => setReleaseIsInstall(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="release-revision"
                        label="Release Revision"
                        value={releaseRevision}
                        onChange={(e) => setReleaseRevision(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="release-service"
                        label="Release Service"
                        value={releaseService}
                        onChange={(e) => setReleaseService(e.target.value)}
                    />
                </Grid>

                <Grid item md={6}>
                    <Typography variant="h5" className={classes.typography}>
                        Kubernetes Version
                    </Typography>
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="kubernetes-version"
                        label="Kubernetes Version"
                        value={kubeVersion}
                        onChange={(e) => setKubeVersion(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="kubernetes-major"
                        label="Kubernetes Major"
                        value={kubeMajor}
                        onChange={(e) => setKubeMajor(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="kubernetes-minor"
                        label="Kubernetes Minor"
                        value={kubeMinor}
                        onChange={(e) => setKubeMinor(e.target.value)}
                    />
                </Grid>

                <Grid item md={6}>
                    <Typography variant="h5" className={classes.typography}>
                        Helm Version
                    </Typography>
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="helm-version"
                        label="Version"
                        value={helmVersion}
                        onChange={(e) => setHelmVersion(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="helm-goversion"
                        label="GoVersion"
                        value={helmGoVersion}
                        onChange={(e) => setHelmGoVersion(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="helm-gitcommit"
                        label="GitCommit"
                        value={helmGitCommit}
                        onChange={(e) => setHelmGitCommit(e.target.value)}
                    />
                    <TextField
                        className={classes.textfield}
                        fullWidth
                        variant="standard"
                        id="helm-gittreestate"
                        label="GitTreeState"
                        value={helmGitTreeState}
                        onChange={(e) => setHelmGitTreeState(e.target.value)}
                    />
                </Grid>

                <Grid item md={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "2em" }}
                        onClick={handleClick}>Save Settings</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Settings
