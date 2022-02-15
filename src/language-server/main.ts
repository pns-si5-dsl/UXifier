import { startLanguageServer } from 'langium';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { createUxifierServices } from './uxifier-module';

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the language services
const services = createUxifierServices({ connection });

// Start the language server with the language-specific services
startLanguageServer(services);
