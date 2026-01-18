# Figma to HTML

Convert Figma designs to production-ready JSX code with Tailwind CSS. AI-powered code generation directly from Figma URLs.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

## Features

- 🎨 **Convert Figma to JSX** - Transform Figma designs into clean, production-ready React/JSX code
- 🎯 **Tailwind CSS Only** - Strict validation ensures only Tailwind utility classes (no inline styles)
- 🤖 **AI-Powered** - Uses advanced AI (OpenAI GPT-4 or Anthropic Claude) for accurate code generation
- 📦 **Component Reuse** - Automatically detects and reuses existing components from your project
- 🔍 **Smart Mapping** - Converts Figma spacing, font sizes, and border radius to nearest Tailwind classes
- 📱 **Responsive Ready** - Generates responsive-friendly code with Tailwind breakpoints
- 🚫 **No Overwrites** - Preview diffs and never accidentally overwrite existing files
- ⚡ **Fast & Accurate** - Optimized algorithms for 80%+ accuracy target

## Quick Start

### 1. Install Extension

Install from VS Code Marketplace or download `.vsix` file and install manually.

### 2. Configure AI API Key

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/)
2. Open VS Code Settings (Cmd/Ctrl + ,)
3. Search for "Figma to HTML"
4. Set `Figma to HTML: AI Api Key` with your API key
5. Choose your AI provider (OpenAI or Anthropic)

### 3. Set Figma Token

Set your Figma API token as an environment variable:

```bash
export FIGMA_TOKEN="your-figma-token-here"
```

Or add it to your VS Code settings:

```json
{
  "figma-to-html.figmaToken": "your-figma-token-here"
}
```

Get your Figma token from [Figma Account Settings](https://www.figma.com/developers/api#access-tokens).

### 4. Generate Code

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Run: `Figma: Generate HTML from URL`
3. Paste your Figma URL (e.g., `https://www.figma.com/file/abc123/Design?node-id=1:2`)
4. Preview the generated code
5. Confirm to save the file

## Usage Examples

### Basic Usage

```
Command: Figma: Generate HTML from URL
Input: https://www.figma.com/file/abc123/my-design
Output: components/my-design.tsx
```

### With Node ID

```
Input: https://www.figma.com/file/abc123/my-design?node-id=1:234
Output: Generates code for specific node
```

### Component Reuse

The extension automatically:
- Scans `src/components` folder
- Detects existing components
- Suggests reuse when component names match Figma nodes

## Configuration

### Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `figma-to-html.aiApiKey` | AI API Key for code generation | (empty) |
| `figma-to-html.aiProvider` | AI Provider (`openai` or `anthropic`) | `openai` |
| `figma-to-html.aiModel` | AI Model to use | `gpt-4` |
| `figma-to-html.licenseKey` | License key for premium features | (empty) |

### Supported AI Models

**OpenAI:**
- `gpt-4` (recommended)
- `gpt-4-turbo`
- `gpt-3.5-turbo`

**Anthropic:**
- `claude-3-opus`
- `claude-3-sonnet`
- `claude-3-haiku`

## How It Works

1. **Parse Figma URL** - Extracts file ID and node ID from Figma URL
2. **Fetch Figma Data** - Retrieves design data from Figma API
3. **Scan Project** - Detects Tailwind usage and existing components
4. **Generate Code** - AI converts Figma layout to JSX with Tailwind classes
5. **Validate Output** - Ensures no inline styles or custom CSS
6. **Preview & Save** - Shows diff preview before writing file

## Generated Code Format

The extension generates clean JSX code like:

```jsx
<div className="flex items-center justify-between bg-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold text-gray-900">Hello World</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click Me
  </button>
</div>
```

## Requirements

- VS Code 1.80.0 or higher
- Node.js 18+ (for development)
- Figma API token
- AI API key (OpenAI or Anthropic)

## Troubleshooting

### "AI API key not configured"
- Set your API key in VS Code settings
- Ensure the setting name is exactly `figma-to-html.aiApiKey`

### "FIGMA_TOKEN environment variable is required"
- Set `FIGMA_TOKEN` environment variable
- Or add `figma-to-html.figmaToken` to VS Code settings

### "Invalid Figma URL format"
- Ensure URL format: `https://www.figma.com/file/{fileId}/...`
- Include `?node-id=...` for specific nodes

### Generated code contains inline styles
- This should not happen - validation should catch it
- Report as a bug with the Figma URL that caused it

## Privacy & Security

- API keys are stored locally in VS Code settings
- Figma data is fetched directly from Figma API
- AI processing is done via your chosen provider (OpenAI/Anthropic)
- No data is sent to extension author's servers

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## License

Proprietary License - See LICENSE.txt for details

## Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/figma-to-html-extension/issues)
- 📖 Documentation: [Full Docs](https://github.com/your-username/figma-to-html-extension/wiki)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

Made with ❤️ for developers who love clean code.
