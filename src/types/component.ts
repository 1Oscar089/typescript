export type Category = 
  | 'todos' | 'botones' | 'loaders' | 'tarjetas' 
  | 'formularios' | 'modales' | 'navbars' | 'animaciones' 
  | 'badges' | 'tooltips' | 'graficos' | '3d' | 'footers';

export interface ComponentControl {
  id: string;
  label: string;
  type: 'color' | 'range' | 'text' | 'select' | 'number';
  defaultValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: string | number }[];
}

export interface UIComponentItem {
  id: string;
  title: string;
  category: Category;
  engine: string; // Ej: 'dom', 'svg', 'canvas', 'webgl', etc.
  tags: string[];
  controls?: ComponentControl[];
  
  htmlCode: string;
  cssCode: string;
  jsCode?: string;
  tsCode?: string;
  
  generateCode?: (values: Record<string, any>) => {
    html: string;
    css: string;
    js: string;
    ts: string;
  };
  
  renderPreview: (values: Record<string, any>) => HTMLElement;
}