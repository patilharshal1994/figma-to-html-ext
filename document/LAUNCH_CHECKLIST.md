# VS Code Marketplace Launch Checklist

## Pre-Launch Requirements

### ✅ Code
- [x] All TypeScript files compile without errors
- [x] Extension activates correctly
- [x] All commands work as expected
- [x] Error handling implemented
- [x] No console errors in development mode

### ✅ Configuration Files
- [x] `package.json` - Complete with all required fields
- [x] `tsconfig.json` - TypeScript configuration
- [x] `.vscodeignore` - Exclude unnecessary files from package
- [x] `.gitignore` - Exclude build artifacts

### ✅ Documentation
- [x] `README.md` - Comprehensive user documentation
- [x] `CHANGELOG.md` - Version history
- [x] `LICENSE.txt` - License file
- [x] `MARKETPLACE_SETUP.md` - Publishing guide
- [x] `ARCHITECTURE.md` - Technical architecture

### ⚠️ Required Before Publishing

#### 1. Update Package Information
- [ ] Replace `your-publisher-id` in `package.json` with your actual publisher ID
- [ ] Replace `your-username` in repository URLs
- [ ] Update `support@example.com` with real support email
- [ ] Add actual company name to LICENSE.txt

#### 2. Create Visual Assets
- [ ] Create `icon.png` (128x128 PNG)
  - Simple, recognizable icon
  - Related to Figma/HTML/code generation
- [ ] Create screenshots:
  - `images/screenshot1.png` (1280x720 or 1280x960)
  - `images/screenshot2.png` (optional, recommended)
  - Show extension in action
  - Highlight key features

#### 3. Set Up Publisher Account
- [ ] Create Azure DevOps organization (if not exists)
- [ ] Create VS Code Marketplace publisher:
  ```bash
  vsce create-publisher your-publisher-name
  ```
- [ ] Get Personal Access Token (PAT) from Azure DevOps
- [ ] Store PAT securely (use for `vsce publish`)

#### 4. Testing
- [ ] Test on fresh VS Code install
- [ ] Test all configuration options
- [ ] Test with different Figma URLs
- [ ] Test error scenarios
- [ ] Verify file generation works
- [ ] Test diff preview functionality
- [ ] Verify license service (if using)

#### 5. Build & Package
- [ ] Install dependencies: `npm install`
- [ ] Compile TypeScript: `npm run compile`
- [ ] Test package locally: `npm run package`
- [ ] Verify `.vsix` file size (< 10MB recommended)
- [ ] Install `.vsix` in VS Code to test

#### 6. Marketplace Metadata
- [ ] Write compelling extension description (150-200 words)
- [ ] Choose appropriate categories
- [ ] Add relevant keywords
- [ ] Set pricing (Free or Paid)
- [ ] Configure badges (if applicable)

## Publishing Steps

### Step 1: Install Publishing Tools
```bash
npm install -g @vscode/vsce
```

### Step 2: Login to Publisher
```bash
vsce login your-publisher-name
# Enter your Personal Access Token when prompted
```

### Step 3: Package Extension
```bash
npm run package
# This creates figma-to-html-1.0.0.vsix
```

### Step 4: Publish (First Time)
```bash
vsce publish
# Or publish specific version:
vsce publish 1.0.0
```

### Step 5: Verify Publication
- [ ] Check VS Code Marketplace listing
- [ ] Verify all information displays correctly
- [ ] Test installation from marketplace
- [ ] Verify icon and screenshots appear

## Post-Launch Tasks

### Immediate (First 24 Hours)
- [ ] Monitor for installation issues
- [ ] Check error logs/reports
- [ ] Respond to initial user questions
- [ ] Share on social media/communities

### First Week
- [ ] Gather user feedback
- [ ] Fix any critical bugs
- [ ] Update documentation based on questions
- [ ] Monitor marketplace reviews

### Ongoing
- [ ] Regular updates based on feedback
- [ ] Add new features
- [ ] Maintain compatibility with VS Code updates
- [ ] Respond to issues and feature requests

## Promotion Ideas

### Communities to Share
- [ ] Reddit: r/vscode, r/webdev, r/reactjs
- [ ] Twitter/X: Use hashtags #vscode #extension #figma
- [ ] Dev.to: Write a launch article
- [ ] Product Hunt: Launch on Product Hunt
- [ ] Hacker News: Share in Show HN
- [ ] Discord: Web dev communities

### Content Ideas
- [ ] Blog post about the extension
- [ ] Demo video on YouTube
- [ ] Tutorial on using the extension
- [ ] Case studies from early users

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Marketplace Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce Documentation](https://github.com/microsoft/vscode-vsce)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Notes

- First publication may take a few minutes to appear
- Updates are faster (usually 1-2 minutes)
- Keep version number semantic (major.minor.patch)
- Use `vsce publish minor` or `vsce publish patch` for updates

---

**Ready to Launch?** Make sure all checkboxes are marked before publishing!
