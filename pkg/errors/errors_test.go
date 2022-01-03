//go:build js && wasm

package errors_test

import (
	goerrors "errors"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/paulvollmer/helm-playground/pkg/errors"
)

func TestHasYamlLinePrefix(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName       string
		input          string
		expectedResult bool
	}{
		{
			testName:       "has matching prefix",
			input:          "yaml: line match",
			expectedResult: true,
		},
		{
			testName:       "has not matching prefix",
			input:          "no match",
			expectedResult: false,
		},
	}
	for _, tt := range tests {
		tt := tt

		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()

			result := errors.HasYamlLinePrefix(goerrors.New(tt.input))
			assert.Equal(t, result, tt.expectedResult, fmt.Sprintf("expect %v for string %q", tt.expectedResult, tt.input))
		})
	}
}

func TestYamlErrorGetLine(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName       string
		input          string
		expectedResult int
	}{
		{
			testName:       "1",
			input:          "yaml: line 1: test",
			expectedResult: 1,
		},
	}
	for _, tt := range tests {
		tt := tt

		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()

			result := errors.YamlErrorGetLine(goerrors.New(tt.input))
			assert.Equal(t, tt.expectedResult, result)
		})
	}
}

func TestYamlErrorGetMessage(t *testing.T) {
	t.Parallel()

	tests := []struct {
		testName       string
		input          string
		expectedResult string
	}{
		{
			testName:       "1",
			input:          "yaml: line 1: test",
			expectedResult: "test",
		},
	}
	for _, tt := range tests {
		tt := tt

		t.Run(tt.testName, func(t *testing.T) {
			t.Parallel()

			result := errors.YamlErrorGetMessage(goerrors.New(tt.input))
			assert.Equal(t, tt.expectedResult, result)
		})
	}
}
