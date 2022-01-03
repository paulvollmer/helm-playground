//go:build js && wasm

package settings

import (
	"errors"
	"syscall/js"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewKubeVersionFromJSValue(t *testing.T) {
	tests := []struct {
		testName    string
		value       js.Value
		expected    *KubeVersion
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
			expected:    &KubeVersion{Version: "1.0.0"},
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
		t.Run(tt.testName, func(t *testing.T) {
			result, resultErr := NewKubeVersionFromJSValue(tt.value)
			assert.Equal(t, tt.expected, result)
			assert.Equal(t, tt.expectedErr, resultErr)
		})
	}
}
