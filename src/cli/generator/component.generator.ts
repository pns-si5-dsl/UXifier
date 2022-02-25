import { CompositeGeneratorNode, NL } from "langium";
import { Component, isButtonComponent, isFieldGroupComponent, isImageComponent, isTextComponent, TextComponent, ImageComponent, isComponentBoxComponent, ComponentBoxComponent, ButtonComponent } from "../../language-server/generated/ast";
import { generateFieldGroup } from "./fieldGroup.generator";

export function generateComponent(component: Component, node: CompositeGeneratorNode): void {
    const titleBoxColor = component.styles[0]?.borderColors[0] ? "background='" + component.styles[0]?.borderColors[0].value.value + "' " : "background='light-3' ";
    const borderBoxColor = component.styles[0]?.borderColors[0] ? "background='" + component.styles[0]?.borderColors[0].value.value + "' " : "background='light-3' ";
    const borderBoxSize = component.styles[0]?.borderSizes[0] ? "pad='" + component.styles[0]?.borderSizes[0].value + "' " : "";
    const titleColor = component.styles[0]?.textColors[0] ? "color='" + component.styles[0]?.textColors[0].value.value + "' " : "";
    const width = component.styles[0]?.widths[0] ? "width='" + component.styles[0]?.widths[0].value + "' " : "";
    const height = component.styles[0]?.heights[0] ? "height='" + component.styles[0]?.heights[0].value + "' " : "";
    const round = component.styles[0]?.shapes[0]?.value == 'circular' ? "round='50%' " : "";

    node.append("<Card margin='small' ",borderBoxSize, borderBoxColor, width, height,round," gridArea='", component.name, "'>", NL);
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