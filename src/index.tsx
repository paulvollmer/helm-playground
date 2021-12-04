import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// load the golang wasm artifact and then render the react application
fetch('main.wasm')
.then(response => response.arrayBuffer())
.then(function (bin) {
    // @ts-ignore
    const go = new Go();
    WebAssembly.instantiate(bin, go.importObject)
    .then((result) => {
        go.run(result.instance);
        // @ts-ignore
        window.helmRender = helmRender
        // @ts-ignore
        window.helmDefaultCapabilities = helmDefaultCapabilities

        ReactDOM.render(
            <React.StrictMode>
                <App defaultCapabilities={window.helmDefaultCapabilities()}/>
            </React.StrictMode>,
            document.getElementById('root')
        );
    })
    .catch(err => {
        console.log("webassembly instantiate error", err)
    });
})
.catch((err) => {
    console.log("fetch wasm error", err)
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
