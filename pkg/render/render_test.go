//go:build js && wasm

package render

import (
	"github.com/paulvollmer/helm-playground/pkg/errors"
	"github.com/paulvollmer/helm-playground/pkg/settings"
	"helm.sh/helm/v3/pkg/chart"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseInputTemplates(t *testing.T) {
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
		t.Run(tt.testName, func(t *testing.T) {
			result, resultErr := ParseInputTemplates(tt.input)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}

func TestParseInputValues(t *testing.T) {
	tests := []struct {
		testName    string
		input       string
		expected    InputValues
		expectedErr map[string]interface{}
	}{
		{
			testName:    "valid",
			input:       `{"key": "value"}`,
			expected:    InputValues{"key": "value"},
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
		t.Run(tt.testName, func(t *testing.T) {
			result, resultErr := ParseInputValues(tt.input)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}

func TestParseInputChartMetadata(t *testing.T) {
	tests := []struct {
		testName    string
		input       string
		expected    *chart.Metadata
		expectedErr map[string]interface{}
	}{
		{
			testName:    "valid",
			input:       "name: test",
			expected:    &chart.Metadata{Name: "test"},
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
		t.Run(tt.testName, func(t *testing.T) {
			result, resultErr := ParseInputChartMetadata(tt.input)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}

func TestRender(t *testing.T) {
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
					"file":    "test/sample",
					"kind":    errors.ErrorKindRender,
					"line":    1,
					"message": "unclosed action",
				},
			},
		},
	}

	metadata := &chart.Metadata{Name: "test"}
	values := InputValues{}
	s := &settings.Settings{
		Release:     &settings.Release{},
		KubeVersion: &settings.KubeVersion{},
		HelmVersion: &settings.HelmVersion{},
	}

	for _, tt := range tests {
		t.Run(tt.testName, func(t *testing.T) {
			result := Render(metadata, tt.templates, values, s)
			assert.Equal(t, tt.expected, result)
		})
	}
}
