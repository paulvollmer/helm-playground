//go:build js && wasm

package main

import (
	"github.com/paulvollmer/helm-playground/pkg/errors"
	"github.com/paulvollmer/helm-playground/pkg/render"
	"github.com/paulvollmer/helm-playground/pkg/settings"
	"syscall/js"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("helmRender", js.FuncOf(helmRender))
	<-c
}

func helmRender(this js.Value, p []js.Value) interface{} {
	if len(p) != 4 {
		return errors.ReturnObjectErrorMissingArguments()
	}

	inputTemplate, err := render.ParseInputTemplates(p[0].String())
	if err != nil {
		return err
	}
	valuesInput, err := render.ParseInputValues(p[1].String())
	if err != nil {
		return err
	}
	chartMetadata, err := render.ParseInputChartMetadata(p[2].String())
	if err != nil {
		return err
	}
	s, errSettings := settings.NewSettingsFromJSValue(p[3])
	if errSettings != nil {
		return errors.ReturnObjectErrorSettings(errSettings)
	}

	return render.Render(chartMetadata, inputTemplate, valuesInput, *s)
}
