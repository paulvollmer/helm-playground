import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import kubernetesVersions from './kubernetesVersions'

const useStyles = makeStyles((theme) =>
  createStyles({
    textfield: {
      marginBottom: theme.spacing(2),
    },
  })
)

export type SettingsProps = {
  releaseName: string
  releaseNamespace: string
  releaseIsUpgrade: string
  releaseIsInstall: string
  releaseRevision: string
  releaseService: string
  kubeVersion: string
  helmVersion: string
  helmGitCommit: string
  helmGitTreeState: string
  helmGoVersion: string
  onChangeReleaseName: (v: string) => void
  onChangeReleaseNamespace: (v: string) => void
  onChangeReleaseIsUpgrade: (v: string) => void
  onChangeReleaseIsInstall: (v: string) => void
  onChangeReleaseRevision: (v: string) => void
  onChangeReleaseService: (v: string) => void
  onChangeKubeVersion: (v: string) => void
  onChangeHelmVersion: (v: string) => void
  onChangeHelmGitCommit: (v: string) => void
  onChangeHelmGitTreeState: (v: string) => void
  onChangeHelmGoVersion: (v: string) => void
}

const Settings = (props: SettingsProps): JSX.Element => {
  const classes = useStyles()

  return (
    <>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="button">Release</Typography>
      </Box>
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="release-name"
        label="Release Name"
        value={props.releaseName}
        onChange={(e) => props.onChangeReleaseName(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="release-namespace"
        label="Release Namespace"
        value={props.releaseNamespace}
        onChange={(e) => props.onChangeReleaseNamespace(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="release-isupgrade"
        label="Release Is Upgrade"
        value={props.releaseIsUpgrade}
        onChange={(e) => props.onChangeReleaseIsUpgrade(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="release-isinstall"
        label="Release Is Install"
        value={props.releaseIsInstall}
        onChange={(e) => props.onChangeReleaseIsInstall(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="release-revision"
        label="Release Revision"
        value={props.releaseRevision}
        onChange={(e) => props.onChangeReleaseRevision(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="release-service"
        label="Release Service"
        value={props.releaseService}
        onChange={(e) => props.onChangeReleaseService(e.target.value)}
      />

      <Box sx={{ marginTop: 3, marginBottom: 2 }}>
        <Typography variant="button">Kubernetes Version</Typography>
      </Box>
      <Autocomplete
        options={kubernetesVersions}
        getOptionLabel={(option) => option}
        freeSolo
        value={props.kubeVersion}
        onChange={(e, v) => {
          if (v !== null) {
            props.onChangeKubeVersion(v)
          }
        }}
        renderInput={(params) => (
          <TextField
                {...params} // eslint-disable-line
            className={classes.textfield}
            fullWidth
            variant="standard"
            id="kubernetes-version"
            label="Kubernetes Version"
            onChange={(e) => {
              props.onChangeKubeVersion(e.target.value)
            }}
          />
        )}
      />
      {/* <TextField
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
                    /> */}

      <Box sx={{ marginTop: 3, marginBottom: 2 }}>
        <Typography variant="button">Helm Version</Typography>
      </Box>
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="helm-version"
        label="Version"
        value={props.helmVersion}
        onChange={(e) => props.onChangeHelmVersion(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="helm-goversion"
        label="GoVersion"
        value={props.helmGoVersion}
        onChange={(e) => props.onChangeHelmGoVersion(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="helm-gitcommit"
        label="GitCommit"
        value={props.helmGitCommit}
        onChange={(e) => props.onChangeHelmGitCommit(e.target.value)}
      />
      <TextField
        className={classes.textfield}
        fullWidth
        variant="standard"
        id="helm-gittreestate"
        label="GitTreeState"
        value={props.helmGitTreeState}
        onChange={(e) => props.onChangeHelmGitTreeState(e.target.value)}
      />
    </>
  )
}

export default Settings
