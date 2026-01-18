/**
 * Base node interface that all Figma nodes extend
 */
export interface BaseNode {
    id: string;
    name: string;
    type: string;
    visible: boolean;
    locked: boolean;
    opacity: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

/**
 * AutoLayout configuration for FrameNode
 */
export interface AutoLayout {
    layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
    primaryAxisAlignItems: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    counterAxisAlignItems: 'MIN' | 'CENTER' | 'MAX';
    primaryAxisSizingMode: 'FIXED' | 'AUTO';
    counterAxisSizingMode: 'FIXED' | 'AUTO';
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    itemSpacing: number;
    layoutWrap: 'NO_WRAP' | 'WRAP';
}

/**
 * Frame node with auto layout, padding, and spacing properties
 */
export interface FrameNode extends BaseNode {
    type: 'FRAME' | 'GROUP';
    autoLayout?: AutoLayout;
    padding?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    spacing?: number;
    children?: FigmaNode[];
    clipsContent?: boolean;
    fills?: Paint[];
    strokes?: Paint[];
    cornerRadius?: number;
}

/**
 * Text node with fontSize and characters properties
 */
export interface TextNode extends BaseNode {
    type: 'TEXT';
    fontSize: number;
    characters: string;
    textStyle?: TextStyle;
    fills?: Paint[];
    textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
    textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
}

/**
 * Component node (component definition or instance)
 */
export interface ComponentNode extends BaseNode {
    type: 'COMPONENT' | 'COMPONENT_SET' | 'INSTANCE';
    componentId?: string;
    children?: FigmaNode[];
    variantProperties?: { [key: string]: string };
    fills?: Paint[];
    strokes?: Paint[];
    cornerRadius?: number;
}

/**
 * Color style definition
 */
export interface ColorStyle {
    id: string;
    name: string;
    type: 'SOLID';
    color: Color;
    opacity?: number;
}

/**
 * Color representation (RGBA)
 */
export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

/**
 * Paint (fill or stroke)
 */
export interface Paint {
    type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'IMAGE';
    color?: Color;
    opacity?: number;
    visible?: boolean;
}

/**
 * Text style properties
 */
export interface TextStyle {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
    letterSpacing?: { value: number; unit: 'PIXELS' | 'PERCENT' };
    textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
}

/**
 * Union type for all Figma node types
 */
export type FigmaNode = FrameNode | TextNode | ComponentNode;
