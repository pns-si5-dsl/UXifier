import { CompositeGeneratorNode, NL } from "langium";
import { Component, isButtonComponent, isFieldGroupComponent, isImageComponent, isTextComponent, TextComponent, ImageComponent, isComponentBoxComponent, ComponentBoxComponent, ButtonComponent, isItemListComponent, ItemListComponent } from "../../language-server/generated/ast";
import { generateFieldGroup } from "./field-group.generator";

export function generateComponent(component: Component, node: CompositeGeneratorNode): void {
    if(isFieldGroupComponent(component)) component.titlePositions
    let titlePos = '';
    if (isFieldGroupComponent(component) || isImageComponent(component) || isTextComponent(component) || isComponentBoxComponent(component)){
        titlePos = component.titlePositions[0]?.value == 'left' ?  "direction='row' " : '';
    }
    const titleBoxColor = component.styles[0]?.borderColors[0] ? "background='" + component.styles[0]?.borderColors[0].value.value + "' " : "background='light-3' ";
    const borderBoxColor = component.styles[0]?.borderColors[0] ? "background='" + component.styles[0]?.borderColors[0].value.value + "' " : "background='light-3' ";
    const borderBoxSize = component.styles[0]?.borderSizes[0] ? "pad='" + component.styles[0]?.borderSizes[0].value + "' " : "";
    const titleColor = component.styles[0]?.textColors[0] ? "color='" + component.styles[0]?.textColors[0].value.value + "' " : "";
    const width = component.styles[0]?.widths[0] ? "width='" + component.styles[0]?.widths[0].value + "' " : "";
    const height = component.styles[0]?.heights[0] ? "height='" + component.styles[0]?.heights[0].value + "' " : "";
    const round = component.styles[0]?.shapes[0]?.value == 'circular' ? "round='50%' " : "";

    node.append("<Card margin='small' ",borderBoxSize, borderBoxColor, width, height,round,titlePos," gridArea='", component.name, "'>", NL);
    if (component.titles[0]) {
        node.append(
          "<CardHeader pad='small' ",titleBoxColor,titleColor,">", NL,
          component.titles[0].value, NL,
          "</CardHeader>", NL
        );
    }

    if (isFieldGroupComponent(component)) {
        generateFieldGroup(component, node);
    } else if (isButtonComponent(component)) {
        generateButtonComponent(component, node);
    } else if (isTextComponent(component)) {
        generateTextComponent(component, node);
    } else if (isImageComponent(component)) {
        generateImageComponent(component, node);
    } else if (isComponentBoxComponent(component)) {
        generateBoxComponent(component, node);
    } else if (isItemListComponent(component)){
        generateItemListComponent(component, node);
    }

    node.append(
        "</Card>", NL
    );

}

function generateTextComponent(text: TextComponent, node: CompositeGeneratorNode): void {
    const boxColor      = text.styles[0]?.boxColors[0]      ? "background='" + text.styles[0]?.boxColors[0].value.value + "' "    : "background='light-2' ";
    const textColor     = text.styles[0]?.textColors[0]     ? "color='" + text.styles[0]?.textColors[0].value.value + "' "        : "";
    const width         = text.styles[0]?.widths[0]         ? "width='" + text.styles[0]?.widths[0].value + "' "            : "";
    const round         = text.styles[0]?.shapes[0]?.value == 'circular' ?            "round='50%' "                  : "";
    const direction     = text.styles[0]?.directions[0]?.value == 'horizontal' ? "direction='row' wrap "              : "";
    const align         = text.styles[0]?.aligns[0]?.value == 'right'      ? "align='end' "
                        : text.styles[0]?.aligns[0]?.value == 'center'    ? "align='center' justify='center' "        : "";
    node.append(
        "<CardBody margin='large' ",boxColor,textColor, width, round, direction, align,">", NL,
        "<Text>", NL,
        text.contents[0].value, NL,
        "</Text>", NL,
        "</CardBody>", NL
    );
}

function generateImageComponent(image: ImageComponent, node: CompositeGeneratorNode): void {
    node.append(
        "<Image fill src='",image.sources[0].value,"'/>", NL
    );
}

function generateBoxComponent(box: ComponentBoxComponent, node: CompositeGeneratorNode): void {
    const boxColor      = box.styles[0]?.boxColors[0]      ? "background='" + box.styles[0]?.boxColors[0].value.value + "' "  : "";
    const textColor     = box.styles[0]?.textColors[0]     ? "color='" + box.styles[0]?.textColors[0].value.value + "' "      : "";
    const width         = box.styles[0]?.widths[0]         ? "width='" + box.styles[0]?.widths[0].value + "' "          : "";
    const round         = box.styles[0]?.shapes[0]?.value == 'circular'       ? "round='50%' "                    : "";
    const direction     = box.styles[0]?.directions[0]?.value == 'horizontal' ? "direction='row' wrap "           : "";
    const align         = box.styles[0]?.aligns[0]?.value == 'right'          ? "align='end' "
                        : box.styles[0]?.aligns[0]?.value == 'center'         ? "align='center' justify='center' ": "";
    node.append(
        "<CardBody margin='large' ",boxColor,textColor, width, round, direction, align,">", NL,
    );
    box.components.forEach((innerComp) => {
        generateComponent(innerComp, node);
    });
    node.append(
        "</CardBody>", NL
    );
}

