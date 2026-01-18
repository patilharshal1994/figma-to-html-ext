import * as vscode from 'vscode';

export interface FigmaLayoutJSON {
    [key: string]: any;
}

export interface TailwindTokens {
    spacing?: { [key: string]: string };
    colors?: { [key: string]: string };
    fontSize?: { [key: string]: string };
    borderRadius?: { [key: string]: string };
}

export interface ExistingComponent {
    name: string;
    path: string;
}

export interface AIRequestInput {
    figmaLayout: FigmaLayoutJSON;
    tailwindTokens: TailwindTokens;
    existingComponents: ExistingComponent[];
}

/**
 * Generates JSX code from Figma layout using AI
 * @param input - Structured input containing Figma layout, Tailwind tokens, and existing components
 * @returns Promise<string> - JSX string only
 * @throws Error if output contains invalid styles or non-Tailwind CSS
 */
export async function generateJSXFromFigma(input: AIRequestInput): Promise<string> {
    const prompt = buildStrictPrompt(input);
    const jsxCode = await callLLM(prompt);
    const validatedJSX = validateJSXOutput(jsxCode);
    return validatedJSX;
}

/**
 * Builds a strict LLM prompt with rules and constraints
 */
function buildStrictPrompt(input: AIRequestInput): string {
    const existingComponentsList = input.existingComponents
        .map(comp => `- ${comp.name} (${comp.path})`)
        .join('\n');

    const tailwindTokensStr = JSON.stringify(input.tailwindTokens, null, 2);
    const figmaLayoutStr = JSON.stringify(input.figmaLayout, null, 2);

    return `Figma Layout:
${figmaLayoutStr}

Existing Components:
${existingComponentsList || '(none)'}

Tailwind Tokens:
${tailwindTokensStr}

Rules:
- Reuse components if names match
- Use flex/grid based on auto-layout
- Match spacing to nearest Tailwind class
- Target accuracy: 80%`;
}

/**
 * Calls the LLM API to generate code
 */
