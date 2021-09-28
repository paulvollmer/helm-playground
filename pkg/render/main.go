package main

import (
	"syscall/js"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("helmRender", js.FuncOf(helmRender))
	js.Global().Set("helmDefaultCapabilities", js.FuncOf(helmDefaultCapabilities))
	<-c
}
