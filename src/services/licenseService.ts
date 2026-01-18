import * as vscode from 'vscode';

/**
 * License service for paid extension architecture
 * Handles license validation and feature gating
 */

export interface LicenseInfo {
    isValid: boolean;
    type: 'free' | 'trial' | 'paid' | 'enterprise';
    expiresAt?: Date;
    features: string[];
}

/**
 * Checks if the extension is licensed
 * For production: Integrate with license validation service
 */
export async function validateLicense(): Promise<LicenseInfo> {
    const config = vscode.workspace.getConfiguration('figma-to-html');
    const licenseKey = config.get<string>('licenseKey');
    
    // Free tier: Basic features only
    if (!licenseKey || licenseKey.trim().length === 0) {
        return {
            isValid: true,
            type: 'free',
            features: ['basic-generation']
        };
    }

    // TODO: Integrate with license validation API
    // For now, accept any non-empty key as valid (demo mode)
    const isValid = await checkLicenseKey(licenseKey);

    if (!isValid) {
        return {
            isValid: false,
            type: 'free',
            features: ['basic-generation']
        };
    }

    // Paid tier: All features
    return {
        isValid: true,
        type: 'paid',
        features: [
            'basic-generation',
            'advanced-ai',
            'component-reuse',
            'bulk-export',
            'custom-mappings'
        ]
    };
}

/**
 * Checks if a feature is available in the current license
 */
export async function hasFeature(feature: string): Promise<boolean> {
    const license = await validateLicense();
    return license.isValid && license.features.includes(feature);
}

/**
 * Validates license key with backend service
 * TODO: Replace with actual license validation API
 */
async function checkLicenseKey(licenseKey: string): Promise<boolean> {
    try {
        // Placeholder for license validation API
        // const response = await fetch('https://api.example.com/validate-license', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ licenseKey, extensionId: 'figma-to-html' })
        // });
        // return response.ok && (await response.json()).valid;

        // Demo: Accept specific format
        return licenseKey.length >= 8 && /^[A-Z0-9-]+$/.test(licenseKey);
    } catch {
        return false;
    }
}

/**
 * Shows license activation dialog
 */
export async function showLicenseDialog(): Promise<void> {
    const licenseKey = await vscode.window.showInputBox({
        prompt: 'Enter your license key',
        placeHolder: 'XXXX-XXXX-XXXX-XXXX',
        validateInput: (value) => {
            if (!value || value.trim().length === 0) {
                return 'License key is required';
            }
            return null;
        }
    });

    if (licenseKey) {
        const config = vscode.workspace.getConfiguration('figma-to-html');
        await config.update('licenseKey', licenseKey, vscode.ConfigurationTarget.Global);
        
        const license = await validateLicense();
        if (license.isValid && license.type === 'paid') {
            vscode.window.showInformationMessage('License activated successfully!');
        } else {
            vscode.window.showErrorMessage('Invalid license key. Please check and try again.');
        }
    }
}
