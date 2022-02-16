import { CompositeGeneratorNode, NL } from 'langium';
import { Application, Context } from '../../language-server/generated/ast';

export function generateApplication(application: Application, node: CompositeGeneratorNode): void {

    const config: Context | undefined = application.configs[0];
    const game: Context | undefined = application.games[0];

    node.append("export default function App() {",NL);
    node.append("return (", NL);
    node.append("<BrowserRouter>", NL);
    node.append("<Grommet>", NL);
    node.append("<Routes>", NL);
    if(config) {
        node.append('<Route path="/', config.name,'" element={<', config.name,'/>}>', NL);
        config.pages.forEach(page => {
            node.append(
                '<Route path="',
                '/',  config.name,'/',page.name,
                '" element={<', config.name,'><',page.name,'/></', config.name,'>}/>',NL)
        });
        node.append('</Route>', NL);
    }
    if(game) {
        node.append('<Route path="/', game.name,'" element={<', game.name,'/>}>',NL)
        game.pages.forEach(page => {
            node.append(
                '<Route path="',
                '/',  game.name,'/',page.name,
                '" element={<', game.name,'><',page.name,'/></', game.name,'>}/>',NL)
        })
        node.append('</Route>',NL)
    }
    node.append("</Routes>", NL);
    node.append("</Grommet>", NL);
    node.append("</BrowserRouter>", NL);
    node.append(")", NL);
    node.append("}", NL);
}