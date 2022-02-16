import { CompositeGeneratorNode, NL } from 'langium';
import { Application } from '../../language-server/generated/ast';

export function generateApplication(application: Application, node: CompositeGeneratorNode): void {
    node.append("export default function App() {",NL);
    node.indent((appNode) => {
        appNode.append("return (",NL)
        appNode.indent(appNode1 => {
            appNode1.append("<BrowserRouter>",NL)
            appNode1.indent(appNode2 => {
                appNode2.append("<Grommet>",NL)
                appNode2.indent(appNode3 => {
                    appNode3.append("<Routes>",NL)
                    appNode3.indent(appNode4 => {
                        if(application.config) {
                            appNode4.append('<Route path="/', application.config.name,'" element={<', application.config.name,'/>}>',NL)
                            appNode4.indent(configNode => {
                                application.config.pages.forEach(page => {
                                    configNode.append(
                                        '<Route path="',
                                        '/',  application.config.name,'/',page.name,
                                        '" element={<', application.config.name,'><',page.name,'/></', application.config.name,'>}/>',NL)
                                })
                            })
                            appNode4.append('</Route>',NL)
                        }
                        if(application.game) {
                            appNode4.append('<Route path="/', application.game.name,'" element={<', application.game.name,'/>}>',NL)
                            appNode4.indent(gameNode => {
                                application.game.pages.forEach(page => {
                                    gameNode.append(
                                        '<Route path="',
                                        '/',  application.game.name,'/',page.name,
                                        '" element={<', application.game.name,'><',page.name,'/></', application.game.name,'>}/>',NL)
                                })
                            })
                            appNode4.append('</Route>',NL)
                        }
                    })
                    appNode3.append("</Routes>",NL)
                })
                appNode2.append("</Grommet>",NL)
            })
            appNode1.append("</BrowserRouter>",NL)
        })
        appNode.append(")",NL,NL)
    })
    node.append("}",NL,NL)
}