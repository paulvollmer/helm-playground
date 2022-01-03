//go:build js && wasm

package settings

import (
	"errors"
	"syscall/js"
)

type Settings struct {
	Release     *Release
	KubeVersion *KubeVersion
	HelmVersion *HelmVersion
}

func NewSettingsFromJSValue(value js.Value) (*Settings, error) {
	if !value.Truthy() {
		return nil, errors.New("value is undefined")
	}
	if value.Type() != js.TypeObject {
		return nil, errors.New("value must be type of object")
	}

	s := new(Settings)

	var err error

	releaseValue := value.Get("release")
	if releaseValue.Type() != js.TypeObject {
		return nil, errors.New("release must be type of object")
	}
	s.Release, err = NewReleaseFromJSValue(releaseValue)
	if err != nil {
		return nil, err
	}

	kubeVersionValue := value.Get("kubeVersion")
	if kubeVersionValue.Type() != js.TypeObject {
		return nil, errors.New("kubeVersion must be type of object")
	}
	s.KubeVersion, err = NewKubeVersionFromJSValue(kubeVersionValue)
	if err != nil {
		return nil, err
	}

	helmVersionValue := value.Get("helmVersion")
	if helmVersionValue.Type() != js.TypeObject {
		return nil, errors.New("helmVersion must be type of object")
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
		return nil, errors.New("value is undefined")
	}

	release := new(Release)

	if value.Get("name").Type() != js.TypeString {
		return nil, errors.New("name must be type of string")
	}
	release.Name = value.Get("name").String()

	if value.Get("namespace").Type() != js.TypeString {
		return nil, errors.New("namespace must be type of string")
	}
	release.Namespace = value.Get("namespace").String()

	if value.Get("revision").Type() != js.TypeString {
		return nil, errors.New("revision must be type of string")
	}
	release.Revision = value.Get("revision").String()

	if value.Get("isUpgrade").Type() != js.TypeString {
		return nil, errors.New("isUpgrade must be type of string")
	}
	release.IsUpgrade = value.Get("isUpgrade").String()

	if value.Get("isInstall").Type() != js.TypeString {
		return nil, errors.New("isInstall must be type of string")
	}
	release.IsInstall = value.Get("isInstall").String()

	if value.Get("service").Type() != js.TypeString {
		return nil, errors.New("service must be type of string")
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
		return nil, errors.New("value is undefined")
	}

	kubeVersion := new(KubeVersion)

	if value.Get("version").Type() != js.TypeString {
		return nil, errors.New("version must be type of string")
	}
	kubeVersion.Version = value.Get("version").String()

	//if value.Get("major").Type() != js.TypeString {
	//	return nil, errors.New("major must be type of string")
	//}
	//kubeVersion.Major = value.Get("major").String()
	//
	//if value.Get("minor").Type() != js.TypeString {
	//	return nil, errors.New("minor must be type of string")
	//}
	//kubeVersion.Minor = value.Get("minor").String()

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
		return nil, errors.New("value is undefined")
	}

	helmVersion := new(HelmVersion)

	if value.Get("version").Type() != js.TypeString {
		return nil, errors.New("version must be type of string")
	}
	helmVersion.Version = value.Get("version").String()

	if value.Get("gitCommit").Type() != js.TypeString {
		return nil, errors.New("gitCommit must be type of string")
	}
	helmVersion.GitCommit = value.Get("gitCommit").String()

	if value.Get("gitTreeState").Type() != js.TypeString {
		return nil, errors.New("gitTreeState must be type of string")
	}
	helmVersion.GitTreeState = value.Get("gitTreeState").String()

	if value.Get("goVersion").Type() != js.TypeString {
		return nil, errors.New("goVersion must be type of string")
	}
	helmVersion.GoVersion = value.Get("goVersion").String()

	return helmVersion, nil
}