function generateButtonComponent(button: ButtonComponent, node: CompositeGeneratorNode): void {
    const boxColor      = button.styles[0]?.boxColors[0]      ? "background='" + button.styles[0]?.boxColors[0].value.value + "' "  : "";
    const textColor     = button.styles[0]?.textColors[0]     ? "color='" + button.styles[0]?.textColors[0].value.value + "' "      : "";
    const width         = button.styles[0]?.widths[0]         ? "width='" + button.styles[0]?.widths[0].value + "' "          : "";
    const round         = button.styles[0]?.shapes[0]?.value == 'circular'       ? "round='50%' "                    : "";
    const label = button.titles[0] ? "label='"+button.titles[0].value+"' " : "" ;
    const type = button.types[0] ? button.types[0].value+" " : "primary ";

    node.append(
        "<CardBody>", NL,
    );
    if(button.hrefs[0]){
        node.append("<Link to='",button.hrefs[0].value,"'>",NL);
    }
    node.append("<Button id='",button.name,"-button' ",type, label,boxColor,textColor,width,round,"/>",NL)
    if(button.hrefs[0]){
        node.append("</Link>",NL);
    }
    node.append(
        "</CardBody>", NL
    );
}

function generateItemListComponent(component: ItemListComponent, node: CompositeGeneratorNode){
    const fielName = 'inventory';
    const boxColor      = component.styles[0]?.boxColors[0]      ? "background='" + component.styles[0]?.boxColors[0].value.value + "' "  : "";
    const textColor     = component.styles[0]?.textColors[0]     ? "color='" + component.styles[0]?.textColors[0].value.value + "' "      : "";
    const align         = component.styles[0]?.aligns[0]?.value == 'right'          ? "align='end' "
                        : component.styles[0]?.aligns[0]?.value == 'center'         ? "align='center' justify='center' ": "";
    node.append(
        "<CardBody fill overflow={{vertical: 'auto'}} ",boxColor,textColor, align,">", NL,
    );
    node.append(
            "<List",NL,
                "primaryKey='name'",NL,
                "secondaryKey='count'",NL,
                "data={state.",fielName,"?.sort()?.reduce((result, item) => {",NL,
                    "const idx = result.items.indexOf(item);",NL,
                    "if(idx !== -1){",NL,
                        "result.result[idx].count+=1;",NL,
                    "} else {",NL,
                        "result.items.push(item);",NL,
                        "result.result.push({ name: item, count: 1 });",NL,
                    "}",NL,
                    "return result;",NL,
                "}, { items: [], result: [] }).result}",NL,
                "action={(item, index) =>",NL,
                    "<Box direction={'row'}>",NL,
                        "<Button",NL,
                            "plain",NL,
                            "icon={<Icons.AddCircle/>}",NL,
                            "onClick={() => {",NL,
                                "dispatch({",NL,
                                    "type: 'up',",NL,
                                    "value: {",NL,
                                        fielName,": state.",fielName,".concat([item.name]),",NL,
                                    "}",NL,
                                "});",NL,
                            "}}/>",NL,
                        "<Button",NL,
                            "plain",NL,
                            "icon={<Icons.SubtractCircle/>}",NL,
                            "onClick={() => {",NL,
                                "const idx = state.",fielName,".findIndex((i) => i === item.name);",NL,
                                "dispatch({",NL,
                                    "type: 'up',",NL,
                                    "value: {",NL,
                                        fielName,": state.",fielName,".slice(0, idx).concat(state.",fielName,".slice(idx+1))",NL,
                                    "}",NL,
                                "})",NL,
                            "}}/>",NL,
                    "</Box>",NL,
                "}",NL,
            "/>",NL,
        "</CardBody>",NL,
        "<CardFooter direction={'row'}",NL,
                    "pad={'small'}>",NL,
            "<TextInput",NL,
                "margin={'small'}",NL,
                "value={currentNewInvItem}",NL,
                "onChange={(event) => setCurrentNewInvItem(event.target.value)}",NL,
                "placeholder={'New item'}",NL,
            "/>",NL,
            "<Button",NL,
                "plain",NL,
                "icon={<Icons.AddCircle/>}",NL,
                "onClick={() => {",NL,
                    "if (!currentNewInvItem) return;",NL,
                    "dispatch({",NL,
                        "type: 'up',",NL,
                        "value: {",NL,
                            fielName,": state.",fielName,".concat([currentNewInvItem]),",NL,
                        "}",NL,
                    "});",NL,
                    "setCurrentNewInvItem('');",NL,
                "}}/>",NL,
        "</CardFooter>",NL
    );
}
