all: test prebuild build

test:
	@ GOOS=js GOARCH=wasm go test -cover -exec="$(shell go env GOROOT)/misc/wasm/go_js_wasm_exec" ./pkg/...

lint:
	@ GOOS=js GOARCH=wasm golangci-lint run -c ./.golangci.yaml ./pkg/...
lint-fix:
	@ GOOS=js GOARCH=wasm golangci-lint run -c ./.golangci.yaml --fix ./pkg/...

prebuild: public/wasm_exec.js
public/wasm_exec.js:
	@ cat $(shell go env GOROOT)/misc/wasm/wasm_exec.js > public/wasm_exec.js

build:
	@ cd pkg/playground && GOOS=js GOARCH=wasm go build -ldflags='-s -w' -o ../../public/main.wasm
.PHONY: build
