import { Hover, MarkupKind, Position, TextDocumentPositionParams, TextDocuments } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { odlKeywords } from "./completion";

export function provideHover(
    params: TextDocumentPositionParams,
    documents: TextDocuments<TextDocument>
): Hover | null {

    const doc = documents.get(params.textDocument.uri);
    if (!doc) {
        console.error("Document not found for hover:", params.textDocument.uri);
        return null;
    }

    const pos = params.position;
    const { text: word, range } = wordUnderCursor(doc, pos);

    const kw = odlKeywords.find(k => k.label === word);
    if (!kw) return null;
    return {
        contents: {
            kind: MarkupKind.Markdown,
            value: `**${kw.label}**\n\n${kw.documentation}`
        }
    };
}

export function wordUnderCursor(
    document: TextDocument,
    position: Position,
) {

    const lines = document.getText().split("\n");
    const line = lines[position.line];

    const start = line.lastIndexOf(" ", position.character) + 1;
    const end = line.indexOf(" ", position.character);

    if (end === -1) {
        return {
            text: line.slice(start),
            range: {
                start: { line: position.line, character: start },
                end: { line: position.line, character: line.length },
            },
        };
    }

    return {
        text: line.slice(start, end),
        range: {
            start: { line: position.line, character: start },
            end: { line: position.line, character: end },
        },
    };
};