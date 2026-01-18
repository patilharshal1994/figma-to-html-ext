import * as vscode from 'vscode';
import { FigmaLayoutJSON } from './aiService';

/**
 * Parsed Figma URL components
 */
interface ParsedFigmaUrl {
    fileId: string;
    nodeId?: string;
}

/**
 * Extracts file ID and node ID from a Figma URL
 * Supports formats:
 * - https://www.figma.com/file/{fileId}/{fileName}
 * - https://www.figma.com/file/{fileId}/{fileName}?node-id={nodeId}
 * - https://www.figma.com/design/{fileId}/{fileName}
 * - {fileId} (just the file ID)
 */
function parseFigmaUrl(figmaUrl: string): ParsedFigmaUrl {
    // Trim whitespace
    const trimmed = figmaUrl.trim();

    // If it's just a file ID (alphanumeric string, no slashes)
    if (/^[a-zA-Z0-9]+$/.test(trimmed)) {
        return { fileId: trimmed };
    }

    // Extract file ID from URL
    // Pattern: https://www.figma.com/file/{fileId}/...
    // Pattern: https://www.figma.com/design/{fileId}/...
    const fileMatch = trimmed.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    
    if (!fileMatch) {
        throw new Error(`Invalid Figma URL format: ${figmaUrl}`);
    }

    const fileId = fileMatch[1];

    // Extract node ID from query parameter
    // Pattern: ?node-id={nodeId}
    // Node IDs can be: 1-2:3, 1:2:3, etc.
    const nodeMatch = trimmed.match(/[?&]node-id=([^&]+)/);
    const nodeId = nodeMatch ? decodeURIComponent(nodeMatch[1]) : undefined;

    return { fileId, nodeId };
}

/**
 * Fetches Figma layout data from a Figma URL
 * @param figmaUrl - The Figma file URL or file ID
 * @returns Promise<FigmaLayoutJSON> - The raw Figma node JSON
 * @throws Error if token is missing or API call fails
 */
export async function fetchFigmaLayout(figmaUrl: string): Promise<FigmaLayoutJSON> {
    // Check for FIGMA_TOKEN in VS Code settings first, then environment variable
    const config = vscode.workspace.getConfiguration('figma-to-html');
    const token = config.get<string>('figmaToken') || process.env.FIGMA_TOKEN;
    
    if (!token) {
        throw new Error(
            'Figma API token is required. ' +
            'Please set figma-to-html.figmaToken in VS Code settings or FIGMA_TOKEN environment variable. ' +
            'Get your token from: https://www.figma.com/developers/api#access-tokens'
        );
    }

    // Parse URL to extract file ID and node ID
    const { fileId, nodeId } = parseFigmaUrl(figmaUrl);

    try {
        let response: Response;
        let data: any;

        if (nodeId) {
            // Fetch specific node(s)
            // API: GET /v1/files/:file_key/nodes?ids=:node_ids
            const nodeIds = nodeId.replace(/:/g, '-'); // Convert 1:2:3 to 1-2-3
            const apiUrl = `https://api.figma.com/v1/files/${fileId}/nodes?ids=${encodeURIComponent(nodeIds)}`;
            
            response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-Figma-Token': token
                }
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ err: 'Unknown error' })) as { err?: string; message?: string };
                throw new Error(
                    `Figma API error (${response.status}): ${error.err || error.message || response.statusText}`
                );
            }

            data = await response.json();
            
            // Return the nodes data
            // The API returns: { nodes: { "node-id": { document: {...}, components: {...} } } }
            return data as FigmaLayoutJSON;
        } else {
            // Fetch entire file
            // API: GET /v1/files/:file_key
            const apiUrl = `https://api.figma.com/v1/files/${fileId}`;
            
            response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-Figma-Token': token
                }
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ err: 'Unknown error' })) as { err?: string; message?: string };
                throw new Error(
                    `Figma API error (${response.status}): ${error.err || error.message || response.statusText}`
                );
            }

            data = await response.json();
            
            // Return the entire file document
            // The API returns: { document: {...}, components: {...}, styles: {...}, ... }
            return data as FigmaLayoutJSON;
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch Figma layout: ${error.message}`);
        }
        throw new Error(`Failed to fetch Figma layout: ${String(error)}`);
    }
}
