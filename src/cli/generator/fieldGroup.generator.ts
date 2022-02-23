import { CompositeGeneratorNode, NL } from "langium";
import { FieldGroupComponent, DecoField, isIntField_, isStatField_, isTextField_, isCheckField_, isSkillField_ } from "../../language-server/generated/ast";

export function generateFieldGroup(fieldGroup: FieldGroupComponent, node: CompositeGeneratorNode): void {

    // node.append(
    //     "<Card margin='small' background='light-2'>", NL
    // );
    // if(fieldGroup.titles[0]) {
    //     node.append(
    //         "<CardHeader pad='small' background='light-3'>", NL,
    //         fieldGroup.titles[0].value, NL,
    //         "</CardHeader>", NL,
    //     ); 
    // }
    // node.append(
    //     "<CardBody margin='small'>", NL
    // );

    fieldGroup.decoFields.forEach(decoField => {
        const field = decoField.field.ref;
        if (field)  generateField(decoField, node);
    });

    // node.append(
    //     "</CardBody>", NL,
    //     "<CardFooter>", NL,
    //     "</CardFooter>", NL,
    //     "</Card>", NL
    // );

}

function generateField(decoField: DecoField, node: CompositeGeneratorNode ){
    const fieldName =  String(decoField.field.ref?.name);
    const field =  decoField.field.ref;
    if(isInput(decoField)){
        node.append(
            "<FormField htmlFor='",fieldName,"-input' label='",fieldName,"' margin={{horizontal: 'medium'}}>", NL
        );

        if(isIntField_(field) || isStatField_(field)){
            node.append(
                "<NumberInput id='",fieldName,"-input' placeholder='", fieldName, "'",NL,
                "value={state.",fieldName,"}", NL,
                "onChange={e => {", NL,
                "dispatch({type: 'up', value: {",fieldName,": e.target.value}})", NL,
                "}}", NL,
                "/>", NL
            )
        }
        if(isTextField_(field)){
            node.append(
                "<TextInput id='",fieldName,"-input' placeholder='", fieldName, "'",NL,
                "value={state.",fieldName,"}", NL,
                "onChange={e => {", NL,
                "dispatch({type: 'up', value: {",fieldName,": e.target.value}})", NL,
                "}}", NL,
                "/>", NL
            )
        }
        if(isCheckField_(field)){
            node.append(
                "<CheckBox", NL,
                'id="',fieldName,'-input"', NL,
                "checked={state.",fieldName,"}", NL,
                'label="', field.descriptions[0] ? field.descriptions[0].value : fieldName , '"', NL,
                "onChange={(event) => dispatch({",NL,
                    "type: 'up',",NL,
                    "value: {", NL,
                    fieldName,": e.target.checked,",NL,
                    "},",NL,
                "})}", NL,
              "/>", NL
            )
        }
        if(isSkillField_(field)){
            const skillSelectedVar = "skills."+fieldName+".selected";
            const skillStatVar = "skills."+fieldName+".stat";
            const skillVariationVar = "skills."+fieldName+".var";
            
            node.append(
                "<CheckBox", NL,
                "id='skills_",fieldName,"-input'", NL,
                "checked={state.",skillSelectedVar,"}", NL,
                "onChange={(e)=>{", NL,
                    "const skills = JSON.parse(JSON.stringify(state.skills));", NL,
                    skillSelectedVar," = e.target.checked;", NL,
                    "dispatch({", NL,
                        "type: 'up',", NL,
                        "value: {", NL,
                            "skills: skills", NL,
                        "}", NL,
                    "})", NL,
                "}}", NL,
                "label={'lecture (' + state.",skillStatVar," + '+' + state.",skillVariationVar," + '%)'}", NL,
            "/>", NL
            )
        }

        node.append(
            "</FormField>"
            )
    } else if(isOutput(decoField)){

        // TODO other

        if(isSkillField_(field)){
            const skillSelectedVar = "skills."+fieldName+".selected";
            const skillActivatedVar = "skills."+fieldName+".selected";
            const skillStatVar = "skills."+fieldName+".stat";
            const skillVariationVar = "skills."+fieldName+".var";

            node.append(
                "{state.",skillSelectedVar," &&",NL,
                    "<CheckBox",NL,
                        "id='skills-",fieldName,"-output'",NL,
                        "checked={state.",skillActivatedVar,"}",NL,
                        "onChange={(e) => {",NL,
                            "const skills = JSON.parse(JSON.stringify(state.skills));", NL,
                            skillActivatedVar," = e.target.checked;", NL,
                            "const value = {",NL,
                                "skills: skills,",NL,
                            "}",NL,
                            "value[state.",skillStatVar,"+'_incr'] =",NL,
                            "state[state.",skillStatVar,"+'_incr']",NL,
                                "+ state.",skillVariationVar," * (e.target.checked ? 1 : -1);",NL,
                            "dispatch({",NL,
                                "type: 'up',",NL,
                                "value: value,",NL,
                            "})",NL,
                        "}}",NL,
                        "label={'",fieldName," (' + state.",skillStatVar," + '+' + state.",skillVariationVar," + '%)'}",NL,
                    "/>}",NL,
            )
        } else if (isStatField_(field)){
            node.append(
                "<Card background={'accent-1'} margin={'small'} pad={'small'} width={'xsmall'}>",NL,
                    "<CardHeader background={'accent-1'}>",NL,
                    fieldName,NL,
                    "</CardHeader>",NL,
                    "<CardBody background={'light-1'} round={'xsmall'} align={'center'}",NL,
                    "          justify={'center'}>",NL,
                    "    <Heading margin='none' color={state.",fieldName,"_incr>100 ? 'neutral-1' : ''}>",NL,
                    "        {Math.round(state.",fieldName," * state.",fieldName,"_incr/100)}",NL,
                    "    </Heading>",NL,
                    "</CardBody>",NL,
                "</Card>",NL,
            )
        }
        else {
            node.append(
                "<Card>", NL,
            )
            node.append(
                "<CardHeader pad='small' background='light-3'>", NL,
                fieldName, NL,
                "</CardHeader>", NL,
            );  
            node.append(
                "<CardBody>", NL,
                "{state.", fieldName, "}", NL,
                "</CardBody>", NL,
                "</Card>", NL            
            )
        }
    }
}

function isInput(decoField: DecoField): boolean {
    return true;
    throw new Error("Not implemented");
    
}

function isOutput(decoField: DecoField): boolean {
    //TODO
    throw new Error("Not implemented");
    
}