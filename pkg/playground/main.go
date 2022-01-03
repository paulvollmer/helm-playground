package main

import (
	"github.com/paulvollmer/helm-playground/pkg/errors"
	"github.com/paulvollmer/helm-playground/pkg/render"
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
	s, err := render.ParseInputSettings(p[3].String())
	if err != nil {
		return err
	}

	return render.Render(chartMetadata, inputTemplate, valuesInput, s)
}
