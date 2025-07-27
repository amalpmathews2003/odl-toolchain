# ODL Toolchain VS Code Extension

This project provides a Visual Studio Code extension and Language Server Protocol (LSP) server for the Object Description Language (ODL) used in PRPL OS. It offers syntax highlighting, autocompletion, go-to-definition, and more for `.odl` files.

## Features

- Syntax highlighting for ODL files
- Intelligent autocompletion based on ODL keywords and context
- Hover documentation for keywords
- Go to Definition for ODL objects and C functions
- Error diagnostics (squiggles and Problems panel)
- Support for both line (`// ...`) and block (`/* ... */`) comments

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [VS Code](https://code.visualstudio.com/)

### Installation

```bash
curl -sL https://amalpmathews2003.github.io/odl-toolchain/install.sh | bash
```

### Development

1. Clone this repository:
   ```sh
   git clone https://github.com/amalpmathews2003/odl-toolchain.git
   cd odl-toolchain
   ```
2. Install dependencies for both client and server:
   ```sh
   npm install
   cd client && npm install && cd ../server && npm install && cd ..
   ```
3. Open the folder in VS Code:
   ```sh
   code .
   ```
4. Press `F5` to launch the extension in a new Extension Development Host window.

## Project Structure

- `client/` — VS Code extension client
- `server/` — Language server implementation
- `assets/` — ODL keywords and documentation
- `syntaxes/` — TextMate grammar for syntax highlighting

## Usage

- Open any `.odl` file in VS Code.
- Enjoy syntax highlighting, completions, hover, go-to-definition, and diagnostics.
- Use `Ctrl+Space` for manual completion suggestions.
- Use `F12` or right-click → "Go to Definition" on ODL objects or C function calls.

## Customization

- Add or edit ODL keywords in `assets/odl-keywords.json`.
- Extend syntax highlighting in `syntaxes/odl.tmLanguage.json`.
- Add new language features in the `server/src/methods/` directory.

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

## License

[MIT](LICENSE)
