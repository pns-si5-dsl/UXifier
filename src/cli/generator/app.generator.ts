import fs from 'fs';
import { processGeneratorNode } from 'langium';
import { CompositeGeneratorNode, NL } from 'langium';
import path from 'path';
import { Application, Context } from '../../language-server/generated/ast';
import { camelize } from '../generator';

export function generateApplication(application: Application, fileDir: string): void {

    const node = new CompositeGeneratorNode();
    insertImport(node);

    const config: Context | undefined = application.configs[0];
    const game: Context | undefined = application.games[0];

    if (config) {
        node.append("import {",camelize(config.name));
        config.pages.forEach(page => {
            node.append(", ", camelize(page.name), " as ", camelize(config.name), "_", page.name);
        });
        node.append("} from './", config.name, "'", NL, NL);
    }

    if (game) {
        node.append("import { ",camelize(game.name));
        game.pages.forEach(page => {
            node.append(", ", camelize(page.name), " as ", camelize(game.name), "_", page.name);
        });
        node.append("} from './", game.name, "'", NL, NL);
    }

    node.append(
        "const theme = {", NL,
        "global: {", NL,
        "colors: {", NL,
        "brand: '#228BE6',", NL,
        "},", NL,
        "font: {", NL,
        "family: 'Roboto',", NL,
        "size: '18px',", NL,
        "height: '20px',", NL,
        "},", NL,
        "},", NL,
        "};", NL, NL
    );

    node.append(
        "export default function ", camelize(application.name), "(props) {", NL,
        "return (", NL,
        "<BrowserRouter>", NL,
        "<Grommet theme={theme} full={true}>", NL,
        "<Routes>", NL
    );

    if (config) {
        node.append(
            "<Route path='", config.name, "' element={<", camelize(config.name), "/>}>", NL,
            "<Route index element={<", config.name, '_', config.pages[0].name, "/>}/>", NL
        );

        config.pages.forEach(page => {
            node.append(
                "<Route path='", page.name, "' element={<", camelize(config.name), '_', page.name, "/>}/>", NL,
            );
        });
        
        node.append(
            "</Route>", NL,
        );
    }

    if (game) {
        node.append(
            "<Route path='", game.name, "' element={<", camelize(game.name), "/>}>", NL,
            "<Route index element={<", game.name, '_', game.pages[0].name, "/>}/>", NL
        );

        game.pages.forEach(page => {
            node.append(
                "<Route path='", page.name, "' element={<", camelize(game.name), '_', page.name, "/>}/>", NL,
            );
        });
        
        node.append(
            "</Route>", NL,
        );
    }

    node.append(
        "</Routes>", NL,
        "</Grommet>", NL,
        "</BrowserRouter>", NL,
        ");", NL,
        "}", NL,
    );

    fs.writeFileSync(`${path.join(fileDir,camelize(application.name))}.js`, processGeneratorNode(node));
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import './App.css';", NL,
        "import {Box, Button, Grommet, Heading} from 'grommet';",NL,
        "import {Notification} from 'grommet-icons';",NL,
        "import {useState} from 'react';", NL,
        "import {Routes, Route, BrowserRouter, Link} from 'react-router-dom';",NL,NL
    );
}