package errors

import (
	"errors"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHasYamlLinePrefix(t *testing.T) {
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
		t.Run(tt.testName, func(t *testing.T) {
			result := HasYamlLinePrefix(errors.New(tt.input))
			assert.Equal(t, result, tt.expectedResult, fmt.Sprintf("expect %v for string %q", tt.expectedResult, tt.input))
		})
	}
}

func TestYamlErrorGetLine(t *testing.T) {
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
		t.Run(tt.testName, func(t *testing.T) {
			result := YamlErrorGetLine(errors.New(tt.input))
			assert.Equal(t, tt.expectedResult, result)
		})
	}
}

func TestYamlErrorGetMessage(t *testing.T) {
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
		t.Run(tt.testName, func(t *testing.T) {
			result := YamlErrorGetMessage(errors.New(tt.input))
			assert.Equal(t, tt.expectedResult, result)
		})
	}
}
