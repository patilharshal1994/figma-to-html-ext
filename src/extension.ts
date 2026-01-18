import * as vscode from 'vscode';
import { generateFromFigma } from './commands/generateFromFigma';

export function activate(context: vscode.ExtensionContext): void {
    const commandId = 'figma.generateHtml';
    
    const disposable = vscode.commands.registerCommand(
        commandId,
        () => {
            generateFromFigma();
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate(): void {
    // Cleanup if needed
}
