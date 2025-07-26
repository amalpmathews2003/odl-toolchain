import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  TextDocumentPositionParams,
  CompletionItem,
  CompletionItemKind,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import { provideCompletionItems, resolveCompletionItem } from "./methods/completion";
import { provideHover } from "./methods/hover";
import { provideDefinition } from "./methods/definition";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        // triggerCharacters: ["%"],
      },
      hoverProvider: true,
      definitionProvider:true,
    },
  };

  return result;
});

documents.onDidChangeContent((change) => {
  // connection.window.showInformationMessage(
  //   "onDidChangeContent: " + change.document.uri
  // );
});



connection.onCompletion(
  (params) => provideCompletionItems(params, documents)
);
// This handler provides the initial list of completion items.
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
  (item: CompletionItem) => resolveCompletionItem(item)
);

connection.onHover(
  (params) => provideHover(params, documents)
);

connection.onDefinition(
  (params) => provideDefinition(params, documents)
);


// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();