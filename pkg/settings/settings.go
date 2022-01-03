//go:build js && wasm

package settings

import (
	"errors"
	"syscall/js"
)

var (
	ErrorValueIsUndefined        = errors.New("value is undefined")
	ErrorValueMustBeObject       = errors.New("value must be type of object")
	ErrorReleaseInvalidType      = errors.New("release must be type of object")
	ErrorKubeVersionInvalidType  = errors.New("kubeVersion must be type of object")
	ErrorHelmVersionInvalidType  = errors.New("helmVersion must be type of object")
	ErrorNameInvalidType         = errors.New("name must be type of string")
	ErrorNamespaceInvalidType    = errors.New("namespace must be type of string")
	ErrorVersionInvalidType      = errors.New("version must be type of string")
	ErrorGoVersionInvalidType    = errors.New("goVersion must be type of string")
	ErrorGitTreeStateInvalidType = errors.New("gitTreeState must be type of string")
	ErrorGitCommitInvalidType    = errors.New("gitCommit must be type of string")
	ErrorRevisionInvalidType     = errors.New("revision must be type of string")
	ErrorIsUpgradeInvalidType    = errors.New("isUpgrade must be type of string")
	ErrorIsInstallInvalidType    = errors.New("isInstall must be type of string")
	ErrorServiceInvalidType      = errors.New("service must be type of string")
)

type Settings struct {
	Release     *Release
	KubeVersion *KubeVersion
	HelmVersion *HelmVersion
}

func NewSettingsFromJSValue(value js.Value) (*Settings, error) {
	if !value.Truthy() {
		return nil, ErrorValueIsUndefined
	}
	if value.Type() != js.TypeObject {
		return nil, ErrorValueMustBeObject
	}

	s := new(Settings)

	var err error

	releaseValue := value.Get("release")
	if releaseValue.Type() != js.TypeObject {
		return nil, ErrorReleaseInvalidType
	}
	s.Release, err = NewReleaseFromJSValue(releaseValue)
	if err != nil {
		return nil, err
	}

	kubeVersionValue := value.Get("kubeVersion")
	if kubeVersionValue.Type() != js.TypeObject {
		return nil, ErrorKubeVersionInvalidType
	}
	s.KubeVersion, err = NewKubeVersionFromJSValue(kubeVersionValue)
	if err != nil {
		return nil, err
	}

	helmVersionValue := value.Get("helmVersion")
	if helmVersionValue.Type() != js.TypeObject {
		return nil, ErrorHelmVersionInvalidType
	}
	s.HelmVersion, err = NewHelmVersionFromJSValue(helmVersionValue)
	if err != nil {
		return nil, err
	}

	return s, nil
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
		return nil, ErrorValueIsUndefined
	}
	if value.Type() != js.TypeObject {
		return nil, ErrorValueMustBeObject
	}

	release := new(Release)

	if value.Get("name").Type() != js.TypeString {
		return nil, ErrorNameInvalidType
	}
	release.Name = value.Get("name").String()

	if value.Get("namespace").Type() != js.TypeString {
		return nil, ErrorNamespaceInvalidType
	}
	release.Namespace = value.Get("namespace").String()

	if value.Get("revision").Type() != js.TypeString {
		return nil, ErrorRevisionInvalidType
	}
	release.Revision = value.Get("revision").String()

	if value.Get("isUpgrade").Type() != js.TypeString {
		return nil, ErrorIsUpgradeInvalidType
	}
	release.IsUpgrade = value.Get("isUpgrade").String()

	if value.Get("isInstall").Type() != js.TypeString {
		return nil, ErrorIsInstallInvalidType
	}
	release.IsInstall = value.Get("isInstall").String()

	if value.Get("service").Type() != js.TypeString {
		return nil, ErrorServiceInvalidType
	}
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
		return nil, ErrorValueIsUndefined
	}
	if value.Type() != js.TypeObject {
		return nil, ErrorValueMustBeObject
	}

	kubeVersion := new(KubeVersion)

	if value.Get("version").Type() != js.TypeString {
		return nil, ErrorVersionInvalidType
	}
	kubeVersion.Version = value.Get("version").String()

	// if value.Get("major").Type() != js.TypeString {
	// 	return nil, errors.New("major must be type of string")
	// }
	// kubeVersion.Major = value.Get("major").String()
	//
	// if value.Get("minor").Type() != js.TypeString {
	// 	return nil, errors.New("minor must be type of string")
	// }
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
		return nil, ErrorValueIsUndefined
	}
	if value.Type() != js.TypeObject {
		return nil, ErrorValueMustBeObject
	}

	helmVersion := new(HelmVersion)

	if value.Get("version").Type() != js.TypeString {
		return nil, ErrorVersionInvalidType
	}
	helmVersion.Version = value.Get("version").String()

	if value.Get("gitCommit").Type() != js.TypeString {
		return nil, ErrorGitCommitInvalidType
	}
	helmVersion.GitCommit = value.Get("gitCommit").String()

	if value.Get("gitTreeState").Type() != js.TypeString {
		return nil, ErrorGitTreeStateInvalidType
	}
	helmVersion.GitTreeState = value.Get("gitTreeState").String()

	if value.Get("goVersion").Type() != js.TypeString {
		return nil, ErrorGoVersionInvalidType
	}
	helmVersion.GoVersion = value.Get("goVersion").String()

	return helmVersion, nil
}
