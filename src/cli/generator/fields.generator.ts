import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from "langium";
import path from 'path';
import { Field, isSkillField_, isStatField_ } from "../../language-server/generated/ast";

export function generateFields(fields: Field[], fileDir: string): void {

    const subDir = path.join(fileDir,'character');
    if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
    }

    const node = new CompositeGeneratorNode();
    insertImport(node);

    const skillsFields = fields.filter((f) => isSkillField_(f));
    const statsFields = fields.filter((f) => isStatField_(f));
    const other = fields.filter((f)=> !(isSkillField_(f) || isStatField_(f)));


    node.append("export const initialState = {", NL);

    other.forEach(field => {
        node.append(field.name,': null,', NL);
    })
    statsFields.forEach(field => {
        node.append(field.name,': 0,', NL);
        node.append(field.name,'_incr: 100,', NL);
    })
    
    node.append('skills: {', NL);
    skillsFields.forEach(field => {
        if(!isSkillField_(field)) return; 
        const statName = field.stats[0].value.ref?.name ? field.stats[0].value.ref?.name : "";
        node.append(
            field.name,': {',
            'selected: false,', NL,
            'activated: false,', NL,
            'stat: "',statName,'",', NL,
            'variation: 100,', NL,
            '},', NL
        );
    })
    node.append('},', NL);

    node.append('inventory: [],', NL);

    node.append(
        "}", NL, NL,
        "export const PersoContext = React.createContext({", NL,
        "state: initialState,", NL,
        "dispatch: () => null", NL,
        "})", NL, NL,
        "export const PersoProvider = ({ children }) => {", NL,
        "const [state, dispatch] = React.useReducer(reducer, initialState)", NL, NL,
        "return (", NL,
        "<PersoContext.Provider value={[ state, dispatch ]}>", NL,
        "{ children }", NL,
        "</PersoContext.Provider>", NL,
        ")", NL,
        "}", NL, NL,
        "export const reducer = (state, action) => {", NL,
        "switch (action.type) {", NL,
        "case 'up':", NL,
        "return {", NL,
        "...state,", NL,
        "...action.value,", NL,
        "};", NL,
        "case 'reset':", NL,
        "let result = {", NL,
        "...state,", NL,
        "};", NL,
        "if (!action.value) {", NL,
        "result = { ...initialState };", NL,
        "} else if (Array.isArray(action.value)){", NL,
        "action.value.forEach((attr) => {", NL,
        "result[attr] = initialState[attr];", NL,
        "})", NL,
        "} else result[action.value] = initialState[action.value];", NL,
        "return result;", NL, NL, 
        "default:", NL,
        "return state", NL,
        "}", NL,
        "}", NL
    );


    fs.writeFileSync(`${path.join(subDir,'index')}.js`, processGeneratorNode(node));
}

function insertImport(node: CompositeGeneratorNode): void {
    node.append(
        "import React from 'react'", NL, NL
    );
}