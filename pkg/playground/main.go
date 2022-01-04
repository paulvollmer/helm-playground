//go:build js && wasm

package main

import (
	"syscall/js"

	"github.com/paulvollmer/helm-playground/pkg/errors"
	"github.com/paulvollmer/helm-playground/pkg/render"
	"github.com/paulvollmer/helm-playground/pkg/settings"
)

func main() {
	c := make(chan struct{})
	js.Global().Set("helmRender", js.FuncOf(helmRender)) //nolint: wsl
	<-c
}

const requiredArguments = 4

func helmRender(this js.Value, args []js.Value) interface{} {
	if len(args) != requiredArguments {
		return errors.ReturnObjectErrorMissingArguments()
	}

	inputTemplate, err := render.ParseInputTemplates(args[0].String())
	if err != nil {
		return err
	}

	valuesInput, err := render.ParseInputValues(args[1].String())
	if err != nil {
		return err
	}

	chartMetadata, err := render.ParseInputChartMetadata(args[2].String())
	if err != nil {
		return err
	}

	stng, errSettings := settings.NewSettingsFromJSValue(args[3])
	if errSettings != nil {
		return errors.ReturnObjectErrorSettings(errSettings)
	}

	return render.Render(chartMetadata, inputTemplate, valuesInput, stng)
}
