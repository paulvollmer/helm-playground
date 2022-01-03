package settings

type Settings struct {
	Release     Release     `json:"release"`
	KubeVersion KubeVersion `json:"kubeVersion"`
	HelmVersion HelmVersion `json:"helmVersion"`
}

type Release struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
	Revision  string `json:"revision"`
	IsUpgrade string `json:"isUpgrade"`
	IsInstall string `json:"isInstall"`
	Service   string `json:"service"`
}

type KubeVersion struct {
	Version string `json:"version"`
	Major   string `json:"major"`
	Minor   string `json:"minor"`
}

type HelmVersion struct {
	Version      string `json:"version"`
	GitCommit    string `json:"gitCommit"`
	GitTreeState string `json:"gitTreeState"`
	GoVersion    string `json:"goVersion"`
}
