import * as vscode from 'vscode';
import { scanProject } from '../services/projectScanner';
import { fetchFigmaLayout } from '../services/figmaService';
import { generateJSXFromFigma, TailwindTokens, ExistingComponent } from '../services/aiService';
import { writeJSXCode, determineTargetFolder, suggestFileName } from '../services/codeWriter';

/**
 * Main command handler for generating HTML/JSX from Figma URL
 */
export async function generateFromFigma(): Promise<void> {
    try {
        // Check if workspace is open
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found. Please open a workspace first.');
            return;
        }

        // Show input box for Figma URL
        const figmaUrl = await vscode.window.showInputBox({
            prompt: 'Enter Figma file URL or file key',
            placeHolder: 'https://www.figma.com/file/... or file-key',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Figma URL is required';
                }
                return null;
            }
        });

        if (!figmaUrl) {
            // User cancelled
            return;
        }

        // Show progress indicator
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Generating code from Figma',
                cancellable: false
            },
            async (progress) => {
                try {
                    // Step 1: Scan project
                    progress.report({ increment: 10, message: 'Scanning project...' });
                    const projectScan = await scanProject();

                    // Step 2: Fetch Figma layout
                    progress.report({ increment: 30, message: 'Fetching Figma layout...' });
                    const figmaLayout = await fetchFigmaLayout(figmaUrl);

                    // Step 3: Prepare structured data for AI service
                    progress.report({ increment: 10, message: 'Preparing data...' });
                    const tailwindTokens: TailwindTokens = {
                        spacing: projectScan.usesTailwind ? {} : undefined,
                        colors: projectScan.usesTailwind ? {} : undefined,
                        fontSize: projectScan.usesTailwind ? {} : undefined,
                        borderRadius: projectScan.usesTailwind ? {} : undefined
                    };

                    const existingComponents: ExistingComponent[] = projectScan.components.map(comp => ({
                        name: comp.name,
                        path: comp.path
                    }));

                    // Step 4: Generate JSX using AI
                    progress.report({ increment: 30, message: 'Generating JSX code...' });
                    const jsxCode = await generateJSXFromFigma({
                        figmaLayout,
                        tailwindTokens,
                        existingComponents
                    });

                    // Step 5: Determine file name
                    const figmaName = (figmaLayout as any).name || (figmaLayout as any).title || 'component';
                    const fileName = suggestFileName(figmaName);

                    // Step 6: Determine target folder
                    const targetFolder = determineTargetFolder();

                    // Step 7: Write JSX code to file
                    progress.report({ increment: 20, message: 'Writing file...' });
                    const fileUri = await writeJSXCode(jsxCode, {
                        fileName,
                        targetFolder,
                        showDiff: false
                    });

                    if (fileUri) {
                        vscode.window.showInformationMessage(
                            `Successfully generated component: ${targetFolder}/${fileName}`
                        );
                        
                        // Optionally open the file
                        const document = await vscode.workspace.openTextDocument(fileUri);
                        await vscode.window.showTextDocument(document);
                    }
                } catch (error) {
                    handleError(error);
                    throw error;
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

/**
 * Handles errors gracefully and shows appropriate user messages
 */
function handleError(error: unknown): void {
    if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('already exists')) {
            vscode.window.showWarningMessage(
                error.message,
                'Show Diff',
                'Change File Name'
            ).then(action => {
                if (action === 'Show Diff') {
                    // TODO: Re-trigger with showDiff: true
                } else if (action === 'Change File Name') {
                    // TODO: Prompt for new file name
                }
            });
        } else if (error.message.includes('Rejected:')) {
            vscode.window.showErrorMessage(
                `Code generation failed: ${error.message}. Please check your AI service configuration.`
            );
        } else if (error.message.includes('API key')) {
            vscode.window.showErrorMessage(
                `${error.message}. Please configure your AI API key in VS Code settings.`,
                'Open Settings'
            ).then(action => {
                if (action === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'figma-to-html.aiApiKey');
                }
            });
        } else {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    } else {
        vscode.window.showErrorMessage(`An unexpected error occurred: ${String(error)}`);
    }
}
