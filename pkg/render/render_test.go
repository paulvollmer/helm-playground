//go:build js && wasm

package render_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"helm.sh/helm/v3/pkg/chart"

	"github.com/paulvollmer/helm-playground/pkg/errors"
	"github.com/paulvollmer/helm-playground/pkg/render"
	"github.com/paulvollmer/helm-playground/pkg/settings"
)

func TestParseInputTemplates(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName    string
		input       string
		expected    []*chart.File
		expectedErr map[string]interface{}
	}{
		{
			testName: "valid",
			input:    `{"name": "data"}`,
			expected: []*chart.File{
				{Name: "name", Data: []byte("data")},
			},
			expectedErr: nil,
		},
		{
			testName: "invalid",
			input:    "invalid",
			expected: nil,
			expectedErr: map[string]interface{}{
				"error": map[string]interface{}{
					"file":    "",
					"kind":    errors.ErrorKindTemplates,
					"line":    "",
					"message": "unmarshall input templates data error: invalid character 'i' looking for beginning of value",
				},
			},
		},
	}
	for _, tt := range tests {
		tt := tt

		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()

			result, resultErr := render.ParseInputTemplates(tt.input)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}

func TestParseInputValues(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName    string
		input       string
		expected    render.InputValues
		expectedErr map[string]interface{}
	}{
		{
			testName:    "valid",
			input:       `{"key": "value"}`,
			expected:    render.InputValues{"key": "value"},
			expectedErr: nil,
		},
		{
			testName: "invalid",
			input:    "invalid",
			expected: nil,
			expectedErr: map[string]interface{}{
				"error": map[string]interface{}{
					"file":    "values.yaml",
					"kind":    errors.ErrorKindInput,
					"line":    -1,
					"message": "yaml: unmarshal errors:\n  line 1: cannot unmarshal !!str `invalid` into render.InputValues",
				},
			},
		},
	}
	for _, tt := range tests {
		tt := tt

		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()

			result, resultErr := render.ParseInputValues(tt.input)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}

func TestParseInputChartMetadata(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName    string
		input       string
		expected    *chart.Metadata
		expectedErr map[string]interface{}
	}{
		{
			testName: "valid",
			input: `name: Test-Name
home: Test-Home
version: Test-Version
description:  Test-Description
icon:         Test-Icon
apiversion:   "Test-APIVersion"
condition:    "Test-Condition"
tags:         "Test-Tags"
appversion:   "Test-AppVersion"
deprecated:   false
kubeversion:  "Test-KubeVersion"
type:         "Test-Type"
`,
			expected: &chart.Metadata{
				Name:         "Test-Name",
				Home:         "Test-Home",
				Sources:      nil,
				Version:      "Test-Version",
				Description:  "Test-Description",
				Keywords:     nil,
				Maintainers:  nil,
				Icon:         "Test-Icon",
				APIVersion:   "Test-APIVersion",
				Condition:    "Test-Condition",
				Tags:         "Test-Tags",
				AppVersion:   "Test-AppVersion",
				Deprecated:   false,
				Annotations:  nil,
				KubeVersion:  "Test-KubeVersion",
				Dependencies: nil,
				Type:         "Test-Type",
			},
			expectedErr: nil,
		},
		{
			testName: "invalid",
			input:    "invalid",
			expected: nil,
			expectedErr: map[string]interface{}{
				"error": map[string]interface{}{
					"file":    "Chart.yaml",
					"kind":    errors.ErrorKindInput,
					"line":    -1,
					"message": "yaml: unmarshal errors:\n  line 1: cannot unmarshal !!str `invalid` into chart.Metadata",
				},
			},
		},
	}
	for _, tt := range tests {
		tt := tt

		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()
			result, resultErr := render.ParseInputChartMetadata(tt.input)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}

func TestRender(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName  string
		templates []*chart.File
		expected  map[string]interface{}
	}{
		{
			testName: "ok",
			templates: []*chart.File{
				{
					Name: "sample",
					Data: []byte("test: sample"),
				},
			},
			expected: map[string]interface{}{
				"result": "test: sample",
			},
		},
		{
			testName: "error",
			templates: []*chart.File{
				{
					Name: "sample",
					Data: []byte("test: {{"),
				},
			},
			expected: map[string]interface{}{
				"error": map[string]interface{}{
					"file":    "Test-Name/sample",
					"kind":    errors.ErrorKindRender,
					"line":    1,
					"message": "unclosed action",
				},
			},
		},
	}

	metadata := &chart.Metadata{
		Name:         "Test-Name",
		Home:         "Test-Home",
		Sources:      nil,
		Version:      "Test-Version",
		Description:  "Test-Description",
		Keywords:     nil,
		Maintainers:  nil,
		Icon:         "Test-Icon",
		APIVersion:   "Test-APIVersion",
		Condition:    "Test-Condition",
		Tags:         "Test-Tags",
		AppVersion:   "Test-AppVersion",
		Deprecated:   false,
		Annotations:  nil,
		KubeVersion:  "Test-KubeVersion",
		Dependencies: nil,
		Type:         "Test-Type",
	}
	values := render.InputValues{
		"test": "value",
	}
	testSettings := &settings.Settings{
		Release: &settings.Release{
			Name:      "Test-Name",
			Namespace: "Test-Namespace",
			Revision:  "Test-Revision",
			IsUpgrade: "Test-IsUpgrade",
			IsInstall: "Test-IsInstall",
			Service:   "Test-Service",
		},
		KubeVersion: &settings.KubeVersion{
			Version: "Test-Version",
		},
		HelmVersion: &settings.HelmVersion{
			Version:      "Test-Version",
			GitCommit:    "Test-GitCommit",
			GitTreeState: "Test-GitTreeState",
			GoVersion:    "Test-GoVersion",
		},
	}

	for _, tt := range tests {
		tt := tt

		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()

			result := render.Render(metadata, tt.templates, values, testSettings)
			assert.Equal(t, tt.expected, result)
		})
	}
}
