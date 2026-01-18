# Environment Variables Setup

## Quick Answer: Where is the .env file?

**There is no `.env` file created by default.** VS Code extensions use **VS Code settings** instead of `.env` files for security and ease of use.

However, you can use environment variables for local development.

## Recommended: Use VS Code Settings

### Set Figma Token

1. Open VS Code Settings (`Cmd/Ctrl + ,`)
2. Search for "Figma to HTML"
3. Set `Figma to HTML: Figma Token` with your Figma API token
4. Or edit `settings.json`:
   ```json
   {
     "figma-to-html.figmaToken": "your-figma-token-here"
   }
   ```

### Set AI API Key

1. Open VS Code Settings (`Cmd/Ctrl + ,`)
2. Search for "Figma to HTML"
3. Set `Figma to HTML: AI Api Key` with your API key
4. Or edit `settings.json`:
   ```json
   {
     "figma-to-html.aiApiKey": "your-ai-api-key-here"
   }
   ```

## Alternative: Environment Variables

For local development, you can use environment variables:

### Option 1: System Environment Variables

**macOS/Linux:**
```bash
export FIGMA_TOKEN="your-figma-token"
export OPENAI_API_KEY="your-openai-key"
```

**Windows (PowerShell):**
```powershell
$env:FIGMA_TOKEN="your-figma-token"
$env:OPENAI_API_KEY="your-openai-key"
```

**Windows (CMD):**
```cmd
set FIGMA_TOKEN=your-figma-token
set OPENAI_API_KEY=your-openai-key
```

### Option 2: Create .env File (Development Only)

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your actual tokens:
   ```
   FIGMA_TOKEN=your-actual-figma-token
   OPENAI_API_KEY=your-actual-openai-key
   ```

3. **Note**: VS Code extensions don't automatically load `.env` files. You'll need to:
   - Install `dotenv` package: `npm install dotenv`
   - Load it in your extension code (not recommended for production)

## Priority Order

The extension checks in this order:

1. **VS Code Settings** (highest priority)
   - `figma-to-html.figmaToken`
   - `figma-to-html.aiApiKey`

2. **Environment Variables** (fallback)
   - `FIGMA_TOKEN`
   - `OPENAI_API_KEY`

## Getting Your Tokens

### Figma API Token
1. Go to https://www.figma.com/
2. Settings → Account → Personal Access Tokens
3. Create new token
4. Copy the token

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (you can only see it once!)

### Anthropic API Key
1. Go to https://console.anthropic.com/
2. API Keys section
3. Create new key
4. Copy the key

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to git (already in `.gitignore`)
- Never share your API keys publicly
- VS Code settings are stored locally and encrypted
- Environment variables are more secure than hardcoded values

## Troubleshooting

### "FIGMA_TOKEN is required" error

**Solution 1 (Recommended):**
Set it in VS Code settings:
```json
{
  "figma-to-html.figmaToken": "your-token"
}
```

**Solution 2:**
Set environment variable:
```bash
export FIGMA_TOKEN="your-token"
```

### "AI API key not configured" error

**Solution 1 (Recommended):**
Set it in VS Code settings:
```json
{
  "figma-to-html.aiApiKey": "your-key"
}
```

**Solution 2:**
Set environment variable:
```bash
export OPENAI_API_KEY="your-key"
```

### Environment variable not working

- Make sure you're setting it in the same terminal where VS Code is launched
- Restart VS Code after setting environment variables
- Check that the variable name is exactly correct (case-sensitive)
