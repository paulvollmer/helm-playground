//go:build js && wasm

package render

import (
	"encoding/json"
	"github.com/paulvollmer/helm-playground/pkg/errors"
	"github.com/paulvollmer/helm-playground/pkg/settings"
	"gopkg.in/yaml.v2"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chartutil"
	"helm.sh/helm/v3/pkg/engine"
)

type InputTemplates map[string]string

func ParseInputTemplates(i string) ([]*chart.File, map[string]interface{}) {
	var inputTemplate InputTemplates
	if err := json.Unmarshal([]byte(i), &inputTemplate); err != nil {
		return nil, errors.ReturnObjectErrorInvalidTemplate(err)
	}

	templates := make([]*chart.File, 0)
	for k, v := range inputTemplate {
		templates = append(templates, &chart.File{Name: k, Data: []byte(v)})
	}

	return templates, nil
}

type InputValues map[string]interface{}

func ParseInputValues(i string) (InputValues, map[string]interface{}) {
	valuesInput := make(InputValues, 0)
	err := yaml.Unmarshal([]byte(i), &valuesInput)
	if err != nil {
		return nil, errors.ReturnObjectErrorYaml(err)
	}
	return valuesInput, nil
}

func ParseInputChartMetadata(i string) (*chart.Metadata, map[string]interface{}) {
	chartMetadata := chart.Metadata{}
	err := yaml.Unmarshal([]byte(i), &chartMetadata)
	if err != nil {
		return nil, errors.ReturnObjectErrorChartYaml(err)
	}
	return &chartMetadata, nil
}

func createChartValues(metadata *chart.Metadata, values InputValues, s *settings.Settings) chartutil.Values {
	return chartutil.Values{
		"Values": values,
		"Chart":  metadata,
		"Files": map[string]interface{}{
			"Get":       "",
			"GetBytes":  "",
			"GetGlob":   "",
			"Lines":     "",
			"AsSecrets": "",
			"AsConfig":  "",
		},
		"Release": map[string]interface{}{
			"Name":      s.Release.Name,
			"Namespace": s.Release.Namespace,
			"IsUpgrade": s.Release.IsUpgrade,
			"IsInstall": s.Release.IsInstall,
			"Revision":  s.Release.Revision,
			"Service":   s.Release.Service,
		},
		"Capabilities": map[string]interface{}{
			"KubeVersion": map[string]interface{}{
				"Version": s.KubeVersion.Version,
				"Major":   s.KubeVersion.Major,
				"Minor":   s.KubeVersion.Minor,
			},
			"HelmVersion": map[string]interface{}{
				"Version":      s.HelmVersion.Version,
				"GitCommit":    s.HelmVersion.GitCommit,
				"GitTreeState": s.HelmVersion.GitTreeState,
				"GoVersion":    s.HelmVersion.GoVersion,
			},
			//"Template": map[string]interface{}{
			//	"Name":     "",
			//	"BasePath": "",
			//},
		},
	}
}

func Render(metadata *chart.Metadata, templates []*chart.File, valuesInput InputValues, s *settings.Settings) map[string]interface{} {
	chrt := &chart.Chart{
		Metadata:  metadata,
		Templates: templates,
		Values:    map[string]interface{}{
			//"image": "",
			//"labels": map[string]interface{}{},
		},
		Schema: []byte{},
	}

	values := createChartValues(metadata, valuesInput, s)
	d, err := engine.Render(chrt, values)
	if err != nil {
		return errors.ReturnObjectErrorRender(err)
	}

	result := ""
	for _, v := range d {
		result += v
	}

	return map[string]interface{}{
		"result": result,
	}
}
