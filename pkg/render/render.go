package main

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"syscall/js"

	"gopkg.in/yaml.v2"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chartutil"
	"helm.sh/helm/v3/pkg/engine"
)

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

const (
	errorKindInput     = "input"
	errorKindTemplates = "templates"
	errorKindSettings  = "settings"
	errorKindRender    = "render"
)

func yamlErrorGetLine(err error) int {
	line := -1
	if strings.HasPrefix(err.Error(), "yaml: line ") {
		split := strings.Split(strings.TrimPrefix(err.Error(), "yaml: line "), ":")
		if len(split) > 0 {
			tmpLineStr := split[0]
			if lineInt, err := strconv.Atoi(tmpLineStr); err == nil {
				line = lineInt
			}
		}
	}
	return line
}

func yamlErrorGetMessage(err error) string {
	msg := err.Error()
	if strings.HasPrefix(err.Error(), "yaml: line ") {
		tmp := strings.Split(err.Error(), ":")
		if len(tmp) > 2 {
			msg = strings.Join(tmp[2:], ":")
		}
	}
	return msg
}

func helmRender(this js.Value, p []js.Value) interface{} {
	if len(p) != 4 {
		return map[string]interface{}{
			"error": map[string]interface{}{
				"kind":    errorKindInput,
				"file":    "",
				"message": "missing function arguments",
			},
		}
	}

	inputTemplateJSON := p[0].String()
	var inputTemplate map[string]string
	if err := json.Unmarshal([]byte(inputTemplateJSON), &inputTemplate); err != nil {
		return map[string]interface{}{
			"error": map[string]interface{}{
				"kind":    errorKindTemplates,
				"file":    "",
				"line":    "",
				"message": "unmarshall input templates data error: " + err.Error(),
			},
		}
	}

	valuesInputJSON := p[1].String()
	valuesInput := make(map[string]interface{}, 0)
	err := yaml.Unmarshal([]byte(valuesInputJSON), &valuesInput)
	if err != nil {
		return map[string]interface{}{
			"error": map[string]interface{}{
				"kind":    errorKindInput,
				"file":    "values.yaml",
				"line":    yamlErrorGetLine(err),
				"message": yamlErrorGetMessage(err),
			},
		}
	}

	inputChartMetadataJSON := p[2].String()
	chartMetadata := chart.Metadata{}
	err = yaml.Unmarshal([]byte(inputChartMetadataJSON), &chartMetadata)
	if err != nil {
		return map[string]interface{}{
			"error": map[string]interface{}{
				"kind":    errorKindInput,
				"file":    "Chart.yaml",
				"line":    yamlErrorGetLine(err),
				"message": err.Error(),
			},
		}
	}

	inputSettingsJSON := p[3].String()
	settings := Settings{}
	err = json.Unmarshal([]byte(inputSettingsJSON), &settings)
	if err != nil {
		return map[string]interface{}{
			"error": map[string]interface{}{
				"kind":    errorKindSettings,
				"file":    "",
				"line":    "",
				"message": err.Error(),
			},
		}
	}

	chartTemplates := make([]*chart.File, 0)
	for k, v := range inputTemplate {
		chartTemplates = append(chartTemplates, &chart.File{Name: k, Data: []byte(v)})
	}

	chrt := &chart.Chart{
		Metadata:  &chartMetadata,
		Templates: chartTemplates,
		Values:    map[string]interface{}{
			//"image": "",
			//"labels": map[string]interface{}{},
		},
		Schema: []byte{},
	}

	values := chartutil.Values{
		"Values": valuesInput,
		"Chart":  chartMetadata,
		"Files": map[string]interface{}{
			"Get":       "",
			"GetBytes":  "",
			"GetGlob":   "",
			"Lines":     "",
			"AsSecrets": "",
			"AsConfig":  "",
		},
		"Release": map[string]interface{}{
			"Name":      settings.Release.Name,
			"Namespace": settings.Release.Namespace,
			"IsUpgrade": settings.Release.IsUpgrade,
			"IsInstall": settings.Release.IsInstall,
			"Revision":  settings.Release.Revision,
			"Service":   settings.Release.Service,
		},
		"Capabilities": map[string]interface{}{
			"KubeVersion": map[string]interface{}{
				"Version": settings.KubeVersion.Version,
				"Major":   settings.KubeVersion.Major,
				"Minor":   settings.KubeVersion.Minor,
			},
			"HelmVersion": map[string]interface{}{
				"Version":      settings.HelmVersion.Version,
				"GitCommit":    settings.HelmVersion.GitCommit,
				"GitTreeState": settings.HelmVersion.GitTreeState,
				"GoVersion":    settings.HelmVersion.GoVersion,
			},
			//"Template": map[string]interface{}{
			//	"Name":     "",
			//	"BasePath": "",
			//},
		},
	}

	d, err := engine.Render(chrt, values)
	if err != nil {
		fmt.Println("Helm render error:", err)

		file, line, message := parseRenderError(err)
		return map[string]interface{}{
			"error": map[string]interface{}{
				"kind":    errorKindRender,
				"file":    file,
				"line":    line,
				"message": message,
			},
		}
	}

	result := ""
	for k, v := range d {
		result += "# " + k + "\n"
		result += v
	}

	return map[string]interface{}{
		"result": result,
	}
}

func parseRenderError(renderErr error) (file string, line int, message string) {
	r := regexp.MustCompile(`parse error at \((.+):(\d+)\): (.+)`)
	res := r.FindAllStringSubmatch(renderErr.Error(), -1)
	if len(res) != 1 {
		return
	}
	if len(res[0]) != 4 {
		return
	}

	file = res[0][1]
	var err error
	line, err = strconv.Atoi(res[0][2])
	if err != nil {
		line = 0
	}
	message = res[0][3]

	return
}

func helmDefaultCapabilities(this js.Value, p []js.Value) interface{} {
	return map[string]interface{}{
		"release": map[string]interface{}{
			"name":      "sample",
			"namespace": "default",
			"isUpgrade": "false",
			"isInstall": "false",
			"revision":  "1",
			"service":   "Helm",
		},
		"kubeVersion": map[string]interface{}{
			"version": chartutil.DefaultCapabilities.KubeVersion.Version,
			"major":   chartutil.DefaultCapabilities.KubeVersion.Major,
			"minor":   chartutil.DefaultCapabilities.KubeVersion.Minor,
		},
		"helmVersion": map[string]interface{}{
			"version":      chartutil.DefaultCapabilities.HelmVersion.Version,
			"gitCommit":    chartutil.DefaultCapabilities.HelmVersion.GitCommit,
			"gitTreeState": chartutil.DefaultCapabilities.HelmVersion.GitTreeState,
			"goVersion":    chartutil.DefaultCapabilities.HelmVersion.GoVersion,
		},
	}
}
