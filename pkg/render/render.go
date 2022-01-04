//go:build js && wasm

package render

import (
	"encoding/json"

	yaml "gopkg.in/yaml.v2"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chartutil"
	"helm.sh/helm/v3/pkg/engine"

	"github.com/paulvollmer/helm-playground/pkg/errors"
	"github.com/paulvollmer/helm-playground/pkg/settings"
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
	valuesInput := make(InputValues)

	err := yaml.Unmarshal([]byte(i), &valuesInput)
	if err != nil {
		return nil, errors.ReturnObjectErrorYaml(err)
	}

	return valuesInput, nil
}

func ParseInputChartMetadata(i string) (*chart.Metadata, map[string]interface{}) {
	var chartMetadata chart.Metadata

	err := yaml.Unmarshal([]byte(i), &chartMetadata)
	if err != nil {
		return nil, errors.ReturnObjectErrorChartYaml(err)
	}

	return &chartMetadata, nil
}

func createChartValues(metadata *chart.Metadata, values InputValues, stng *settings.Settings) chartutil.Values {
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
			"Name":      stng.Release.Name,
			"Namespace": stng.Release.Namespace,
			"IsUpgrade": stng.Release.IsUpgrade,
			"IsInstall": stng.Release.IsInstall,
			"Revision":  stng.Release.Revision,
			"Service":   stng.Release.Service,
		},
		"Capabilities": map[string]interface{}{
			"KubeVersion": map[string]interface{}{
				"Version": stng.KubeVersion.Version,
				// "Major":   stng.KubeVersion.Major,
				// "Minor":   stng.KubeVersion.Minor,
			},
			"HelmVersion": map[string]interface{}{
				"Version":      stng.HelmVersion.Version,
				"GitCommit":    stng.HelmVersion.GitCommit,
				"GitTreeState": stng.HelmVersion.GitTreeState,
				"GoVersion":    stng.HelmVersion.GoVersion,
			},
			// "Template": map[string]interface{}{
			// 	"Name":     "",
			// 	"BasePath": "",
			// },
		},
	}
}

func Render(
	metadata *chart.Metadata,
	templates []*chart.File,
	valuesInput InputValues,
	stng *settings.Settings,
) map[string]interface{} {
	chrt := &chart.Chart{
		Raw:       nil,
		Metadata:  metadata,
		Lock:      nil,
		Templates: templates,
		Values:    map[string]interface{}{
			// "image": "",
			// "labels": map[string]interface{}{},
		},
		Schema: []byte{},
		Files:  nil,
	}

	values := createChartValues(metadata, valuesInput, stng)

	renderedResult, err := engine.Render(chrt, values)
	if err != nil {
		return errors.ReturnObjectErrorRender(err)
	}

	result := ""
	for _, v := range renderedResult {
		result += v
	}

	return map[string]interface{}{
		"result": result,
	}
}
