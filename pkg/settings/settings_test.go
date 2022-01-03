//go:build js && wasm

package settings_test

import (
	"errors"
	"syscall/js"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/paulvollmer/helm-playground/pkg/settings"
)

func TestNewKubeVersionFromJSValue(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName    string
		value       js.Value
		expected    *settings.KubeVersion
		expectedErr error
	}{
		{
			testName:    "is undefined",
			expected:    nil,
			expectedErr: errors.New("value is undefined"),
		},
		{
			testName:    "ok",
			value:       js.ValueOf(map[string]interface{}{"version": "1.0.0"}),
			expected:    &settings.KubeVersion{Version: "1.0.0"},
			expectedErr: nil,
		},
		{
			testName:    "is not type of string",
			value:       js.ValueOf(map[string]interface{}{"version": 1}),
			expected:    nil,
			expectedErr: errors.New("version must be type of string"),
		},
	}
	for _, tt := range tests {
		tt := tt
		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()

			result, resultErr := settings.NewKubeVersionFromJSValue(tt.value)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}
