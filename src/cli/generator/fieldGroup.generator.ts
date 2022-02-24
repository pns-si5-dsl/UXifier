import { CompositeGeneratorNode, NL } from "langium";
import { FieldGroupComponent, DecoField, isIntField_, isStatField_, isTextField_, isCheckField_, isSkillField_ } from "../../language-server/generated/ast";

export function generateFieldGroup(fieldGroup: FieldGroupComponent, node: CompositeGeneratorNode): void {
    const boxColor      = fieldGroup.styles[0]?.boxColors[0]      ? "background='" + fieldGroup.styles[0]?.boxColors[0].value + "' "  : "background='light-2' ";
    const textColor     = fieldGroup.styles[0]?.textColors[0]     ? "color='" + fieldGroup.styles[0]?.textColors[0].value + "' "      : "";
    const width         = fieldGroup.styles[0]?.widths[0]         ? "width='" + fieldGroup.styles[0]?.widths[0].value + "' "          : "";
    const round         = fieldGroup.styles[0]?.shapes[0]?.value.value == 'circular'       ? "round='50%' "                           : "";
    const direction     = fieldGroup.styles[0]?.directions[0]?.value.value == 'horizontal' ? "direction='row' wrap "                  : "";
    const align         = fieldGroup.styles[0]?.aligns[0]?.value.value == 'right'          ? "align='end' " 
                        : fieldGroup.styles[0]?.aligns[0]?.value.value == 'center'         ? "align='center' justify='center' "       : "";

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
    node.append(
        "<CardBody margin='small' ",boxColor,textColor,width,round,direction,align,">", NL
    );

    fieldGroup.decoFields.forEach(decoField => {
        const field = decoField.decoField.field.ref;
        if (field)  generateField(decoField, node);
    });

    node.append(
        "</CardBody>", NL
    );

}

function generateField(decoField: DecoField, node: CompositeGeneratorNode ){
    const fieldName =  String(decoField.decoField.field.ref?.name);
    const field =  decoField.decoField.field.ref;
    if(decoField.input){
        node.append(
            "<FormField htmlFor='",fieldName,"-input' label='",fieldName,"' margin={{horizontal: 'medium'}}>", NL
        );

        if(isIntField_(field) || isStatField_(field)){
            node.append(
                "<NumberInput id='",fieldName,"-input' placeholder='", fieldName, "'",NL,
            );
            if(field.mins[0]){
                node.append(
                    "min={",String(field.mins[0].value),"}", NL,
                );
            }
            if(field.maxs[0]){
                node.append(
                    "max={",String(field.maxs[0].value),"}", NL,
                );
            }
            node.append(
                "value={state.",fieldName,"}", NL,
                "onChange={e => {", NL,
                "dispatch({type: 'up', value: {",fieldName,": e.target.value}})", NL,
                "}}", NL,
                "/>", NL
            )
        }
        if(isTextField_(field)){
            if(field.selections[0]) {
                node.append(
                    "<Select id='",fieldName,"-input' placeholder='", fieldName, "'",NL,
                    "value={state.",fieldName,"}", NL,
                    "options={['",field.selections[0].values.join("','"),"']}",NL,
                    "onChange={e => {", NL,
                    "dispatch({type: 'up', value: {",fieldName,": e.target.value}})", NL,
                    "}}", NL,
                    "/>", NL
                )
            }
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
                "onChange={(e) => dispatch({",NL,
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
            const skillVariationVar = "skills."+fieldName+".variation";
            
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
    } else if(decoField.output){

        if(isSkillField_(field)){
            const skillSelectedVar = "skills."+fieldName+".selected";
            const skillActivatedVar = "skills."+fieldName+".activated";
            const skillStatVar = "skills."+fieldName+".stat";
            const skillVariationVar = "skills."+fieldName+".variation";

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
        } 
        else if (isStatField_(field)){
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
         // TODO
        else if(isCheckField_(field)){
            node.append(
                "<CheckBox", NL,
                    "id='",fieldName,"-output'", NL,
                    "checked={state.",fieldName,"}", NL,
                    "label='", field.descriptions[0] ? field.descriptions[0].value : fieldName ," ' ", NL,
                    "toggle={false}", NL,
                "/>", NL
            )
        }
        //TODO
        else if(isIntField_(field)){
            node.append(
                "<Text", NL,
                    "id='",fieldName,"-output'", NL,
                    "align-self='center'", NL,
                    "> {state.",fieldName,"}" , NL,
                "</Text>", NL
            )
        }
        //TODO
        else if(isTextField_(field)){
            node.append(
                "<Heading", NL,
                    "id='",fieldName,"-output'", NL,
                    "margin='large'", NL,
                    "align-self='center'", NL,
                    "> {state.",fieldName,"}" , NL,
                "</Heading>", NL
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
