// function generateContext(context: Context, node: CompositeGeneratorNode): void {
//     node.append(context.name, '() {', NL);
//     node.indent(body => {
//         body.append('const path = "', context.path, '";', NL);
//         if (context.navigation) {
//             body.append('const navigation = ', context.navigation.type, ';', NL);
//         }
//         body.append(NL);
//         context.pages.forEach(p => generatePage(p, body));
//     });
//     node.append('}', NL, NL);
// }