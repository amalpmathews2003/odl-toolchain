import { CompletionItem, CompletionItemKind, CompletionList, TextDocumentPositionParams, TextDocuments } from "vscode-languageserver/node";
import * as fs from "fs";
import * as path from "path";
import { TextDocument } from "vscode-languageserver-textdocument";

// Load ODL keywords from JSON
export const odlKeywords: { label: string; documentation: string, kind: number, detail: string }[] = (() => {
    try {
        const jsonPath = path.resolve(__dirname, "../../../assets/odl-keywords.json");
        return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    } catch (e) {
        console.error("Failed to load ODL keywords:", e);
        return [
            { label: "object", documentation: "Defines an ODL object" },
            { label: "property", documentation: "Defines an ODL property" },
            { label: "method", documentation: "Defines an ODL method" }
        ];
    }
})();

export function provideCompletionItems(
    params: TextDocumentPositionParams,
    documents: TextDocuments<TextDocument>
): CompletionList {

    const document = documents.get(params.textDocument.uri);
    if (!document) {
        console.error("Document not found for completion:", params.textDocument.uri);
        return {
            isIncomplete: false,
            items: []
        };
    }

    const position = params.position;
    const lineText = document.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line, character: position.character }
    });

    // Get the word fragment before the cursor (including %)
    const match = lineText.match(/([%\w]+)$/);
    const prefix = match ? match[1] : "";

    // Case-insensitive filter
    const filtered = odlKeywords.filter(kw =>
        kw.label.toLowerCase().startsWith(prefix.toLowerCase())
    );

    let completions: CompletionItem[] = [];

    completions = (prefix.length > 0 ? filtered : odlKeywords).map((kw, idx) => {
        const originalIdx = odlKeywords.findIndex(orig => orig.label === kw.label);
        return {
            label: kw.label,
            kind: kw.kind as CompletionItemKind,
            data: originalIdx,
            documentation: kw.documentation,
            detail: kw.detail,
            filterText: kw.label + "-special",
            textEdit: {
                range: {
                    start: { line: position.line, character: lineText.length - prefix.length },
                    end: { line: position.line, character: lineText.length }
                },
                newText: kw.label
            }
        };
    });

    console.log("Returning CompletionList:", JSON.stringify({ isIncomplete: false, items: completions }, null, 2));
    return {
        isIncomplete: false,
        items: completions
    };
}

export function resolveCompletionItem(item: CompletionItem): CompletionItem {
    const kw = odlKeywords[item.data];
    if (kw) {
        item.detail = kw.detail;
        item.documentation = kw.documentation;
    }
    return item;
}