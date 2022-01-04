//go:build js && wasm

package errors

import (
	"regexp"
	"strconv"
	"strings"
)

const (
	ErrorKindInput     = "input"
	ErrorKindTemplates = "templates"
	ErrorKindSettings  = "settings"
	ErrorKindRender    = "render"
)

func HasYamlLinePrefix(err error) bool {
	return strings.HasPrefix(err.Error(), "yaml: line ")
}

func YamlErrorGetLine(err error) int {
	line := -1

	if HasYamlLinePrefix(err) {
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

func YamlErrorGetMessage(err error) string {
	msg := err.Error()

	if HasYamlLinePrefix(err) {
		tmp := strings.Split(err.Error(), ":")
		if len(tmp) > 2 { //nolint: gomnd
			msg = strings.Join(tmp[2:], ":")
		}
	}

	return strings.TrimSpace(msg)
}

func ReturnObjectErrorMissingArguments() map[string]interface{} {
	return map[string]interface{}{
		"error": map[string]interface{}{
			"kind":    ErrorKindInput,
			"file":    "",
			"message": "missing function arguments",
		},
	}
}

func ReturnObjectErrorInvalidTemplate(err error) map[string]interface{} {
	return map[string]interface{}{
		"error": map[string]interface{}{
			"kind":    ErrorKindTemplates,
			"file":    "",
			"line":    "",
			"message": "unmarshall input templates data error: " + err.Error(),
		},
	}
}

func ReturnObjectErrorYaml(err error) map[string]interface{} {
	return map[string]interface{}{
		"error": map[string]interface{}{
			"kind":    ErrorKindInput,
			"file":    "values.yaml",
			"line":    YamlErrorGetLine(err),
			"message": YamlErrorGetMessage(err),
		},
	}
}

func ReturnObjectErrorChartYaml(err error) map[string]interface{} {
	return map[string]interface{}{
		"error": map[string]interface{}{
			"kind":    ErrorKindInput,
			"file":    "Chart.yaml",
			"line":    YamlErrorGetLine(err),
			"message": err.Error(),
		},
	}
}

func ReturnObjectErrorSettings(err error) map[string]interface{} {
	return map[string]interface{}{
		"error": map[string]interface{}{
			"kind":    ErrorKindSettings,
			"file":    "",
			"line":    "",
			"message": err.Error(),
		},
	}
}

func ReturnObjectErrorRender(err error) map[string]interface{} {
	file, line, message := parseRenderError(err)

	return map[string]interface{}{
		"error": map[string]interface{}{
			"kind":    ErrorKindRender,
			"file":    file,
			"line":    line,
			"message": message,
		},
	}
}

func parseRenderError(renderErr error) (file string, line int, message string) {
	r := regexp.MustCompile(`parse error at \((.+):(\d+)\): (.+)`)

	res := r.FindAllStringSubmatch(renderErr.Error(), -1)
	if len(res) != 1 {
		return
	}

	if len(res[0]) != 4 { //nolint: gomnd
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
