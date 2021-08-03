import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components'
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const GlobalStyles = createGlobalStyle`
.card-header {
  padding: 0.25em 0.5em;
}
.card-body {
  padding: 0.25em 0.5em;
}
.card-text {
  margin: 0;
}
`

ReactDOM.render(
    <>
        <GlobalStyles />
        <App />
    </>,
    document.getElementById('root')
);