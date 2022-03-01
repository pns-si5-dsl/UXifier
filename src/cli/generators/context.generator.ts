import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from "langium";
import path from 'path';
import { Context } from "../../language-server/generated/ast";
import { generateConfigPage } from './config-page.generator';
import { generateGamePage } from './game-page.generator';

export function generateGameContext(context: Context, fileDir: string): void {

    const node = new CompositeGeneratorNode();
    insertImport(node);

    node.append(
        "export function ", context.name, "(props) {", NL,
        "const navigate = useNavigate();",NL,
        "return (", NL,
    );

    if(context.navigation == 'bottom_menu'){
        //todo if bottom menu
       
        node.append(
            "<Box fill={true}>", NL,
            "<Box", NL,
            "pad='medium'", NL,
            "fill", NL,
            "overflow='auto'", NL,
            "background='light-1'>", NL,
            "<Outlet/>", NL,
            "<Box height='xsmall'/>", NL,
            "</Box>", NL,
            "<Nav", NL,
            "direction='row'", NL,
            "background='brand'", NL,
            "pad='medium'", NL,
            ">", NL
        );
    
        context.pages.forEach(page => {
            node.append("<Button primary label={'", page.name, "'} onClick={()=>{ navigate('/", context.name, "/", page.name, "'); }} />", NL);
        });

        node.append(
            "</Nav>", NL,
            "</Box>", NL
        );
    } else if (context.navigation == 'side_menu'){
        node.append(
            "<Box fill={true} direction='row'>", NL,
            "<Sidebar background='brand' >", NL,
            "<Nav pad={'small'}>", NL,
        );
    
        context.pages.forEach(page => {
            node.append("<Button primary label={'", page.name, "'} onClick={()=>{ navigate('/", context.name, "/", page.name, "'); }} />", NL);
        });

        node.append(
            "</Nav>", NL,
            "</Sidebar>", NL,
            "<Box", NL,
            "pad='medium'", NL,
            "fill", NL,
            "background='light-1'", NL,
            "overflow='auto'", NL,
            ">", NL,
            "<Outlet/>", NL,
            "</Box>", NL,
            "</Box>", NL,
        );
    } else {
        //todo if linear menu
        node.append(
            "<Box fill>", NL,
            "<Tabs fill flex>", NL,
        );

        context.pages.forEach(page => {
            node.append("<Tab title='", page.name, "'>", "<", page.name, "/>", "</Tab>", NL);
        });

        node.append(
            "</Tabs>", NL,
            "</Box>", NL,
        );
    }

    node.append(
        ")}", NL
    );

    for (let i = 0; i < context.pages.length; i++) {
        generateGamePage(context.pages[i], context.pages[i+1], context.name, node);
    }

    fs.writeFileSync(`${path.join(fileDir,context.name)}.js`, processGeneratorNode(node));
}

export function generateConfigContext(context: Context, fileDir: string, nextPath: string | undefined = undefined): void {

    const node = new CompositeGeneratorNode();
    insertImport(node);

    //so it applies to whatever context it is
    node.append(
        "export function ", context.name, "(props) {", NL,
        "const navigate = useNavigate();",NL,
        "return (", NL,
    );

    if(context.navigation == 'bottom_menu'){
        //todo if bottom menu
        node.append(
            "<Box fill={true}>", NL,
            "<Box", NL,
            "pad='medium'", NL,
            "fill", NL,
            "overflow='auto'", NL,
            "background='light-1'>", NL,
            "<Outlet/>", NL,
            "<Box height='xsmall'/>", NL,
            "</Box>", NL,
            "<Nav", NL,
            "direction='row'", NL,
            "background='brand'", NL,
            "pad='medium'", NL,
            ">", NL
        );
    
        context.pages.forEach(page => {
            node.append("<Button primary label={'", page.name, "'} onClick={()=>{ navigate('/", context.name, "/", page.name, "'); }} />", NL);
        });
        
        node.append(
            "</Nav>", NL,
            "</Box>", NL
        );
    } else if (context.navigation == 'side_menu'){
        node.append(
            "<Box fill={true} direction='row'>", NL,
            "<Sidebar background='brand' >", NL,
            "<Nav pad={'small'}>", NL,
        );
    
        context.pages.forEach(page => {
            node.append("<Button primary label={<Box><Text truncate='tip'>", page.name, "</Text></Box>} onClick={()=>{ navigate('/", context.name, "/", page.name, "'); }} />", NL);
        });

        node.append(
            "</Nav>", NL,
            "</Sidebar>", NL,
            "<Box", NL,
            "pad='medium'", NL,
            "fill", NL,
            "background='light-1'", NL,
            "overflow='auto'", NL,
            ">", NL,
            "<Outlet/>", NL,
            "</Box>", NL,
            "</Box>", NL,
        );
    } else {
        //todo if linear menu
        node.append(
            "<Box fill>", NL,
            "<Outlet/>", NL,
            "</Box>", NL,
        );
    }
    

    node.append(
        ")}", NL
    );

    for (let i = 0; i < context.pages.length; i++) {
        generateConfigPage(context.pages[i], context.pages[i+1], context.name, node, nextPath);
    }

    fs.writeFileSync(`${path.join(fileDir,context.name)}.js`, processGeneratorNode(node));
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import React, {useContext} from 'react';", NL,
        "import {", NL,
            "Box, Card, Grid, ResponsiveContext, Text, List, Button,", NL,
            "Nav, Stack, Form, FormField, Image, Layer, Select,", NL,
            "Heading, Sidebar, Tabs, Tab, Meter, CardHeader, CardBody, CardFooter, TextInput, CheckBox,", NL,
        "} from 'grommet';", NL,
        "import {Link, Outlet, useNavigate} from \"react-router-dom\";", NL,
        "import {PersoContext} from \"./character\";", NL,
        "import * as Icons from \"grommet-icons\";", NL,
        "import {NumberInput} from 'grommet-controls';", NL, NL
    );
}