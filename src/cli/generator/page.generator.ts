// function generatePage(page: PageDecl, node: CompositeGeneratorNode): void {
//     node.append('function ', page.name, '() {', NL);
//     node.indent(body => {
//         body.append('const path = "', page.path, '";', NL);
//         body.append('const is_skipable = ', (page.skipable?true:false).toString(), ';', NL);
//         if (page.axe) {
//             body.append('const axe = ', page.axe.type, ';', NL);
//         }
//         body.append(NL);
//         page.components.forEach(c => {
//             if (isTextComponent(c)) {
//                 generateTextComponent(c, body);
//             } else if (isButtonComponent(c)) {
//                 generateButtonComponent(c, body);
//             } else if (isImageComponent(c)) {
//                 generateImageComponent(c, body);
//             } else if (isFieldsComponent(c)) {
//                 generateFieldComponent(c, body);
//             }
//         })
//     });
//     node.append('}', NL, NL);
// }