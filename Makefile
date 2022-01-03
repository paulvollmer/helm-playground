all: test prebuild build

test:
	@ go test -cover ./pkg/errors
	@ GOOS=js GOARCH=wasm go test -cover -exec="$(shell go env GOROOT)/misc/wasm/go_js_wasm_exec" ./pkg/render
	@ GOOS=js GOARCH=wasm go test -cover -exec="$(shell go env GOROOT)/misc/wasm/go_js_wasm_exec" ./pkg/settings

lint:
	@ golangci-lint run -c ./.golangci.yaml
lint-fix:
	@ golangci-lint run -c ./.golangci.yaml --fix

prebuild: public/wasm_exec.js
public/wasm_exec.js:
	@ cat $(shell go env GOROOT)/misc/wasm/wasm_exec.js > public/wasm_exec.js

build:
	@ cd pkg/playground && GOOS=js GOARCH=wasm go build -ldflags='-s -w' -o ../../public/main.wasm
.PHONY: build
