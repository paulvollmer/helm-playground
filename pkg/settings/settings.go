//go:build js && wasm

package settings

import (
	"errors"
	"syscall/js"
)

var (
	ErrValueIsUndefined        = errors.New("value is undefined")
	ErrValueMustBeObject       = errors.New("value must be type of object")
	ErrReleaseInvalidType      = errors.New("release must be type of object")
	ErrKubeVersionInvalidType  = errors.New("kubeVersion must be type of object")
	ErrHelmVersionInvalidType  = errors.New("helmVersion must be type of object")
	ErrNameInvalidType         = errors.New("name must be type of string")
	ErrNamespaceInvalidType    = errors.New("namespace must be type of string")
	ErrVersionInvalidType      = errors.New("version must be type of string")
	ErrGoVersionInvalidType    = errors.New("goVersion must be type of string")
	ErrGitTreeStateInvalidType = errors.New("gitTreeState must be type of string")
	ErrGitCommitInvalidType    = errors.New("gitCommit must be type of string")
	ErrRevisionInvalidType     = errors.New("revision must be type of string")
	ErrIsUpgradeInvalidType    = errors.New("isUpgrade must be type of string")
	ErrIsInstallInvalidType    = errors.New("isInstall must be type of string")
	ErrServiceInvalidType      = errors.New("service must be type of string")
)

type Settings struct {
	Release     *Release
	KubeVersion *KubeVersion
	HelmVersion *HelmVersion
}

func NewSettingsFromJSValue(value js.Value) (*Settings, error) {
	if !value.Truthy() {
		return nil, ErrValueIsUndefined
	}

	if value.Type() != js.TypeObject {
		return nil, ErrValueMustBeObject
	}

	stng := new(Settings)

	var err error

	releaseValue := value.Get("release")
	if releaseValue.Type() != js.TypeObject {
		return nil, ErrReleaseInvalidType
	}

	stng.Release, err = NewReleaseFromJSValue(releaseValue)
	if err != nil {
		return nil, err
	}

	kubeVersionValue := value.Get("kubeVersion")
	if kubeVersionValue.Type() != js.TypeObject {
		return nil, ErrKubeVersionInvalidType
	}

	stng.KubeVersion, err = NewKubeVersionFromJSValue(kubeVersionValue)
	if err != nil {
		return nil, err
	}

	helmVersionValue := value.Get("helmVersion")
	if helmVersionValue.Type() != js.TypeObject {
		return nil, ErrHelmVersionInvalidType
	}

	stng.HelmVersion, err = NewHelmVersionFromJSValue(helmVersionValue)
	if err != nil {
		return nil, err
	}

	return stng, nil
}

type Release struct {
	Name      string
	Namespace string
	Revision  string
	IsUpgrade string
	IsInstall string
	Service   string
}

func NewReleaseFromJSValue(value js.Value) (*Release, error) {
	if !value.Truthy() {
		return nil, ErrValueIsUndefined
	}

	if value.Type() != js.TypeObject {
		return nil, ErrValueMustBeObject
	}

	if value.Get("name").Type() != js.TypeString {
		return nil, ErrNameInvalidType
	}

	if value.Get("namespace").Type() != js.TypeString {
		return nil, ErrNamespaceInvalidType
	}

	if value.Get("revision").Type() != js.TypeString {
		return nil, ErrRevisionInvalidType
	}

	if value.Get("isUpgrade").Type() != js.TypeString {
		return nil, ErrIsUpgradeInvalidType
	}

	if value.Get("isInstall").Type() != js.TypeString {
		return nil, ErrIsInstallInvalidType
	}

	if value.Get("service").Type() != js.TypeString {
		return nil, ErrServiceInvalidType
	}

	release := new(Release)
	release.Name = value.Get("name").String()
	release.Namespace = value.Get("namespace").String()
	release.Revision = value.Get("revision").String()
	release.IsUpgrade = value.Get("isUpgrade").String()
	release.IsInstall = value.Get("isInstall").String()
	release.Service = value.Get("service").String()

	return release, nil
}

type KubeVersion struct {
	Version string
	// Major   string
	// Minor   string
}

func NewKubeVersionFromJSValue(value js.Value) (*KubeVersion, error) {
	if !value.Truthy() {
		return nil, ErrValueIsUndefined
	}

	if value.Type() != js.TypeObject {
		return nil, ErrValueMustBeObject
	}

	if value.Get("version").Type() != js.TypeString {
		return nil, ErrVersionInvalidType
	}

	// if value.Get("major").Type() != js.TypeString {
	// 	return nil, errors.New("major must be type of string")
	// }

	// if value.Get("minor").Type() != js.TypeString {
	// 	return nil, errors.New("minor must be type of string")
	// }

	kubeVersion := new(KubeVersion)
	kubeVersion.Version = value.Get("version").String()
	// kubeVersion.Major = value.Get("major").String()
	// kubeVersion.Minor = value.Get("minor").String()

	return kubeVersion, nil
}

type HelmVersion struct {
	Version      string
	GitCommit    string
	GitTreeState string
	GoVersion    string
}

func NewHelmVersionFromJSValue(value js.Value) (*HelmVersion, error) {
	if !value.Truthy() {
		return nil, ErrValueIsUndefined
	}

	if value.Type() != js.TypeObject {
		return nil, ErrValueMustBeObject
	}

	if value.Get("version").Type() != js.TypeString {
		return nil, ErrVersionInvalidType
	}

	if value.Get("gitCommit").Type() != js.TypeString {
		return nil, ErrGitCommitInvalidType
	}

	if value.Get("gitTreeState").Type() != js.TypeString {
		return nil, ErrGitTreeStateInvalidType
	}

	if value.Get("goVersion").Type() != js.TypeString {
		return nil, ErrGoVersionInvalidType
	}

	helmVersion := new(HelmVersion)
	helmVersion.Version = value.Get("version").String()
	helmVersion.GitCommit = value.Get("gitCommit").String()
	helmVersion.GitTreeState = value.Get("gitTreeState").String()
	helmVersion.GoVersion = value.Get("goVersion").String()

	return helmVersion, nil
}
