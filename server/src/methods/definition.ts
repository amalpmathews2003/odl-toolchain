import { Definition, DefinitionParams, Location, Range, TextDocuments } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { wordUnderCursor } from "./hover";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

export function provideDefinition(params: DefinitionParams, documents: TextDocuments<TextDocument>): Definition | null {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        console.error("Document not found for definition:", params.textDocument.uri);
        return null;
    }

    const pos = params.position;
    const { text, range } = wordUnderCursor(document, pos);

    const word = text.replace(/;/g, ""); // Remove semicolon if present

    const definitionLocation = findDefinitionLocation(word, document);

    if (definitionLocation) {
        return Location.create(
            definitionLocation.uri,
            Range.create(definitionLocation.range.start, definitionLocation.range.end)
        );
    }

    console.log("No definition found for word:", word);
    return null;
}


function findDefinitionLocation(word: string, document: TextDocument): { uri: string; range: Range } | null {

    let dirname = path.dirname(document.uri.replace("file://", ""));
    for (let i = 0; i < 3; i++) {
        console.log("Searching for  definition in directory:", word, dirname);
        const result = findCFunctionWithGrep(`_${word}`, dirname);
        if (result) return result;
        const parent = path.dirname(dirname);
        if (parent === dirname) break; // reached root directory
        dirname = parent;
    }
    return null;
}

const cFuncRegex = /(void|int|char|float|double|bool)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;

function findCFunctionInDirRecursively(
    dir: string,
    functionName: string
): { uri: string; range: Range } | null {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const found = findCFunctionInDirRecursively(functionName, fullPath);
            if (found) return found;
        } else if (entry.isFile() && (entry.name.endsWith(".c") || entry.name.endsWith(".h"))) {
            const content = fs.readFileSync(fullPath, "utf8");
            const lines = content.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const match = lines[i].match(cFuncRegex);
                if (match && match[2] === functionName) {
                    return {
                        uri: "file://" + fullPath,
                        range: Range.create(i, 0, i, lines[i].length)
                    };
                }
            }
        }
    }
    return null;
}

function findCFunctionWithGrep(functionName: string, workspaceDir: string): { uri: string; range: Range } | null {
    try {
        const pattern = `${functionName}`;
        const cmd = `grep -rnE '${pattern}' '${workspaceDir}'`;
        const output = execSync(cmd, { encoding: "utf8" });
        // Output format: path:line:code
        const [firstLine] = output.split("\n");
        if (!firstLine) return null;
        const [file, lineStr] = firstLine.split(":", 2);
        const line = parseInt(lineStr, 10);
        console.log(line, file);
        return {
            uri: "file://" + path.resolve(file),
            range: Range.create(line - 1, 0, line - 1, 1000)
        };
    } catch (e) {
        return null;
    }
}