# VS Code Marketplace Launch Guide

## 1. Package Configuration (`package.json`)

### Required Fields:
```json
{
  "name": "figma-to-html",
  "displayName": "Figma to HTML",
  "description": "Convert Figma designs to production-ready JSX code with Tailwind CSS",
  "version": "1.0.0",
  "publisher": "your-publisher-id",
  "engines": {
    "vscode": "^1.80.0"
  },
  "categories": [
    "Other",
    "Visualization",
    "Productivity"
  ],
  "keywords": [
    "figma",
    "html",
    "jsx",
    "tailwind",
    "css",
    "code-generation",
    "design-to-code"
  ],
  "activationEvents": [
    "onCommand:figma.generateHtml"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "figma.generateHtml",
        "title": "Figma: Generate HTML from URL"
      }
    ],
    "configuration": {
      "figma-to-html.aiApiKey": {
        "type": "string",
        "default": "",
        "description": "AI API Key (OpenAI or Anthropic)"
      },
      "figma-to-html.aiProvider": {
        "type": "string",
        "enum": ["openai", "anthropic"],
        "default": "openai",
        "description": "AI Provider"
      },
      "figma-to-html.licenseKey": {
        "type": "string",
        "default": "",
        "description": "License key for paid features"
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/figma-to-html-extension"
  },
  "bugs": {
    "url": "https://github.com/your-username/figma-to-html-extension/issues"
  },
  "homepage": "https://github.com/your-username/figma-to-html-extension#readme",
  "license": "SEE LICENSE IN LICENSE.txt"
}
```

## 2. Required Files

### LICENSE.txt
- Use MIT, Apache 2.0, or proprietary license
- For paid extensions, use proprietary license

### README.md
Include:
- Extension description
- Features
- Installation instructions
- Configuration
- Usage examples
- Screenshots/demos
- Troubleshooting
- Support links

### CHANGELOG.md
Version history:
```markdown
# Change Log

## [1.0.0] - 2024-01-01
- Initial release
- Convert Figma designs to JSX
- Tailwind CSS support
- AI-powered code generation
```

## 3. Publishing Steps

### Install vsce (VS Code Extension Manager):
```bash
npm install -g @vscode/vsce
```

### Package Extension:
```bash
vsce package
```

### Publish to Marketplace:
```bash
vsce publish
```

### Update Publisher (first time):
1. Create Azure DevOps organization
2. Get Personal Access Token (PAT)
3. Create publisher: `vsce create-publisher your-publisher-name`
4. Login: `vsce login your-publisher-name`

## 4. Marketplace Listing

### Extension Icon
- 128x128 PNG
- Simple, recognizable design
- Add to root: `icon.png`

### Screenshots
- At least 1 screenshot (1280x720 or 1280x960)
- Show extension in action
- Add to root: `images/screenshot1.png`

### Pricing
- Free: Basic features
- Paid: All features ($X.XX one-time or subscription)
- Configure via VS Code Marketplace dashboard

## 5. Paid Extension Architecture

### Feature Gating:
- Free tier: Basic generation (limited)
- Paid tier: Full features + priority support
- License validation via backend API
- Offline license caching

### Revenue Model:
- One-time purchase: $19.99
- Annual subscription: $9.99/year
- Enterprise: Custom pricing

## 6. CI/CD Setup

### GitHub Actions Workflow:
```yaml
name: Publish Extension
on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run compile
      - run: npm install -g @vscode/vsce
      - run: vsce publish -p ${{ secrets.VSCE_PAT }}
```

## 7. Post-Launch Checklist

- [ ] Test extension on fresh VS Code install
- [ ] Verify all features work
- [ ] Check license validation
- [ ] Update documentation
- [ ] Monitor user reviews
- [ ] Respond to issues
- [ ] Plan update schedule
