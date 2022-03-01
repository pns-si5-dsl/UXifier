import { CompositeGeneratorNode, NL } from "langium";
import { FieldGroupComponent, DecoField, isIntField_, isStatField_, isTextField_, isCheckField_, isSkillField_, isGaugeDecoField, GaugeDecoField, IntField_, StatField_ } from "../../language-server/generated/ast";

export function generateFieldGroup(fieldGroup: FieldGroupComponent, node: CompositeGeneratorNode): void {
    const boxColor      = fieldGroup.styles[0]?.boxColors[0]      ? "background='" + fieldGroup.styles[0]?.boxColors[0].value.value + "' "  : "background='light-2' ";
    const textColor     = fieldGroup.styles[0]?.textColors[0]     ? "color='" + fieldGroup.styles[0]?.textColors[0].value.value + "' "      : "";
    const width         = fieldGroup.styles[0]?.widths[0]         ? "width='" + fieldGroup.styles[0]?.widths[0].value + "' "          : "";
    const round         = fieldGroup.styles[0]?.shapes[0]?.value == 'circular'       ? "round='50%' "                           : "";
    const direction     = fieldGroup.styles[0]?.directions[0]?.value == 'horizontal' ? "direction='row' wrap "                  : "";
    const align         = fieldGroup.styles[0]?.aligns[0]?.value == 'right'          ? "align='end' " 
                        : fieldGroup.styles[0]?.aligns[0]?.value == 'center'         ? "align='center' justify='center' "       : "";

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
        "<CardBody margin='small' pad='small' ",boxColor,textColor,width,round,direction,align,">", NL
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
    const boxColor      = decoField.decoField.styles[0]?.boxColors[0]      ? "background='" + decoField.decoField.styles[0]?.boxColors[0].value.value + "' "  : "background='light-2' ";
    const textColor     = decoField.decoField.styles[0]?.textColors[0]     ? "color='" + decoField.decoField.styles[0]?.textColors[0].value.value + "' "      : "";
    const borderColor   = decoField.decoField.styles[0]?.borderColors[0]   ? "background='" + decoField.decoField.styles[0]?.borderColors[0].value.value + "' "  : "background='light-3' ";
    const borderSizes   = decoField.decoField.styles[0]?.borderSizes[0]    ? "pad='" + decoField.decoField.styles[0]?.borderSizes[0].value + "' "  : "pad={'small'}";
    const width         = decoField.decoField.styles[0]?.widths[0]         ? "width='" + decoField.decoField.styles[0]?.widths[0].value + "' "          : "";
    const height        = decoField.decoField.styles[0]?.heights[0]        ? "height='" + decoField.decoField.styles[0]?.heights[0].value + "' "          : "";
    // const round         = decoField.decoField.styles[0]?.shapes[0]?.value == 'circular'       ? "round='50%' "                           : "";
    const isVertical    = decoField.decoField.styles[0]?.directions[0]?.value == 'vertical';
    const direction     = decoField.decoField.styles[0]?.directions[0]?.value == 'horizontal' ? "direction='row' "                  : "";
    const align         = decoField.decoField.styles[0]?.aligns[0]?.value == 'right'          ? "align='end' " 
                        : decoField.decoField.styles[0]?.aligns[0]?.value == 'center'         ? "align='center' justify='center' "       : "";
    const sizeLvl = " level={"+sizeToLevel(decoField.decoField.styles[0]?.widths[0]?.value)+"} ";

    const fieldName =  String(decoField.decoField.field.ref?.name);
    const field =  decoField.decoField.field.ref;

    if(isGaugeDecoField(decoField.decoField) && (isIntField_(field) || isStatField_(field))){
        generateGauge(decoField.decoField, field, node, decoField.input);
    } else
    if(decoField.input){
        node.append(
            "<FormField htmlFor='",fieldName,"-input' label='",fieldName,"' margin={{horizontal: 'medium'}} ",align,width,height,textColor,">", NL
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
            } else {
                node.append(
                    "<TextInput id='",fieldName,"-input' placeholder='", fieldName, "'",NL,
                    "value={state.",fieldName,"}", NL,
                    "onChange={e => {", NL,
                    "dispatch({type: 'up', value: {",fieldName,": e.target.value}})", NL,
                    "}}", NL,
                    "/>", NL
                )
            }
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
                "label={'",fieldName," (' + state.",skillStatVar," + '+' + state.",skillVariationVar," + '%)'}", NL,
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
                    "<Box margin='small'>",NL,
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
                    "/></Box>}",NL,
            )
        } 
        else if (isStatField_(field)){
            const ntextColor     = decoField.decoField.styles[0]?.textColors[0] ? "" + decoField.decoField.styles[0]?.textColors[0].value.value      : "";
            node.append(
                "<Card margin={'small'} ",borderColor,borderSizes, width,height,direction,">",NL,
                    "<CardHeader ",borderColor,">",NL,
                    fieldName,NL,
                    "</CardHeader>",NL,
                    "<CardBody round={'xsmall'} pad={{horizontal:'small'}} ", align, boxColor,NL,">",NL,
                    "    <Heading margin='none' color={state.",fieldName,"_incr>100 ? 'neutral-1' : '",ntextColor,"'}>",NL,
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
                "<Heading", NL,
                    "margin='medium'",NL,
                    "id='",fieldName,"-output'", NL,
                    sizeLvl,NL,
                    "align-self='center'", NL,
                    "> ",fieldName,": {state.",fieldName,"}" , NL,
                "</Heading>", NL
            )
        }
        //TODO
        else if(isTextField_(field)){
            node.append(
                "<Heading", NL,
                    "margin='medium'",NL,
                    "id='",fieldName,"-output'", NL,
                    sizeLvl,NL,
                    "> ",fieldName,": ",isVertical? "<br/>":"",
                    "{state.",fieldName,"}" , NL,
                "</Heading>", NL
            )
        }
        else {
            node.append(
                "<Card margin={'small'} ",borderColor,borderSizes, width,height,">",NL,
                    "<CardHeader ",borderColor,">",NL,
                    fieldName,NL,
                    "</CardHeader>",NL,
                    "<CardBody round={'xsmall'} ", align, borderColor,NL,">",NL,
                    "    <Heading margin='none'>",NL,
                    "        {state.",fieldName,"}",NL,
                    "    </Heading>",NL,
                    "</CardBody>",NL,
                "</Card>",NL,
            )
        }
    }
}

