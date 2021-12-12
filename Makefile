all: test prebuild build

test:
	@ GOOS=js GOARCH=wasm go test ./pkg/...

prebuild:
	@ cat $(shell go env GOROOT)/misc/wasm/wasm_exec.js > public/wasm_exec.js

build:
	@ cd pkg/render && GOOS=js GOARCH=wasm go build -ldflags='-s -w' -o ../../public/main.wasm
