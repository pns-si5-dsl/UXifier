import { CompositeGeneratorNode, NL } from 'langium';
import { Application, Context } from '../../language-server/generated/ast';

export function generateApplication(application: Application, node: CompositeGeneratorNode): void {

    const config: Context | undefined = application.configs[0];
    const game: Context | undefined = application.games[0];

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
                        if(config) {
                            appNode4.append('<Route path="/', config.name,'" element={<', config.name,'/>}>',NL)
                            appNode4.indent(configNode => {
                                config.pages.forEach(page => {
                                    configNode.append(
                                        '<Route path="',
                                        '/',  config.name,'/',page.name,
                                        '" element={<', config.name,'><',page.name,'/></', config.name,'>}/>',NL)
                                })
                            })
                            appNode4.append('</Route>',NL)
                        }
                        if(game) {
                            appNode4.append('<Route path="/', game.name,'" element={<', game.name,'/>}>',NL)
                            appNode4.indent(gameNode => {
                                game.pages.forEach(page => {
                                    gameNode.append(
                                        '<Route path="',
                                        '/',  game.name,'/',page.name,
                                        '" element={<', game.name,'><',page.name,'/></', game.name,'>}/>',NL)
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