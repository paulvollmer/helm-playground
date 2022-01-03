all: test prebuild build

test:
	@ go test ./pkg/errors
	@ go test ./pkg/render
	@ go test ./pkg/settings

prebuild: public/wasm_exec.js
public/wasm_exec.js:
	@ cat $(shell go env GOROOT)/misc/wasm/wasm_exec.js > public/wasm_exec.js

build:
	@ cd pkg/playground && GOOS=js GOARCH=wasm go build -ldflags='-s -w' -o ../../public/main.wasm
.PHONY: build
