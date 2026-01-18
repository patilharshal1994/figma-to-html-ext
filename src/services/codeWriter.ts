import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface WriteOptions {
    fileName: string;
    targetFolder?: 'pages' | 'components';
    showDiff?: boolean;
}

/**
 * Writes generated JSX code to the appropriate folder
 * Shows diff preview, asks for confirmation, and never overwrites existing files
 */
export async function writeJSXCode(jsxCode: string, options: WriteOptions): Promise<vscode.Uri | null> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    if (!workspaceFolder) {
        throw new Error('No workspace folder found');
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    const targetFolder = options.targetFolder || 'components';
    
    // Determine target directory
    const targetDir = path.join(workspacePath, targetFolder);
    
    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Construct file path - only allow JSX/TSX files
    let fileName = options.fileName;
    const ext = path.extname(fileName).toLowerCase();
    
    if (ext !== '.tsx' && ext !== '.jsx') {
        fileName = `${fileName}.tsx`;
    }

    const filePath = path.join(targetDir, fileName);
    const fileUri = vscode.Uri.file(filePath);

    // Check if file already exists - never overwrite
    if (fs.existsSync(filePath)) {
        const existingContent = fs.readFileSync(filePath, 'utf-8');
        
        if (options.showDiff !== false) {
            // Show diff preview for existing file
            await showDiffPreview(fileUri, existingContent, jsxCode);
        }
        
        // Never overwrite - throw error
        throw new Error(`File already exists: ${targetFolder}/${fileName}. Cannot overwrite existing files.`);
    }

    // Show diff preview even for new files (empty vs new content)
    if (options.showDiff !== false) {
        await showDiffPreviewForNewFile(fileUri, jsxCode, targetFolder, fileName);
    }

    // Ask user for confirmation before writing
    const confirmed = await askUserConfirmation(filePath);
    if (!confirmed) {
        return null; // User cancelled
    }

    // Write new file only
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(jsxCode, 'utf-8'));

    // Show success message
    vscode.window.showInformationMessage(`Generated component saved to ${targetFolder}/${fileName}`);

    return fileUri;
}

/**
 * Shows a diff preview for an existing file
 */
async function showDiffPreview(
    fileUri: vscode.Uri,
    existingContent: string,
    newContent: string
): Promise<void> {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return;
        }

        // Create temp directory if it doesn't exist
        const tempDir = path.join(workspaceFolder.uri.fsPath, '.figma-temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Create temp file URI for new content
        const tempUri = vscode.Uri.file(
            path.join(tempDir, `temp-${Date.now()}-${path.basename(fileUri.fsPath)}`)
        );

        // Write new content to temp file
        await vscode.workspace.fs.writeFile(tempUri, Buffer.from(newContent, 'utf-8'));

        // Show diff using VS Code's diff editor
        await vscode.commands.executeCommand(
            'vscode.diff',
            fileUri,
            tempUri,
            `${path.basename(fileUri.fsPath)} (Current) ↔ (Generated)`
        );

        // Schedule cleanup
        scheduleTempFileCleanup(tempUri);
    } catch (error) {
        vscode.window.showWarningMessage(
            `Failed to show diff preview: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Shows a diff preview for a new file (empty vs new content)
 */
async function showDiffPreviewForNewFile(
    fileUri: vscode.Uri,
    newContent: string,
    targetFolder: string,
    fileName: string
): Promise<void> {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return;
        }

        // Create temp directory if it doesn't exist
        const tempDir = path.join(workspaceFolder.uri.fsPath, '.figma-temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Create temp file for new content
        const tempUri = vscode.Uri.file(
            path.join(tempDir, `temp-${Date.now()}-${fileName}`)
        );

        // Create empty file for comparison
        const emptyUri = vscode.Uri.file(
            path.join(tempDir, `empty-${Date.now()}-${fileName}`)
        );

        // Write new content to temp file
        await vscode.workspace.fs.writeFile(tempUri, Buffer.from(newContent, 'utf-8'));

        // Write empty content for comparison
        await vscode.workspace.fs.writeFile(emptyUri, Buffer.from('', 'utf-8'));

        // Show diff using VS Code's diff editor
        await vscode.commands.executeCommand(
            'vscode.diff',
            emptyUri,
            tempUri,
            `(New file) ${targetFolder}/${fileName} ↔ (Generated)`
        );

        // Schedule cleanup
        scheduleTempFileCleanup(tempUri);
        scheduleTempFileCleanup(emptyUri);
    } catch (error) {
        vscode.window.showWarningMessage(
            `Failed to show diff preview: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Schedules cleanup of temporary files
 */
function scheduleTempFileCleanup(tempUri: vscode.Uri): void {
    setTimeout(async () => {
        try {
            if (fs.existsSync(tempUri.fsPath)) {
                await vscode.workspace.fs.delete(tempUri, { useTrash: false });
            }
        } catch {
            // Ignore cleanup errors
        }
    }, 30000); // Clean up after 30 seconds
}

/**
 * Asks user for confirmation before writing the file
 */
async function askUserConfirmation(filePath: string): Promise<boolean> {
    const relativePath = path.relative(
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
        filePath
    );

    const action = await vscode.window.showInformationMessage(
        `Create new file: ${relativePath}?`,
        'Yes',
        'No'
    );

    return action === 'Yes';
}

/**
 * Suggests a file name based on component content or Figma node name
 */
export function suggestFileName(nodeName?: string, defaultName: string = 'component'): string {
    if (!nodeName) {
        return defaultName;
    }

    // Clean and format node name
    const cleaned = nodeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim();

    return cleaned || defaultName;
}

/**
 * Checks if a file exists in pages or components folder
 */
export async function fileExists(fileName: string, targetFolder?: 'pages' | 'components'): Promise<boolean> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    if (!workspaceFolder) {
        return false;
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    
    // Check in components first (default)
    if (!targetFolder || targetFolder === 'components') {
        const componentsPath = path.join(workspacePath, 'components', fileName);
        if (fs.existsSync(componentsPath)) {
            return true;
        }
    }

    // Check in pages
    if (!targetFolder || targetFolder === 'pages') {
        const pagesPath = path.join(workspacePath, 'pages', fileName);
        if (fs.existsSync(pagesPath)) {
            return true;
        }
    }

    return false;
}

/**
 * Determines the appropriate target folder based on project structure
 */
export function determineTargetFolder(): 'pages' | 'components' {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    if (!workspaceFolder) {
        return 'components'; // Default to components
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    const pagesPath = path.join(workspacePath, 'pages');
    const componentsPath = path.join(workspacePath, 'components');

    // Prefer components if both exist
    if (fs.existsSync(componentsPath)) {
        return 'components';
    }

    if (fs.existsSync(pagesPath)) {
        return 'pages';
    }

    // Default to components
    return 'components';
}
