declare global {
  interface Window {
    helmRender: (templates: string, values: string, chart: string, settings: string) => helmRenderReturn
    helmDefaultCapabilities: () => SettingsData
  }
}

export type helmRenderReturn = {
  error?: helmRenderReturnError
  result?: string
}

export type helmRenderReturnError = {
  kind: string
  file: string
  line: number
  message: string
}

export type Sources = {
  [key: string]: string
}

export type SettingsData = {
  release: SettingsRelease
  kubeVersion: SettingsKubeVersion
  helmVersion: SettingsHelmVersion
}

export type SettingsRelease = {
  name: string
  namespace: string
  revision: string
  isUpgrade: string
  isInstall: string
  service: string
}

export type SettingsKubeVersion = {
  version: string
  major: string
  minor: string
}

export type SettingsHelmVersion = {
  version: string
  gitCommit: string
  gitTreeState: string
  goVersion: string
}
