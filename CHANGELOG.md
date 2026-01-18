# Change Log

All notable changes to the "Figma to HTML" extension will be documented in this file.

## [1.0.0] - 2024-01-15

### Added
- Initial release
- Convert Figma designs to JSX code
- Tailwind CSS code generation with strict validation
- AI-powered code generation (OpenAI GPT-4 and Anthropic Claude)
- Component reuse detection from `src/components` folder
- Smart Tailwind class mapping (spacing, font sizes, border radius)
- Responsive breakpoint utilities
- Diff preview before file write
- Never overwrite existing files
- Project scanner for Tailwind configuration detection
- Figma API integration
- License service for paid features (architecture ready)

### Features
- Support for OpenAI and Anthropic AI providers
- Automatic component name extraction from Figma nodes
- Nearest-value algorithm for Tailwind class mapping
- Binary search optimization for fast mapping
- Comprehensive output validation (no inline styles, no custom CSS)
- User confirmation dialog before writing files
- Progress indicators during code generation

### Technical
- TypeScript implementation
- Strict type checking
- Pure, deterministic mapping functions
- Optimized nearest-value algorithm with binary search
- Error handling and graceful degradation

## [Unreleased]

### Planned
- Bulk export feature
- Custom Tailwind configuration support
- Component library sync
- VS Code Marketplace payment integration
- Enterprise features

---

Check [GitHub Releases](https://github.com/your-username/figma-to-html-extension/releases) for the full changelog.
