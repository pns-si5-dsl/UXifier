import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ${name} from './${name}';
import {PersoProvider} from "./character";

ReactDOM.render(
    <PersoProvider><${name} /></PersoProvider>,
    document.getElementById('root')
);
