# Extension Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd figma-to-html-extension
npm install
```

### 2. Compile TypeScript

```bash
npm run compile
```

This compiles all TypeScript files to JavaScript in the `out/` directory.

### 3. Test in Development

1. Open the extension folder in VS Code
2. Press `F5` or go to Run > Start Debugging
3. A new VS Code window opens with the extension loaded
4. Test the extension commands

### 4. Build for Production

```bash
npm run compile
npm run package
```

This creates a `.vsix` file that can be installed or published.

## Project Structure

```
figma-to-html-extension/
├── src/                    # TypeScript source files
│   ├── extension.ts       # Extension entry point
│   ├── commands/          # Command implementations
│   ├── services/          # Core services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── out/                   # Compiled JavaScript (generated)
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript configuration
├── README.md              # User documentation
├── CHANGELOG.md           # Version history
├── LICENSE.txt            # License file
└── .vscodeignore          # Files to exclude from package
```

## Development Workflow

### Watch Mode

For automatic compilation during development:

```bash
npm run watch
```

This watches for file changes and recompiles automatically.

### Testing Locally

1. Make changes to TypeScript files
2. Run `npm run compile` or use watch mode
3. Press `F5` in VS Code to test changes
4. The extension reloads in the debug window

### Packaging

Create a `.vsix` file for distribution:

```bash
npm run package
```

Install the `.vsix` file:
1. Open VS Code
2. Go to Extensions
3. Click "..." menu
4. Select "Install from VSIX..."
5. Choose the `.vsix` file

## Configuration

### Required Environment Variables

- `FIGMA_TOKEN` - Your Figma API token (or set in VS Code settings)

### VS Code Settings

Users need to configure:

1. `figma-to-html.aiApiKey` - AI API key
2. `figma-to-html.aiProvider` - `openai` or `anthropic`
3. `figma-to-html.aiModel` - Model name (e.g., `gpt-4`)

## Publishing

### First Time Setup

1. Create Azure DevOps organization (if needed)
2. Create publisher:
   ```bash
   vsce create-publisher your-publisher-name
   ```
3. Get Personal Access Token (PAT) from Azure DevOps
4. Login:
   ```bash
   vsce login your-publisher-name
   ```

### Publish

```bash
vsce publish
```

Or publish a specific version:

```bash
vsce publish 1.0.1
```

### Update Existing Extension

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Compile: `npm run compile`
4. Publish: `vsce publish`

## Troubleshooting

### "Cannot find module" errors

- Run `npm install` to install dependencies
- Check `package.json` has all required dependencies

### TypeScript compilation errors

- Check `tsconfig.json` configuration
- Verify all imports are correct
- Ensure all type definitions are available

### Extension doesn't activate

- Check `package.json` activation events
- Verify `main` field points to compiled output
- Check command IDs match exactly

### Publishing fails

- Verify publisher name is correct
- Check PAT (Personal Access Token) is valid
- Ensure version number is incremented
- Check all required fields in `package.json`

## Next Steps

1. ✅ Complete all checklist items in `LAUNCH_CHECKLIST.md`
2. ✅ Create icon.png (128x128)
3. ✅ Create screenshots
4. ✅ Update publisher information
5. ✅ Test thoroughly
6. ✅ Publish to marketplace
