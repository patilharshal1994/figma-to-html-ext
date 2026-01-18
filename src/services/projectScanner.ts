import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface ProjectScanResult {
    usesTailwind: boolean;
    tailwindConfigPath?: string;
    components: Array<{ name: string; path: string }>;
}

export async function scanProject(): Promise<ProjectScanResult> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    if (!workspaceFolder) {
        return {
            usesTailwind: false,
            components: []
        };
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    
    // Locate tailwind.config.js (deterministic check)
    const tailwindConfigPath = await locateTailwindConfig(workspacePath);
    
    // Check for Tailwind CSS usage (prioritize config file, fallback to package.json)
    const usesTailwind = tailwindConfigPath ? true : await checkTailwindUsage(workspacePath);
    
    // Scan components folder
    const components = await scanComponentsFolder(workspacePath);

    return {
        usesTailwind,
        tailwindConfigPath,
        components
    };
}

async function checkTailwindUsage(workspacePath: string): Promise<boolean> {
    const packageJsonPath = path.join(workspacePath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        return false;
    }

    try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);
        
        const dependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies
        };

        return !!(
            dependencies['tailwindcss'] ||
            dependencies['@tailwindcss/typography'] ||
            dependencies['@tailwindcss/forms']
        );
    } catch {
        return false;
    }
}

async function locateTailwindConfig(workspacePath: string): Promise<string | undefined> {
    const possibleConfigNames = [
        'tailwind.config.js',
        'tailwind.config.cjs',
        'tailwind.config.mjs',
        'tailwind.config.ts'
    ];

    for (const configName of possibleConfigNames) {
        const configPath = path.join(workspacePath, configName);
        if (fs.existsSync(configPath)) {
            return configPath;
        }
    }

    return undefined;
}

async function scanComponentsFolder(workspacePath: string): Promise<Array<{ name: string; path: string }>> {
    const componentsPath = path.join(workspacePath, 'src', 'components');
    
    if (!fs.existsSync(componentsPath)) {
        return [];
    }

    const components: Array<{ name: string; path: string }> = [];
    
    function scanDirectory(dirPath: string): void {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            
            if (entry.isDirectory()) {
                scanDirectory(fullPath);
            } else if (entry.isFile()) {
                // Consider common component file extensions
                const ext = path.extname(entry.name);
                if (['.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte'].includes(ext)) {
                    const componentName = path.basename(entry.name, ext);
                    const relativePath = path.relative(workspacePath, fullPath);
                    
                    components.push({
                        name: componentName,
                        path: relativePath
                    });
                }
            }
        }
    }

    scanDirectory(componentsPath);
    return components;
}
