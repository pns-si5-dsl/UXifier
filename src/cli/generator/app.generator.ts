import fs from 'fs';
import { processGeneratorNode } from 'langium';
import { CompositeGeneratorNode, NL } from 'langium';
import path from 'path';
import { CharSheet as Application, Context } from '../../language-server/generated/ast';

export function generateApplication(application: Application, fileDir: string): void {

    const node = new CompositeGeneratorNode();
    insertImport(node);

    const config: Context | undefined = application.configs[0];
    const game: Context | undefined = application.games[0];

    if (config) {
        node.append("import {",config.name);
        config.pages.forEach(page => {
            node.append(", ", page.name, " as ", config.name, "_", page.name);
        });
        node.append("} from './", config.name, "'", NL, NL);
    }

    if (game) {
        node.append("import { ",game.name);
        game.pages.forEach(page => {
            node.append(", ", page.name, " as ", game.name, "_", page.name);
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
        "export default function ", application.name, "(props) {", NL,
        "return (", NL,
        "<BrowserRouter>", NL,
        "<Grommet theme={theme} full={true}>", NL,
        "<Routes>", NL
    );

    if (config) {
        node.append(
            "<Route path='*' element={<Navigate to='",config.name,"' />} />", NL,
            "<Route path='", config.name, "' element={<", config.name, "/>}>", NL,
            "<Route index element={<", config.name, '_', config.pages[0].name, "/>}/>", NL
        );

        config.pages.forEach(page => {
            node.append(
                "<Route path='", page.name, "' element={<", config.name, '_', page.name, "/>}/>", NL,
            );
        });
        
        node.append(
            "</Route>", NL,
        );
    }

    if (game) {
        if(!config) node.append("<Route path='*' element={<Navigate to='",game.name,"' />} />", NL,);
        node.append(
            "<Route path='", game.name, "' element={<", game.name, "/>}>", NL,
            "<Route index element={<", game.name, '_', game.pages[0].name, "/>}/>", NL
        );

        game.pages.forEach(page => {
            node.append(
                "<Route path='", page.name, "' element={<", game.name, '_', page.name, "/>}/>", NL,
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

    fs.writeFileSync(`${path.join(fileDir,application.name)}.js`, processGeneratorNode(node));
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import './CharSheet.css';", NL,
        "import {Box, Button, Grommet, Heading} from 'grommet';",NL,
        "import {Notification} from 'grommet-icons';",NL,
        "import {useState} from 'react';", NL,
        "import {Routes, Route, BrowserRouter, Link, Navigate} from 'react-router-dom';",NL,NL
    );
}