function generateGauge(decoField: GaugeDecoField, field: IntField_|StatField_, node: CompositeGeneratorNode, hasChangeButton: boolean){
    const fieldName =  String(decoField.field.ref?.name);

    const valueVar = "state."+fieldName;
    const valueMax = String(field.maxs[0] ? field.maxs[0].value : 100);
    const valueMin = String(field.mins[0] ? field.mins[0].value : 0);

    const isVertical = decoField.styles[0]?.directions[0]?.value == 'vertical';

    const colorHigh = decoField.lowColors[0] ?   "'"+decoField.highColors[0].value.value+"'"  : "("+valueVar+"-"+valueMin+") * 100 / "+valueMax+" < 60   ? 'status-warning' : 'status-ok'";
    const colorLow = decoField.highColors[0] ?   "'"+decoField.lowColors[0].value.value+"'"   : "'status-critical'";
    const width = decoField.styles[0]?.widths[0] ? "'"+decoField.styles[0]?.widths[0].value+"' " : "{{max:'100%'}} " ;
    const height = decoField.styles[0]?.heights[0] ? "'"+decoField.styles[0]?.heights[0].value+"' " : "{{max:'100%'}} " ;
    const background = decoField.styles[0]?.borderColors[0] ? "'"+decoField.styles[0]?.borderColors[0].value.value+"'" : "'light-2' ";
    const thickness = decoField.styles[0]?.borderSizes[0] ? "'"+decoField.styles[0]?.borderSizes[0].value+"'" : "{'large'} ";
    const buttonColor = decoField.styles[0]?.boxColors[0] ? " background='"+decoField.styles[0]?.boxColors[0].value.value+"' " : "";
    const buttonTxtColor = decoField.styles[0]?.textColors[0] ? " color='"+decoField.styles[0]?.textColors[0].value.value+"' " : "";

    
    if(decoField.styles[0]?.shapes[0]?.value=="circular") {
        node.append(
            "<Box direction={'row'} gap={'medium'}>",NL,
                "<Box fill={{vertical:true, horizontal:true}}>",NL,
                    "<Meter",NL,
                        "width=",width,NL,
                        "height=",height,NL,
                        "type='circle'",NL,
                        "background=",background,NL,
                        "thickness=",thickness,NL,
                        "values={[{",NL,
                            "value: (",valueVar,"-",valueMin,") * 100 / ",valueMax,",",NL,
                            "color: (",valueVar,"-",valueMin,") * 100 / ",valueMax," < 30   ? ",colorLow,NL, 
                                    ": ",colorHigh,NL,
                        "}]}",NL,
                    "/>",NL,
                "</Box>",NL,
        );
        if(hasChangeButton) {
            node.append(
                    "<Box align={'end'} justify={'center'}>",NL,
                        "<Button primary",NL,
                            buttonColor, buttonTxtColor, NL,
                            "margin={{vertical: 'small'}} icon={<Icons.Add/>} onClick={() => {",NL,
                            "dispatch({type: 'up', value: {",fieldName,": ",valueVar," < ",valueMax," ? ",valueVar," + 1 : ",valueVar," }})",NL,
                            "}}/>",NL,
                        "<Button primary",NL,
                            buttonColor, buttonTxtColor, NL,
                            " margin={{vertical: 'small'}} icon={<Icons.Subtract/>} onClick={() => {",NL,
                            "dispatch({type: 'up', value: {",fieldName,": ",valueVar," > ",valueMin," ? ",valueVar," - 1 : ",valueVar," }})",NL,
                            "}}/>",NL,
                    "</Box>",NL,
            ); 
        }
        node.append(
            "</Box>",NL
        )
    } else {
        // linear gauge
        if(isVertical){
            node.append(
                "<Box align={'center'}>",NL,
                    "<Meter",NL,
                        "direction={'vertical'}",NL,
                        "background=",background,NL,
                        "values={[{",NL,
                        "value: (",valueVar,"-",valueMin,") * 100 / ",valueMax,",",NL,
                        "color: (",valueVar,"-",valueMin,") * 100 / ",valueMax," < 30   ? ",colorLow,NL, 
                                ": ",colorHigh,NL,
                        "}]}",NL,
                        "/>",NL,
            ); 
            if(hasChangeButton){
                node.append(
                        "<Button primary margin={{vertical: 'small'}}",NL,
                        buttonColor, buttonTxtColor, NL,
                            "icon={<Icons.Add/>} onClick={() => {",NL,
                                "dispatch({type: 'up', value: {",fieldName,": ",valueVar," < ",valueMax," ? ",valueVar," + 1 : ",valueVar," }})",NL,
                            "}}/>",NL,
                        "<Button primary ",NL,
                            buttonColor, buttonTxtColor, NL,
                            " icon={<Icons.Subtract/>} onClick={() => {",NL,
                                "dispatch({type: 'up', value: {",fieldName,": ",valueVar," > ",valueMin," ? ",valueVar," - 1 : ",valueVar," }})",NL,
                            "}}/>",NL,
                );
            }
            node.append(
                "</Box>",NL,
            )
        } else {
            // horizontal gauge
            node.append(
                "<Box direction={'row'} align={'center'}>",NL,
                    "<Meter",NL,
                    "background=",background,NL,
                        "values={[{",NL,
                            "value: (",valueVar,"-",valueMin,") * 100 / ",valueMax,",",NL,
                            "color: (",valueVar,"-",valueMin,") * 100 / ",valueMax," < 30   ? ",colorLow,NL, 
                                    ": ",colorHigh,NL,
                        "}]}",NL,
                    "/>",NL,
            ); 
            if(hasChangeButton){
                node.append(
                    "<Button primary ",NL,
                        buttonColor, buttonTxtColor, NL,
                        "margin={{horizontal: 'small'}} icon={<Icons.Subtract/>} onClick={() => {",NL,
                        "dispatch({type: 'up', value: {",fieldName,": ",valueVar," > ",valueMin," ? ",valueVar," - 1 : ",valueVar," }})",NL,
                    "}}/>",NL,
                    "<Button primary",NL,
                        buttonColor, buttonTxtColor, NL,
                        "icon={<Icons.Add/>} onClick={() => {",NL,
                            "dispatch({type: 'up', value: {",fieldName,": ",valueVar," < ",valueMax," ? ",valueVar," + 1 : ",valueVar," }})",NL,
                " }}/>",NL,
                );
            }
            node.append(
                "</Box>",NL,
            );
        }
    }
}

function sizeToLevel(size: string): number{
    switch(size){
        case 'xxlarge': return 1;
        case 'xlarge': return 2;
        case 'large': return 3;
        case 'medium': return 4;
        case 'small': return 5;
        case 'xsmall': return 6;
        case 'xxsmall': return 7;
        default: return 4;
    }
}