async function callLLM(prompt: string): Promise<string> {
    const config = vscode.workspace.getConfiguration('figma-to-html');
    const apiKey = config.get<string>('aiApiKey') || process.env.OPENAI_API_KEY;
    const apiProvider = config.get<string>('aiProvider', 'openai');
    const model = config.get<string>('aiModel', 'gpt-4');

    if (!apiKey) {
        throw new Error('AI API key not configured. Please set figma-to-html.aiApiKey in VS Code settings or OPENAI_API_KEY environment variable.');
    }

    try {
        if (apiProvider === 'openai') {
            return await callOpenAI(apiKey, model, prompt);
        } else if (apiProvider === 'anthropic') {
            return await callAnthropic(apiKey, model, prompt);
        } else {
            throw new Error(`Unsupported AI provider: ${apiProvider}`);
        }
    } catch (error) {
        throw new Error(`Failed to call AI service: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Calls OpenAI API
 */
async function callOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are a senior frontend engineer.

Strict rules:
- Use Tailwind CSS only
- No inline styles
- Prefer existing components
- Output JSX only
- No comments or explanations`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 4000
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as { error?: { message?: string } };
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('No response from OpenAI API');
    }

    // Remove markdown code blocks if present
    return cleanMarkdownCodeBlocks(content);
}

/**
 * Calls Anthropic API
 */
async function callAnthropic(apiKey: string, model: string, prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 4000,
            system: `You are a senior frontend engineer.

Strict rules:
- Use Tailwind CSS only
- No inline styles
- Prefer existing components
- Output JSX only
- No comments or explanations`,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as { error?: { message?: string } };
        throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json() as { content?: Array<{ text?: string }> };
    const content = data.content?.[0]?.text;

    if (!content) {
        throw new Error('No response from Anthropic API');
    }

    // Remove markdown code blocks if present
    return cleanMarkdownCodeBlocks(content);
}

/**
 * Removes markdown code blocks from the response
 */
function cleanMarkdownCodeBlocks(content: string): string {
    // Remove ```jsx, ```js, ```tsx, ```ts, ``` blocks
    let cleaned = content.trim();
    
    // Remove opening code block
    cleaned = cleaned.replace(/^```(?:jsx?|tsx?)?\s*\n?/i, '');
    
    // Remove closing code block
    cleaned = cleaned.replace(/\n?```\s*$/i, '');
    
    return cleaned.trim();
}

/**
 * Validates JSX output - rejects if invalid
 * Checks for: JSX only, no inline styles, Tailwind classes only
 */
function validateJSXOutput(jsxCode: string): string {
    const trimmed = jsxCode.trim();

    // Check if output is empty
    if (!trimmed) {
        throw new Error('Rejected: Output is empty. JSX code is required.');
    }

    // Check if output contains JSX (must have at least one JSX element)
    const jsxElementPattern = /<[a-zA-Z][a-zA-Z0-9]*(\s|>|\/)/;
    if (!jsxElementPattern.test(trimmed)) {
        throw new Error('Rejected: Output does not contain valid JSX code. Expected JSX elements.');
    }

    // Check for inline styles (style={{ }})
    const inlineStylePattern = /style\s*=\s*\{[\s\S]*?\}/g;
    if (inlineStylePattern.test(trimmed)) {
        throw new Error('Rejected: Output contains inline styles (style={{ }}). Only Tailwind CSS classes are allowed.');
    }

    // Check for style prop with strings (style="...")
    const styleStringPattern = /style\s*=\s*["'][^"']*["']/g;
    if (styleStringPattern.test(trimmed)) {
        throw new Error('Rejected: Output contains inline style strings (style="..."). Only Tailwind CSS classes are allowed.');
    }

    // Check for <style> tags
    const styleTagPattern = /<style[^>]*>[\s\S]*?<\/style>/gi;
    if (styleTagPattern.test(trimmed)) {
        throw new Error('Rejected: Output contains <style> tags. Only Tailwind CSS classes are allowed.');
    }

    // Check for CSS-in-JS patterns (styled-components, emotion, etc.)
    const styledComponentsPattern = /styled\.[a-zA-Z]+|css\s*`|@emotion|makeStyles|styled\(/g;
    if (styledComponentsPattern.test(trimmed)) {
        throw new Error('Rejected: Output contains CSS-in-JS patterns. Only Tailwind CSS classes are allowed.');
    }

    // Check for className with CSS-like content (catches className="color: red; padding: 10px")
    const cssInClassNamePattern = /className\s*=\s*["'][^"']*[:;]\s*[^"']*["']/g;
    if (cssInClassNamePattern.test(trimmed)) {
        throw new Error('Rejected: Output contains CSS-like syntax in className. Only Tailwind utility classes are allowed.');
    }

    // Check for external CSS imports
    const cssImportPattern = /import\s+['"].*\.css['"]/g;
    if (cssImportPattern.test(trimmed)) {
        throw new Error('Rejected: Output contains CSS imports. Only Tailwind CSS classes are allowed.');
    }

    // Check for CSS modules
    const cssModulePattern = /import\s+.*\s+from\s+['"].*\.module\.css['"]/g;
    if (cssModulePattern.test(trimmed)) {
        throw new Error('Rejected: Output contains CSS modules. Only Tailwind CSS classes are allowed.');
    }

    // Check for require() CSS imports
    const requireCssPattern = /require\s*\(['"].*\.css['"]\)/g;
    if (requireCssPattern.test(trimmed)) {
        throw new Error('Rejected: Output contains require() CSS imports. Only Tailwind CSS classes are allowed.');
    }

    // Basic check: ensure output looks like JSX (has at least one opening tag)
    const hasOpeningTag = /<[a-zA-Z]/.test(trimmed);
    if (!hasOpeningTag) {
        throw new Error('Rejected: Output does not appear to be valid JSX code.');
    }

    return trimmed;
}
